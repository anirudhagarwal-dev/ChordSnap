export function About() {
  return (
    <div style={{ padding: '60px 40px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '48px', fontWeight: 700, marginBottom: '20px', color: 'var(--text-primary)' }}>
        About ChordSnap
      </h1>
      
      <div style={{ fontSize: '18px', lineHeight: '1.8', color: 'var(--text-secondary)', marginBottom: '40px' }}>
        <p style={{ marginBottom: '24px' }}>
          ChordSnap is an innovative music analysis platform that uses advanced AI and machine learning 
          to automatically detect chords, analyze pitch, identify key signatures, and detect vocals in 
          audio files. Whether you're a musician, music student, or music enthusiast, ChordSnap helps 
          you understand the harmonic structure of any song.
        </p>
        <p style={{ marginBottom: '24px' }}>
          Our mission is to make music theory accessible to everyone. With ChordSnap, you can upload 
          any audio file and instantly see the chord progression, making it easier to learn songs, 
          practice your instrument, and understand music composition.
        </p>
      </div>

      <div style={{ marginTop: '60px' }}>
        <h2 style={{ fontSize: '32px', fontWeight: 600, marginBottom: '30px', color: 'var(--text-primary)' }}>
          Key Features
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {[
            {
              title: 'Chord Detection',
              description: 'Automatically identify chords in real-time with high accuracy using chroma-based analysis.',
            },
            {
              title: 'Pitch Analysis',
              description: 'Track pitch changes over time with detailed frequency data and note identification.',
            },
            {
              title: 'Key Detection',
              description: 'Determine the key and scale of any song using advanced music theory algorithms.',
            },
            {
              title: 'Vocals Detection',
              description: 'Identify vocal presence and analyze vocal characteristics in audio tracks.',
            },
            {
              title: 'Practice Mode',
              description: 'Interactive practice mode with auto-scrolling chords and karaoke-style display.',
            },
            {
              title: 'Multiple Instruments',
              description: 'View chord fingerings for guitar, piano, ukulele, and bass.',
            },
          ].map((feature, i) => (
            <div
              key={i}
              style={{
                backgroundColor: 'var(--card-bg)',
                padding: '24px',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
              }}
            >
              <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '12px', color: 'var(--text-primary)' }}>
                {feature.title}
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '60px' }}>
        <h2 style={{ fontSize: '32px', fontWeight: 600, marginBottom: '30px', color: 'var(--text-primary)' }}>
          Technology
        </h2>
        <p style={{ fontSize: '16px', lineHeight: '1.8', color: 'var(--text-secondary)' }}>
          ChordSnap is built using cutting-edge technologies including librosa for audio analysis, 
          FastAPI for the backend, and React with TypeScript for the frontend. Our chord detection 
          algorithm uses chroma-CQT (Constant-Q Transform) and template matching to identify chords 
          with high precision.
        </p>
      </div>
    </div>
  )
}

