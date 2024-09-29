from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from analysis.audio_processing import analyze_audio
import uvicorn
import os

app = FastAPI(
    title="Audio Analysis API",
    description="API do analizy plików audio i ekstrakcji informacji z sygnaturami czasowymi.",
    version="1.0.0"
)

# Pozwolenie na połączenia z innych domen (jeśli potrzebne)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # W produkcji zastąp "*" konkretnymi domenami
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(('.wav', '.mp3', '.m4a', '.flac', '.ogg', '.wma','mp4','mov','webm','mkv')):
        raise HTTPException(status_code=400, detail="Nieprawidłowy format pliku.")
    try:
        # Zapisz przesłany plik tymczasowo
        contents = await file.read()
        temp_file_path = f"temp_{file.filename}"
        with open(temp_file_path, "wb") as f:
            f.write(contents)

        # Analiza pliku audio
        analysis_results = analyze_audio(temp_file_path)

        # Usuwanie tymczasowego pliku
        os.remove(temp_file_path)

        # Zwracanie wyników analizy w formacie JSON
        return JSONResponse(content=analysis_results)
    except Exception as e:
        # Usuń plik tymczasowy w razie błędu
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)
        raise HTTPException(status_code=500, detail=f"Błąd podczas analizy pliku: {str(e)}")


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
