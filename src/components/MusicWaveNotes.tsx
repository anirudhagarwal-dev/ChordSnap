import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

type Props = {
  enabled?: boolean
  waveSpeed?: number
  noteDuration?: number
  fadeTime?: number
  density?: number
  volume?: number
}

const NOTE_SYMBOLS = ['♪', '♫', '♩', '♬', '𝄞']

export function MusicWaveNotes({
  enabled = true,
  waveSpeed = 1.6,
  noteDuration = 1.8,
  fadeTime = 1.0,
  density = 0.7,
  volume = 0.08,
}: Props) {
  const [visualNotes, setVisualNotes] = useState<
    { id: number; left: number; top: number; driftX: number; driftY: number; size: number; symbol: string; duration: number }[]
  >([])
  const nextIdRef = useRef(0)
  const schedulerRef = useRef<number | null>(null)
  const runningRef = useRef(false)

  const spawnVisualNote = (duration: number) => {
    const id = nextIdRef.current++
    const left = Math.random() * 100
    const top = Math.random() * 100
    const driftX = 120 + Math.random() * 120
    const driftY = -160 - Math.random() * 160
    const size = 14 + Math.random() * 18
    const symbol = NOTE_SYMBOLS[id % NOTE_SYMBOLS.length]
    setVisualNotes((prev) => [...prev, { id, left, top, driftX, driftY, size, symbol, duration }])
    window.setTimeout(() => {
      setVisualNotes((prev) => prev.filter((n) => n.id !== id))
    }, duration * 1000)
  }

  useEffect(() => {
    if (!enabled) {
      runningRef.current = false
      if (schedulerRef.current) {
        window.clearInterval(schedulerRef.current)
        schedulerRef.current = null
      }
      return
    }

    runningRef.current = true
    const interval = Math.max(0.15, 1 / density)

    const tick = () => {
      const dur = Math.max(0.8, noteDuration)
      spawnVisualNote(Math.max(0.9, dur / waveSpeed))
    }

    schedulerRef.current = window.setInterval(tick, interval * 1000)
    return () => {
      runningRef.current = false
      if (schedulerRef.current) {
        window.clearInterval(schedulerRef.current)
        schedulerRef.current = null
      }
    }
  }, [enabled, density, fadeTime, noteDuration, waveSpeed, volume])

  return createPortal(
    <div className="music-wave-notes-container" aria-hidden="true">
      {visualNotes.map((n) => (
        <span
          key={n.id}
          className="music-wave-note"
          style={{
            left: `${n.left}%`,
            top: `${n.top}%`,
            fontSize: `${n.size}px`,
            animationDuration: `${n.duration}s`,
            '--wave-drift-x': `${n.driftX}px`,
            '--wave-drift-y': `${n.driftY}px`,
          } as React.CSSProperties}
        >
          {n.symbol}
        </span>
      ))}
    </div>,
    document.body
  )
}