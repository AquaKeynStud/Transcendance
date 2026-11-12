FROM python:3.12-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    gcc \
    # Header files for the PostgreSQL client library (libpq)
    libpq-dev \
    # Clear the apt cache to keep the Docker image small and clean
    && rm -rf /var/lib/apt/lists/*

# Dev image: also installs the test and lint tools (pytest, ruff)
COPY requirements.txt requirements-dev.txt ./
RUN pip install --no-cache-dir -r requirements-dev.txt

COPY . .

# Start Django's built-in web server on 0.0.0.0 so other containers can reach it
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
