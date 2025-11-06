type Props = {
  chord: string
  onKeyPress?: (note: string) => void
}

const WHITE_KEYS = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
const BLACK_KEYS = ['C#', 'D#', 'F#', 'G#', 'A#']

// Chord to notes mapping
const CHORD_NOTES: Record<string, string[]> = {
  C: ['C', 'E', 'G'],
  'Cm': ['C', 'D#', 'G'],
  D: ['D', 'F#', 'A'],
  'Dm': ['D', 'F', 'A'],
  E: ['E', 'G#', 'B'],
  'Em': ['E', 'G', 'B'],
  F: ['F', 'A', 'C'],
  'Fm': ['F', 'G#', 'C'],
  G: ['G', 'B', 'D'],
  'Gm': ['G', 'A#', 'D'],
  A: ['A', 'C#', 'E'],
  'Am': ['A', 'C', 'E'],
  B: ['B', 'D#', 'F#'],
  'Bm': ['B', 'D', 'F#'],
}

export function PianoKeyboard({ chord, onKeyPress }: Props) {
  const chordNotes = CHORD_NOTES[chord] || []

  const isNoteInChord = (note: string) => {
    return chordNotes.includes(note) || chordNotes.includes(note.replace('#', ''))
  }

  const handleKeyClick = (note: string) => {
    onKeyPress?.(note)
    // Play note sound (simplified - would use Web Audio API in production)
    const audio = new Audio()
    // In production, use actual note samples
  }

  return (
    <div
      style={{
        backgroundColor: 'var(--card-bg)',
        borderRadius: '12px',
        padding: '24px',
        border: '1px solid var(--border-color)',
      }}
    >
      <h4 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', color: 'var(--text-primary)' }}>
        {chord} - Piano
      </h4>
      <div style={{ position: 'relative', height: '200px', display: 'flex' }}>
        {/* White keys */}
        {WHITE_KEYS.map((note, idx) => {
          const isPressed = isNoteInChord(note)
          return (
            <button
              key={note}
              onClick={() => handleKeyClick(note)}
              style={{
                flex: 1,
                backgroundColor: isPressed ? 'var(--accent-purple)' : 'var(--bg-primary)',
                border: '1px solid var(--border-color)',
                borderRadius: '0 0 8px 8px',
                cursor: 'pointer',
                position: 'relative',
                zIndex: 1,
                color: isPressed ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontSize: '14px',
                fontWeight: 600,
                transition: 'all 0.1s ease',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                paddingBottom: '8px',
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--accent-purple-light)'
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.backgroundColor = isPressed ? 'var(--accent-purple)' : 'var(--bg-primary)'
              }}
            >
              {note}
            </button>
          )
        })}
        {/* Black keys */}
        {BLACK_KEYS.map((note, idx) => {
          const isPressed = isNoteInChord(note)
          const whiteKeyIndex = note === 'C#' ? 0 : note === 'D#' ? 1 : note === 'F#' ? 3 : note === 'G#' ? 4 : 5
          return (
            <button
              key={note}
              onClick={() => handleKeyClick(note)}
              style={{
                position: 'absolute',
                left: `${(whiteKeyIndex + 1) * (100 / 7) - 3}%`,
                width: '6%',
                height: '60%',
                backgroundColor: isPressed ? 'var(--accent-purple-light)' : '#1a1a1a',
                border: '1px solid var(--border-color)',
                borderRadius: '0 0 4px 4px',
                cursor: 'pointer',
                zIndex: 2,
                color: isPressed ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontSize: '12px',
                fontWeight: 600,
                transition: 'all 0.1s ease',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                paddingBottom: '4px',
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--accent-purple)'
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.backgroundColor = isPressed ? 'var(--accent-purple-light)' : '#1a1a1a'
              }}
            >
              {note}
            </button>
          )
        })}
      </div>
    </div>
  )
}

