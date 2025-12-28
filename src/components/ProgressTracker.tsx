import { useState, useEffect } from 'react'
import { getProgress, getXPForLevel, BADGES, type UserProgress } from '../utils/gamification'

export function ProgressTracker() {
  const [progress, setProgress] = useState<UserProgress>(getProgress())
  const currentLevelXP = getXPForLevel(progress.level)
  const nextLevelXP = getXPForLevel(progress.level + 1)
  const progressToNext = ((progress.xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100

  useEffect(() => {
    setProgress(getProgress())
    const interval = setInterval(() => {
      setProgress(getProgress())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const userBadges = BADGES.filter((b) => progress.badges.includes(b.id))

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
        📊 Your Progress
      </h3>

      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '16px', color: 'var(--text-primary)', fontWeight: 600 }}>
            Level {progress.level}
          </span>
          <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            {progress.xp} XP / {nextLevelXP} XP
          </span>
        </div>
        <div
          style={{
            width: '100%',
            height: '12px',
            backgroundColor: 'var(--bg-tertiary)',
            borderRadius: '6px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${progressToNext}%`,
              height: '100%',
              background: 'linear-gradient(90deg, var(--accent-purple), var(--accent-teal))',
              transition: 'width 0.3s ease',
            }}
          />
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        <div
          style={{
            padding: '16px',
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: '8px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--accent-purple)', marginBottom: '4px' }}>
            {progress.chordsMastered}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Chords Detected</div>
        </div>
        <div
          style={{
            padding: '16px',
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: '8px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--accent-teal)', marginBottom: '4px' }}>
            {Math.floor(progress.totalPracticeTime)}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Minutes Practiced</div>
        </div>
        <div
          style={{
            padding: '16px',
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: '8px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--accent-green)', marginBottom: '4px' }}>
            {progress.dailyStreak}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Day Streak 🔥</div>
        </div>
        <div
          style={{
            padding: '16px',
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: '8px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--accent-purple)', marginBottom: '4px' }}>
            {progress.challengesCompleted}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Challenges</div>
        </div>
      </div>

      {userBadges.length > 0 && (
        <div>
          <h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px', color: 'var(--text-primary)' }}>
            🏆 Your Badges
          </h4>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {userBadges.map((badge) => (
              <div
                key={badge.id}
                style={{
                  padding: '12px',
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: '8px',
                  border: '2px solid var(--accent-purple)',
                  textAlign: 'center',
                  minWidth: '80px',
                }}
                title={badge.description}
              >
                <div style={{ fontSize: '24px', marginBottom: '4px' }}>{badge.icon}</div>
                <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>{badge.name}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}