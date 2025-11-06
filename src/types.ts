export type Instrument = 'guitar' | 'piano' | 'ukulele'

export type ChordSegment = {
  startSec: number
  endSec: number
  chord: string
  confidence: number
  notes?: string[]
}

export type PitchData = {
  timeSec: number
  note: string
  frequencyHz: number
}

export type AnalyzeResponse = {
  durationSec: number
  segments: ChordSegment[]
  key?: string
  scale?: string
  keyConfidence?: number
  vocalsDetected?: boolean
  vocalsConfidence?: number
  pitches?: PitchData[]
  fileName?: string
  tempo?: number
}


