import { useState, useRef } from 'react'

type Props = {
  onAnalyze: (file: File) => Promise<void> | void
}

export function UploadPage({ onAnalyze }: Props) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && (file.type.startsWith('audio/') || file.name.match(/\.(mp3|wav|mp4)$/i))) {
      await onAnalyze(file)
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      await onAnalyze(file)
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const features = [
    {
      icon: '🎵',
      title: 'Chord Detection',
      description: 'Automatically identify chords throughout your audio with high accuracy',
    },
    {
      icon: '🎹',
      title: 'Key & Scale',
      description: 'Detect the musical key and scale of your composition',
    },
    {
      icon: '🎤',
      title: 'Vocals Detection',
      description: 'Identify vocal presence and analyze vocal characteristics',
    },
    {
      icon: '📊',
      title: 'Pitch Analysis',
      description: 'Track pitch changes over time with detailed frequency data',
    },
  ]

  const steps = [
    {
      number: '1',
      title: 'Upload Audio',
      description: 'Drag and drop or browse to upload your audio file (.mp3, .wav, .mp4)',
    },
    {
      number: '2',
      title: 'AI Analysis',
      description: 'Our advanced algorithms analyze your audio in seconds',
    },
    {
      number: '3',
      title: 'View Results',
      description: 'Explore detailed chord progression, key detection, and pitch analysis',
    },
  ]

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 80px)',
        padding: '40px 20px',
        maxWidth: '1400px',
        margin: '0 auto',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '80px' }}>
        <h2
          className="responsive-heading"
          style={{
            fontSize: '56px',
            fontWeight: 700,
            marginBottom: '20px',
            color: 'var(--text-primary)',
            background: 'linear-gradient(135deg, #A31D1D, #E5D0AC)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Analyze Your Music
        </h2>
        <p style={{ fontSize: '20px', color: 'var(--text-secondary)', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px' }}>
          Upload an audio file to detect chords, pitch, scale, and vocals automatically with AI-powered analysis
        </p>

        <div
          className="responsive-padding-large"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
          style={{
            width: '100%',
            maxWidth: '700px',
            margin: '0 auto',
            minHeight: '350px',
            border: `2px dashed ${isDragging ? 'var(--accent-purple)' : 'var(--border-color)'}`,
            borderRadius: '20px',
            backgroundColor: 'var(--bg-secondary)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '24px',
            padding: '50px 40px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: isDragging ? '0 0 30px rgba(163, 29, 29, 0.3)' : 'none',
          }}
        >
          <div style={{ fontSize: '80px', color: 'var(--accent-purple)' }}>☁️</div>
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: '28px', fontWeight: 600, marginBottom: '12px', color: 'var(--text-primary)' }}>
              Upload Audio File
            </h3>
            <p style={{ fontSize: '18px', color: 'var(--text-secondary)' }}>
              Drag and drop your audio file here, or click to browse
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '8px' }}>
            {['.MP4', '.WAV', '.MP3'].map((ext) => (
              <div
                key={ext}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 18px',
                  backgroundColor: 'var(--bg-tertiary)',
                  borderRadius: '10px',
                  fontSize: '14px',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-color)',
                }}
              >
                <span style={{ color: 'var(--accent-purple)' }}>♫</span>
                <span>{ext}</span>
              </div>
            ))}
          </div>

          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Maximum file size: 100MB</p>

          <button
            onClick={(e) => {
              e.stopPropagation()
              handleClick()
            }}
            style={{
              padding: '14px 40px',
              backgroundColor: 'var(--accent-purple)',
              color: 'var(--text-primary)',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: 600,
              cursor: 'pointer',
              border: 'none',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--accent-purple-light)'
              e.currentTarget.style.transform = 'scale(1.05)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--accent-purple)'
              e.currentTarget.style.transform = 'scale(1)'
            }}
          >
            Browse Files
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*,.mp3,.wav,.mp4"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
        </div>
      </div>

      <div style={{ marginBottom: '80px' }}>
        <h3
          className="responsive-heading"
          style={{
            fontSize: '36px',
            fontWeight: 700,
            textAlign: 'center',
            marginBottom: '50px',
            color: 'var(--text-primary)',
          }}
        >
          Powerful Features
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '24px',
          }}
        >
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="responsive-card-padding"
              style={{
                backgroundColor: 'var(--card-bg)',
                borderRadius: '16px',
                padding: '32px',
                border: '1px solid var(--border-color)',
                textAlign: 'center',
                transition: 'all 0.3s ease',
                cursor: 'default',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)'
                e.currentTarget.style.borderColor = 'var(--accent-purple)'
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(163, 29, 29, 0.2)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.borderColor = 'var(--border-color)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>{feature.icon}</div>
              <h4 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '12px', color: 'var(--text-primary)' }}>
                {feature.title}
              </h4>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '60px' }}>
        <h3
          className="responsive-heading"
          style={{
            fontSize: '36px',
            fontWeight: 700,
            textAlign: 'center',
            marginBottom: '50px',
            color: 'var(--text-primary)',
          }}
        >
          How It Works
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '32px',
            maxWidth: '1000px',
            margin: '0 auto',
          }}
        >
          {steps.map((step, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                position: 'relative',
              }}
            >
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--accent-purple)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '32px',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  marginBottom: '24px',
                  boxShadow: '0 4px 16px rgba(163, 29, 29, 0.3)',
                }}
              >
                {step.number}
              </div>
              <h4 style={{ fontSize: '22px', fontWeight: 600, marginBottom: '12px', color: 'var(--text-primary)' }}>
                {step.title}
              </h4>
              <p style={{ fontSize: '16px', color: 'var(--text-secondary)', lineHeight: '1.6', maxWidth: '280px' }}>
                {step.description}
              </p>
              {idx < steps.length - 1 && (
                <div
                  style={{
                    position: 'absolute',
                    top: '40px',
                    right: '-50%',
                    width: '100%',
                    height: '2px',
                    backgroundColor: 'var(--accent-purple)',
                    opacity: 0.3,
                    display: idx === steps.length - 1 ? 'none' : 'block',
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div
        className="responsive-padding-large"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: '20px',
          padding: '50px 40px',
          border: '1px solid var(--border-color)',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '40px',
            textAlign: 'center',
          }}
        >
          <div>
            <div
              style={{
                fontSize: '48px',
                fontWeight: 700,
                color: 'var(--accent-purple)',
                marginBottom: '8px',
              }}
            >
              24
            </div>
            <div style={{ fontSize: '16px', color: 'var(--text-secondary)' }}>Chord Types Detected</div>
          </div>
          <div>
            <div
              style={{
                fontSize: '48px',
                fontWeight: 700,
                color: 'var(--accent-purple)',
                marginBottom: '8px',
              }}
            >
              100%
            </div>
            <div style={{ fontSize: '16px', color: 'var(--text-secondary)' }}>Accuracy Rate</div>
          </div>
          <div>
            <div
              style={{
                fontSize: '48px',
                fontWeight: 700,
                color: 'var(--accent-purple)',
                marginBottom: '8px',
              }}
            >
              &lt; 5s
            </div>
            <div style={{ fontSize: '16px', color: 'var(--text-secondary)' }}>Average Analysis Time</div>
          </div>
          <div>
            <div
              style={{
                fontSize: '48px',
                fontWeight: 700,
                color: 'var(--accent-purple)',
                marginBottom: '8px',
              }}
            >
              AI
            </div>
            <div style={{ fontSize: '16px', color: 'var(--text-secondary)' }}>Powered Analysis</div>
          </div>
        </div>
      </div>
    </div>
  )
}