import type { ChordSegment } from '../types'

type Props = {
  segments: ChordSegment[]
  duration: number
  onSeek?: (timeSec: number) => void
}

export function ChordTimeline({ segments, duration, onSeek }: Props) {
  return (
    <div style={{ marginTop: 16 }}>
      <h3>Detected Chords</h3>
      <div
        style={{
          display: 'flex',
          gap: 4,
          border: '1px solid #ddd',
          height: 48,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {segments.map((s, idx) => {
          const widthPct = ((s.endSec - s.startSec) / Math.max(1e-6, duration)) * 100
          return (
            <div
              key={idx}
              title={`${s.chord} (${s.startSec.toFixed(2)}s - ${s.endSec.toFixed(2)}s)`}
              onClick={() => onSeek?.(s.startSec)}
              style={{
                width: `${widthPct}%`,
                background: idx % 2 === 0 ? '#e9f5ff' : '#f3f3f3',
                borderRight: '1px solid #fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                cursor: 'pointer',
                userSelect: 'none',
              }}
            >
              <span>{s.chord}</span>
            </div>
          )
        })}
      </div>
      <ul style={{ marginTop: 12 }}>
        {segments.map((s, i) => (
          <li key={i}>
            <button onClick={() => onSeek?.(s.startSec)} style={{ marginRight: 6 }}>▶</button>
            {s.chord} — {s.startSec.toFixed(2)}s to {s.endSec.toFixed(2)}s (conf {s.confidence.toFixed(2)})
          </li>
        ))}
      </ul>
    </div>
  )
}


