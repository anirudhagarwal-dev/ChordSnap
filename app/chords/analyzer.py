import io
import re
from typing import Dict, List, Tuple

import librosa
import numpy as np


PITCH_CLASSES = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B",
]


def _chord_templates() -> Dict[str, np.ndarray]:
    templates: Dict[str, np.ndarray] = {}
    # Define chord intervals
    chord_types = {
        '': [0, 4, 7],  # Major
        'm': [0, 3, 7],  # Minor
        '7': [0, 4, 7, 10],  # Dominant 7th
        'm7': [0, 3, 7, 10],  # Minor 7th
        'maj7': [0, 4, 7, 11],  # Major 7th
        'dim': [0, 3, 6],  # Diminished
        'sus4': [0, 5, 7],  # Suspended 4th
        'add9': [0, 4, 7, 2],  # Add 9th
        '7b9': [0, 4, 7, 10, 1],  # 7th flat 9th
    }
    
    for root_idx, root_name in enumerate(PITCH_CLASSES):
        for suffix, intervals in chord_types.items():
            chord = np.zeros(12)
            for i in intervals:
                chord[(root_idx + i) % 12] = 1.0
            chord_name = f"{root_name}{suffix}"
            templates[chord_name] = chord
    return templates


TEMPLATES = _chord_templates()
TEMPLATE_NAMES = list(TEMPLATES.keys())
TEMPLATE_MATRIX = np.stack([TEMPLATES[name] for name in TEMPLATE_NAMES], axis=0)


def _frame_chord_scores(chroma: np.ndarray) -> np.ndarray:
    # chroma: (12, T)
    chroma = chroma / (np.linalg.norm(chroma, axis=0, keepdims=True) + 1e-8)
    templates_norm = TEMPLATE_MATRIX / (np.linalg.norm(TEMPLATE_MATRIX, axis=1, keepdims=True) + 1e-8)
    scores = templates_norm @ chroma  # (24, T)
    return scores


def _get_chord_notes(chord_name: str) -> List[str]:
    """Extract constituent notes from chord name."""
    # Parse chord name to get root and suffix
    import re
    match = re.match(r'^([A-G]#?)(.*)$', chord_name)
    if not match:
        return []
    
    root_name = match.group(1)
    suffix = match.group(2)
    
    root_idx = PITCH_CLASSES.index(root_name) if root_name in PITCH_CLASSES else 0
    
    # Map suffixes to intervals
    interval_map = {
        '': [0, 4, 7],
        'm': [0, 3, 7],
        '7': [0, 4, 7, 10],
        'm7': [0, 3, 7, 10],
        'maj7': [0, 4, 7, 11],
        'dim': [0, 3, 6],
        'sus4': [0, 5, 7],
        'add9': [0, 4, 7, 2],
        '7b9': [0, 4, 7, 10, 1],
    }
    
    intervals = interval_map.get(suffix, [0, 4, 7])
    notes = [PITCH_CLASSES[(root_idx + i) % 12] for i in intervals]
    return notes


def _aggregate_segments(times: np.ndarray, scores: np.ndarray) -> List[Dict]:
    # scores: (24, T), times: (T,)
    best_idx = np.argmax(scores, axis=0)
    best_conf = np.max(scores, axis=0)
    segments: List[Dict] = []
    if best_idx.size == 0:
        return segments
    current = int(best_idx[0])
    start = float(times[0])
    conf_accum: List[float] = [float(best_conf[0])]
    for t in range(1, best_idx.shape[0]):
        if int(best_idx[t]) != current:
            chord_name = TEMPLATE_NAMES[current]
            segments.append(
                {
                    "startSec": start,
                    "endSec": float(times[t]),
                    "chord": chord_name,
                    "confidence": float(np.mean(conf_accum)),
                    "notes": _get_chord_notes(chord_name),
                }
            )
            current = int(best_idx[t])
            start = float(times[t])
            conf_accum = []
        conf_accum.append(float(best_conf[t]))
    chord_name = TEMPLATE_NAMES[current]
    segments.append(
        {
            "startSec": start,
            "endSec": float(times[-1]),
            "chord": chord_name,
            "confidence": float(np.mean(conf_accum)),
            "notes": _get_chord_notes(chord_name),
        }
    )
    return segments


