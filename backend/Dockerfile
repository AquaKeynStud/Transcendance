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

# Start Django's ASGI server (Daphne) on 0.0.0.0 to support both HTTP and WebSockets for other containers
CMD ["daphne", "-b", "0.0.0.0", "-p", "8000", "transcendance.asgi:application"]
