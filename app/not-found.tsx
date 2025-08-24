import Link from 'next/link'

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '24px',
      }}
    >
      <h1 
        style={{ 
          marginBottom: '16px', 
          fontSize: '6rem',
          fontWeight: 700,
          color: '#a855f7',
          margin: 0,
        }}
      >
        404
      </h1>
      <h4 style={{ marginBottom: '16px', color: 'white', margin: 0 }}>
        Page Not Found
      </h4>
      <p style={{ marginBottom: '32px', color: 'rgba(255, 255, 255, 0.7)', maxWidth: '600px' }}>
        The page you&apos;re looking for doesn&apos;t exist or has been moved. 
        Let&apos;s get you back on track.
      </p>
      <Link 
        href="/en"
        style={{
          backgroundColor: '#a855f7',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '4px',
          textDecoration: 'none',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Back to Home
      </Link>
    </div>
  )
}