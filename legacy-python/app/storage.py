import json
import threading
from pathlib import Path


class JobStore:
    def __init__(self, directory: Path):
        self.directory = directory
        self.directory.mkdir(parents=True, exist_ok=True)
        self.jobs: dict[str, dict] = {}
        self.lock = threading.RLock()

    def create(self, job: dict):
        with self.lock:
            self.jobs[job["id"]] = job
            self._save(job)

    def get(self, job_id: str):
        with self.lock:
            job = self.jobs.get(job_id)
            if job:
                return job
            path = self.directory / f"{job_id}.json"
            if path.exists():
                job = json.loads(path.read_text(encoding="utf-8"))
                self.jobs[job_id] = job
                return job
        return None

    def update(self, job_id: str, **changes):
        with self.lock:
            job = self.jobs[job_id]
            job.update(changes)
            self._save(job)
            return job

    def mutate(self, job_id: str, mutator):
        with self.lock:
            job = self.jobs[job_id]
            mutator(job)
            self._save(job)
            return job

    def list(self):
        with self.lock:
            paths = sorted(self.directory.glob("*.json"), key=lambda p: p.stat().st_mtime, reverse=True)
            known = {p.stem for p in paths} | set(self.jobs)
            return [self.get(job_id) for job_id in known if self.get(job_id)]

    def _save(self, job: dict):
        target = self.directory / f"{job['id']}.json"
        temporary = target.with_suffix(".tmp")
        temporary.write_text(json.dumps(job, ensure_ascii=False, indent=2), encoding="utf-8")
        temporary.replace(target)

