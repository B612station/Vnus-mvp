import React, { useState } from 'react'
import { verifyPin } from '../lib/supabase.js'
import { Avatar } from './ui.jsx'

export default function PinScreen({ couple, onSuccess, onBack }) {
  const [selectedSide, setSelectedSide] = useState(null)
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)
  const [loading, setLoading] = useState(false)

  const digits = ['1','2','3','4','5','6','7','8','9','','0','⌫']

  async function handleDigit(d) {
    if (loading) return
    if (pin.length >= 4) return
    const next = pin + d
    setPin(next)
    setError(false)
    if (next.length === 4) {
      setLoading(true)
      try {
        const ok = await verifyPin(couple.id, selectedSide, next)
        if (ok) {
          onSuccess(selectedSide)
        } else {
          setShake(true)
          setError(true)
          setTimeout(() => { setPin(''); setShake(false) }, 600)
        }
      } catch {
        setError(true)
        setTimeout(() => { setPin(''); setShake(false) }, 600)
      } finally {
        setLoading(false)
      }
    }
  }

  function handleDelete() { setPin(p => p.slice(0, -1)); setError(false) }

  const personA = { name: couple.person_a_name, initial: couple.person_a_name[0].toUpperCase(), type: 'A' }
  const personB = { name: couple.person_b_name, initial: couple.person_b_name[0].toUpperCase(), type: 'B' }

  // Sélection de personne
  if (!selectedSide) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--sapin)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px' }}>
        <div style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', color: 'var(--cream)', marginBottom: '4px', letterSpacing: '0.04em' }}>
          V<em style={{ fontStyle: 'italic', color: 'var(--sapin-mist)' }}>·</em>nus
        </div>
        <p style={{ fontSize: '10px', color: 'var(--ink-muted)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '40px' }}>
          session privée
        </p>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '30px', color: 'var(--cream)', fontWeight: 400, marginBottom: '8px', textAlign: 'center' }}>
          Qui êtes-vous ?
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--ink-muted)', marginBottom: '40px', textAlign: 'center', lineHeight: 1.6, maxWidth: '320px' }}>
          Vnus ne partagera que la traduction finale — jamais vos messages bruts.
        </p>
        <div style={{ display: 'flex', gap: '16px' }}>
          {[personA, personB].map((p, i) => {
            const side = i === 0 ? 'A' : 'B'
            const av = side === 'A' ? { bg: '#2A4830', border: '#3A6040', color: '#90C898' } : { bg: '#243040', border: '#344858', color: '#80B0C8' }
            return (
              <button key={side} onClick={() => setSelectedSide(side)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', padding: '28px 36px', background: 'rgba(255,255,255,0.06)', border: '0.5px solid rgba(255,255,255,0.12)', borderRadius: 'var(--radius)', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)' }}
              >
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: av.bg, border: `1.5px solid ${av.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700, color: av.color, fontFamily: 'var(--font-sans)' }}>
                  {p.initial}
                </div>
                <span style={{ fontSize: '15px', color: 'var(--cream)', fontWeight: 500 }}>{p.name}</span>
              </button>
            )
          })}
        </div>
        {onBack && (
          <button onClick={onBack} style={{ marginTop: '32px', fontSize: '12px', color: 'var(--ink-muted)', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.06em' }}>
            ← Changer d'espace
          </button>
        )}
      </div>
    )
  }

  // Saisie PIN
  const currentPerson = selectedSide === 'A' ? personA : personB
  const av = selectedSide === 'A' ? { bg: '#2A4830', border: '#3A6040', color: '#90C898' } : { bg: '#243040', border: '#344858', color: '#80B0C8' }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--sapin)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px', position: 'relative' }}>
      <button onClick={() => { setSelectedSide(null); setPin(''); setError(false) }} style={{ position: 'absolute', top: '24px', left: '32px', color: 'var(--ink-muted)', fontSize: '12px', fontFamily: 'var(--font-sans)', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.06em' }}>
        ← Retour
      </button>
      <div style={{ width: 52, height: 52, borderRadius: '50%', background: av.bg, border: `1.5px solid ${av.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700, color: av.color, fontFamily: 'var(--font-sans)', marginBottom: '14px' }}>
        {currentPerson.initial}
      </div>
      <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '26px', color: 'var(--cream)', fontWeight: 400, marginBottom: '6px' }}>{currentPerson.name}</h2>
      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--ink-muted)', marginBottom: '32px' }}>Entrez votre code PIN</p>

      <div style={{ display: 'flex', gap: '14px', marginBottom: '32px', animation: shake ? 'shake 0.4s ease' : 'none' }}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{ width: 14, height: 14, borderRadius: '50%', background: i < pin.length ? (error ? '#E05555' : av.color) : 'rgba(255,255,255,0.15)', transition: 'background 0.15s', border: `1px solid ${i < pin.length ? 'transparent' : 'rgba(255,255,255,0.2)'}` }} />
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 64px)', gap: '12px' }}>
        {digits.map((d, i) => (
          <button key={i} onClick={() => d === '⌫' ? handleDelete() : d !== '' ? handleDigit(d) : null} disabled={d === '' || loading} style={{ width: 64, height: 64, borderRadius: '50%', background: d === '' ? 'transparent' : 'rgba(255,255,255,0.08)', border: d === '' ? 'none' : '0.5px solid rgba(255,255,255,0.12)', color: 'var(--cream)', fontSize: d === '⌫' ? '18px' : '20px', fontFamily: 'var(--font-sans)', cursor: d === '' ? 'default' : 'pointer', transition: 'all 0.15s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onMouseEnter={e => { if (d !== '') e.currentTarget.style.background = 'rgba(255,255,255,0.16)' }}
            onMouseLeave={e => { if (d !== '') e.currentTarget.style.background = 'rgba(255,255,255,0.08)' }}
          >{d}</button>
        ))}
      </div>
      {error && <p style={{ marginTop: '20px', fontSize: '12px', color: '#E08888', fontFamily: 'var(--font-sans)' }}>Code incorrect — réessayez</p>}
    </div>
  )
}
