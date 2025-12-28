from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, Response
from pydantic import BaseModel
import io
from typing import List, Dict, Optional

from .chords.analyzer import analyze_audio_filelike

class AnalyzeResponse(BaseModel):
    durationSec: float
    segments: list


app = FastAPI(title="ChordSnap API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/analyze")
async def analyze(file: UploadFile = File(...), instrument: str | None = None):
    try:
        if not file.filename:
            raise HTTPException(status_code=400, detail="No filename provided")
        
        allowed_extensions = {'.mp3', '.wav', '.mp4', '.m4a', '.flac', '.ogg'}
        file_ext = '.' + file.filename.split('.')[-1].lower() if '.' in file.filename else ''
        if file_ext not in allowed_extensions:
            raise HTTPException(
                status_code=400, 
                detail=f"Unsupported file format. Allowed: {', '.join(allowed_extensions)}"
            )
        
        content = await file.read()
        if len(content) > 100 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="File size exceeds 100MB limit")
        
        if len(content) == 0:
            raise HTTPException(status_code=400, detail="File is empty")
        
        file_like = io.BytesIO(content)
        file_like.seek(0)
        result = analyze_audio_filelike(file_like, instrument=instrument)
        return JSONResponse(content=result)
    except HTTPException:
        raise
    except Exception as exc:
        import traceback
        error_detail = str(exc)
        print(f"Analysis error: {error_detail}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Analysis failed: {error_detail}")