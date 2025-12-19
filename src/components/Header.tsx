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
  const navItems = [
    { label: 'Features', page: 'features' },
    { label: 'About', page: 'about' },
    { label: 'Contact Us', page: 'contact' },
  ]

  return (
    <header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 40px',
        borderBottom: '1px solid var(--border-color)',
        backgroundColor: 'var(--bg-primary)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '28px', color: '#E5D0AC' }}>♫</span>
        <h1 
          style={{ fontSize: '24px', fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer' }}
          onClick={() => onNavigate?.('home')}
        >
          ChordSnap
        </h1>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
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
            <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              {user.name || user.email}
            </span>
            {showNewFile && onNewFile && (
              <button
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
              </button>
            )}
            {onExport && (
              <button
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
              </button>
            )}
            <button
              onClick={onLogout}
              style={{
                padding: '8px 16px',
                backgroundColor: 'var(--accent-purple)',
                color: 'var(--text-primary)',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 500,
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
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
            </button>
          </div>
        )}

        {onThemeToggle && (
          <button
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
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
            title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        )}
      </div>
    </header>
  )
}

