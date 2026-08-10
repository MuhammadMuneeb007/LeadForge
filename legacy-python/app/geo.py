import math
import time
from functools import lru_cache

import requests


@lru_cache(maxsize=512)
def geocode(query: str):
    try:
        response = requests.get(
            "https://nominatim.openstreetmap.org/search",
            params={"q": query, "format": "jsonv2", "limit": 1},
            headers={"User-Agent": "LeadForge/1.0 (local business research app)"},
            timeout=10,
        )
        response.raise_for_status()
        items = response.json()
        time.sleep(1)  # Respect the public Nominatim usage rate.
        if items:
            return float(items[0]["lat"]), float(items[0]["lon"])
    except (requests.RequestException, ValueError, KeyError):
        pass
    return None


def distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    radius = 6371.0088
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dp = math.radians(lat2 - lat1)
    dl = math.radians(lon2 - lon1)
    a = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return round(radius * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a)), 1)

