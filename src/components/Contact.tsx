export function Contact() {
  return (
    <div style={{ padding: '60px 40px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '48px', fontWeight: 700, marginBottom: '20px', color: 'var(--text-primary)', textAlign: 'center' }}>
        Contact Us
      </h1>
      
      <p style={{ fontSize: '18px', lineHeight: '1.8', color: 'var(--text-secondary)', marginBottom: '60px', textAlign: 'center' }}>
        Get in touch with our team members for any questions or support.
      </p>

      {/* Team Members Section */}
      <div style={{ marginTop: '60px' }}>
        <h2 style={{ fontSize: '32px', fontWeight: 600, marginBottom: '40px', color: 'var(--text-primary)', textAlign: 'center' }}>
          Our Team
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {/* Team Member 1 - Ankit */}
          <div
            style={{
              backgroundColor: 'var(--card-bg)',
              padding: '32px',
              borderRadius: '16px',
              border: '1px solid var(--border-color)',
              textAlign: 'center',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)'
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(74, 112, 169, 0.3)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            <div
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                backgroundColor: 'var(--bg-tertiary)',
                margin: '0 auto 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '48px',
                color: 'var(--text-primary)',
              }}
            >
              🤖
            </div>
            <h3 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '12px', color: 'var(--text-primary)' }}>
              Ankit Lawaniya
            </h3>
            <p style={{ fontSize: '16px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              <strong>Roll No:</strong> 2400270130034
            </p>
            <p style={{ fontSize: '16px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              <strong>Domain:</strong> ML
            </p>
            <p style={{ fontSize: '16px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              <span style={{ fontSize: '20px', marginRight: '8px' }}>📞</span>
              <strong>Phone:</strong> 9267932341
            </p>
            <div
              style={{
                display: 'inline-block',
                padding: '8px 16px',
                backgroundColor: 'var(--bg-tertiary)',
                borderRadius: '8px',
                fontSize: '14px',
                color: 'var(--text-primary)',
                fontWeight: 500,
              }}
            >
              ML Engineer
            </div>
          </div>

          {/* Team Member 2 - Anirudh */}
          <div
            style={{
              backgroundColor: 'var(--card-bg)',
              padding: '32px',
              borderRadius: '16px',
              border: '1px solid var(--border-color)',
              textAlign: 'center',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)'
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(74, 112, 169, 0.3)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            <div
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                backgroundColor: 'var(--bg-tertiary)',
                margin: '0 auto 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '48px',
                color: 'var(--text-primary)',
              }}
            >
              👨‍💻
            </div>
            <h3 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '12px', color: 'var(--text-primary)' }}>
              Anirudh Agarwal
            </h3>
            <p style={{ fontSize: '16px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              <strong>Roll No:</strong> 2400270130033
            </p>
            <p style={{ fontSize: '16px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              <strong>Domain:</strong> Backend
            </p>
            <p style={{ fontSize: '16px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              <span style={{ fontSize: '20px', marginRight: '8px' }}>📞</span>
              <strong>Phone:</strong> 8527870864
            </p>
            <div
              style={{
                display: 'inline-block',
                padding: '8px 16px',
                backgroundColor: 'var(--bg-tertiary)',
                borderRadius: '8px',
                fontSize: '14px',
                color: 'var(--text-primary)',
                fontWeight: 500,
              }}
            >
              Backend Developer
            </div>
          </div>

          {/* Team Member 3 */}
          <div
            style={{
              backgroundColor: 'var(--card-bg)',
              padding: '32px',
              borderRadius: '16px',
              border: '1px solid var(--border-color)',
              textAlign: 'center',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)'
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(74, 112, 169, 0.3)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            <div
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                backgroundColor: 'var(--bg-tertiary)',
                margin: '0 auto 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '48px',
                color: 'var(--text-primary)',
              }}
            >
              💻
            </div>
            <h3 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '12px', color: 'var(--text-primary)' }}>
              Akshendra Dweidi
            </h3>
            <p style={{ fontSize: '16px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              <strong>Roll No:</strong> 2400270130025
            </p>
            <p style={{ fontSize: '16px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              <strong>Domain:</strong> Frontend
            </p>
            <p style={{ fontSize: '16px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              <span style={{ fontSize: '20px', marginRight: '8px' }}>📞</span>
              <strong>Phone:</strong> 8010906123
            </p>
            <div
              style={{
                display: 'inline-block',
                padding: '8px 16px',
                backgroundColor: 'var(--bg-tertiary)',
                borderRadius: '8px',
                fontSize: '14px',
                color: 'var(--text-primary)',
                fontWeight: 500,
              }}
            >
              Frontend Developer
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

