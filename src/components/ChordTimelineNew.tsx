import type { ChordSegment } from '../types'

type Props = {
  segments: ChordSegment[]
  duration: number
  onSeek?: (timeSec: number) => void
}

export function ChordTimelineNew({ segments, duration, onSeek }: Props) {
  return (
    <div style={{ marginBottom: '32px' }}>
      <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px', color: 'var(--text-primary)' }}>
        Chord Timeline
      </h3>
      <div
        style={{
          display: 'flex',
          gap: '4px',
          overflowX: 'auto',
          padding: '12px',
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: '12px',
          border: '1px solid var(--border-color)',
        }}
      >
        {segments.map((segment, idx) => {
          const widthPct = ((segment.endSec - segment.startSec) / Math.max(1e-6, duration)) * 100
          return (
            <button
              key={idx}
              onClick={() => onSeek?.(segment.startSec)}
              style={{
                minWidth: '80px',
                padding: '12px 16px',
                backgroundColor: 'var(--bg-tertiary)',
                borderRadius: '8px',
                border: 'none',
                color: 'var(--text-primary)',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--accent-purple)'
                e.currentTarget.style.transform = 'scale(1.05)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'
                e.currentTarget.style.transform = 'scale(1)'
              }}
            >
              {segment.chord}
            </button>
          )
        })}
      </div>
    </div>
  )
}