import smtplib
import ssl
import time
from email.message import EmailMessage


def render_template(value: str, lead: dict):
    replacements = {
        "{{business_name}}": lead.get("name") or "there",
        "{{city}}": lead.get("search_city") or "your city",
        "{{category}}": lead.get("category") or "business",
        "{{address}}": lead.get("address") or "",
    }
    for placeholder, replacement in replacements.items():
        value = value.replace(placeholder, replacement)
    return value


def send_smtp(request, leads: list[dict]):
    recipients = [lead for lead in leads if lead.get("email") and lead.get("id") in request.lead_ids]
    if not recipients:
        return {"sent": 0, "failed": [], "message": "No selected leads have an email address"}

    context = ssl.create_default_context()
    sent, failed = 0, []
    with smtplib.SMTP(request.smtp_host, request.smtp_port, timeout=20) as server:
        if request.use_tls:
            server.starttls(context=context)
        server.login(request.smtp_username, request.smtp_password)
        for lead in recipients:
            try:
                message = EmailMessage()
                message["From"] = str(request.from_email)
                message["To"] = lead["email"]
                message["Subject"] = render_template(request.subject, lead)
                message.set_content(render_template(request.message, lead))
                server.send_message(message)
                sent += 1
                time.sleep(1)
            except Exception:
                failed.append(lead["id"])
    return {"sent": sent, "failed": failed, "message": f"Sent {sent} email(s)"}

