import asyncio
import tempfile
import unittest
from pathlib import Path

from app.geo import distance_km
from app.models import SearchRequest
from app.outreach import render_template
from app.scraper import deduplicate
from app.storage import JobStore


class CoreTests(unittest.TestCase):
    def test_search_input_is_cleaned(self):
        request = SearchRequest(
            country="  Pakistan ", cities=[" Lahore ", "Lahore", " Islamabad"],
            business_queries=[" laptop shop ", "computer store"], max_results=10,
        )
        self.assertEqual(request.country, "Pakistan")
        self.assertEqual(request.cities, ["Lahore", "Islamabad"])

    def test_distance(self):
        self.assertAlmostEqual(distance_km(0, 0, 0, 1), 111.2, places=1)

    def test_template_rendering(self):
        result = render_template("Hello {{business_name}} in {{city}}", {"name": "Tech House", "search_city": "Lahore"})
        self.assertEqual(result, "Hello Tech House in Lahore")

    def test_deduplicate_by_phone(self):
        leads = deduplicate([
            {"name": "A", "phone": "+92 300 1234567", "address": "One"},
            {"name": "A shop", "phone": "923001234567", "address": "Two"},
        ])
        self.assertEqual(len(leads), 1)
        self.assertEqual(leads[0]["id"], "lead-1")

    def test_atomic_job_storage(self):
        with tempfile.TemporaryDirectory() as directory:
            store = JobStore(Path(directory))
            store.create({"id": "abc", "status": "queued"})
            store.update("abc", status="complete")
            self.assertEqual(store.get("abc")["status"], "complete")


if __name__ == "__main__":
    unittest.main()

