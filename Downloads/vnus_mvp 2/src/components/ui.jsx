export function Avatar({ letter, type, size = 32 }) {
  const styles = {
    A: { bg: '#2A4830', border: '#3A6040', color: '#90C898' },
    B: { bg: '#243040', border: '#344858', color: '#80B0C8' },
  }
  const s = styles[type] || styles.A
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: s.bg, border: `1px solid ${s.border}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.38, fontWeight: 700, color: s.color,
      fontFamily: 'var(--font-sans)', flexShrink: 0,
    }}>
      {letter}
    </div>
  )
}

export function Spinner() {
  return (
    <div style={{
      width: 20, height: 20, borderRadius: '50%',
      border: '2px solid rgba(255,255,255,0.2)',
      borderTopColor: 'var(--cream)',
      animation: 'spin 0.7s linear infinite',
      display: 'inline-block',
    }} />
  )
}

export function formatDate(iso) {
  const d = new Date(iso)
  const now = new Date()
  const diff = now - d
  if (diff < 86400000) return 'Aujourd\'hui'
  if (diff < 172800000) return 'Hier'
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}
