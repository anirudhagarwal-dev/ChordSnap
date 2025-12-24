# 🎸 ChordSnap

ChordSnap is a Python-based web app that analyzes uploaded audio files (.mp3/.wav) and detects chords over time, featuring simple visualizations and instrument-specific presentation. 🎵

## 🛠️ Stack
- **Backend:** FastAPI (Python) 🐍 with chroma-based chord detection (librosa) 🎼
- **Frontend:** Vite ⚡ + React ⚛️ + TypeScript 📘

## 🚀 Quick Start

### 1️⃣ Backend Setup

**⚠️ Important:** For MP3/MP4 file support, you may need **FFmpeg** installed:
- **Windows:** Download from [ffmpeg.org](https://ffmpeg.org/download.html) or use `winget install ffmpeg`
- **Mac:** `brew install ffmpeg`
- **Linux:** `sudo apt install ffmpeg` or `sudo yum install ffmpeg`

```bash
cd backend
python -m venv .venv
# Activate virtual environment:
. .venv/Scripts/activate  # Windows PowerShell: . .venv/Scripts/Activate.ps1
# Install dependencies:
pip install -r requirements.txt
# Run server:
uvicorn app.main:app --reload --port 8000
```

> **Note:** If you encounter "Unspecified internal error" when uploading MP3/MP4 files, install FFmpeg or convert your files to WAV format.

### 2️⃣ Frontend Setup

The frontend is located in the project root.

```bash
# In the project root directory
npm install
npm run dev
```

Open the frontend dev server URL shown in the console (e.g., `http://localhost:5173`).
Ensure the backend is running on `http://localhost:8000` or update `VITE_API_BASE_URL` in `.env` accordingly.

## ✨ Features
- 📤 **Upload** `.mp3` or `.wav` files
- 🎸 **Instrument Selection** (Guitar, Piano, Ukulele)
- ⏱️ **Chord Timeline** with precise timestamps
- 🎧 **Playback** audio alongside detected chords

## 📝 Notes
- **Chord Detection:** Uses chroma features and template matching for major/minor triads. Lightweight and CPU-friendly. 🧠
- **Accuracy:** Depends on audio quality, tuning, and arrangement. Future improvements may include key estimation, seventh chords, and HMM smoothing. 🔮

## 🔌 Backend API
- **POST** `/analyze` (multipart/form-data):
  - `file`: Audio file 📁
  - `instrument`: Optional instrument type 🎻
  - **Returns:** `{ segments: [{ startSec, endSec, chord, confidence }], durationSec }`

## 📄 License
MIT 🔓
