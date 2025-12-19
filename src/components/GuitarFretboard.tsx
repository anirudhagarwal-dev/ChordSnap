type Props = {
  chord: string
  instrument?: 'guitar' | 'ukulele' | 'bass'
}

const GUITAR_STRINGS = ['E', 'A', 'D', 'G', 'B', 'E']
const UKULELE_STRINGS = ['G', 'C', 'E', 'A']
const BASS_STRINGS = ['E', 'A', 'D', 'G']

const CHORD_FINGERINGS: Record<string, number[][]> = {
  C: [[0, 1], [1, 0], [2, 0], [3, 0], [4, 1], [5, 0]],
  'Cm': [[0, 3], [1, 3], [2, 0], [3, 3], [4, 1], [5, 0]],
  D: [[0, 0], [1, 0], [2, 2], [3, 2], [4, 2], [5, 0]],
  'Dm': [[0, 0], [1, 1], [2, 2], [3, 2], [4, 1], [5, 0]],
  E: [[0, 0], [1, 2], [2, 2], [3, 1], [4, 0], [5, 0]],
  'Em': [[0, 0], [1, 0], [2, 0], [3, 2], [4, 2], [5, 0]],
  F: [[0, 1], [1, 3], [2, 3], [3, 2], [4, 1], [5, 1]],
  'Fm': [[0, 1], [1, 3], [2, 3], [3, 1], [4, 1], [5, 1]],
  G: [[0, 3], [1, 2], [2, 0], [3, 0], [4, 0], [5, 3]],
  'Gm': [[0, 3], [1, 3], [2, 0], [3, 3], [4, 1], [5, 3]],
  A: [[0, 0], [1, 0], [2, 2], [3, 2], [4, 2], [5, 0]],
  'Am': [[0, 0], [1, 0], [2, 2], [3, 2], [4, 1], [5, 0]],
  B: [[0, 2], [1, 2], [2, 4], [3, 4], [4, 4], [5, 2]],
  'Bm': [[0, 2], [1, 2], [2, 3], [3, 4], [4, 2], [5, 2]],
}

export function GuitarFretboard({ chord, instrument = 'guitar' }: Props) {
  const strings = instrument === 'ukulele' ? UKULELE_STRINGS : instrument === 'bass' ? BASS_STRINGS : GUITAR_STRINGS
  const frets = instrument === 'bass' ? 4 : 5
  const fingering = CHORD_FINGERINGS[chord] || []

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
        {chord} - {instrument.charAt(0).toUpperCase() + instrument.slice(1)}
      </h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {strings.map((string, stringIdx) => (
          <div key={stringIdx} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div
              style={{
                width: '40px',
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--text-primary)',
                textAlign: 'right',
              }}
            >
              {string}
            </div>
            <div style={{ display: 'flex', gap: '2px', position: 'relative', flex: 1 }}>
              <div
                style={{
                  width: '8px',
                  height: '32px',
                  backgroundColor: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '2px',
                }}
              />
              {Array.from({ length: frets }).map((_, fretIdx) => {
                const fretNum = fretIdx + 1
                const fingerPos = fingering.find((f) => f[0] === stringIdx)
                const isFingered = fingerPos && fingerPos[1] === fretNum

                return (
                  <div
                    key={fretIdx}
                    style={{
                      position: 'relative',
                      width: '40px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        right: 0,
                        top: 0,
                        bottom: 0,
                        width: '2px',
                        backgroundColor: 'var(--border-color)',
                      }}
                    />
                    {isFingered && (
                      <div
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--accent-purple)',
                          border: '2px solid var(--text-primary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '12px',
                          fontWeight: 600,
                          color: 'var(--text-primary)',
                          zIndex: 1,
                        }}
                      >
                        {fretNum}
                      </div>
                    )}
                    {fretIdx === 0 && !isFingered && (
                      <div
                        style={{
                          fontSize: '18px',
                          color: 'var(--text-secondary)',
                        }}
                      >
                        O
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

