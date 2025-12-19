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
    <div>
      <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '24px', color: 'var(--text-primary)' }}>
        Detected Chords
      </h3>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '20px',
        }}
      >
        {segments.map((segment, i) => {
          const confidencePercent = Math.round(segment.confidence * 100)
          const isHighConfidence = confidencePercent >= 90

          return (
            <div
              key={i}
              style={{
                backgroundColor: 'var(--card-bg)',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                transition: 'transform 0.2s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.borderColor = 'var(--accent-purple)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.borderColor = 'var(--border-color)'
              }}
              onClick={() => onSeek?.(segment.startSec)}
            >
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
                        borderRadius: '6px',
                        fontSize: '14px',
                        color: 'var(--text-primary)',
                      }}
                    >
                      {note}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

