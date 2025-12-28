type Props = {
  key?: string
  scale?: string
  keyConfidence?: number
  vocalsDetected?: boolean
  vocalsConfidence?: number
}

export function AnalysisDetails({ key, scale, keyConfidence = 0, vocalsDetected, vocalsConfidence = 0 }: Props) {
  const keyScale = key && scale ? `${key} ${scale}` : key || scale || 'Unknown'

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
        Analysis Details
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <span style={{ fontSize: '20px' }}>🎵</span>
            <span style={{ fontSize: '16px', fontWeight: 500, color: 'var(--text-primary)' }}>Key & Scale</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div
              style={{
                padding: '8px 16px',
                backgroundColor: 'var(--accent-purple)',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 600,
                color: 'var(--text-primary)',
              }}
            >
              {keyScale}
            </div>
            <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              {Math.round(keyConfidence * 100)}% confidence
            </span>
          </div>
          <div
            style={{
              width: '100%',
              height: '8px',
              backgroundColor: 'var(--bg-tertiary)',
              borderRadius: '4px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${keyConfidence * 100}%`,
                height: '100%',
                backgroundColor: 'var(--accent-purple)',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <span style={{ fontSize: '20px' }}>🎤</span>
            <span style={{ fontSize: '16px', fontWeight: 500, color: 'var(--text-primary)' }}>Vocals</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div
              style={{
                padding: '8px 16px',
                backgroundColor: vocalsDetected ? 'var(--accent-purple)' : 'var(--bg-tertiary)',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 600,
                color: 'var(--text-primary)',
              }}
            >
              {vocalsDetected ? 'Detected' : 'Not Detected'}
            </div>
            {vocalsDetected && (
              <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                {Math.round(vocalsConfidence * 100)}% confidence
              </span>
            )}
          </div>
          <div
            style={{
              width: '100%',
              height: '8px',
              backgroundColor: 'var(--bg-tertiary)',
              borderRadius: '4px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${vocalsConfidence * 100}%`,
                height: '100%',
                backgroundColor: vocalsDetected ? 'var(--accent-purple)' : 'var(--bg-tertiary)',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}