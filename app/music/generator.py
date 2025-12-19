"""
AI Music Generator - Generates instrumental tracks based on detected chords and tempo
"""
import numpy as np
import io
from typing import Dict, List, Tuple
import librosa
from scipy.io import wavfile
from scipy import signal

def generate_drum_pattern(tempo: float, duration: float, pattern: str = "standard") -> np.ndarray:
    """Generate a drum pattern (kick, snare, hi-hat)"""
    sr = 22050
    total_samples = int(duration * sr)
    drum_track = np.zeros(total_samples)
    
    # Calculate beat positions
    beats_per_second = tempo / 60.0
    samples_per_beat = int(sr / beats_per_second)
    
    # Generate kick (on beats 1 and 3)
    kick_freq = 60  # Hz
    kick_duration = 0.1  # seconds
    kick_samples = int(kick_duration * sr)
    
    for beat in range(0, total_samples, samples_per_beat * 2):
        if beat + kick_samples < total_samples:
            t = np.linspace(0, kick_duration, kick_samples)
            kick = np.sin(2 * np.pi * kick_freq * t) * np.exp(-t * 10)
            drum_track[beat:beat + kick_samples] += kick * 0.3
    
    # Generate snare (on beats 2 and 4)
    snare_duration = 0.05
    snare_samples = int(snare_duration * sr)
    
    # Snare frequency range (within Nyquist limit)
    snare_freq_low = 200
    snare_freq_high = min(8000, sr // 2 - 100)  # Stay below Nyquist
    
    for beat in range(samples_per_beat, total_samples, samples_per_beat * 2):
        if beat + snare_samples < total_samples:
            noise = np.random.normal(0, 1, snare_samples)
            sos = signal.butter(4, [snare_freq_low, snare_freq_high], btype='band', fs=sr, output='sos')
            filtered_noise = signal.sosfilt(sos, noise)
            drum_track[beat:beat + snare_samples] += filtered_noise * 0.2
    
    # Generate hi-hat (on every beat)
    hihat_duration = 0.02
    hihat_samples = int(hihat_duration * sr)
    # Use frequencies within Nyquist limit (fs/2 = 11025 for sr=22050)
    hihat_freq_low = 8000
    hihat_freq_high = min(10000, sr // 2 - 100)  # Stay below Nyquist
    
    for beat in range(0, total_samples, samples_per_beat):
        if beat + hihat_samples < total_samples:
            hihat_noise = np.random.normal(0, 1, hihat_samples)
            sos = signal.butter(4, [hihat_freq_low, hihat_freq_high], btype='band', fs=sr, output='sos')
            filtered_hihat = signal.sosfilt(sos, hihat_noise)
            drum_track[beat:beat + hihat_samples] += filtered_hihat * 0.1
    
    
    return drum_track

def generate_bass_line(chords: List[Dict], tempo: float, duration: float) -> np.ndarray:
    """Generate a bass line following the chord progression"""
    sr = 22050
    total_samples = int(duration * sr)
    bass_track = np.zeros(total_samples)
    
    # Note frequencies (C0 to C8)
    note_freqs = {
        'C': 32.70, 'C#': 34.65, 'D': 36.71, 'D#': 38.89,
        'E': 41.20, 'F': 43.65, 'F#': 46.25, 'G': 49.00,
        'G#': 51.91, 'A': 55.00, 'A#': 58.27, 'B': 61.74
    }
    
    beats_per_second = tempo / 60.0
    samples_per_beat = int(sr / beats_per_second)
    
    for chord_seg in chords:
        start_sample = int(chord_seg['startSec'] * sr)
        end_sample = int(chord_seg['endSec'] * sr)
        chord_name = chord_seg['chord']
        
        # Extract root note
        root = chord_name[0]
        if len(chord_name) > 1 and chord_name[1] in ['#', 'b']:
            root = chord_name[:2]
        
        # Get root frequency (one octave lower for bass)
        root_freq = note_freqs.get(root, 32.70) / 2
        
        # Generate bass notes (root note on each beat)
        segment_samples = end_sample - start_sample
        num_beats = int(segment_samples / samples_per_beat)
        
        for i in range(num_beats):
            beat_start = start_sample + (i * samples_per_beat)
            beat_end = min(beat_start + samples_per_beat, end_sample)
            beat_duration = (beat_end - beat_start) / sr
            
            if beat_duration > 0:
                t = np.linspace(0, beat_duration, beat_end - beat_start)
                # Create a smooth bass tone with slight attack
                envelope = np.exp(-t * 2)
                bass_note = np.sin(2 * np.pi * root_freq * t) * envelope
                bass_track[beat_start:beat_end] += bass_note * 0.25
    
    return bass_track

def generate_guitar_chords(chords: List[Dict], tempo: float, duration: float) -> np.ndarray:
    """Generate guitar strumming pattern following chords"""
    sr = 22050
    total_samples = int(duration * sr)
    guitar_track = np.zeros(total_samples)
    
    note_freqs = {
        'C': 261.63, 'C#': 277.18, 'D': 293.66, 'D#': 311.13,
        'E': 329.63, 'F': 349.23, 'F#': 369.99, 'G': 392.00,
        'G#': 415.30, 'A': 440.00, 'A#': 466.16, 'B': 493.88
    }
    
    # Chord intervals (major triads)
    chord_intervals = {
        '': [0, 4, 7],  # Major
        'm': [0, 3, 7],  # Minor
        '7': [0, 4, 7, 10],  # Dominant 7th
        'maj7': [0, 4, 7, 11],  # Major 7th
        'm7': [0, 3, 7, 10],  # Minor 7th
    }
    
    beats_per_second = tempo / 60.0
    samples_per_beat = int(sr / beats_per_second)
    
    for chord_seg in chords:
        start_sample = int(chord_seg['startSec'] * sr)
        end_sample = int(chord_seg['endSec'] * sr)
        chord_name = chord_seg['chord']
        
        # Parse chord
        root = chord_name[0]
        suffix = ''
        if len(chord_name) > 1:
            if chord_name[1] in ['#', 'b']:
                root = chord_name[:2]
                suffix = chord_name[2:]
            else:
                suffix = chord_name[1:]
        
        # Get root frequency
        root_freq = note_freqs.get(root, 261.63)
        
        # Get intervals
        intervals = chord_intervals.get(suffix, [0, 4, 7])
        
        # Generate chord notes
        chord_notes = []
        for interval in intervals:
            semitones = interval
            freq = root_freq * (2 ** (semitones / 12))
            chord_notes.append(freq)
        
        # Strum pattern (down-up-down-up)
        segment_samples = end_sample - start_sample
        num_beats = max(1, int(segment_samples / samples_per_beat))
        
        for i in range(num_beats):
            beat_start = start_sample + (i * samples_per_beat)
            beat_end = min(beat_start + int(samples_per_beat * 0.8), end_sample)
            beat_duration = (beat_end - beat_start) / sr
            
            if beat_duration > 0:
                t = np.linspace(0, beat_duration, beat_end - beat_start)
                # Strum effect (notes slightly offset)
                chord_sound = np.zeros(len(t))
                for j, freq in enumerate(chord_notes):
                    offset = j * 0.01  # Slight delay for strum effect
                    if offset < beat_duration:
                        note_t = t[t >= offset] - offset
                        if len(note_t) > 0:
                            envelope = np.exp(-note_t * 3)
                            note = np.sin(2 * np.pi * freq * note_t) * envelope
                            start_idx = np.where(t >= offset)[0][0]
                            chord_sound[start_idx:start_idx + len(note)] += note
                
                guitar_track[beat_start:beat_end] += chord_sound * 0.15
    
    return guitar_track

def generate_synth_pad(chords: List[Dict], tempo: float, duration: float) -> np.ndarray:
    """Generate a synth pad (sustained chords)"""
    sr = 22050
    total_samples = int(duration * sr)
    synth_track = np.zeros(total_samples)
    
    note_freqs = {
        'C': 261.63, 'C#': 277.18, 'D': 293.66, 'D#': 311.13,
        'E': 329.63, 'F': 349.23, 'F#': 369.99, 'G': 392.00,
        'G#': 415.30, 'A': 440.00, 'A#': 466.16, 'B': 493.88
    }
    
    chord_intervals = {
        '': [0, 4, 7],
        'm': [0, 3, 7],
        '7': [0, 4, 7, 10],
        'maj7': [0, 4, 7, 11],
        'm7': [0, 3, 7, 10],
    }
    
    for chord_seg in chords:
        start_sample = int(chord_seg['startSec'] * sr)
        end_sample = int(chord_seg['endSec'] * sr)
        chord_name = chord_seg['chord']
        
        root = chord_name[0]
        suffix = ''
        if len(chord_name) > 1:
            if chord_name[1] in ['#', 'b']:
                root = chord_name[:2]
                suffix = chord_name[2:]
            else:
                suffix = chord_name[1:]
        
        root_freq = note_freqs.get(root, 261.63)
        intervals = chord_intervals.get(suffix, [0, 4, 7])
        
        # Generate sustained chord
        segment_samples = end_sample - start_sample
        t = np.linspace(0, (end_sample - start_sample) / sr, segment_samples)
        
        chord_sound = np.zeros(segment_samples)
        for interval in intervals:
            semitones = interval
            freq = root_freq * (2 ** (semitones / 12))
            # Add slight detuning for richer sound
            detune = freq * 1.005
            note1 = np.sin(2 * np.pi * freq * t)
            note2 = np.sin(2 * np.pi * detune * t)
            # Soft attack and release
            envelope = np.ones(len(t))
            attack_samples = int(0.1 * sr)
            release_samples = int(0.2 * sr)
            if len(envelope) > attack_samples:
                envelope[:attack_samples] = np.linspace(0, 1, attack_samples)
            if len(envelope) > release_samples:
                envelope[-release_samples:] = np.linspace(1, 0, release_samples)
            
            chord_sound += (note1 + note2) * envelope * 0.1
        
        synth_track[start_sample:end_sample] += chord_sound
    
    return synth_track

def generate_music_tracks(chords: List[Dict], tempo: float, duration: float, 
                         enabled_tracks: Dict[str, bool] = None) -> Dict[str, np.ndarray]:
    """Generate all instrumental tracks"""
    if enabled_tracks is None:
        enabled_tracks = {
            'drums': True,
            'bass': True,
            'guitar': True,
            'synth': True
        }
    
    tracks = {}
    
    if enabled_tracks.get('drums', True):
        tracks['drums'] = generate_drum_pattern(tempo, duration)
    
    if enabled_tracks.get('bass', True):
        tracks['bass'] = generate_bass_line(chords, tempo, duration)
    
    if enabled_tracks.get('guitar', True):
        tracks['guitar'] = generate_guitar_chords(chords, tempo, duration)
    
    if enabled_tracks.get('synth', True):
        tracks['synth'] = generate_synth_pad(chords, tempo, duration)
    
    return tracks

def mix_tracks(tracks: Dict[str, np.ndarray], volumes: Dict[str, float] = None) -> np.ndarray:
    """Mix all tracks together with volume control"""
    if not tracks:
        return np.array([])
    
    if volumes is None:
        volumes = {track: 1.0 for track in tracks.keys()}
    
    # Find maximum length
    max_length = max(len(track) for track in tracks.values())
    
    # Mix tracks
    mixed = np.zeros(max_length)
    for track_name, track_data in tracks.items():
        volume = volumes.get(track_name, 1.0)
        if len(track_data) < max_length:
            # Pad with zeros
            padded = np.pad(track_data, (0, max_length - len(track_data)), 'constant')
        else:
            padded = track_data[:max_length]
        mixed += padded * volume
    
    # Normalize to prevent clipping
    max_val = np.max(np.abs(mixed))
    if max_val > 0:
        mixed = mixed / max_val * 0.8
    
    return mixed

def save_audio_to_wav(audio: np.ndarray, sample_rate: int = 22050) -> bytes:
    """Convert numpy array to WAV file bytes"""
    # Normalize to 16-bit integer range
    audio_int16 = (audio * 32767).astype(np.int16)
    
    # Create WAV file in memory
    buffer = io.BytesIO()
    wavfile.write(buffer, sample_rate, audio_int16)
    buffer.seek(0)
    return buffer.read()

