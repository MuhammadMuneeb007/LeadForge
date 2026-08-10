import threading
import traceback
from datetime import datetime, timezone
from uuid import uuid4

from app.geo import distance_km, geocode
from app.enrichment import enrich_website
from app.scraper import deduplicate, scrape_google_maps


def now():
    return datetime.now(timezone.utc).isoformat()


class JobManager:
    def __init__(self, store, max_concurrent: int = 1):
        self.store = store
        self.semaphore = threading.Semaphore(max_concurrent)

    def start(self, request):
        job_id = uuid4().hex
        total_searches = len(request.cities) * len(request.business_queries)
        job = {
            "id": job_id,
            "status": "queued",
            "created_at": now(),
            "updated_at": now(),
            "request": request.model_dump(),
            "progress": 0,
            "total_searches": total_searches,
            "completed_searches": 0,
            "found_count": 0,
            "current_task": "Waiting for a worker",
            "events": [{"time": now(), "message": "Job queued"}],
            "leads": [],
            "error": None,
        }
        self.store.create(job)
        threading.Thread(target=self._run, args=(job_id, request), daemon=True, name=f"job-{job_id[:8]}").start()
        return job

    def _event(self, job_id, message, increment=False):
        def mutate(job):
            job["events"].append({"time": now(), "message": message})
            job["events"] = job["events"][-100:]
            if increment:
                job["found_count"] += 1
            job["updated_at"] = now()
        self.store.mutate(job_id, mutate)

    def _run(self, job_id, request):
        with self.semaphore:
            try:
                self.store.update(job_id, status="running", current_task="Starting browser", updated_at=now())
                leads = []
                completed = 0
                for city in request.cities:
                    for query in request.business_queries:
                        task = f"{query} in {city}, {request.country}"
                        self.store.update(job_id, current_task=task, updated_at=now())
                        self._event(job_id, f"Searching {task}")
                        leads.extend(scrape_google_maps(
                            query, city, request.country, request.max_results,
                            request.headless, lambda message, increment=False: self._event(job_id, message, increment),
                        ))
                        completed += 1
                        self.store.update(
                            job_id,
                            completed_searches=completed,
                            progress=round(completed / (len(request.cities) * len(request.business_queries)) * 100),
                            updated_at=now(),
                        )

                leads = deduplicate(leads)
                websites = [lead for lead in leads if lead.get("website")]
                if websites:
                    self._event(job_id, f"Checking {len(websites)} public business websites for contact details")
                    for index, lead in enumerate(websites, 1):
                        enrich_website(lead)
                        if index % 5 == 0 or index == len(websites):
                            self._event(job_id, f"Website enrichment {index}/{len(websites)}")
                if request.origin:
                    self._event(job_id, f"Calculating distances from {request.origin}")
                    origin = geocode(request.origin)
                    if origin:
                        for lead in leads:
                            if lead.get("latitude") is not None and lead.get("longitude") is not None:
                                lead["distance_km"] = distance_km(origin[0], origin[1], lead["latitude"], lead["longitude"])
                        leads.sort(key=lambda lead: lead.get("distance_km", float("inf")))
                self.store.update(
                    job_id, status="completed", progress=100, leads=leads,
                    found_count=len(leads), current_task="Complete", updated_at=now(),
                )
                self._event(job_id, f"Completed with {len(leads)} unique leads")
            except Exception as error:
                traceback.print_exc()
                self.store.update(
                    job_id, status="failed", current_task="Failed",
                    error=str(error)[:500], updated_at=now(),
                )
                self._event(job_id, "The job failed; check the server console for details")
