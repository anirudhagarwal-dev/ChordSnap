import { useState, useEffect } from 'react'
import { addXP } from '../utils/gamification'

const CHORD_OPTIONS = ['C', 'Cm', 'D', 'Dm', 'E', 'Em', 'F', 'Fm', 'G', 'Gm', 'A', 'Am', 'B', 'Bm']

export function ChordChallenge() {
  const [currentChord, setCurrentChord] = useState<string>('')
  const [options, setOptions] = useState<string[]>([])
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [isPlaying, setIsPlaying] = useState(false)
  const [round, setRound] = useState(0)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)

  const startChallenge = () => {
    setIsPlaying(true)
    setScore(0)
    setRound(0)
    setTimeLeft(30)
    generateQuestion()
  }

  const generateQuestion = () => {
    const correct = CHORD_OPTIONS[Math.floor(Math.random() * CHORD_OPTIONS.length)]
    const wrong = CHORD_OPTIONS.filter((c) => c !== correct)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
    setCurrentChord(correct)
    setOptions([correct, ...wrong].sort(() => Math.random() - 0.5))
  }

  const handleAnswer = (answer: string) => {
    if (answer === currentChord) {
      setScore(score + 1)
      setFeedback('correct')
      addXP(20, 'chord-challenge')
    } else {
      setFeedback('wrong')
    }

    setTimeout(() => {
      setFeedback(null)
      setRound(round + 1)
      generateQuestion()
    }, 1000)
  }

  useEffect(() => {
    if (!isPlaying || timeLeft <= 0) {
      setIsPlaying(false)
      return
    }

    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [isPlaying, timeLeft])

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
        🎯 Chord Challenge
      </h3>

      {!isPlaying ? (
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '16px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
            Identify the correct chord as fast as you can!
          </p>
          <button
            onClick={startChallenge}
            style={{
              padding: '14px 32px',
              backgroundColor: 'var(--accent-purple)',
              color: 'var(--text-primary)',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: 600,
              cursor: 'pointer',
              border: 'none',
            }}
          >
            Start Challenge
          </button>
        </div>
      ) : (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Score</div>
              <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--accent-purple)' }}>{score}</div>
            </div>
            <div>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Time</div>
              <div
                style={{
                  fontSize: '32px',
                  fontWeight: 700,
                  color: timeLeft < 10 ? '#ef4444' : 'var(--accent-teal)',
                }}
              >
                {timeLeft}s
              </div>
            </div>
          </div>

          <div
            style={{
              padding: '40px',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: '12px',
              textAlign: 'center',
              marginBottom: '24px',
              minHeight: '120px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                fontSize: '64px',
                fontWeight: 700,
                color: feedback === 'correct' ? 'var(--accent-green)' : feedback === 'wrong' ? '#ef4444' : 'var(--text-primary)',
                transition: 'all 0.3s ease',
              }}
            >
              {currentChord}
            </div>
          </div>

          {feedback && (
            <div
              style={{
                textAlign: 'center',
                marginBottom: '16px',
                fontSize: '24px',
                color: feedback === 'correct' ? 'var(--accent-green)' : '#ef4444',
                fontWeight: 600,
              }}
            >
              {feedback === 'correct' ? '✅ Correct!' : '❌ Wrong!'}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            {options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(option)}
                disabled={feedback !== null}
                style={{
                  padding: '20px',
                  backgroundColor: feedback === 'correct' && option === currentChord
                    ? 'var(--accent-green)'
                    : feedback === 'wrong' && option === currentChord
                      ? '#ef4444'
                      : 'var(--bg-tertiary)',
                  color: 'var(--text-primary)',
                  borderRadius: '12px',
                  fontSize: '20px',
                  fontWeight: 600,
                  cursor: feedback === null ? 'pointer' : 'not-allowed',
                  border: 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                {option}
              </button>
            ))}
          </div>

          {timeLeft === 0 && (
            <div
              style={{
                marginTop: '24px',
                padding: '20px',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: '12px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '24px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                Time's Up! 🎉
              </div>
              <div style={{ fontSize: '18px', color: 'var(--text-secondary)' }}>
                Final Score: {score} points
              </div>
              <button
                onClick={startChallenge}
                style={{
                  marginTop: '16px',
                  padding: '12px 24px',
                  backgroundColor: 'var(--accent-purple)',
                  color: 'var(--text-primary)',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: 'none',
                }}
              >
                Play Again
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}