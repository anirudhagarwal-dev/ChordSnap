import { useState } from 'react'
import { GuitarFretboard } from './GuitarFretboard'
import { PianoKeyboard } from './PianoKeyboard'

const ALL_CHORDS = [
  'C', 'Cm', 'C#', 'C#m', 'D', 'Dm', 'D#', 'D#m', 'E', 'Em', 'F', 'Fm', 'F#', 'F#m',
  'G', 'Gm', 'G#', 'G#m', 'A', 'Am', 'A#', 'A#m', 'B', 'Bm',
  'C7', 'Cm7', 'C7b9', 'Cmaj7', 'Cdim', 'Csus4', 'Cadd9',
  'D7', 'Dm7', 'Dmaj7', 'Ddim', 'Dsus4',
  'E7', 'Em7', 'Emaj7', 'Edim', 'Esus4',
  'F7', 'Fm7', 'Fmaj7', 'Fdim', 'Fsus4',
  'G7', 'Gm7', 'Gmaj7', 'Gdim', 'Gsus4',
  'A7', 'Am7', 'Amaj7', 'Adim', 'Asus4',
  'B7', 'Bm7', 'Bmaj7', 'Bdim', 'Bsus4',
]

type Props = {
  onChordSelect?: (chord: string) => void
}

export function ChordSearch({ onChordSelect }: Props) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedChord, setSelectedChord] = useState<string>('C')
  const [selectedInstrument, setSelectedInstrument] = useState<'guitar' | 'piano' | 'ukulele' | 'bass'>('guitar')

  const filteredChords = ALL_CHORDS.filter((chord) =>
    chord.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleChordSelect = (chord: string) => {
    setSelectedChord(chord)
    onChordSelect?.(chord)
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
        Chord Search & Visualization
      </h3>

      {/* Search Input */}
      <div style={{ marginBottom: '24px' }}>
        <input
          type="text"
          placeholder="Search chords (e.g., C, Am, Fmaj7)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 16px',
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            color: 'var(--text-primary)',
            fontSize: '16px',
          }}
        />
      </div>

      {/* Chord List */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
          gap: '8px',
          marginBottom: '24px',
          maxHeight: '200px',
          overflowY: 'auto',
          padding: '8px',
        }}
      >
        {filteredChords.map((chord) => (
          <button
            key={chord}
            onClick={() => handleChordSelect(chord)}
            style={{
              padding: '10px',
              backgroundColor: selectedChord === chord ? 'var(--accent-purple)' : 'var(--bg-tertiary)',
              color: 'var(--text-primary)',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              border: 'none',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              if (selectedChord !== chord) {
                e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'
              }
            }}
            onMouseLeave={(e) => {
              if (selectedChord !== chord) {
                e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'
              }
            }}
          >
            {chord}
          </button>
        ))}
      </div>

      {/* Instrument Selector */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {(['guitar', 'piano', 'ukulele', 'bass'] as const).map((inst) => (
          <button
            key={inst}
            onClick={() => setSelectedInstrument(inst)}
            style={{
              padding: '8px 16px',
              backgroundColor: selectedInstrument === inst ? 'var(--accent-purple)' : 'var(--bg-tertiary)',
              color: 'var(--text-primary)',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              border: 'none',
              textTransform: 'capitalize',
            }}
          >
            {inst}
          </button>
        ))}
      </div>

      {/* Visualization */}
      <div>
        {selectedInstrument === 'piano' ? (
          <PianoKeyboard chord={selectedChord} />
        ) : (
          <GuitarFretboard chord={selectedChord} instrument={selectedInstrument} />
        )}
      </div>
    </div>
  )
}

