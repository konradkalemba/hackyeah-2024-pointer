from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from analysis.audio_processing import analyze_audio
import uvicorn

app = FastAPI(
    title="Audio Analysis API",
    description="API do analizy plików audio i ekstrakcji informacji z sygnaturami czasowymi.",
    version="1.0.0"
)

# Pozwolenie na połączenia z innych domen (jeśli potrzebne)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", response_class=HTMLResponse)
async def read_root():
    content = """
    <html>
        <head>
            <title>Audio Analysis API</title>
        </head>
        <body>
            <h1>Witaj w Audio Analysis API</h1>
            <p>Użyj endpointu <code>/upload</code> do przesłania pliku audio.</p>
            <form action="/upload" enctype="multipart/form-data" method="post">
                <input name="file" type="file" accept="audio/*">
                <input type="submit" value="Prześlij">
            </form>
        </body>
    </html>
    """
    return HTMLResponse(content=content)

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    if not file.filename.endswith(('.wav', '.mp3', '.m4a', '.flac', '.ogg', '.wma')):
        raise HTTPException(status_code=400, detail="Nieprawidłowy format pliku.")
    try:
        contents = await file.read()
        with open(f"temp_{file.filename}", "wb") as f:
            f.write(contents)
        # Analiza pliku audio
        analysis_results = analyze_audio(f"temp_{file.filename}")
        # Usuwanie tymczasowego pliku
        import os
        os.remove(f"temp_{file.filename}")
        return analysis_results
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Błąd podczas analizy pliku: {e}")

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
