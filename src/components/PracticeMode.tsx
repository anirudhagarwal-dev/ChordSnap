import { useState, useEffect, useRef } from 'react'
import type { ChordSegment } from '../types'

type Props = {
  segments: ChordSegment[]
  duration: number
  currentTime: number
  isPlaying: boolean
  onSeek: (time: number) => void
  playbackRate: number
}

export function PracticeMode({ segments, duration, currentTime, isPlaying, onSeek, playbackRate }: Props) {
  const [scrollPosition, setScrollPosition] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const currentChordIndex = segments.findIndex(
    (seg) => currentTime >= seg.startSec && currentTime < seg.endSec
  )

  useEffect(() => {
    if (!isPlaying || currentChordIndex === -1) return

    const currentSegment = segments[currentChordIndex]
    const progress = (currentTime - currentSegment.startSec) / (currentSegment.endSec - currentSegment.startSec)
    const scrollTo = currentChordIndex * 200 - window.innerWidth / 2 + 100

    setScrollPosition(scrollTo)
    if (containerRef.current) {
      containerRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' })
    }
  }, [currentTime, currentChordIndex, isPlaying, segments])

  return (
    <div
      style={{
        backgroundColor: 'var(--card-bg)',
        borderRadius: '16px',
        padding: '32px',
        border: '1px solid var(--border-color)',
        marginBottom: '24px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--text-primary)' }}>🎸 Practice Mode</h3>
        <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
          Speed: {playbackRate.toFixed(2)}x
        </div>
      </div>

      <div
        ref={containerRef}
        style={{
          display: 'flex',
          gap: '16px',
          overflowX: 'auto',
          padding: '20px',
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: '12px',
          scrollBehavior: 'smooth',
          scrollbarWidth: 'thin',
        }}
      >
        {segments.map((segment, idx) => {
          const isActive = idx === currentChordIndex
          const isPast = currentTime > segment.endSec
          const isUpcoming = currentTime < segment.startSec

          return (
            <div
              key={idx}
              onClick={() => onSeek(segment.startSec)}
              style={{
                minWidth: '180px',
                padding: '24px',
                backgroundColor: isActive
                  ? 'var(--accent-purple)'
                  : isPast
                    ? 'var(--bg-tertiary)'
                    : 'var(--card-bg)',
                borderRadius: '12px',
                border: isActive ? '3px solid var(--accent-purple-light)' : '2px solid var(--border-color)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                transform: isActive ? 'scale(1.1)' : 'scale(1)',
                boxShadow: isActive ? '0 8px 24px rgba(163, 29, 29, 0.4)' : 'none',
                opacity: isUpcoming ? 0.6 : 1,
              }}
            >
              <div
                style={{
                  fontSize: '48px',
                  fontWeight: 700,
                  color: isActive ? 'var(--text-primary)' : 'var(--text-primary)',
                  textAlign: 'center',
                  marginBottom: '8px',
                }}
              >
                {segment.chord}
              </div>
              <div
                style={{
                  fontSize: '12px',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  textAlign: 'center',
                }}
              >
                {Math.floor(segment.startSec / 60)}:
                {Math.floor(segment.startSec % 60)
                  .toString()
                  .padStart(2, '0')}
              </div>
              {segment.notes && (
                <div
                  style={{
                    display: 'flex',
                    gap: '4px',
                    justifyContent: 'center',
                    marginTop: '8px',
                    flexWrap: 'wrap',
                  }}
                >
                  {segment.notes.map((note, noteIdx) => (
                    <span
                      key={noteIdx}
                      style={{
                        padding: '4px 8px',
                        backgroundColor: isActive ? 'rgba(255, 255, 255, 0.2)' : 'var(--bg-tertiary)',
                        borderRadius: '4px',
                        fontSize: '10px',
                        color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                      }}
                    >
                      {note}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div style={{ marginTop: '16px', fontSize: '14px', color: 'var(--text-secondary)', textAlign: 'center' }}>
        {isPlaying ? '🎵 Playing... Follow along!' : '▶️ Start playback to begin practice mode'}
      </div>
    </div>
  )
}

