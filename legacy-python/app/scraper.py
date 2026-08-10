import re
import time
from urllib.parse import quote_plus

from playwright.sync_api import sync_playwright


def _text(page, selector: str):
    element = page.query_selector(selector)
    if not element:
        return None
    value = element.get_attribute("aria-label") or element.inner_text()
    return value.strip() if value else None


def scrape_google_maps(query: str, city: str, country: str, max_results: int, headless: bool, progress):
    """Scrape public Google Maps business cards with one browser per search."""
    results = []
    search = f"{query} in {city}, {country}"
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=headless)
        context = browser.new_context(
            locale="en-US",
            viewport={"width": 1440, "height": 900},
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36",
        )
        page = context.new_page()
        try:
            page.goto(f"https://www.google.com/maps/search/{quote_plus(search)}", wait_until="domcontentloaded", timeout=45_000)
            try:
                page.wait_for_selector('div[role="feed"]', timeout=20_000)
            except Exception:
                progress("No Google Maps result feed was available")
                return []

            feed = page.locator('div[role="feed"]')
            previous = 0
            stable_rounds = 0
            while previous < max_results and stable_rounds < 3:
                links = page.locator('a[href*="/maps/place/"]')
                count = links.count()
                stable_rounds = stable_rounds + 1 if count == previous else 0
                previous = count
                feed.evaluate("element => element.scrollTop = element.scrollHeight")
                page.wait_for_timeout(1200)

            urls = []
            for index in range(min(page.locator('a[href*="/maps/place/"]').count(), max_results)):
                href = page.locator('a[href*="/maps/place/"]').nth(index).get_attribute("href")
                if href and href not in urls:
                    urls.append(href)

            for index, url in enumerate(urls, 1):
                try:
                    page.goto(url, wait_until="domcontentloaded", timeout=30_000)
                    page.wait_for_timeout(900)
                    name = _text(page, "h1") or "Unknown"
                    address = _text(page, '[data-item-id="address"]')
                    phone = _text(page, '[data-item-id*="phone"]')
                    website_element = page.query_selector('a[data-item-id="authority"]')
                    website = website_element.get_attribute("href") if website_element else None
                    current_url = page.url
                    coordinates = re.search(r"@(-?\d+\.\d+),(-?\d+\.\d+)", current_url)
                    if not coordinates:
                        coordinates = re.search(r"!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)", current_url)
                    rating = _text(page, "div.F7nice span[aria-hidden='true']")
                    category = _text(page, 'button[jsaction*="category"]')
                    results.append({
                        "name": name,
                        "address": (address or "").replace("Address: ", "") or None,
                        "phone": (phone or "").replace("Phone: ", "").replace("Copy phone number", "").strip() or None,
                        "email": None,
                        "website": website,
                        "category": category,
                        "rating": rating,
                        "latitude": float(coordinates.group(1)) if coordinates else None,
                        "longitude": float(coordinates.group(2)) if coordinates else None,
                        "maps_url": current_url,
                        "source": "Google Maps",
                        "search_city": city,
                        "search_country": country,
                        "matched_query": query,
                    })
                    progress(f"Found {name}", increment=True)
                except Exception as error:
                    progress(f"Skipped one listing: {str(error)[:80]}")
        finally:
            context.close()
            browser.close()
    return results


def normalize_phone(value):
    return re.sub(r"\D", "", value or "")


def deduplicate(leads: list[dict]):
    unique = []
    keys = set()
    for lead in leads:
        phone = normalize_phone(lead.get("phone"))
        key = phone or f"{lead.get('name', '').casefold()}|{lead.get('address', '').casefold()}"
        if key and key not in keys:
            keys.add(key)
            lead["id"] = f"lead-{len(unique) + 1}"
            unique.append(lead)
    return unique
