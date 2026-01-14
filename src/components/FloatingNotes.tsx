import { createPortal } from 'react-dom'
import React from 'react'

const NOTES = ['♪', '♫', '𝄞', '♩', '♬']

function Note({ index }: { index: number }) {
  const symbol = NOTES[index % NOTES.length]
  const left = Math.random() * 100
  const top = Math.random() * 100
  const size = 16 + Math.random() * 18
  const duration = 12 + Math.random() * 10
  const delay = Math.random() * 8
  const driftX = -20 + Math.random() * 40
  const driftY = -40 + Math.random() * 80
  const opacity = 0.4 + Math.random() * 0.4
  return (
    <span
      className="floating-note"
      style={{
        left: `${left}%`,
        top: `${top}%`,
        fontSize: `${size}px`,
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`,
        '--note-drift-x': `${driftX}px`,
        '--note-drift-y': `${driftY}px`,
        opacity,
      } as React.CSSProperties}
    >
      {symbol}
    </span>
  )
}

export function FloatingNotes() {
  const count = 22
  return createPortal(
    <div className="floating-notes-container" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <Note key={i} index={i} />
      ))}
    </div>,
    document.body
  )
}
