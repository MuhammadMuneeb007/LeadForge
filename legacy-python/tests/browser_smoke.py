"""Local browser smoke test; run while LeadForge is listening on port 8000."""
from pathlib import Path

from playwright.sync_api import sync_playwright


with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 1000})
    errors = []
    page.on("console", lambda message: errors.append(message.text) if message.type == "error" else None)
    page.on("pageerror", lambda error: errors.append(str(error)))
    response = page.goto("http://127.0.0.1:8000", wait_until="networkidle")
    assert response and response.ok, "Home page failed to load"
    assert page.locator("text=Build a focused prospect list").count() > 0
    assert page.locator("#searchForm").is_visible()
    page.locator('[data-view="leads"]').click()
    assert page.locator("text=Your market, mapped and organized").is_visible()
    page.locator('[data-view="outreach"]').click()
    assert page.locator("text=Personalized, human-first outreach").is_visible()
    assert not page.locator("[data-nextjs-dialog], .vite-error-overlay").count()
    page.screenshot(path=Path("browser-verification.png"), full_page=True)
    relevant_errors = [error for error in errors if "favicon.ico" not in error]
    assert not relevant_errors, f"Browser console errors: {relevant_errors}"
    browser.close()

print("browser smoke test passed")
