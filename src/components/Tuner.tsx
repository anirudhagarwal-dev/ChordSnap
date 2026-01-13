import { useState, useRef, useEffect } from 'react'

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

const TUNINGS: Record<
  string,
  { name: string; strings: { label: string; freq: number }[] }
> = {
  standard: {
    name: 'Standard (EADGBE)',
    strings: [
      { label: 'E4', freq: 329.63 },
      { label: 'B3', freq: 246.94 },
      { label: 'G3', freq: 196.0 },
      { label: 'D3', freq: 146.83 },
      { label: 'A2', freq: 110.0 },
      { label: 'E2', freq: 82.41 },
    ],
  },
  dropd: {
    name: 'Drop D',
    strings: [
      { label: 'E4', freq: 329.63 },
      { label: 'B3', freq: 246.94 },
      { label: 'G3', freq: 196.0 },
      { label: 'D3', freq: 146.83 },
      { label: 'A2', freq: 110.0 },
      { label: 'D2', freq: 73.42 },
    ],
  },
  openg: {
    name: 'Open G',
    strings: [
      { label: 'D4', freq: 293.66 },
      { label: 'B3', freq: 246.94 },
      { label: 'G3', freq: 196.0 },
      { label: 'D3', freq: 146.83 },
      { label: 'G2', freq: 98.0 },
      { label: 'D2', freq: 73.42 },
    ],
  },
  halfstep: {
    name: 'Half-step Down',
    strings: [
      { label: 'Eb4', freq: 311.13 },
      { label: 'Bb3', freq: 233.08 },
      { label: 'Gb3', freq: 185.0 },
      { label: 'Db3', freq: 138.59 },
      { label: 'Ab2', freq: 103.83 },
      { label: 'Eb2', freq: 77.78 },
    ],
  },
}

type Props = {
  onTune?: (note: string, cents: number) => void
}

function TunerSparkles() {
  const flakes = Array.from({ length: 12 }, (_, i) => i)
  return (
    <div className="tuner-sparkles">
      {flakes.map((i) => {
        const left = Math.random() * 100
        const top = 10 + Math.random() * 80
        const delay = Math.random() * 8
        const duration = 10 + Math.random() * 6
        const size = 3 + Math.random() * 4
        return (
          <div
            key={i}
            className="tuner-sparkle"
            style={{
              left: `${left}%`,
              top: `${top}%`,
              width: `${size}px`,
              height: `${size}px`,
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
            }}
          />
        )
      })}
    </div>
  )
}

