FROM mcr.microsoft.com/playwright/python:v1.62.0-noble

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
ENV LEADFORGE_HOST=0.0.0.0 LEADFORGE_PORT=8000 PYTHONUNBUFFERED=1
EXPOSE 8000
CMD ["python", "run.py"]
