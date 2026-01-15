import type { ChordSegment } from '../types'

type Props = {
  segments: ChordSegment[]
  onSeek?: (timeSec: number) => void
}

export function ChordCards({ segments, onSeek }: Props) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="minimal-gradient-bg" style={{ borderRadius: '20px', padding: '16px' }}>
      <h3 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px', color: 'var(--text-primary)', letterSpacing: '0.3px' }}>
        Detected Chords
      </h3>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: '24px',
        }}
      >
        {segments.map((segment, i) => {
          const confidencePercent = Math.round(segment.confidence * 100)
          const isHighConfidence = confidencePercent >= 90
          const floatDuration = 6 + ((i % 5) * 0.6)
          const floatDelay = (i % 7) * 0.2

          return (
            <div
              key={i}
              className="chord-card"
              style={{
                animationDuration: `${floatDuration}s`,
                animationDelay: `${floatDelay}s`,
                cursor: 'pointer',
              }}
              onClick={() => onSeek?.(segment.startSec)}
            >
              <div className="chord-card-content">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--text-primary)' }}>{segment.chord}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  {formatTime(segment.startSec)} - {formatTime(segment.endSec)}
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Confidence</span>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {confidencePercent}%
                  </span>
                </div>
                <div
                  style={{
                    width: '100%',
                    height: '8px',
                    backgroundColor: 'var(--bg-tertiary)',
                    borderRadius: '4px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${confidencePercent}%`,
                      height: '100%',
                      backgroundColor: isHighConfidence ? 'var(--accent-purple)' : 'var(--accent-green)',
                      transition: 'width 0.3s ease',
                    }}
                  />
                </div>
              </div>

              {segment.notes && segment.notes.length > 0 && (
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {segment.notes.map((note, noteIdx) => (
                    <div
                      key={noteIdx}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: 'var(--bg-tertiary)',
                        borderRadius: '8px',
                        fontSize: '12px',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--border-color)',
                      }}
                    >
                      {note}
                    </div>
                  ))}
                </div>
              )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
