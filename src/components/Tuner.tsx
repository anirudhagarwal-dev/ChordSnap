import { useState, useRef, useEffect } from 'react'

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
const NOTE_FREQUENCIES: Record<string, number> = {
  C: 261.63,
  'C#': 277.18,
  D: 293.66,
  'D#': 311.13,
  E: 329.63,
  F: 349.23,
  'F#': 369.99,
  G: 392.0,
  'G#': 415.3,
  A: 440.0,
  'A#': 466.16,
  B: 493.88,
}

type Props = {
  onTune?: (note: string, cents: number) => void
}

export function Tuner({ onTune }: Props) {
  const [isActive, setIsActive] = useState(false)
  const [currentNote, setCurrentNote] = useState<string>('A')
  const [cents, setCents] = useState(0)
  const [frequency, setFrequency] = useState(0)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      stopTuner()
    }
  }, [])

  const startTuner = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      audioContextRef.current = audioContext

      const analyser = audioContext.createAnalyser()
      analyser.fftSize = 8192
      analyserRef.current = analyser

      const microphone = audioContext.createMediaStreamSource(stream)
      microphoneRef.current = microphone
      microphone.connect(analyser)

      setIsActive(true)
      detectPitch()
    } catch (err) {
      console.error('Error accessing microphone:', err)
      alert('Microphone access denied. Please allow microphone access.')
    }
  }

  const detectPitch = () => {
    if (!analyserRef.current) return

    const bufferLength = analyserRef.current.frequencyBinCount
    const dataArray = new Float32Array(bufferLength)
    analyserRef.current.getFloatTimeDomainData(dataArray)

    const sampleRate = audioContextRef.current?.sampleRate || 44100
    const detectedFreq = detectFrequency(dataArray, sampleRate)

    if (detectedFreq > 0) {
      setFrequency(detectedFreq)
      const closestNote = findClosestNote(detectedFreq)
      setCurrentNote(closestNote.note)
      setCents(closestNote.cents)
      onTune?.(closestNote.note, closestNote.cents)
    }

    animationFrameRef.current = requestAnimationFrame(detectPitch)
  }

  const detectFrequency = (data: Float32Array, sampleRate: number): number => {
    let maxCorrelation = 0
    let maxPeriod = 0

    for (let period = 20; period < data.length / 2; period++) {
      let correlation = 0
      for (let i = 0; i < data.length - period; i++) {
        correlation += data[i] * data[i + period]
      }
      if (correlation > maxCorrelation) {
        maxCorrelation = correlation
        maxPeriod = period
      }
    }

    if (maxPeriod > 0) {
      return sampleRate / maxPeriod
    }
    return 0
  }

  const findClosestNote = (freq: number): { note: string; cents: number } => {
    let closestNote = 'A'
    let minDiff = Infinity
    let cents = 0

    for (const [note, noteFreq] of Object.entries(NOTE_FREQUENCIES)) {
      for (let octave = 0; octave < 5; octave++) {
        const octaveFreq = noteFreq * Math.pow(2, octave)
        const diff = Math.abs(freq - octaveFreq)
        if (diff < minDiff) {
          minDiff = diff
          closestNote = note
          const semitones = 12 * Math.log2(freq / octaveFreq)
          cents = Math.round(semitones * 100)
        }
      }
    }

    return { note: closestNote, cents }
  }

  const stopTuner = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }

    if (microphoneRef.current) {
      microphoneRef.current.disconnect()
      microphoneRef.current = null
    }

    if (audioContextRef.current) {
      audioContextRef.current.close()
      audioContextRef.current = null
    }

    analyserRef.current = null
    setIsActive(false)
    setFrequency(0)
    setCents(0)
  }

  const getTuningColor = () => {
    const absCents = Math.abs(cents)
    if (absCents < 5) return 'var(--accent-green)'
    if (absCents < 20) return 'var(--accent-teal)'
    return 'var(--accent-purple)'
  }

  return (
    <div
      style={{
        backgroundColor: 'var(--card-bg)',
        borderRadius: '16px',
        padding: '32px',
        border: '1px solid var(--border-color)',
        textAlign: 'center',
      }}
    >
      <h3 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '24px', color: 'var(--text-primary)' }}>
        Tuner
      </h3>

      <div style={{ marginBottom: '32px' }}>
        <div
          style={{
            fontSize: '64px',
            fontWeight: 700,
            color: getTuningColor(),
            marginBottom: '16px',
            minHeight: '80px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {isActive ? currentNote : '--'}
        </div>
        {isActive && (
          <div style={{ fontSize: '18px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            {frequency.toFixed(1)} Hz
          </div>
        )}
        {isActive && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginTop: '16px',
            }}
          >
            <div
              style={{
                width: '200px',
                height: '8px',
                backgroundColor: 'var(--bg-tertiary)',
                borderRadius: '4px',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: 0,
                  bottom: 0,
                  width: '2px',
                  backgroundColor: 'var(--text-primary)',
                  transform: 'translateX(-50%)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: `${50 + (cents / 2)}%`,
                  top: 0,
                  bottom: 0,
                  width: '4px',
                  backgroundColor: getTuningColor(),
                  transform: 'translateX(-50%)',
                  transition: 'left 0.1s ease',
                }}
              />
            </div>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)', minWidth: '60px' }}>
              {cents > 0 ? '+' : ''}
              {cents}¢
            </div>
          </div>
        )}
      </div>

      <button
        onClick={isActive ? stopTuner : startTuner}
        style={{
          padding: '14px 32px',
          backgroundColor: isActive ? '#ef4444' : 'var(--accent-purple)',
          color: 'var(--text-primary)',
          borderRadius: '10px',
          fontSize: '16px',
          fontWeight: 600,
          cursor: 'pointer',
          border: 'none',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)'
        }}
      >
        {isActive ? 'Stop Tuning' : 'Start Tuner'}
      </button>
    </div>
  )
}