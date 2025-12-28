import type { PitchData } from '../types'

type Props = {
  pitches: PitchData[]
}

export function PitchAnalysis({ pitches }: Props) {
  const sampledPitches = pitches.length > 100 
    ? pitches.filter((_, i) => i % Math.ceil(pitches.length / 100) === 0).slice(0, 100)
    : pitches

  return (
    <div
      style={{
        backgroundColor: 'var(--card-bg)',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid var(--border-color)',
      }}
    >
      <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '12px', color: 'var(--text-primary)' }}>
        Pitch Analysis
      </h3>
      <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
        Detected pitch over time (sampling: {sampledPitches.length} points)
      </p>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '12px',
          maxHeight: '400px',
          overflowY: 'auto',
          paddingRight: '8px',
        }}
      >
        {sampledPitches.map((pitch, i) => {
          const minutes = Math.floor(pitch.timeSec / 60)
          const seconds = Math.floor(pitch.timeSec % 60)
          const timeStr = `${minutes}:${seconds.toString().padStart(2, '0')}`

          return (
            <div
              key={i}
              style={{
                padding: '12px',
                backgroundColor: 'var(--bg-tertiary)',
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
              }}
            >
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{timeStr}</div>
              <div style={{ fontSize: '18px', fontWeight: 600, color: 'var(--accent-purple)' }}>{pitch.note}</div>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{Math.round(pitch.frequencyHz)} Hz</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}