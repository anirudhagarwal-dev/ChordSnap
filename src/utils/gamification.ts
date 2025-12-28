export interface UserProgress {
  xp: number
  level: number
  totalPracticeTime: number
  chordsMastered: number
  dailyStreak: number
  lastPracticeDate: string
  badges: string[]
  challengesCompleted: number
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  requirement: number
}

export const BADGES: Badge[] = [
  { id: 'first-chord', name: 'First Chord', description: 'Detected your first chord', icon: '🎵', requirement: 1 },
  { id: 'chord-master', name: 'Chord Master', description: 'Detected 100 chords', icon: '🎸', requirement: 100 },
  { id: 'perfect-pitch', name: 'Perfect Pitch', description: 'Achieved 95%+ accuracy 10 times', icon: '🎹', requirement: 10 },
  { id: 'daily-streak-7', name: 'Week Warrior', description: '7 day practice streak', icon: '🔥', requirement: 7 },
  { id: 'daily-streak-30', name: 'Monthly Master', description: '30 day practice streak', icon: '⭐', requirement: 30 },
  { id: 'speed-demon', name: 'Speed Demon', description: 'Practiced at 2x speed', icon: '⚡', requirement: 1 },
  { id: 'night-owl', name: 'Night Owl', description: 'Practiced after midnight', icon: '🦉', requirement: 1 },
  { id: 'early-bird', name: 'Early Bird', description: 'Practiced before 6 AM', icon: '🐦', requirement: 1 },
]

const XP_PER_CHORD = 10
const XP_PER_MINUTE_PRACTICE = 5
const XP_PER_CHALLENGE = 50

export function getLevelFromXP(xp: number): number {
  return Math.floor(Math.sqrt(xp / 100)) + 1
}

export function getXPForLevel(level: number): number {
  return Math.pow(level - 1, 2) * 100
}

export function getProgress(): UserProgress {
  const stored = localStorage.getItem('chordsnap-progress')
  if (stored) {
    return JSON.parse(stored)
  }
  return {
    xp: 0,
    level: 1,
    totalPracticeTime: 0,
    chordsMastered: 0,
    dailyStreak: 0,
    lastPracticeDate: '',
    badges: [],
    challengesCompleted: 0,
  }
}

export function saveProgress(progress: UserProgress): void {
  localStorage.setItem('chordsnap-progress', JSON.stringify(progress))
}

export function addXP(amount: number, reason: string): UserProgress {
  const progress = getProgress()
  const today = new Date().toDateString()
  
  if (progress.lastPracticeDate !== today) {
    const lastDate = progress.lastPracticeDate ? new Date(progress.lastPracticeDate) : null
    const todayDate = new Date()
    
    if (lastDate) {
      const daysDiff = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))
      if (daysDiff === 1) {
        progress.dailyStreak += 1
      } else if (daysDiff > 1) {
        progress.dailyStreak = 1
      }
    } else {
      progress.dailyStreak = 1
    }
    
    progress.lastPracticeDate = today
  }

  const oldLevel = progress.level
  progress.xp += amount
  progress.level = getLevelFromXP(progress.xp)

  const newBadges = checkBadges(progress)
  if (newBadges.length > 0) {
    progress.badges = [...new Set([...progress.badges, ...newBadges])]
  }

  saveProgress(progress)

  if (progress.level > oldLevel) {
    return progress
  }

  return progress
}

export function checkBadges(progress: UserProgress): string[] {
  const earned: string[] = []
  
  for (const badge of BADGES) {
    if (progress.badges.includes(badge.id)) continue

    let earnedBadge = false
    switch (badge.id) {
      case 'first-chord':
        earnedBadge = progress.chordsMastered >= badge.requirement
        break
      case 'chord-master':
        earnedBadge = progress.chordsMastered >= badge.requirement
        break
      case 'daily-streak-7':
        earnedBadge = progress.dailyStreak >= badge.requirement
        break
      case 'daily-streak-30':
        earnedBadge = progress.dailyStreak >= badge.requirement
        break
    }

    if (earnedBadge) {
      earned.push(badge.id)
    }
  }

  return earned
}

export function recordPracticeTime(minutes: number): void {
  const progress = getProgress()
  progress.totalPracticeTime += minutes
  addXP(Math.floor(minutes * XP_PER_MINUTE_PRACTICE), 'practice')
}

export function recordChordDetected(): void {
  const progress = getProgress()
  progress.chordsMastered += 1
  addXP(XP_PER_CHORD, 'chord-detected')
}

export function completeChallenge(): void {
  const progress = getProgress()
  progress.challengesCompleted += 1
  addXP(XP_PER_CHALLENGE, 'challenge')
}