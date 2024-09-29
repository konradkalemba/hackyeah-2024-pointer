# Wybór obrazu bazowego
FROM python:3.9-slim

# Instalacja zależności systemowych
RUN apt-get update && apt-get install -y --no-install-recommends \
    libsndfile1 \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Ustawienie katalogu roboczego w kontenerze
WORKDIR /app

# Skopiowanie pliku requirements.txt i instalacja zależności
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# Skopiowanie reszty kodu aplikacji
COPY . .

# Otworzenie portu aplikacji (domyślnie 8000)
EXPOSE 8000

# Komenda startowa uruchamiająca aplikację
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
