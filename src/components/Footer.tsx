export function Footer() {
  return (
    <footer
      style={{
        backgroundColor: 'var(--bg-secondary)',
        padding: '32px 20px',
        marginTop: '60px',
        borderTop: '1px solid var(--border-color)',
        textAlign: 'center',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div className="mobile-stack" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '24px', marginBottom: '16px' }}>
          <a
            href="https://www.linkedin.com/in/anirudh-agarwal-2b7b41332/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              textDecoration: 'none',
              color: 'var(--text-secondary)',
              transition: 'color 0.2s ease',
              fontSize: '16px',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#0077b5')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            <img src="/linkedin.svg" alt="" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
            LinkedIn
          </a>
          <a
            href="https://github.com/anirudhagarwal-dev"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              textDecoration: 'none',
              color: 'var(--text-secondary)',
              transition: 'color 0.2s ease',
              fontSize: '16px',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            <img src="/github.svg" alt="" className="github-icon" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
            GitHub
          </a>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          © {new Date().getFullYear()} ChordSnap.
        </p>
      </div>
    </footer>
  )
}