export function Tuner({ onTune }: Props) {
  const [isActive, setIsActive] = useState(false)
  const [currentNote, setCurrentNote] = useState<string>('--')
  const [cents, setCents] = useState(0)
  const [frequency, setFrequency] = useState(0)
  const [a4, setA4] = useState(440)
  const [mode, setMode] = useState<'auto' | 'manual'>('auto')
  const [tuningKey, setTuningKey] = useState<keyof typeof TUNINGS>('standard')
  const [manualStringIdx, setManualStringIdx] = useState(0)
  const [amplitude, setAmplitude] = useState(0)
  const [noiseThreshold, setNoiseThreshold] = useState(0.02)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const freqBufferRef = useRef<number[]>([])
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

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

    const rms = Math.sqrt(dataArray.reduce((s, v) => s + v * v, 0) / dataArray.length)
    setAmplitude(rms)
    renderWaves()
    if (rms < noiseThreshold) {
      animationFrameRef.current = requestAnimationFrame(detectPitch)
      return
    }

    if (detectedFreq > 0) {
      const buf = freqBufferRef.current
      buf.push(detectedFreq)
      if (buf.length > 8) buf.shift()
      const stableFreq = buf.slice().sort((a, b) => a - b)[Math.floor(buf.length / 2)]
      setFrequency(stableFreq)
      const info = noteInfo(stableFreq, a4)
      let targetCents = info.cents
      let displayNote = info.name

      if (mode === 'auto') {
        const t = TUNINGS[tuningKey].strings
        const nearest = t.reduce<{ idx: number; diff: number }>(
          (best, s, idx) => {
            const diff = Math.abs(stableFreq - s.freq)
            return diff < best.diff ? { idx, diff } : best
          },
          { idx: 0, diff: Infinity }
        )
        const target = t[nearest.idx]
        displayNote = target.label
        targetCents = centsToTarget(stableFreq, target.freq)
      } else {
        const target = TUNINGS[tuningKey].strings[manualStringIdx]
        displayNote = target.label
        targetCents = centsToTarget(stableFreq, target.freq)
      }

      setCurrentNote(displayNote)
      setCents(Math.max(-50, Math.min(50, Math.round(targetCents))))
      onTune?.(displayNote, Math.round(targetCents))
    }

    animationFrameRef.current = requestAnimationFrame(detectPitch)
  }

  const detectFrequency = (data: Float32Array, sampleRate: number): number => {
    let maxCorr = 0
    let bestPeriod = 0
    const len = data.length
    for (let period = 24; period < len / 2; period++) {
      let corr = 0
      for (let i = 0; i < len - period; i++) {
        corr += data[i] * data[i + period]
      }
      if (corr > maxCorr) {
        maxCorr = corr
        bestPeriod = period
      }
    }
    return bestPeriod > 0 ? sampleRate / bestPeriod : 0
  }

  const noteInfo = (freq: number, a4Freq: number) => {
    const n = Math.round(12 * Math.log2(freq / a4Freq) + 69)
    const cents = Math.round(100 * (12 * Math.log2(freq / a4Freq) + 69 - n))
    const name = NOTE_NAMES[n % 12]
    const octave = Math.floor(n / 12) - 1
    return { name: `${name}${octave}`, cents }
  }

  const centsToTarget = (freq: number, targetFreq: number) => {
    return 1200 * Math.log2(freq / targetFreq)
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
    setCurrentNote('--')
  }

  const getTuningColor = () => {
    const absCents = Math.abs(cents)
    if (absCents < 5) return 'var(--accent-green)'
    if (absCents < 20) return 'var(--accent-teal)'
    return 'var(--accent-purple)'
  }

  const renderWaves = () => {
    const c = canvasRef.current
    if (!c) return
    const ctx = c.getContext('2d')!
    const dpr = Math.max(1, window.devicePixelRatio || 1)
    const w = 560
    const h = 120
    c.width = Math.floor(w * dpr)
    c.height = Math.floor(h * dpr)
    c.style.width = w + 'px'
    c.style.height = h + 'px'
    ctx.clearRect(0, 0, c.width, c.height)
    const base = getTuningColor()
    ctx.strokeStyle = base
    ctx.globalAlpha = 0.4
    ctx.lineWidth = dpr
    const amp = Math.min(30, Math.max(6, amplitude * 240))
    for (let i = 0; i < 3; i++) {
      ctx.beginPath()
      for (let x = 0; x <= c.width; x += 8 * dpr) {
        const y =
          c.height / 2 +
          Math.sin(x / (80 * dpr) + (performance.now() / 1000) * (0.6 + i * 0.2)) *
            (amp - i * 6) * dpr
        if (x === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()
    }
  }

  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: 'var(--card-bg)',
        borderRadius: '16px',
        padding: '32px',
        border: '1px solid var(--border-color)',
        textAlign: 'center',
      }}
    >
      <TunerSparkles />
      <h3 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '24px', color: 'var(--text-primary)' }}>
        Guitar Tuner
      </h3>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '16px',
        }}
      >
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center' }}>
          <label htmlFor="tuner-mode" style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Mode</label>
          <select
            id="tuner-mode"
            value={mode}
            onChange={(e) => setMode(e.target.value as 'auto' | 'manual')}
            style={{
              backgroundColor: 'var(--bg-tertiary)',
              color: 'var(--text-primary)',
              borderRadius: '8px',
              padding: '8px 12px',
              border: '1px solid var(--border-color)',
            }}
          >
            <option value="auto">Auto</option>
            <option value="manual">Manual</option>
          </select>
        </div>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center' }}>
          <label htmlFor="tuner-tuning" style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Tuning</label>
          <select
            id="tuner-tuning"
            value={tuningKey}
            onChange={(e) => setTuningKey(e.target.value as keyof typeof TUNINGS)}
            style={{
              backgroundColor: 'var(--bg-tertiary)',
              color: 'var(--text-primary)',
              borderRadius: '8px',
              padding: '8px 12px',
              border: '1px solid var(--border-color)',
            }}
          >
            {Object.keys(TUNINGS).map((k) => (
              <option key={k} value={k}>
                {TUNINGS[k].name}
              </option>
            ))}
          </select>
        </div>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center' }}>
          <label htmlFor="tuner-a4" style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>A4</label>
          <input
            id="tuner-a4"
            type="range"
            min={430}
            max={450}
            step={1}
            value={a4}
            onChange={(e) => setA4(parseInt(e.target.value))}
            aria-label="Reference pitch A4"
            style={{ width: '160px' }}
          />
          <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{a4} Hz</span>
        </div>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center' }}>
          <label htmlFor="tuner-noise" style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Noise</label>
          <input
            id="tuner-noise"
            type="range"
            min={0}
            max={0.1}
            step={0.005}
            value={noiseThreshold}
            onChange={(e) => setNoiseThreshold(parseFloat(e.target.value))}
            aria-label="Noise threshold"
            style={{ width: '160px' }}
          />
        </div>
      </div>

      {mode === 'manual' && (
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '12px', flexWrap: 'wrap' }}>
          {TUNINGS[tuningKey].strings.map((s, idx) => (
            <button
              key={s.label}
              onClick={() => setManualStringIdx(idx)}
              style={{
                padding: '8px 12px',
                backgroundColor: manualStringIdx === idx ? 'var(--accent-purple)' : 'var(--bg-tertiary)',
                color: 'var(--text-primary)',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                fontSize: '12px',
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      )}

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
                  left: `${50 + cents}%`,
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
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <canvas ref={canvasRef} width={560} height={120} style={{ maxWidth: '100%' }} />
        </div>
        {isActive && Math.abs(cents) < 5 && (
          <div style={{ marginTop: '12px', fontSize: '14px', color: 'var(--accent-green)' }}>
            ✓ {currentNote} tuned
          </div>
        )}
      </div>

      <button
        onClick={isActive ? stopTuner : startTuner}
        style={{
          padding: '14px 32px',
          backgroundColor: isActive ? '#ef4444' : 'var(--accent-purple)',
          color: 'var(--text-on-accent)',
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
