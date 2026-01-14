import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Header } from './components/Header'
import { UploadPage } from './components/UploadPage'
import { Waveform } from './components/Waveform'
import { AnalysisDetails } from './components/AnalysisDetails'
import { PitchAnalysis } from './components/PitchAnalysis'
import { ChordTimelineNew } from './components/ChordTimelineNew'
import { ChordCards } from './components/ChordCards'
import { AudioPlayer } from './components/AudioPlayer'
import { MicrophoneInput } from './components/MicrophoneInput'
import { Tuner } from './components/Tuner'
import { Metronome } from './components/Metronome'
import { ChordSearch } from './components/ChordSearch'
import { Transpose } from './components/Transpose'
import { Spectrogram } from './components/Spectrogram'
import { GuitarFretboard } from './components/GuitarFretboard'
import { PianoKeyboard } from './components/PianoKeyboard'
import { Tabs } from './components/Tabs'
import { PracticeMode } from './components/PracticeMode'
import { ProgressTracker } from './components/ProgressTracker'
import { DailyChallenge } from './components/DailyChallenge'
import { ChordChallenge } from './components/ChordChallenge'
import { ChordProgressionBuilder } from './components/ChordProgressionBuilder'
import { MusicGenerator } from './components/MusicGenerator'
import { Login } from './components/Login'
import { SignUp } from './components/SignUp'
import { About } from './components/About'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'
import { Features } from './components/Features'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import { LiquidBackground } from './components/LiquidBackground'
import { LiquidWaves } from './components/LiquidWaves'
import { LiquidFilters } from './components/LiquidFilters'
import { LiquidTransition } from './components/LiquidTransition'
import { InteractiveLiquid } from './components/InteractiveLiquid'
import { LiquidButton } from './components/LiquidButton'
import { recordChordDetected, recordPracticeTime } from './utils/gamification'
import { LiquidMotionSystem } from './components/LiquidMotionSystem'
import { FloatingNotes } from './components/FloatingNotes'
import { MusicWaveNotes } from './components/MusicWaveNotes'
import type { AnalyzeResponse, ChordSegment } from './types'
import './index.css'

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'

type Theme = 'dark' | 'light'
type MainTab = 'upload' | 'generator' | 'practice' | 'live' | 'tools' | 'visualize' | 'games'
type Page = 'home' | 'features' | 'about' | 'contact'

interface User {
  email: string
  name?: string
  phone?: string
}

