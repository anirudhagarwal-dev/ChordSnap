import { useState, useRef, useEffect } from 'react'

type Props = {
  initialBPM?: number
}

export function Metronome({ initialBPM = 120 }: Props) {
  const [bpm, setBpm] = useState(initialBPM)
  const [isPlaying, setIsPlaying] = useState(false)
  const [beat, setBeat] = useState(0)
  const intervalRef = useRef<number | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const oscillatorRef = useRef<OscillatorNode | null>(null)

  useEffect(() => {
    return () => {
      stopMetronome()
    }
  }, [])

  useEffect(() => {
    if (isPlaying) {
      startMetronome()
    } else {
      stopMetronome()
    }
    return () => {
      stopMetronome()
    }
  }, [isPlaying, bpm])

  const playTick = () => {
    try {
      const audioContext = audioContextRef.current || new (window.AudioContext || (window as any).webkitAudioContext)()
      audioContextRef.current = audioContext

      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.value = beat === 0 ? 800 : 400
      oscillator.type = 'sine'

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.1)

      setBeat((prev) => (prev + 1) % 4)
    } catch (err) {
      console.error('Error playing metronome:', err)
    }
  }

  const startMetronome = () => {
    if (intervalRef.current) return

    const interval = (60 / bpm) * 1000
    playTick()
    intervalRef.current = window.setInterval(playTick, interval)
  }

  const stopMetronome = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setBeat(0)
  }

  const toggleMetronome = () => {
    setIsPlaying((prev) => !prev)
  }

  return (
    <div
      style={{
        backgroundColor: 'var(--card-bg)',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid var(--border-color)',
      }}
    >
      <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '24px', color: 'var(--text-primary)' }}>
        Metronome
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontSize: '48px',
              fontWeight: 700,
              color: 'var(--accent-purple)',
              marginBottom: '8px',
            }}
          >
            {bpm}
          </div>
          <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>BPM</div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', width: '100%', maxWidth: '300px' }}>
          <button
            onClick={() => setBpm(Math.max(40, bpm - 5))}
            style={{
              padding: '8px 16px',
              backgroundColor: 'var(--bg-tertiary)',
              color: 'var(--text-primary)',
              borderRadius: '8px',
              fontSize: '18px',
              fontWeight: 600,
              cursor: 'pointer',
              border: 'none',
            }}
          >
            -5
          </button>
          <input
            type="range"
            min="40"
            max="200"
            value={bpm}
            onChange={(e) => setBpm(Number(e.target.value))}
            style={{
              flex: 1,
              height: '8px',
              borderRadius: '4px',
              background: 'var(--bg-tertiary)',
              outline: 'none',
            }}
          />
          <button
            onClick={() => setBpm(Math.min(200, bpm + 5))}
            style={{
              padding: '8px 16px',
              backgroundColor: 'var(--bg-tertiary)',
              color: 'var(--text-primary)',
              borderRadius: '8px',
              fontSize: '18px',
              fontWeight: 600,
              cursor: 'pointer',
              border: 'none',
            }}
          >
            +5
          </button>
        </div>

        {isPlaying && (
          <div style={{ display: 'flex', gap: '8px' }}>
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  backgroundColor: i === beat ? 'var(--accent-purple)' : 'var(--bg-tertiary)',
                  transition: 'all 0.1s ease',
                }}
              />
            ))}
          </div>
        )}

        <button
          onClick={toggleMetronome}
          style={{
            padding: '14px 40px',
            backgroundColor: isPlaying ? '#ef4444' : 'var(--accent-purple)',
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
          {isPlaying ? '⏸ Stop' : '▶ Start'}
        </button>
      </div>
    </div>
  )
}