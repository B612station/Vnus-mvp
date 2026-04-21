import React, { useState } from 'react'
import { getSpaceById } from '../lib/supabase.js'
import { VnusLogo, Btn, Card } from './ui.jsx'

export default function Login({ onFound, onBack }) {
  const [spaceId, setSpaceId] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleFind() {
    const id = spaceId.trim()
    if (!id) { setError('Entrez votre identifiant d\'espace'); return }
    setLoading(true); setError(null)
    try {
      const space = await getSpaceById(id)
      localStorage.setItem('vnus_space_id', space.id)
      onFound(space)
    } catch {
      setError('Espace introuvable. Vérifiez l\'identifiant.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--sapin)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '32px 24px',
    }}>
      <div style={{ marginBottom: '36px' }}>
        <VnusLogo />
      </div>

      <Card>
        <div className="fade-in">
          <p style={{ fontSize: '10px', color: 'var(--sapin-mist)', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '10px' }}>
            Accès à un espace existant
          </p>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '26px', color: 'var(--cream)', fontWeight: 400, marginBottom: '8px' }}>
            Retrouver votre espace
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--ink-muted)', lineHeight: 1.6, marginBottom: '28px' }}>
            Entrez l'identifiant de votre espace (visible dans vos paramètres, ou envoyé lors de la création).
          </p>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ fontSize: '10px', color: 'var(--sapin-mist)', letterSpacing: '0.14em', textTransform: 'uppercase', display: 'block', marginBottom: '10px' }}>
              Identifiant de l'espace
            </label>
            <input
              type="text"
              value={spaceId}
              onChange={e => { setSpaceId(e.target.value); setError(null) }}
              placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
              autoFocus
              style={{
                width: '100%', padding: '12px 16px',
                background: 'rgba(255,255,255,0.08)',
                border: `1px solid ${error ? '#E05555' : 'rgba(255,255,255,0.15)'}`,
                borderRadius: 'var(--radius-sm)',
                color: 'var(--cream)', fontSize: '13px', outline: 'none',
                fontFamily: 'var(--font-sans)',
              }}
              onFocus={e => e.target.style.borderColor = 'rgba(168,208,160,0.5)'}
              onBlur={e => e.target.style.borderColor = error ? '#E05555' : 'rgba(255,255,255,0.15)'}
              onKeyDown={e => e.key === 'Enter' && handleFind()}
            />
            {error && <p style={{ fontSize: '11px', color: '#E08888', marginTop: '5px' }}>{error}</p>}
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <Btn variant="ghost" onClick={onBack} style={{ flex: 1 }}>← Retour</Btn>
            <Btn onClick={handleFind} loading={loading} style={{ flex: 2 }}>Accéder →</Btn>
          </div>
        </div>
      </Card>
    </div>
  )
}
