import { useState } from 'react'

const ALL_CHORDS = [
  'C', 'Cm', 'C#', 'C#m', 'D', 'Dm', 'D#', 'D#m', 'E', 'Em', 'F', 'Fm', 'F#', 'F#m',
  'G', 'Gm', 'G#', 'G#m', 'A', 'Am', 'A#', 'A#m', 'B', 'Bm',
  'C7', 'Cm7', 'Cmaj7', 'D7', 'Dm7', 'Dmaj7', 'E7', 'Em7', 'Emaj7',
  'F7', 'Fm7', 'Fmaj7', 'G7', 'Gm7', 'Gmaj7', 'A7', 'Am7', 'Amaj7',
]

const POP_PROGRESSIONS = [
  ['C', 'Am', 'F', 'G'],
  ['Am', 'F', 'C', 'G'],
  ['C', 'G', 'Am', 'F'],
  ['F', 'Am', 'C', 'G'],
]

const JAZZ_PROGRESSIONS = [
  ['Cmaj7', 'Am7', 'Dm7', 'G7'],
  ['Am7', 'D7', 'Gmaj7', 'Cmaj7'],
]

export function ChordProgressionBuilder() {
  const [progression, setProgression] = useState<string[]>([])
  const [mood, setMood] = useState<'happy' | 'sad' | 'dreamy' | 'energetic' | null>(null)

  const addChord = (chord: string) => {
    setProgression([...progression, chord])
  }

  const removeChord = (index: number) => {
    setProgression(progression.filter((_, i) => i !== index))
  }

  const clearProgression = () => {
    setProgression([])
    setMood(null)
  }

  const generateByMood = (selectedMood: typeof mood) => {
    setMood(selectedMood)
    let template: string[] = []
    
    switch (selectedMood) {
      case 'happy':
        template = POP_PROGRESSIONS[Math.floor(Math.random() * POP_PROGRESSIONS.length)]
        break
      case 'sad':
        template = ['Am', 'F', 'C', 'G']
        break
      case 'dreamy':
        template = ['Cmaj7', 'Am7', 'Fmaj7', 'G7']
        break
      case 'energetic':
        template = ['C', 'G', 'Am', 'F']
        break
    }
    
    setProgression(template)
  }

  const playProgression = () => {
    console.log('Playing progression:', progression)
    alert(`Playing: ${progression.join(' - ')}`)
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
        🎼 Chord Progression Builder
      </h3>

      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
          Generate by Mood:
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {(['happy', 'sad', 'dreamy', 'energetic'] as const).map((m) => (
            <button
              key={m}
              onClick={() => generateByMood(m)}
              style={{
                padding: '8px 16px',
                backgroundColor: mood === m ? 'var(--accent-purple)' : 'var(--bg-tertiary)',
                color: 'var(--text-primary)',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                border: 'none',
                textTransform: 'capitalize',
              }}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div
        style={{
          minHeight: '120px',
          padding: '20px',
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: '12px',
          marginBottom: '24px',
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: progression.length === 0 ? 'center' : 'flex-start',
        }}
      >
        {progression.length === 0 ? (
          <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Drag chords here or click to add
          </div>
        ) : (
          progression.map((chord, idx) => (
            <div
              key={idx}
              style={{
                padding: '16px 24px',
                backgroundColor: 'var(--accent-purple)',
                borderRadius: '12px',
                fontSize: '24px',
                fontWeight: 700,
                color: 'var(--text-primary)',
                position: 'relative',
                cursor: 'pointer',
              }}
              onClick={() => removeChord(idx)}
              title="Click to remove"
            >
              {chord}
              <span
                style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ×
              </span>
            </div>
          ))
        )}
      </div>

      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
          Click to Add Chords:
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(70px, 1fr))',
            gap: '8px',
            maxHeight: '200px',
            overflowY: 'auto',
            padding: '8px',
          }}
        >
          {ALL_CHORDS.map((chord) => (
            <button
              key={chord}
              onClick={() => addChord(chord)}
              style={{
                padding: '10px',
                backgroundColor: 'var(--bg-tertiary)',
                color: 'var(--text-primary)',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                border: 'none',
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
              {chord}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          onClick={playProgression}
          disabled={progression.length === 0}
          style={{
            padding: '12px 24px',
            backgroundColor: progression.length > 0 ? 'var(--accent-purple)' : 'var(--bg-tertiary)',
            color: 'var(--text-primary)',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 600,
            cursor: progression.length > 0 ? 'pointer' : 'not-allowed',
            border: 'none',
            flex: 1,
          }}
        >
          ▶️ Play Progression
        </button>
        <button
          onClick={clearProgression}
          style={{
            padding: '12px 24px',
            backgroundColor: 'var(--bg-tertiary)',
            color: 'var(--text-primary)',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 600,
            cursor: 'pointer',
            border: 'none',
          }}
        >
          Clear
        </button>
      </div>
    </div>
  )
}

