import { createPortal } from 'react-dom'
import React from 'react'

const NOTES = ['♪', '♫', '𝄞', '♩', '♬']

function Note({ index }: { index: number }) {
  const symbol = NOTES[index % NOTES.length]
  const left = Math.random() * 100
  const top = Math.random() * 100
  const size = 16 + Math.random() * 18
  const duration = 6 + Math.random() * 6
  const delay = Math.random() * 6
  const opacity = 0.5 + Math.random() * 0.4
  return (
    <span
      className="floating-note"
      style={{
        left: `${left}%`,
        top: `${top}%`,
        fontSize: `${size}px`,
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`,
        opacity,
      } as React.CSSProperties}
    >
      {symbol}
    </span>
  )
}

export function FloatingNotes() {
  const count = 0
  return null
}
