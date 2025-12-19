### ChordSnap

ChordSnap is a Python-based web app that analyzes uploaded audio files (.mp3/.wav) and detects chords over time, with simple visualizations and instrument-specific presentation.

### Stack
- Backend: FastAPI (Python) with chroma-based chord detection (librosa)
- Frontend: Vite + React + TypeScript

### Quick Start

1) Backend

**Important:** For MP3/MP4 file support, you may need FFmpeg installed:
- Windows: Download from https://ffmpeg.org/download.html or use `winget install ffmpeg`
- Mac: `brew install ffmpeg`
- Linux: `sudo apt install ffmpeg` or `sudo yum install ffmpeg`

```bash
cd backend
python -m venv .venv
. .venv/Scripts/activate  # Windows PowerShell: . .venv/Scripts/Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

**Note:** If you encounter "Unspecified internal error" when uploading MP3/MP4 files, install FFmpeg or convert your files to WAV format.

2) Frontend

```bash
cd frontend
npm install
npm run dev
```

Open the frontend dev server URL shown in the console. Ensure the backend runs on `http://localhost:8000` or update `VITE_API_BASE_URL` in `frontend/.env` accordingly.

### Features
- Upload `.mp3` or `.wav`
- Select instrument (guitar, piano, ukulele)
- See chord timeline with timestamps
- Playback the audio alongside detected chords

### Notes
- Chord detection uses chroma features and template matching for major/minor triads. It's lightweight and runs without GPU.
- Accuracy depends on audio quality, tuning, and arrangement. Future improvements can include key estimation, seventh chords, and HMM smoothing.

### Backend API
- POST `/analyze` (multipart/form-data): `file` (audio), optional `instrument`
  - Returns `{ segments: [{ startSec, endSec, chord, confidence }], durationSec }`

### License
MIT


