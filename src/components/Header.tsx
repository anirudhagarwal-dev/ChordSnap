import { useEffect, useRef, useState } from 'react'
import { LiquidButton } from './LiquidButton'

type Props = {
  onExport?: () => void
  onThemeToggle?: () => void
  onNewFile?: () => void
  showNewFile?: boolean
  theme?: 'dark' | 'light'
  onNavigate?: (page: string) => void
  currentPage?: string
  user?: { email: string; name?: string } | null
  onLogin?: () => void
  onSignUp?: () => void
  onLogout?: () => void
}

export function Header({ 
  onExport, 
  onThemeToggle, 
  onNewFile, 
  showNewFile, 
  theme = 'dark',
  onNavigate,
  currentPage,
  user,
  onLogin,
  onSignUp,
  onLogout
}: Props) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const userTriggerRef = useRef<HTMLDivElement | null>(null)
  const userMenuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as Node
      if (
        isUserMenuOpen &&
        userMenuRef.current &&
        userTriggerRef.current &&
        !userMenuRef.current.contains(target) &&
        !userTriggerRef.current.contains(target)
      ) {
        setIsUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [isUserMenuOpen])

  const navItems = [
    { label: 'Features', page: 'features' },
    { label: 'About', page: 'about' },
    { label: 'Contact Us', page: 'contact' },
  ]

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  const handleNavClick = (page: string) => {
    onNavigate?.(page)
    setIsMenuOpen(false)
  }

  return (
    <header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 40px',
        borderBottom: '1px solid var(--border-color)',
        backgroundColor: 'var(--bg-primary)',
        position: 'relative',
        zIndex: 100,
      }}
      className="mobile-container"
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span data-speed="0.6" style={{ fontSize: '28px', color: '#E5D0AC' }}>♫</span>
        <h1 
          data-lag="0.3"
          style={{ fontSize: '24px', fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer' }}
          onClick={() => onNavigate?.('/')}
        >
          ChordSnap
        </h1>
      </div>
      
      <div className="desktop-only" data-speed="0.95" style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
        <nav style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          {navItems.map((item) => (
            <button
              key={item.page}
              onClick={() => onNavigate?.(item.page)}
              style={{
                color: currentPage === item.page ? 'var(--accent-purple)' : 'var(--text-primary)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: currentPage === item.page ? 600 : 400,
                padding: '8px 12px',
                borderRadius: '6px',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (currentPage !== item.page) {
                  e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'
                }
              }}
              onMouseLeave={(e) => {
                if (currentPage !== item.page) {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {showNewFile && onNewFile && (
              <LiquidButton
                onClick={onNewFile}
                style={{
                  color: 'var(--accent-purple)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 500,
                }}
              >
                Analyze New File
              </LiquidButton>
            )}
            {onExport && (
              <LiquidButton
                onClick={onExport}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: 'var(--text-primary)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                <span>📥</span>
                <span>Export</span>
              </LiquidButton>
            )}
            
            <div
              style={{ position: 'relative' }}
            >
              <div 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px', 
                  cursor: 'pointer',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                onClick={() => setIsUserMenuOpen((v) => !v)}
                ref={userTriggerRef}
              >
                <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                  {user.name || user.email}
                </span>
                <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>▼</span>
              </div>

              {isUserMenuOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 4px)',
                    right: 0,
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    padding: '6px',
                    minWidth: '140px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                    zIndex: 1000,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}
                  ref={userMenuRef}
                  onMouseLeave={() => setIsUserMenuOpen(false)}
                >
                  <LiquidButton
                    onClick={onLogout}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      textAlign: 'left',
                      color: '#ff4444',
                      background: 'none',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontWeight: 500
                    }}
                    onMouseEnter={(e: any) => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'}
                    onMouseLeave={(e: any) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <span>🚪</span> Logout
                  </LiquidButton>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <LiquidButton
              onClick={onLogin}
              style={{
                color: 'var(--text-primary)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 500,
                padding: '8px 16px',
              }}
            >
              Login
            </LiquidButton>
          </div>
        )}

        {onThemeToggle && (
          <LiquidButton
            onClick={onThemeToggle}
            style={{
              fontSize: '24px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-primary)',
              padding: '8px',
              borderRadius: '8px',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </LiquidButton>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button
        className="mobile-only"
        onClick={toggleMenu}
        style={{
          fontSize: '24px',
          color: 'var(--text-primary)',
          zIndex: 102,
        }}
      >
        {isMenuOpen ? '✕' : '☰'}
      </button>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div
          className="mobile-only"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: 'var(--bg-secondary)',
            borderBottom: '1px solid var(--border-color)',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
            zIndex: 101,
          }}
        >
          {navItems.map((item) => (
            <LiquidButton
              key={item.page}
              onClick={() => handleNavClick(item.page)}
              style={{
                color: currentPage === item.page ? 'var(--accent-purple)' : 'var(--text-primary)',
                textAlign: 'left',
                fontSize: '18px',
                padding: '10px 0',
                borderBottom: '1px solid var(--border-color)',
              }}
            >
              {item.label}
            </LiquidButton>
          ))}

          {user ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
               <span style={{ fontSize: '16px', color: 'var(--text-secondary)' }}>
                Signed in as: {user.name || user.email}
              </span>
              {showNewFile && onNewFile && (
                <LiquidButton
                  onClick={() => { onNewFile(); setIsMenuOpen(false); }}
                  style={{
                    color: 'var(--accent-purple)',
                    textAlign: 'left',
                    fontSize: '16px',
                  }}
                >
                  Analyze New File
                </LiquidButton>
              )}
               {onExport && (
                <LiquidButton
                  onClick={() => { onExport(); setIsMenuOpen(false); }}
                  style={{
                    color: 'var(--text-primary)',
                    textAlign: 'left',
                    fontSize: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <span>📥</span> Export
                </LiquidButton>
              )}
              <LiquidButton
                onClick={() => { onLogout?.(); setIsMenuOpen(false); }}
                style={{
                  padding: '12px',
                  backgroundColor: 'var(--accent-purple)',
                  color: 'var(--text-primary)',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 500,
                  width: '100%',
                }}
              >
                Logout
              </LiquidButton>
            </div>
          ) : (
            <button
              onClick={() => { onLogin?.(); setIsMenuOpen(false); }}
              style={{
                padding: '12px',
                backgroundColor: 'var(--accent-purple)',
                color: 'var(--text-primary)',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 500,
                width: '100%',
              }}
            >
              Login
            </button>
          )}
          
          {onThemeToggle && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
              <span style={{ color: 'var(--text-primary)', fontSize: '16px' }}>Theme</span>
              <button
                onClick={onThemeToggle}
                style={{
                  fontSize: '24px',
                  color: 'var(--text-primary)',
                }}
              >
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  )
}
