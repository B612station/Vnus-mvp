export function Avatar({ letter, type, size = 32 }) {
  const styles = {
    A: { bg: '#2A4830', border: '#3A6040', color: '#90C898' },
    B: { bg: '#243040', border: '#344858', color: '#80B0C8' },
    solo: { bg: '#3A3028', border: '#5A4838', color: '#C8A880' },
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

export function Spinner({ light = true }) {
  return (
    <div style={{
      width: 18, height: 18, borderRadius: '50%',
      border: `2px solid ${light ? 'rgba(255,255,255,0.2)' : 'rgba(28,56,40,0.15)'}`,
      borderTopColor: light ? 'var(--cream)' : 'var(--sapin)',
      animation: 'spin 0.7s linear infinite',
      display: 'inline-block', flexShrink: 0,
    }} />
  )
}

export function TextInput({ value, onChange, placeholder, label, error, type = 'text', autoFocus }) {
  return (
    <div>
      {label && (
        <label style={{
          fontSize: '10px', color: 'var(--sapin-mist)',
          letterSpacing: '0.14em', textTransform: 'uppercase',
          display: 'block', marginBottom: '8px',
        }}>
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        style={{
          width: '100%', padding: '12px 16px',
          background: 'rgba(255,255,255,0.08)',
          border: `1px solid ${error ? '#E05555' : 'rgba(255,255,255,0.15)'}`,
          borderRadius: 'var(--radius-sm)',
          color: 'var(--cream)', fontSize: '15px', outline: 'none',
          transition: 'border-color 0.2s',
          fontFamily: 'var(--font-serif)',
        }}
        onFocus={e => { e.target.style.borderColor = error ? '#E05555' : 'rgba(168,208,160,0.5)' }}
        onBlur={e => { e.target.style.borderColor = error ? '#E05555' : 'rgba(255,255,255,0.15)' }}
      />
      {error && <p style={{ fontSize: '11px', color: '#E08888', marginTop: '5px' }}>{error}</p>}
    </div>
  )
}

export function PinInput({ value, onChange, placeholder, error, autoFocus }) {
  return (
    <div>
      <input
        type="password"
        inputMode="numeric"
        maxLength={4}
        value={value}
        autoFocus={autoFocus}
        onChange={e => onChange(e.target.value.replace(/\D/g, '').slice(0, 4))}
        placeholder={placeholder || '••••'}
        style={{
          width: '100%', padding: '14px 16px',
          background: 'rgba(255,255,255,0.08)',
          border: `1px solid ${error ? '#E05555' : 'rgba(255,255,255,0.15)'}`,
          borderRadius: 'var(--radius-sm)',
          color: 'var(--cream)', fontSize: '22px',
          letterSpacing: '0.5em', outline: 'none',
          transition: 'border-color 0.2s',
          fontFamily: 'var(--font-sans)',
          textAlign: 'center',
        }}
        onFocus={e => { e.target.style.borderColor = error ? '#E05555' : 'rgba(168,208,160,0.5)' }}
        onBlur={e => { e.target.style.borderColor = error ? '#E05555' : 'rgba(255,255,255,0.15)' }}
      />
      {error && <p style={{ fontSize: '11px', color: '#E08888', marginTop: '5px' }}>{error}</p>}
    </div>
  )
}

export function VnusLogo({ size = 'md' }) {
  const sizes = { sm: { title: 22, sub: 9 }, md: { title: 32, sub: 10 }, lg: { title: 44, sub: 11 } }
  const s = sizes[size] || sizes.md
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontFamily: 'var(--font-serif)', fontSize: s.title, color: 'var(--cream)', letterSpacing: '0.04em' }}>
        V<em style={{ fontStyle: 'italic', color: 'var(--sapin-mist)' }}>·</em>nus
      </div>
      <div style={{ fontSize: s.sub, color: 'var(--ink-muted)', letterSpacing: '0.18em', textTransform: 'uppercase', marginTop: '3px' }}>
        Traductrice cognitive
      </div>
    </div>
  )
}

export function Card({ children, style }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.05)',
      border: '0.5px solid rgba(255,255,255,0.12)',
      borderRadius: 'var(--radius)', padding: '36px',
      width: '100%', maxWidth: '440px',
      ...style,
    }}>
      {children}
    </div>
  )
}

export function Btn({ children, onClick, disabled, variant = 'primary', style, loading }) {
  const variants = {
    primary: { background: 'var(--cream)', color: 'var(--sapin)', border: 'none' },
    ghost: { background: 'transparent', color: 'var(--ink-muted)', border: '0.5px solid var(--border-dark)' },
    danger: { background: 'transparent', color: '#E08888', border: '0.5px solid #804040' },
  }
  const v = variants[variant] || variants.primary
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        ...v, padding: '13px 20px',
        fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 600,
        letterSpacing: '0.04em', borderRadius: 'var(--radius-xs)',
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
        transition: 'opacity 0.2s',
        ...style,
      }}
    >
      {loading ? <Spinner light={variant === 'primary'} /> : children}
    </button>
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
