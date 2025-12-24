from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, Response
from pydantic import BaseModel
import io
from typing import List, Dict, Optional

from .chords.analyzer import analyze_audio_filelike
from .music.generator import generate_music_tracks, mix_tracks, save_audio_to_wav


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


# class GenerateMusicRequest(BaseModel):
#     segments: List[Dict]
#     tempo: float
#     duration: float
#     enabled_tracks: Optional[Dict[str, bool]] = None
#     volumes: Optional[Dict[str, float]] = None


# @app.post("/generate-music")
# async def generate_music(request: GenerateMusicRequest): # type: ignore
#     raise HTTPException(status_code=501, detail="Music generation module is missing")
    # try:
    #     if not request.segments:
    #         raise HTTPException(status_code=400, detail="No chord segments provided")
        
    #     if request.tempo <= 0 or request.duration <= 0:
    #         raise HTTPException(status_code=400, detail="Invalid tempo or duration")
        
    #     tracks = generate_music_tracks(
    #         request.segments,
    #         request.tempo,
    #         request.duration,
    #         request.enabled_tracks
    #     )
        
    #     if not tracks:
    #         raise HTTPException(status_code=400, detail="No tracks were generated")
        
    #     mixed_audio = mix_tracks(tracks, request.volumes)
        
    #     if len(mixed_audio) == 0:
    #         raise HTTPException(status_code=500, detail="Failed to mix tracks")
        
    #     wav_bytes = save_audio_to_wav(mixed_audio)
        
        return Response(
            content=wav_bytes,
            media_type="audio/wav",
            headers={"Content-Disposition": "attachment; filename=generated_music.wav"}
        )
    except HTTPException:
        raise
    except Exception as exc:
        import traceback
        error_detail = str(exc)
        print(f"Music generation error: {error_detail}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Music generation failed: {error_detail}")


