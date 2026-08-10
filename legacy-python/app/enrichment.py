import ipaddress
import re
import socket
from urllib.parse import urljoin, urlparse

import requests

EMAIL_RE = re.compile(r"\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b", re.I)
SOCIAL_RE = {
    "instagram": re.compile(r"https?://(?:www\.)?instagram\.com/[A-Za-z0-9._-]+", re.I),
    "facebook": re.compile(r"https?://(?:www\.)?facebook\.com/[A-Za-z0-9._-]+", re.I),
    "linkedin": re.compile(r"https?://(?:www\.)?linkedin\.com/(?:company|in)/[A-Za-z0-9._-]+", re.I),
}
IGNORED_DOMAINS = {"example.com", "google.com", "sentry.io", "wixpress.com"}


def is_public_url(url: str):
    try:
        parsed = urlparse(url)
        if parsed.scheme not in {"http", "https"} or not parsed.hostname:
            return False
        addresses = socket.getaddrinfo(parsed.hostname, parsed.port or (443 if parsed.scheme == "https" else 80))
        return all(ipaddress.ip_address(address[4][0]).is_global for address in addresses)
    except (OSError, ValueError):
        return False


def safe_get(url: str, timeout=7):
    headers = {"User-Agent": "Mozilla/5.0 (compatible; LeadForge/1.0; public-contact-research)"}
    for _ in range(4):
        if not is_public_url(url):
            raise requests.RequestException("Non-public address refused")
        response = requests.get(url, headers=headers, timeout=timeout, allow_redirects=False)
        if response.is_redirect or response.is_permanent_redirect:
            location = response.headers.get("Location")
            if not location:
                raise requests.RequestException("Invalid redirect")
            url = urljoin(url, location)
            continue
        response.raise_for_status()
        content_type = response.headers.get("Content-Type", "")
        if "text/html" not in content_type:
            raise requests.RequestException("Not an HTML page")
        return response
    raise requests.TooManyRedirects()


def enrich_website(lead: dict):
    website = lead.get("website")
    if not website:
        return lead
    try:
        home = safe_get(website)
        documents = [home.text[:1_500_000]]
        contact_match = re.search(r'href=["\']([^"\']*(?:contact|about)[^"\']*)["\']', home.text, re.I)
        if contact_match:
            contact_url = urljoin(home.url, contact_match.group(1))
            if urlparse(contact_url).hostname == urlparse(home.url).hostname:
                documents.append(safe_get(contact_url).text[:1_500_000])
        content = "\n".join(documents)
        emails = sorted({email.lower() for email in EMAIL_RE.findall(content) if email.rsplit("@", 1)[-1].lower() not in IGNORED_DOMAINS})
        if emails:
            lead["email"] = emails[0]
            lead["additional_emails"] = "; ".join(emails[1:]) or None
        for platform, pattern in SOCIAL_RE.items():
            match = pattern.search(content)
            if match:
                lead[platform] = match.group(0).rstrip("/\"'")
        lead["website_checked"] = True
    except requests.RequestException:
        lead["website_checked"] = False
    return lead

