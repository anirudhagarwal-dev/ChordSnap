import { useRef, useEffect, useState } from 'react'

type Props = {
  audioUrl?: string
  isLive?: boolean
  audioData?: Float32Array
}

export function Spectrogram({ audioUrl, isLive, audioData }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isActive, setIsActive] = useState(false)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  useEffect(() => {
    if (isLive && audioData) {
      drawSpectrogram(audioData)
    }
  }, [isLive, audioData])

  const drawSpectrogram = (data?: Float32Array) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    if (data && analyserRef.current) {
      const bufferLength = analyserRef.current.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)
      analyserRef.current.getByteFrequencyData(dataArray)

      const imageData = ctx.createImageData(1, height)
      for (let i = 0; i < height; i++) {
        const value = dataArray[Math.floor((i / height) * bufferLength)]
        const hue = (value / 255) * 240
        const r = hue < 120 ? 255 : hue < 240 ? 255 - ((hue - 120) / 120) * 255 : 0
        const g = hue < 120 ? (hue / 120) * 255 : 255
        const b = hue < 240 ? 0 : ((hue - 240) / 15) * 255

        const index = i * 4
        imageData.data[index] = r
        imageData.data[index + 1] = g
        imageData.data[index + 2] = b
        imageData.data[index + 3] = 255
      }

      const existingImage = ctx.getImageData(1, 0, width - 1, height)
      ctx.putImageData(existingImage, 0, 0)

      ctx.putImageData(imageData, width - 1, 0)
    } else {
      ctx.fillStyle = 'var(--bg-primary)'
      ctx.fillRect(0, 0, width, height)
    }

    if (isLive) {
      animationFrameRef.current = requestAnimationFrame(() => drawSpectrogram())
    }
  }

  const startSpectrogram = async () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      audioContextRef.current = audioContext

      const analyser = audioContext.createAnalyser()
      analyser.fftSize = 2048
      analyserRef.current = analyser

      if (audioUrl) {
        const response = await fetch(audioUrl)
        const arrayBuffer = await response.arrayBuffer()
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
        const source = audioContext.createBufferSource()
        source.buffer = audioBuffer
        source.connect(analyser)
        analyser.connect(audioContext.destination)
        source.start()
      } else {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        const microphone = audioContext.createMediaStreamSource(stream)
        microphone.connect(analyser)
      }

      setIsActive(true)
      drawSpectrogram()
    } catch (err) {
      console.error('Error starting spectrogram:', err)
    }
  }

  const stopSpectrogram = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }
    setIsActive(false)
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)' }}>Spectrogram</h3>
        {!isLive && (
          <button
            onClick={isActive ? stopSpectrogram : startSpectrogram}
            style={{
              padding: '8px 16px',
              backgroundColor: isActive ? '#ef4444' : 'var(--accent-purple)',
              color: 'var(--text-primary)',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              border: 'none',
            }}
          >
            {isActive ? 'Stop' : 'Start'}
          </button>
        )}
      </div>
      <canvas
        ref={canvasRef}
        width={800}
        height={300}
        style={{
          width: '100%',
          height: '300px',
          backgroundColor: 'var(--bg-primary)',
          borderRadius: '8px',
          border: '1px solid var(--border-color)',
        }}
      />
      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '8px', textAlign: 'center' }}>
        Frequency (Hz) → Time
      </div>
    </div>
  )
}