def _detect_key(chroma: np.ndarray) -> tuple[str, str, float]:
    """Detect key and scale using Krumhansl-Schmuckler algorithm."""
    # Major and minor key profiles (Krumhansl-Schmuckler)
    major_profile = np.array([6.35, 2.23, 3.48, 2.33, 4.38, 4.09, 2.52, 5.19, 2.39, 3.66, 2.29, 3.53])
    minor_profile = np.array([6.33, 2.68, 3.52, 5.38, 2.60, 3.53, 2.54, 4.75, 3.98, 2.69, 3.34, 3.17])
    
    # Average chroma across time
    chroma_avg = np.mean(chroma, axis=1)
    chroma_avg = chroma_avg / (np.linalg.norm(chroma_avg) + 1e-8)
    
    best_score = -1.0
    best_key = "C"
    best_scale = "Major"
    
    for root_idx, root_name in enumerate(PITCH_CLASSES):
        # Rotate profiles
        major_rotated = np.roll(major_profile, root_idx)
        minor_rotated = np.roll(minor_profile, root_idx)
        
        # Compute correlation
        major_score = np.dot(chroma_avg, major_rotated / (np.linalg.norm(major_rotated) + 1e-8))
        minor_score = np.dot(chroma_avg, minor_rotated / (np.linalg.norm(minor_rotated) + 1e-8))
        
        if major_score > best_score:
            best_score = major_score
            best_key = root_name
            best_scale = "Major"
        
        if minor_score > best_score:
            best_score = minor_score
            best_key = root_name
            best_scale = "Minor"
    
    # Normalize confidence (0-1)
    confidence = min(1.0, max(0.0, (best_score + 1.0) / 2.0))
    return best_key, best_scale, confidence


def _detect_vocals(y: np.ndarray, sr: int) -> tuple[bool, float]:
    """Simple vocal detection based on spectral centroid and energy."""
    # Spectral centroid (brightness) - vocals tend to have higher centroid
    spectral_centroids = librosa.feature.spectral_centroid(y=y, sr=sr)[0]
    centroid_mean = float(np.mean(spectral_centroids))
    
    # RMS energy
    rms = librosa.feature.rms(y=y)[0]
    rms_mean = float(np.mean(rms))
    
    # Simple heuristic: vocals if centroid > 2000 Hz and sufficient energy
    vocals_detected = centroid_mean > 2000.0 and rms_mean > 0.01
    confidence = min(1.0, max(0.0, (centroid_mean / 4000.0) * 0.5 + (rms_mean / 0.1) * 0.5))
    
    return vocals_detected, confidence


