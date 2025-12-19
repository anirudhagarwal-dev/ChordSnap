type Props = {
  duration: number
  segments: Array<{ startSec: number; endSec: number; chord: string }>
  currentTime?: number
  onSeek?: (timeSec: number) => void
}

export function Waveform({ duration, segments, currentTime = 0, onSeek }: Props) {
  const width = 1000
  const height = 120

  const points = 200
  const waveformData = Array.from({ length: points }, (_, i) => {
    const x = (i / points) * width
    const time = (i / points) * duration
    const segment = segments.find((s) => time >= s.startSec && time < s.endSec)
    const baseAmplitude = 20 + Math.random() * 40
    return { x, y: height / 2, amplitude: baseAmplitude, segment }
  })

  const handleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const timeSec = (x / width) * duration
    onSeek?.(timeSec)
  }

  return (
    <div style={{ marginBottom: '32px' }}>
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        onClick={handleClick}
        style={{ cursor: 'pointer' }}
      >
        {waveformData.map((point, i) => {
          const nextPoint = waveformData[i + 1]
          if (!nextPoint) return null

          const gradientId = `gradient-${i}`
          const isInCurrentSegment = point.segment
          const color = isInCurrentSegment ? '#A31D1D' : '#E5D0AC'

          return (
            <g key={i}>
              <defs>
                <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#A31D1D" />
                  <stop offset="100%" stopColor="#E5D0AC" />
                </linearGradient>
              </defs>
              <line
                x1={point.x}
                y1={height / 2 - point.amplitude / 2}
                x2={nextPoint.x}
                y2={height / 2 - nextPoint.amplitude / 2}
                stroke={color}
                strokeWidth="2"
              />
              <line
                x1={point.x}
                y1={height / 2 + point.amplitude / 2}
                x2={nextPoint.x}
                y2={height / 2 + nextPoint.amplitude / 2}
                stroke={color}
                strokeWidth="2"
              />
            </g>
          )
        })}
        <line
          x1={(currentTime / duration) * width}
          y1={0}
          x2={(currentTime / duration) * width}
          y2={height}
          stroke="var(--text-primary)"
          strokeWidth="2"
          opacity={0.8}
        />
      </svg>
    </div>
  )
}

