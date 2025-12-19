import { useState, useEffect, useRef } from 'react'

type Props = {
  src: string
  duration: number
  onTimeUpdate?: (time: number) => void
  onPlayingChange?: (isPlaying: boolean) => void
  loopStart?: number
  loopEnd?: number
  playbackRate?: number
  onPlaybackRateChange?: (rate: number) => void
}

export function AudioPlayer({ src, duration, onTimeUpdate, onPlayingChange, loopStart, loopEnd, playbackRate = 1, onPlaybackRateChange }: Props) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [isLooping, setIsLooping] = useState(false)
  const [rate, setRate] = useState(playbackRate)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      if (currentScrollY < 50) {
        setIsVisible(true)
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false)
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true)
      }
      
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.playbackRate = rate
    onPlaybackRateChange?.(rate)

    const updateTime = () => {
      setCurrentTime(audio.currentTime)
      onTimeUpdate?.(audio.currentTime)

      if (isLooping && loopStart !== undefined && loopEnd !== undefined) {
        if (audio.currentTime >= loopEnd) {
          audio.currentTime = loopStart
        }
      }
    }

    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('play', () => {
      setIsPlaying(true)
      onPlayingChange?.(true)
    })
    audio.addEventListener('pause', () => {
      setIsPlaying(false)
      onPlayingChange?.(false)
    })
    audio.addEventListener('ended', () => {
      if (isLooping && loopStart !== undefined) {
        audio.currentTime = loopStart
        audio.play().catch(() => void 0)
      } else {
        setIsPlaying(false)
      }
    })

    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('play', () => setIsPlaying(true))
      audio.removeEventListener('pause', () => setIsPlaying(false))
      audio.removeEventListener('ended', () => {
        if (isLooping && loopStart !== undefined) {
          audio.currentTime = loopStart
          audio.play().catch(() => void 0)
        } else {
          setIsPlaying(false)
          onPlayingChange?.(false)
        }
      })
    }
  }, [onTimeUpdate, onPlayingChange, isLooping, loopStart, loopEnd, rate, onPlaybackRateChange])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play().catch(() => void 0)
    }
  }

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current
    if (!audio) return

    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const progress = x / rect.width
    const newTime = progress * duration
    audio.currentTime = newTime
    setCurrentTime(newTime)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-color)',
        padding: '20px 40px',
        zIndex: 9999,
        transform: isVisible ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.3s ease-in-out',
        boxShadow: isVisible ? '0 -4px 12px rgba(0, 0, 0, 0.3)' : 'none',
      }}
    >
      <audio ref={audioRef} src={src} style={{ display: 'none' }} />

      <div
        onClick={handleSeek}
        style={{
          width: '100%',
          height: '4px',
          backgroundColor: 'var(--bg-tertiary)',
          borderRadius: '2px',
          marginBottom: '16px',
          cursor: 'pointer',
          position: 'relative',
        }}
      >
        <div
          style={{
            width: `${(currentTime / duration) * 100}%`,
            height: '100%',
            backgroundColor: 'var(--accent-purple)',
            borderRadius: '2px',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              right: '-8px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              backgroundColor: 'var(--accent-purple)',
              border: '2px solid var(--text-primary)',
            }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{formatTime(currentTime)}</div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => {
              const audio = audioRef.current
              if (audio) audio.currentTime = Math.max(0, audio.currentTime - 10)
            }}
            style={{
              fontSize: '20px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-primary)',
            }}
          >
            ⏪
          </button>
          <button
            onClick={togglePlay}
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: 'var(--accent-purple)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              color: 'var(--text-primary)',
            }}
          >
            {isPlaying ? '⏸' : '▶'}
          </button>
          <button
            onClick={() => {
              const audio = audioRef.current
              if (audio) audio.currentTime = Math.min(duration, audio.currentTime + 10)
            }}
            style={{
              fontSize: '20px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-primary)',
            }}
          >
            ⏩
          </button>
        </div>

        <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{formatTime(duration)}</div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button
          onClick={() => setIsLooping(!isLooping)}
          style={{
            padding: '8px 16px',
            backgroundColor: isLooping ? 'var(--accent-purple)' : 'var(--bg-tertiary)',
            color: 'var(--text-primary)',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span>🔁</span>
          <span>Loop</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Speed:</span>
          <button
            onClick={() => {
              const newRate = Math.max(0.25, rate - 0.25)
              setRate(newRate)
            }}
            style={{
              padding: '4px 12px',
              backgroundColor: 'var(--bg-tertiary)',
              color: 'var(--text-primary)',
              borderRadius: '6px',
              fontSize: '14px',
              cursor: 'pointer',
              border: 'none',
            }}
          >
            -
          </button>
          <span style={{ fontSize: '14px', color: 'var(--text-primary)', minWidth: '50px', textAlign: 'center' }}>
            {rate.toFixed(2)}x
          </span>
          <button
            onClick={() => {
              const newRate = Math.min(2, rate + 0.25)
              setRate(newRate)
            }}
            style={{
              padding: '4px 12px',
              backgroundColor: 'var(--bg-tertiary)',
              color: 'var(--text-primary)',
              borderRadius: '6px',
              fontSize: '14px',
              cursor: 'pointer',
              border: 'none',
            }}
          >
            +
          </button>
        </div>
      </div>
    </div>
  )
}

