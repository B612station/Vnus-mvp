import React, { useState } from 'react'
import { verifyPin } from '../lib/supabase.js'
import { VnusLogo, PinInput, Btn, Avatar, Card } from './ui.jsx'

export default function PinScreen({ space, onSuccess, onChangeSpace }) {
  const isDuo = space.mode === 'duo'
  const isPending = space.status === 'pending'

  // En mode duo, on propose de choisir qui se connecte
  const [selectedSide, setSelectedSide] = useState(isDuo ? null : 'A')
  const [pin, setPin] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [shake, setShake] = useState(false)

  async function handleLogin() {
    if (pin.length !== 4) return
    setLoading(true)
    setError(null)
    try {
      const ok = await verifyPin(space.id, selectedSide, pin)
      if (ok) {
        onSuccess(selectedSide)
      } else {
        setError('Code incorrect. Réessayez.')
        setPin('')
        setShake(true)
        setTimeout(() => setShake(false), 600)
      }
    } catch (err) {
      setError('Erreur de connexion.')
    } finally {
      setLoading(false)
    }
  }

  const personA = space.person_a_name
  const personB = space.person_b_name

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
        {/* Duo en attente de B */}
        {isDuo && isPending && (
          <div className="fade-in" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '16px' }}>⏳</div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', color: 'var(--cream)', fontWeight: 400, marginBottom: '12px' }}>
              En attente de l'autre personne
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--ink-muted)', lineHeight: 1.6, marginBottom: '20px' }}>
              L'espace est créé, mais la deuxième personne n'a pas encore rejoint.
            </p>
            <div style={{
              background: 'rgba(168,208,160,0.1)',
              border: '1px solid rgba(168,208,160,0.3)',
              borderRadius: 'var(--radius-sm)',
              padding: '16px',
              marginBottom: '24px',
            }}>
              <p style={{ fontSize: '10px', color: 'var(--sapin-mist)', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '8px' }}>
                Code à envoyer
              </p>
              <p style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', color: 'var(--cream)', letterSpacing: '0.15em' }}>
                {space.invite_code}
              </p>
            </div>
            <Btn
              variant="ghost"
              onClick={() => window.location.reload()}
              style={{ width: '100%', marginBottom: '12px' }}
            >
              Actualiser
            </Btn>
            <button
              onClick={onChangeSpace}
              style={{ background: 'none', border: 'none', color: 'var(--ink-muted)', fontSize: '11px', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: '3px' }}
            >
              Changer d'espace
            </button>
          </div>
        )}

        {/* Sélection Duo (A ou B) */}
        {isDuo && !isPending && !selectedSide && (
          <div className="fade-in">
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '26px', color: 'var(--cream)', fontWeight: 400, marginBottom: '8px' }}>
              Qui êtes-vous ?
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--ink-muted)', lineHeight: 1.6, marginBottom: '28px' }}>
              Espace de <strong style={{ color: 'var(--cream)' }}>{personA}</strong> & <strong style={{ color: 'var(--cream)' }}>{personB}</strong>
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
              {[
                { side: 'A', name: personA },
                { side: 'B', name: personB },
              ].map(({ side, name }) => (
                <button
                  key={side}
                  onClick={() => setSelectedSide(side)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '14px',
                    background: 'rgba(255,255,255,0.07)',
                    border: '0.5px solid rgba(255,255,255,0.15)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '16px 20px', cursor: 'pointer',
                    transition: 'background 0.2s',
                    textAlign: 'left',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
                >
                  <Avatar letter={name[0].toUpperCase()} type={side} size={36} />
                  <div>
                    <div style={{ fontSize: '15px', color: 'var(--cream)', fontFamily: 'var(--font-serif)' }}>{name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--ink-muted)', marginTop: '2px' }}>Entrer avec mon code privé</div>
                  </div>
                  <div style={{ marginLeft: 'auto', color: 'var(--ink-muted)', fontSize: '16px' }}>→</div>
                </button>
              ))}
            </div>
            <button
              onClick={onChangeSpace}
              style={{ background: 'none', border: 'none', color: 'var(--ink-muted)', fontSize: '11px', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: '3px', display: 'block', margin: '0 auto' }}
            >
              Changer d'espace
            </button>
          </div>
        )}

        {/* Saisie PIN */}
        {selectedSide && (!isDuo || !isPending) && (
          <div className="fade-in">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <Avatar
                letter={isDuo
                  ? (selectedSide === 'A' ? personA[0] : personB[0]).toUpperCase()
                  : personA[0].toUpperCase()
                }
                type={isDuo ? selectedSide : 'solo'}
                size={40}
              />
              <div>
                <div style={{ fontSize: '16px', fontFamily: 'var(--font-serif)', color: 'var(--cream)' }}>
                  {isDuo ? (selectedSide === 'A' ? personA : personB) : personA}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--ink-muted)', marginTop: '2px' }}>
                  {isDuo ? 'Espace Duo' : 'Espace Solo'}
                </div>
              </div>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--ink-muted)', marginBottom: '20px' }}>
              Entrez votre code à 4 chiffres
            </p>

            <div
              style={{ marginBottom: '24px', animation: shake ? 'shake 0.4s ease' : 'none' }}
            >
              <PinInput
                value={pin}
                onChange={v => { setPin(v); setError(null) }}
                error={error}
                autoFocus
              />
            </div>

            <Btn
              onClick={handleLogin}
              loading={loading}
              style={{ width: '100%', marginBottom: '16px' }}
              disabled={pin.length !== 4}
            >
              Entrer →
            </Btn>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
              {isDuo && (
                <button
                  onClick={() => { setSelectedSide(null); setPin(''); setError(null) }}
                  style={{ background: 'none', border: 'none', color: 'var(--ink-muted)', fontSize: '11px', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: '3px' }}
                >
                  ← Changer de personne
                </button>
              )}
              <button
                onClick={onChangeSpace}
                style={{ background: 'none', border: 'none', color: 'var(--ink-muted)', fontSize: '11px', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: '3px' }}
              >
                Changer d'espace
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
