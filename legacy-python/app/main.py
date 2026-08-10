import csv
import io
import os
import threading
import time
from collections import defaultdict, deque
from pathlib import Path

from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import FileResponse, JSONResponse, StreamingResponse
from fastapi.staticfiles import StaticFiles

from app.jobs import JobManager
from app.locations import COUNTRY_PRESETS
from app.models import SearchRequest, SendEmailRequest, TemplateRequest
from app.outreach import render_template, send_smtp
from app.storage import JobStore

BASE_DIR = Path(__file__).resolve().parent.parent
store = JobStore(BASE_DIR / "data" / "jobs")
manager = JobManager(store, max_concurrent=int(os.getenv("LEADFORGE_MAX_CONCURRENT_JOBS", "1")))
app = FastAPI(title="LeadForge", version="1.0.0", docs_url="/api/docs", redoc_url=None)
request_times = defaultdict(deque)
rate_lock = threading.Lock()


@app.middleware("http")
async def security_and_rate_limit(request: Request, call_next):
    response = None
    if request.url.path.startswith("/api/") and request.method != "GET":
        identity = request.client.host if request.client else "unknown"
        now = time.monotonic()
        with rate_lock:
            history = request_times[identity]
            while history and history[0] < now - 60:
                history.popleft()
            if len(history) >= 20:
                return JSONResponse({"detail": "Too many requests; try again shortly"}, status_code=429)
            history.append(now)
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "geolocation=(self)"
    response.headers["Content-Security-Policy"] = (
        "default-src 'self'; script-src 'self' https://unpkg.com; "
        "style-src 'self' 'unsafe-inline' https://unpkg.com; img-src 'self' data: https://*.tile.openstreetmap.org; "
        "connect-src 'self'; font-src 'self'; frame-ancestors 'none'"
    )
    return response


@app.get("/api/health")
def health():
    return {"status": "ok", "version": app.version}


@app.get("/api/locations")
def locations():
    return COUNTRY_PRESETS


@app.post("/api/jobs", status_code=202)
def create_job(payload: SearchRequest):
    max_searches = int(os.getenv("LEADFORGE_MAX_SEARCHES_PER_JOB", "100"))
    if len(payload.cities) * len(payload.business_queries) > max_searches:
        raise HTTPException(400, f"A job may contain at most {max_searches} city/query searches")
    job = manager.start(payload)
    return {"id": job["id"], "status": job["status"]}


def require_job(job_id: str):
    job = store.get(job_id)
    if not job:
        raise HTTPException(404, "Job not found")
    return job


@app.get("/api/jobs")
def list_jobs():
    return [{key: value for key, value in job.items() if key != "leads"} for job in store.list()[:30]]


@app.get("/api/jobs/{job_id}")
def get_job(job_id: str):
    return require_job(job_id)


def safe_csv_value(value):
    text = "" if value is None else str(value)
    return "'" + text if text.startswith(("=", "+", "-", "@")) else text


@app.get("/api/jobs/{job_id}/export/{kind}")
def export(job_id: str, kind: str):
    job = require_job(job_id)
    leads = job["leads"]
    if kind not in {"all", "emails", "phones"}:
        raise HTTPException(404, "Unknown export type")
    if kind == "emails":
        rows, fields = [{"business": x.get("name"), "email": x.get("email")} for x in leads if x.get("email")], ["business", "email"]
    elif kind == "phones":
        rows, fields = [{"business": x.get("name"), "phone": x.get("phone")} for x in leads if x.get("phone")], ["business", "phone"]
    else:
        fields = ["name", "category", "address", "search_city", "search_country", "phone", "email", "website", "rating", "distance_km", "maps_url", "matched_query"]
        rows = leads
    output = io.StringIO(newline="")
    writer = csv.DictWriter(output, fieldnames=fields, extrasaction="ignore")
    writer.writeheader()
    for row in rows:
        writer.writerow({key: safe_csv_value(value) for key, value in row.items()})
    filename = f"leadforge-{job_id[:8]}-{kind}.csv"
    return StreamingResponse(iter([output.getvalue()]), media_type="text/csv", headers={"Content-Disposition": f'attachment; filename="{filename}"'})


@app.post("/api/jobs/{job_id}/templates")
def preview_templates(job_id: str, payload: TemplateRequest):
    job = require_job(job_id)
    return [{
        "id": lead["id"], "email": lead.get("email"), "business": lead.get("name"),
        "subject": render_template(payload.subject, lead),
        "message": render_template(payload.message, lead),
    } for lead in job["leads"]]


@app.post("/api/jobs/{job_id}/send")
def send_emails(job_id: str, payload: SendEmailRequest):
    job = require_job(job_id)
    # Credentials exist only in this request and are never added to job storage/logs.
    try:
        return send_smtp(payload, job["leads"])
    except Exception:
        raise HTTPException(502, "SMTP delivery failed. Check the server, port, credentials, and TLS setting.")


app.mount("/static", StaticFiles(directory=BASE_DIR / "static"), name="static")


@app.get("/", include_in_schema=False)
def index():
    return FileResponse(BASE_DIR / "static" / "index.html")

