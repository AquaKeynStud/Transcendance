FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    gcc \
    # Fichiers d'en-tête pour la bibliothèque PostgreSQL (libpq)
    libpq-dev \
    # Nettoie le cache apt pour garder une image Docker légère et propre
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Lance le server web intégré de Django sur 0.0.0.0 pour écouter les autres containers
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
