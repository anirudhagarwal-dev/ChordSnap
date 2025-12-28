import { useState, useRef, useEffect } from 'react'
import { MicrophoneInput } from './MicrophoneInput'
import type { ChordSegment } from '../types'

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'

type Props = {
  onAnalyze?: (file: File) => void
  analysisResult?: {
    segments: ChordSegment[]
    durationSec: number
    key?: string
    scale?: string
    tempo?: number
  } | null
  tempo?: number
}

type Track = {
  name: string
  enabled: boolean
  volume: number
  audioUrl?: string
}

export function MusicGenerator({ onAnalyze, analysisResult, tempo = 120 }: Props) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [tracks, setTracks] = useState<Track[]>([
    { name: 'drums', enabled: true, volume: 0.8 },
    { name: 'bass', enabled: true, volume: 0.7 },
    { name: 'guitar', enabled: true, volume: 0.6 },
    { name: 'synth', enabled: true, volume: 0.5 },
  ])
  const [mixedAudioUrl, setMixedAudioUrl] = useState<string | null>(null)
  const [projectName, setProjectName] = useState('')
  const [savedProjects, setSavedProjects] = useState<any[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('chordsnap-projects')
    if (saved) {
      setSavedProjects(JSON.parse(saved))
    }
  }, [])

  const handleGenerate = async () => {
    if (!analysisResult || !analysisResult.segments.length) {
      alert('Please analyze an audio file first to detect chords')
      return
    }

    setIsGenerating(true)
    try {
      const enabled_tracks: Record<string, boolean> = {}
      const volumes: Record<string, number> = {}
      
      tracks.forEach(track => {
        enabled_tracks[track.name] = track.enabled
        volumes[track.name] = track.volume
      })

      const response = await fetch(`${API_BASE}/generate-music`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          segments: analysisResult.segments,
          tempo: tempo || 120,
          duration: analysisResult.durationSec,
          enabled_tracks,
          volumes,
        }),
      })

      if (!response.ok) {
        let errorMessage = `Server error: ${response.status} ${response.statusText}`
        try {
          const errorData = await response.json()
          errorMessage = errorData.detail || errorMessage
        } catch (e) {
          try {
            const text = await response.text()
            if (text) errorMessage = text
          } catch (e2) {
          }
        }
        throw new Error(errorMessage)
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      setMixedAudioUrl(url)
    } catch (error) {
      console.error('Generation error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      alert(`Failed to generate music: ${errorMessage}\n\nPlease ensure:\n- Audio has been analyzed first\n- Backend server is running\n- Check browser console for details`)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = () => {
    if (!mixedAudioUrl) return
    
    const a = document.createElement('a')
    a.href = mixedAudioUrl
    a.download = `${projectName || 'generated_music'}.wav`
    a.click()
  }

  const handleSaveProject = () => {
    if (!projectName.trim()) {
      alert('Please enter a project name')
      return
    }

    const project = {
      id: Date.now().toString(),
      name: projectName,
      tracks: tracks,
      analysisResult: analysisResult,
      tempo: tempo,
      createdAt: new Date().toISOString(),
    }

    const updated = [...savedProjects, project]
    setSavedProjects(updated)
    localStorage.setItem('chordsnap-projects', JSON.stringify(updated))
    alert('Project saved successfully!')
  }

  const handleLoadProject = (project: any) => {
    setTracks(project.tracks)
    setProjectName(project.name)
    if (project.analysisResult && onAnalyze) {
      alert('Project loaded. Please re-analyze the original audio file.')
    }
  }

  const toggleTrack = (index: number) => {
    const updated = [...tracks]
    updated[index].enabled = !updated[index].enabled
    setTracks(updated)
  }

  const updateVolume = (index: number, volume: number) => {
    const updated = [...tracks]
    updated[index].volume = volume
    setTracks(updated)
  }

  return (
    <div style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '30px', color: 'var(--text-primary)' }}>
        AI Music Generator
      </h2>

      <p style={{ fontSize: '16px', color: 'var(--text-secondary)', marginBottom: '40px' }}>
        Upload or record vocals, detect chords, and generate a complete instrumental accompaniment.
      </p>

      <div
        style={{
          backgroundColor: 'var(--card-bg)',
          padding: '32px',
          borderRadius: '16px',
          border: '1px solid var(--border-color)',
          marginBottom: '32px',
        }}
      >
        <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '20px', color: 'var(--text-primary)' }}>
          Step 1: Upload or Record Vocals
        </h3>
        
        {!analysisResult ? (
          <div>
            <input
              type="file"
              accept="audio/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file && onAnalyze) {
                  onAnalyze(file)
                }
              }}
              style={{
                padding: '12px',
                backgroundColor: 'var(--bg-tertiary)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                color: 'var(--text-primary)',
                marginBottom: '16px',
                width: '100%',
              }}
            />
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>OR</p>
              <MicrophoneInput
                onAudioData={async (audioData) => {
                  console.log('Recording audio:', audioData.length)
                }}
              />
            </div>
          </div>
        ) : (
          <div style={{ padding: '20px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '8px' }}>
            <p style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>
              ✓ Audio analyzed: {analysisResult.segments.length} chords detected
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              Key: {analysisResult.key || 'Unknown'} | Duration: {Math.round(analysisResult.durationSec)}s
            </p>
          </div>
        )}
      </div>

      {analysisResult && (
        <div
          style={{
            backgroundColor: 'var(--card-bg)',
            padding: '32px',
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            marginBottom: '32px',
          }}
        >
          <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '24px', color: 'var(--text-primary)' }}>
            Step 2: Customize Tracks
          </h3>

          <div style={{ display: 'grid', gap: '16px' }}>
            {tracks.map((track, index) => (
              <div
                key={track.name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '16px',
                  backgroundColor: 'var(--bg-tertiary)',
                  borderRadius: '8px',
                }}
              >
                <button
                  onClick={() => toggleTrack(index)}
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '4px',
                    border: '2px solid var(--border-color)',
                    backgroundColor: track.enabled ? 'var(--accent-purple)' : 'transparent',
                    cursor: 'pointer',
                  }}
                >
                  {track.enabled && '✓'}
                </button>
                <span style={{ minWidth: '80px', color: 'var(--text-primary)', fontWeight: 500 }}>
                  {track.name.charAt(0).toUpperCase() + track.name.slice(1)}
                </span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={track.volume}
                  onChange={(e) => updateVolume(index, parseFloat(e.target.value))}
                  style={{ flex: 1 }}
                />
                <span style={{ minWidth: '40px', textAlign: 'right', color: 'var(--text-secondary)' }}>
                  {Math.round(track.volume * 100)}%
                </span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              style={{
                padding: '12px 24px',
                backgroundColor: 'var(--accent-purple)',
                color: 'var(--text-primary)',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 600,
                cursor: isGenerating ? 'not-allowed' : 'pointer',
                opacity: isGenerating ? 0.6 : 1,
              }}
            >
              {isGenerating ? 'Generating...' : 'Generate Music'}
            </button>
          </div>
        </div>
      )}

      {mixedAudioUrl && (
        <div
          style={{
            backgroundColor: 'var(--card-bg)',
            padding: '32px',
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            marginBottom: '32px',
          }}
        >
          <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '20px', color: 'var(--text-primary)' }}>
            Generated Music
          </h3>
          <audio
            ref={audioRef}
            src={mixedAudioUrl}
            controls
            style={{ width: '100%', marginBottom: '16px' }}
          />
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={handleDownload}
              style={{
                padding: '10px 20px',
                backgroundColor: 'var(--accent-purple)',
                color: 'var(--text-primary)',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Download WAV
            </button>
          </div>
        </div>
      )}

      <div
        style={{
          backgroundColor: 'var(--card-bg)',
          padding: '32px',
          borderRadius: '16px',
          border: '1px solid var(--border-color)',
        }}
      >
        <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '20px', color: 'var(--text-primary)' }}>
          Save Project
        </h3>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Enter project name"
            style={{
              flex: 1,
              padding: '10px 16px',
              backgroundColor: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              color: 'var(--text-primary)',
              fontSize: '14px',
            }}
          />
          <button
            onClick={handleSaveProject}
            style={{
              padding: '10px 20px',
              backgroundColor: 'var(--accent-purple)',
              color: 'var(--text-primary)',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Save
          </button>
        </div>

        {savedProjects.length > 0 && (
          <div>
            <h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px', color: 'var(--text-primary)' }}>
              Saved Projects
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {savedProjects.map((project) => (
                <div
                  key={project.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px',
                    backgroundColor: 'var(--bg-tertiary)',
                    borderRadius: '8px',
                  }}
                >
                  <div>
                    <div style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{project.name}</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
                      {new Date(project.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <button
                    onClick={() => handleLoadProject(project)}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: 'var(--accent-purple)',
                      color: 'var(--text-primary)',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '12px',
                      cursor: 'pointer',
                    }}
                  >
                    Load
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}