def _extract_pitches(y: np.ndarray, sr: int, num_samples: int = 100) -> List[Dict]:
    """Extract pitch information at regular intervals."""
    pitches: List[Dict] = []
    
    # Use pyin for fundamental frequency estimation
    try:
        f0, voiced_flag, voiced_probs = librosa.pyin(
            y, fmin=librosa.note_to_hz('C2'), fmax=librosa.note_to_hz('C7')
        )
        
        # Sample at regular intervals
        total_frames = len(f0)
        step = max(1, total_frames // num_samples)
        
        frame_times = librosa.frames_to_time(np.arange(total_frames), sr=sr)
        
        for i in range(0, total_frames, step):
            if voiced_flag[i] and not np.isnan(f0[i]):
                freq = float(f0[i])
                note = librosa.hz_to_note(freq)
                # Extract note name (e.g., "C#4" -> "C#")
                note_name = re.sub(r'\d+', '', note).strip()
                pitches.append({
                    "timeSec": float(frame_times[i]),
                    "note": note_name,
                    "frequencyHz": freq,
                })
    except Exception:
        # Fallback: use chroma peaks
        chroma = librosa.feature.chroma_cqt(y=y, sr=sr)
        frame_times = librosa.frames_to_time(np.arange(chroma.shape[1]), sr=sr)
        step = max(1, chroma.shape[1] // num_samples)
        
        for i in range(0, chroma.shape[1], step):
            peak_idx = int(np.argmax(chroma[:, i]))
            note_name = PITCH_CLASSES[peak_idx]
            # Estimate frequency from chroma
            freq = librosa.note_to_hz(f"{note_name}4")
            pitches.append({
                "timeSec": float(frame_times[i]),
                "note": note_name,
                "frequencyHz": freq,
            })
    
    return pitches


def analyze_audio_filelike(file_like: io.BytesIO, instrument: str | None = None) -> Dict:
    file_like.seek(0)  # Ensure we're at the start
    
    # Detect file type from first bytes
    file_header = file_like.read(12)
    file_like.seek(0)
    
    file_type = "unknown"
    if file_header.startswith(b'RIFF') or file_header.startswith(b'FORM'):
        file_type = "WAV/AIFF"
    elif file_header.startswith(b'\xff\xfb') or file_header.startswith(b'ID3'):
        file_type = "MP3"
    elif file_header.startswith(b'ftyp'):
        file_type = "MP4/M4A"
    
    try:
        # Try loading with librosa (handles most formats)
        y, sr = librosa.load(file_like, sr=22050, mono=True)
    except Exception as e1:
        error_msg = str(e1).lower()
        
        # Check for common error patterns
        if 'unspecified' in error_msg or 'internal error' in error_msg:
            if file_type in ["MP3", "MP4/M4A"]:
                raise ValueError(
                    f"Failed to decode {file_type} file. This may require FFmpeg. "
                    f"Please try converting to WAV format, or install FFmpeg: "
                    f"https://ffmpeg.org/download.html. "
                    f"Original error: {str(e1)}"
                )
            else:
                raise ValueError(
                    f"Failed to load audio file. The file may be corrupted or in an unsupported format. "
                    f"Please try a different file or convert to WAV format. "
                    f"Original error: {str(e1)}"
                )
        else:
            raise ValueError(
                f"Failed to load audio file: {str(e1)}. "
                f"Please ensure the file is a valid audio format (.mp3, .wav, .mp4) and not corrupted."
            )
    
    if len(y) == 0:
        raise ValueError("Audio file appears to be empty or corrupted.")
    
    duration = float(len(y) / sr)
    
    # Beat-synchronous chroma
    tempo, beats = librosa.beat.beat_track(y=y, sr=sr, trim=True)
    if tempo <= 0 or not np.isfinite(tempo):
        tempo = 120.0  # Default tempo
    chroma = librosa.feature.chroma_cqt(y=y, sr=sr)
    
    if beats.size > 0:
        chroma_sync = librosa.util.sync(chroma, beats, aggregate=np.median)
        times = librosa.frames_to_time(beats, sr=sr)
        if times.size != chroma_sync.shape[1]:
            times = np.linspace(0.0, duration, num=chroma_sync.shape[1])
        use_chroma = chroma_sync
        use_times = times
    else:
        use_chroma = chroma
        use_times = librosa.frames_to_time(np.arange(chroma.shape[1]), sr=sr)

    # Chord detection
    scores = _frame_chord_scores(use_chroma)
    segments = _aggregate_segments(use_times, scores)

    # clamp segment end to duration
    for seg in segments:
        seg["endSec"] = min(seg["endSec"], duration)

    # Key detection
    key, scale, key_confidence = _detect_key(chroma)
    
    # Vocal detection
    vocals_detected, vocals_confidence = _detect_vocals(y, sr)
    
    # Pitch extraction
    pitches = _extract_pitches(y, sr, num_samples=100)

    return {
        "durationSec": duration,
        "segments": segments,
        "instrument": instrument or "generic",
        "tempo": float(tempo) if 'tempo' in locals() else None,
        "key": key,
        "scale": scale,
        "keyConfidence": key_confidence,
        "vocalsDetected": vocals_detected,
        "vocalsConfidence": vocals_confidence,
        "pitches": pitches,
    }


