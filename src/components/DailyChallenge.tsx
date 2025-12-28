import { useState, useEffect } from 'react'
import { completeChallenge, getProgress } from '../utils/gamification'

const CHALLENGES = [
  {
    id: 'identify-5',
    title: 'Identify 5 Chords',
    description: 'Correctly identify 5 random chords',
    icon: '🎯',
    target: 5,
    type: 'identify',
  },
  {
    id: 'practice-10',
    title: 'Practice 10 Minutes',
    description: 'Practice for at least 10 minutes today',
    icon: '⏱️',
    target: 10,
    type: 'practice',
  },
  {
    id: 'detect-20',
    title: 'Detect 20 Chords',
    description: 'Detect chords from 20 different segments',
    icon: '🎵',
    target: 20,
    type: 'detect',
  },
]

export function DailyChallenge() {
  const [challenge, setChallenge] = useState(CHALLENGES[0])
  const [progress, setProgress] = useState(0)
  const [completed, setCompleted] = useState(false)

  useEffect(() => {
    const today = new Date().toDateString()
    const stored = localStorage.getItem(`challenge-${today}`)
    if (stored) {
      const data = JSON.parse(stored)
      setChallenge(data.challenge)
      setProgress(data.progress)
      setCompleted(data.completed)
    } else {
      const randomChallenge = CHALLENGES[Math.floor(Math.random() * CHALLENGES.length)]
      setChallenge(randomChallenge)
      localStorage.setItem(
        `challenge-${today}`,
        JSON.stringify({ challenge: randomChallenge, progress: 0, completed: false })
      )
    }
  }, [])

  const updateProgress = (amount: number) => {
    if (completed) return

    const newProgress = Math.min(progress + amount, challenge.target)
    setProgress(newProgress)

    const today = new Date().toDateString()
    const isCompleted = newProgress >= challenge.target

    if (isCompleted && !completed) {
      setCompleted(true)
      completeChallenge()
    }

    localStorage.setItem(
      `challenge-${today}`,
      JSON.stringify({ challenge, progress: newProgress, completed: isCompleted })
    )
  }

  const progressPercent = (progress / challenge.target) * 100

  return (
    <div
      style={{
        backgroundColor: 'var(--card-bg)',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid var(--border-color)',
      }}
    >
      <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px', color: 'var(--text-primary)' }}>
        🎯 Daily Challenge
      </h3>

      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <span style={{ fontSize: '32px' }}>{challenge.icon}</span>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)' }}>
              {challenge.title}
            </div>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{challenge.description}</div>
          </div>
        </div>

        <div style={{ marginTop: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Progress</span>
            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
              {progress} / {challenge.target}
            </span>
          </div>
          <div
            style={{
              width: '100%',
              height: '10px',
              backgroundColor: 'var(--bg-tertiary)',
              borderRadius: '5px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${progressPercent}%`,
                height: '100%',
                backgroundColor: completed ? 'var(--accent-green)' : 'var(--accent-purple)',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>

        {completed && (
          <div
            style={{
              marginTop: '16px',
              padding: '12px',
              backgroundColor: 'var(--accent-green)',
              borderRadius: '8px',
              color: 'var(--text-primary)',
              textAlign: 'center',
              fontWeight: 600,
            }}
          >
            ✅ Challenge Completed! +50 XP
          </div>
        )}
      </div>
    </div>
  )
}