const AppContent = () => {
  const navigate = useNavigate();
  const [result, setResult] = useState<AnalyzeResponse | null>(null)
  const [fileUrl, setFileUrl] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string>('')
  const [currentTime, setCurrentTime] = useState(0)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [activeTab, setActiveTab] = useState<MainTab>('upload')
  const [selectedChord, setSelectedChord] = useState<string>('C')
  const [transposedSegments, setTransposedSegments] = useState<ChordSegment[]>([])
  const [playbackRate, setPlaybackRate] = useState(1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [practiceStartTime, setPracticeStartTime] = useState<number | null>(null)
  const [showLogin, setShowLogin] = useState(false)
  const [showSignUp, setShowSignUp] = useState(false)
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('chordsnap-user')
    return savedUser ? JSON.parse(savedUser) : null
  })
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('chordsnap-theme') as Theme | null
    return savedTheme || 'light'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('chordsnap-theme', theme)
  }, [theme])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

      switch (e.key) {
        case ' ':
          e.preventDefault()
          break
        case 'ArrowLeft':
          e.preventDefault()
          setCurrentTime((t) => Math.max(0, t - 5))
          break
        case 'ArrowRight':
          e.preventDefault()
          setCurrentTime((t) => Math.min(result?.durationSec || 0, t + 5))
          break
        case 't':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault()
            setActiveTab('tools')
          }
          break
        case 'u':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault()
            setActiveTab('upload')
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [result])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  const onAnalyze = async (file: File) => {
    setIsAnalyzing(true)
    const url = URL.createObjectURL(file)
    setFileUrl(url)
    setFileName(file.name)
    setResult(null)
    setTransposedSegments([])

    try {
      const form = new FormData()
      form.append('file', file)
      
      const res = await fetch(`${API_BASE}/analyze`, { method: 'POST', body: form })
      
      if (!res.ok) {
        let errorMessage = `Server error: ${res.status} ${res.statusText}`
        try {
          const errorData = await res.json()
          errorMessage = errorData.detail || errorData.message || errorMessage
        } catch (e) {
          try {
            const text = await res.text()
            if (text) errorMessage = text
          } catch (e2) {
          }
        }
        throw new Error(errorMessage)
      }
      
      const json = (await res.json()) as AnalyzeResponse
      setResult(json)
      setTransposedSegments(json.segments)
      recordChordDetected()
    } catch (error) {
      console.error('Analysis error:', error)
      let errorMessage = 'Unknown error occurred'
      
      if (error instanceof Error) {
        errorMessage = error.message
      } else if (typeof error === 'string') {
        errorMessage = error
      } else if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = String(error.message)
      }
      
      if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {
        errorMessage = 'Cannot connect to backend server. Please ensure the backend is running on http://localhost:8000'
      }
      
      alert(`Failed to analyze audio file: ${errorMessage}\n\nPlease ensure:\n- File is a valid audio format (.mp3, .wav, .mp4)\n- File size is under 100MB\n- Backend server is running on ${API_BASE}`)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleNewFile = () => {
    setResult(null)
    setFileUrl(null)
    setFileName('')
    setCurrentTime(0)
    setTransposedSegments([])
    setActiveTab('upload')
    navigate('/')
  }

  const handleLogin = (email: string, password: string, phone?: string) => {
    const userData: User = { email, phone }
    setUser(userData)
    localStorage.setItem('chordsnap-user', JSON.stringify(userData))
    setShowLogin(false)
  }

  const handleSignUp = (email: string, password: string, phone: string, name: string) => {
    const userData: User = { email, phone, name }
    setUser(userData)
    localStorage.setItem('chordsnap-user', JSON.stringify(userData))
    setShowSignUp(false)
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('chordsnap-user')
    navigate('/')
  }

  const handleNavigate = (page: string) => {
    navigate(page)
    if (page !== '/') {
      setResult(null)
      setActiveTab('upload')
    }
  }

  const handleExport = () => {
    if (!result) return

    const segments = transposedSegments.length > 0 ? transposedSegments : result.segments
    const exportData = {
      fileName,
      duration: result.durationSec,
      key: result.key,
      scale: result.scale,
      vocalsDetected: result.vocalsDetected,
      chords: segments.map((s) => ({
        chord: s.chord,
        startSec: s.startSec,
        endSec: s.endSec,
        confidence: s.confidence,
        notes: s.notes,
      })),
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${fileName.replace(/\.[^/.]+$/, '')}_chords.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleSeek = (timeSec: number) => {
    setCurrentTime(timeSec)
  }

  const handleLiveAudio = async (audioData: Float32Array) => {
    console.log('Live audio data received:', audioData.length)
  }

  const segments = transposedSegments.length > 0 ? transposedSegments : result?.segments || []
  const totalChords = segments.length
  const vocalsText = result?.vocalsDetected ? 'Vocals detected' : 'No vocals detected'

  
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)', position: 'relative' }}>
      <LiquidFilters />
      <LiquidBackground intensity={0.3} speed={0.4} />
      <LiquidWaves count={3} />
      
      <Header
        onExport={result ? handleExport : undefined}
        onNewFile={handleNewFile}
        onThemeToggle={toggleTheme}
        theme={theme}
        showNewFile={!!result}
        onNavigate={handleNavigate}
        currentPage={'/'}
        user={user}
        onLogin={() => setShowLogin(true)}
        onSignUp={() => setShowSignUp(true)}
        onLogout={handleLogout}
      />
      
      <LiquidTransition>
        <Routes>
          <Route path="/" element={
            !result && activeTab === 'upload' ? (
              <InteractiveLiquid intensity={3}>
                <UploadPage onAnalyze={onAnalyze} />
              </InteractiveLiquid>
            ) : (
              <InteractiveLiquid intensity={2}>
                <div className="responsive-padding-large" style={{ padding: '40px', paddingBottom: '200px', maxWidth: '1600px', margin: '0 auto' }}>
                  <Tabs
                    tabs={['Analysis', 'Music Generator', 'Practice', 'Live Detection', 'Tools', 'Visualize', 'Games']}
                    activeTab={
                      activeTab === 'upload'
                        ? 'Analysis'
                        : activeTab === 'practice'
                          ? 'Practice'
                          : activeTab === 'live'
                            ? 'Live Detection'
                            : activeTab === 'tools'
                              ? 'Tools'
                              : activeTab === 'visualize'
                                ? 'Visualize'
                                : 'Games'
                    }
                    onTabChange={(tab) => {
                      if (tab === 'Analysis') setActiveTab('upload')
                      else if (tab === 'Music Generator') setActiveTab('generator')
                      else if (tab === 'Practice') setActiveTab('practice')
                      else if (tab === 'Live Detection') setActiveTab('live')
                      else if (tab === 'Tools') setActiveTab('tools')
                      else if (tab === 'Visualize') setActiveTab('visualize')
                      else if (tab === 'Games') setActiveTab('games')
                    }}
                  />

              {activeTab === 'generator' && (
                <MusicGenerator
                  onAnalyze={onAnalyze}
                  analysisResult={result}
                  tempo={result?.tempo ? Math.round(result.tempo) : 120}
                />
              )}

              {activeTab === 'upload' && result && (
                <>
                  <div style={{ marginBottom: '32px' }}>
                    <h2 style={{ fontSize: '28px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-primary)' }}>
                      {fileName}
                    </h2>
                    <p style={{ fontSize: '16px', color: 'var(--text-secondary)' }}>
                      {totalChords} chords detected • {vocalsText}
                    </p>
                  </div>

                  {fileUrl && (
                    <Waveform
                      duration={result.durationSec}
                      segments={segments}
                      currentTime={currentTime}
                      onSeek={handleSeek}
                    />
                  )}

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                      gap: '24px',
                      marginBottom: '32px',
                    }}
                  >
                    <AnalysisDetails
                      key={result.key}
                      scale={result.scale}
                      keyConfidence={result.keyConfidence}
                      vocalsDetected={result.vocalsDetected}
                      vocalsConfidence={result.vocalsConfidence}
                    />
                    {result.pitches && result.pitches.length > 0 && <PitchAnalysis pitches={result.pitches} />}
                    {result.segments.length > 0 && (
                      <Transpose segments={result.segments} onTranspose={setTransposedSegments} />
                    )}
                  </div>

                  <ChordTimelineNew segments={segments} duration={result.durationSec} onSeek={handleSeek} />

                  <ChordCards segments={segments} onSeek={handleSeek} />
                </>
              )}

              {activeTab === 'practice' && result && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                      gap: '24px',
                    }}
                  >
                    <ProgressTracker />
                    <DailyChallenge />
                  </div>

                  {fileUrl && (
                    <PracticeMode
                      segments={segments}
                      duration={result.durationSec}
                      currentTime={currentTime}
                      isPlaying={isPlaying}
                      onSeek={handleSeek}
                      playbackRate={playbackRate}
                    />
                  )}

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
                    <ChordProgressionBuilder />
                  </div>
                </div>
              )}

              {activeTab === 'games' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
                    <ChordChallenge />
                    <ProgressTracker />
                  </div>
                </div>
              )}

              {activeTab === 'live' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                  <div>
                    <h2 style={{ fontSize: '28px', fontWeight: 600, marginBottom: '16px', color: 'var(--text-primary)' }}>
                      Live Chord Detection
                    </h2>
                    <p style={{ fontSize: '16px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
                      Use your microphone to detect chords in real-time
                    </p>
                    <MicrophoneInput onAudioData={handleLiveAudio} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
                    <Tuner />
                    <Spectrogram isLive={true} />
                  </div>
                </div>
              )}

              {activeTab === 'tools' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
                    <Metronome initialBPM={result?.tempo ? Math.round(result.tempo) : 120} />
                    <Tuner />
                  </div>
                  <ChordSearch onChordSelect={setSelectedChord} />
                </div>
              )}

              {activeTab === 'visualize' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                  <div>
                    <h2 style={{ fontSize: '28px', fontWeight: 600, marginBottom: '16px', color: 'var(--text-primary)' }}>
                      Chord Visualization
                    </h2>
                    <p style={{ fontSize: '16px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
                      Select a chord to see its fingering on different instruments
                    </p>
                  </div>
                  {result && fileUrl && <Spectrogram audioUrl={fileUrl} />}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
                    {segments.length > 0 && (
                      <>
                        <GuitarFretboard chord={selectedChord} instrument="guitar" />
                        <PianoKeyboard chord={selectedChord} />
                      </>
                    )}
                  </div>
                  {segments.length > 0 && (
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {segments.slice(0, 20).map((seg, idx) => (
                        <LiquidButton
                          key={idx}
                          onClick={() => setSelectedChord(seg.chord)}
                          style={{
                            padding: '8px 16px',
                            backgroundColor: selectedChord === seg.chord ? 'var(--accent-purple)' : 'var(--bg-tertiary)',
                            color: 'var(--text-primary)',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            border: 'none',
                          }}
                        >
                          {seg.chord}
                        </LiquidButton>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </InteractiveLiquid>
          )
        } />
      
      <Route path="/features" element={
        <InteractiveLiquid intensity={1}>
          <Features />
        </InteractiveLiquid>
      } />
      <Route path="/about" element={
        <InteractiveLiquid intensity={1}>
          <About />
        </InteractiveLiquid>
      } />
      <Route path="/contact" element={
        <InteractiveLiquid intensity={1}>
          <Contact />
        </InteractiveLiquid>
      } />
    </Routes>
    </LiquidTransition>
      <Footer />

      {fileUrl && result && (
        <AudioPlayer
          src={fileUrl}
          duration={result.durationSec}
          onTimeUpdate={(time) => {
            setCurrentTime(time)
            if (!practiceStartTime) {
              setPracticeStartTime(Date.now())
            } else {
              const minutes = (Date.now() - practiceStartTime) / 60000
              if (minutes >= 1) {
                recordPracticeTime(1)
                setPracticeStartTime(Date.now())
              }
            }
          }}
          onPlayingChange={setIsPlaying}
          playbackRate={playbackRate}
          onPlaybackRateChange={setPlaybackRate}
        />
      )}

      {showLogin && (
        <Login
          onLogin={handleLogin}
          onClose={() => setShowLogin(false)}
          onSwitchToSignUp={() => {
            setShowLogin(false)
            setShowSignUp(true)
          }}
        />
      )}
      {showSignUp && (
        <SignUp
          onSignUp={handleSignUp}
          onClose={() => setShowSignUp(false)}
          onSwitchToLogin={() => {
            setShowSignUp(false)
            setShowLogin(true)
          }}
        />
      )}

      {isAnalyzing && createPortal(
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: theme === 'dark' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div style={{ textAlign: 'center', color: 'var(--text-primary)' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎵</div>
            <div style={{ fontSize: '20px', fontWeight: 600 }}>Analyzing audio...</div>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '8px' }}>
              This may take a few moments
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}

export default function App() {
  return (
    <Router>
      <LiquidMotionSystem enableInteractions={false}>
        <MusicWaveNotes enabled waveSpeed={1} noteDuration={2.8} fadeTime={1.2} density={0.35} volume={0.06} />
        <FloatingNotes />
        <AppContent />
      </LiquidMotionSystem>
    </Router>
  )
}
