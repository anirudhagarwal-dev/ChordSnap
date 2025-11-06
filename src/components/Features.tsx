export function Features() {
  const features = [
    {
      category: 'Core Features',
      items: [
        {
          title: 'Automatic Chord Detection',
          description: 'Upload any audio file and instantly see the chord progression with timestamps and confidence levels.',
          icon: '🎵',
        },
        {
          title: 'Multi-Instrument Support',
          description: 'View chord fingerings for guitar, piano, ukulele, and bass with visual fretboard and keyboard displays.',
          icon: '🎸',
        },
        {
          title: 'Key & Scale Detection',
          description: 'Automatically identify the key signature and scale of any song using advanced music theory algorithms.',
          icon: '🎹',
        },
        {
          title: 'Pitch Analysis',
          description: 'Track pitch changes over time with detailed frequency data and note identification.',
          icon: '📊',
        },
      ],
    },
    {
      category: 'Practice Tools',
      items: [
        {
          title: 'Practice Mode',
          description: 'Interactive practice mode with auto-scrolling chords, karaoke-style display, and real-time chord tracking.',
          icon: '🎯',
        },
        {
          title: 'Loop Sections',
          description: 'Loop specific sections of a song to practice difficult parts repeatedly.',
          icon: '🔁',
        },
        {
          title: 'Speed Control',
          description: 'Adjust playback speed from 0.25x to 2x to practice at your own pace.',
          icon: '⚡',
        },
        {
          title: 'Metronome',
          description: 'Built-in metronome with adjustable BPM to help you keep time while practicing.',
          icon: '🥁',
        },
      ],
    },
    {
      category: 'Gamification',
      items: [
        {
          title: 'XP & Levels',
          description: 'Earn experience points for analyzing songs and practicing. Level up to unlock new features.',
          icon: '⭐',
        },
        {
          title: 'Daily Challenges',
          description: 'Complete daily challenges to earn bonus XP and test your music knowledge.',
          icon: '🏆',
        },
        {
          title: 'Progress Tracker',
          description: 'Track your learning progress, practice time, and chord detection statistics.',
          icon: '📈',
        },
        {
          title: 'Badges & Achievements',
          description: 'Unlock badges and achievements as you progress through your musical journey.',
          icon: '🎖️',
        },
      ],
    },
    {
      category: 'Creative Tools',
      items: [
        {
          title: 'Chord Progression Builder',
          description: 'Create your own chord progressions with drag-and-drop interface and mood-based suggestions.',
          icon: '🎨',
        },
        {
          title: 'Virtual Instruments',
          description: 'Interactive piano keyboard and guitar fretboard to visualize and play chords.',
          icon: '🎹',
        },
        {
          title: 'Transpose Chords',
          description: 'Transpose detected chords to any key to match your instrument or vocal range.',
          icon: '🔄',
        },
        {
          title: 'Chord Search',
          description: 'Search and visualize any chord with detailed fingerings and note information.',
          icon: '🔍',
        },
      ],
    },
    {
      category: 'Advanced Features',
      items: [
        {
          title: 'Live Detection',
          description: 'Real-time chord detection from microphone input for live performance analysis.',
          icon: '🎤',
        },
        {
          title: 'Tuner',
          description: 'Built-in tuner to help you tune your instrument with visual and audio feedback.',
          icon: '🎚️',
        },
        {
          title: 'Spectrogram Visualization',
          description: 'Visual representation of audio frequencies over time for advanced analysis.',
          icon: '📉',
        },
        {
          title: 'Export & Share',
          description: 'Export chord data as JSON and share your analyses with others.',
          icon: '💾',
        },
      ],
    },
  ]

  return (
    <div style={{ padding: '60px 40px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h1 style={{ fontSize: '48px', fontWeight: 700, marginBottom: '20px', color: 'var(--text-primary)' }}>
          Features
        </h1>
        <p style={{ fontSize: '20px', color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto' }}>
          Discover all the powerful features that make ChordSnap the ultimate tool for music analysis and learning.
        </p>
      </div>

      {features.map((category, categoryIndex) => (
        <div key={categoryIndex} style={{ marginBottom: '60px' }}>
          <h2
            style={{
              fontSize: '32px',
              fontWeight: 600,
              marginBottom: '30px',
              color: 'var(--text-primary)',
              borderBottom: '2px solid var(--accent-purple)',
              paddingBottom: '12px',
            }}
          >
            {category.category}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {category.items.map((feature, featureIndex) => (
              <div
                key={featureIndex}
                style={{
                  backgroundColor: 'var(--card-bg)',
                  padding: '28px',
                  borderRadius: '12px',
                  border: '1px solid var(--border-color)',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(163, 29, 29, 0.2)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div style={{ fontSize: '40px', marginBottom: '16px' }}>{feature.icon}</div>
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
      ))}
    </div>
  )
}

