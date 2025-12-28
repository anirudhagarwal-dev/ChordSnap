import { useState } from 'react'
import type { ChordSegment } from '../types'

type Props = {
  segments: ChordSegment[]
  onTranspose: (transposedSegments: ChordSegment[]) => void
}

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

const transposeChord = (chord: string, semitones: number): string => {
  const rootMatch = chord.match(/^([A-G]#?)(.*)/)
  if (!rootMatch) return chord

  const root = rootMatch[1]
  const suffix = rootMatch[2]
  const rootIndex = NOTES.indexOf(root)
  if (rootIndex === -1) return chord

  const newRootIndex = (rootIndex + semitones + 12) % 12
  const newRoot = NOTES[newRootIndex]

  return newRoot + suffix
}

export function Transpose({ segments, onTranspose }: Props) {
  const [semitones, setSemitones] = useState(0)

  const handleTranspose = (newSemitones: number) => {
    setSemitones(newSemitones)
    const transposed = segments.map((seg) => ({
      ...seg,
      chord: transposeChord(seg.chord, newSemitones),
    }))
    onTranspose(transposed)
  }

  return (
    <div
      style={{
        backgroundColor: 'var(--card-bg)',
        borderRadius: '12px',
        padding: '20px',
        border: '1px solid var(--border-color)',
      }}
    >
      <h4 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', color: 'var(--text-primary)' }}>
        Transpose
      </h4>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => handleTranspose(semitones - 1)}
            style={{
              padding: '8px 16px',
              backgroundColor: 'var(--bg-tertiary)',
              color: 'var(--text-primary)',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 600,
              cursor: 'pointer',
              border: 'none',
            }}
          >
            -1
          </button>
          <div
            style={{
              minWidth: '80px',
              textAlign: 'center',
              fontSize: '18px',
              fontWeight: 600,
              color: 'var(--accent-purple)',
            }}
          >
            {semitones > 0 ? '+' : ''}
            {semitones} semitones
          </div>
          <button
            onClick={() => handleTranspose(semitones + 1)}
            style={{
              padding: '8px 16px',
              backgroundColor: 'var(--bg-tertiary)',
              color: 'var(--text-primary)',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 600,
              cursor: 'pointer',
              border: 'none',
            }}
          >
            +1
          </button>
        </div>
        <button
          onClick={() => handleTranspose(0)}
          style={{
            padding: '8px 16px',
            backgroundColor: 'var(--bg-tertiary)',
            color: 'var(--text-primary)',
            borderRadius: '8px',
            fontSize: '14px',
            cursor: 'pointer',
            border: 'none',
          }}
        >
          Reset
        </button>
      </div>
    </div>
  )
}