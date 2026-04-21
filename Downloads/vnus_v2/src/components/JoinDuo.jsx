import React, { useState } from 'react'
import { joinDuoSpace } from '../lib/supabase.js'
import { VnusLogo, TextInput, PinInput, Btn, Card } from './ui.jsx'

export default function JoinDuo({ onComplete, onBack }) {
  const [step, setStep] = useState(1) // 1=code, 2=prénom+pin
  const [inviteCode, setInviteCode] = useState('')
  const [name, setName] = useState('')
  const [pin, setPin] = useState('')
  const [pin2, setPin2] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  function validateStep1() {
    const e = {}
    if (!inviteCode.trim()) e.code = 'Entrez le code d\'invitation'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function validateStep2() {
    const e = {}
    if (!name.trim()) e.name = 'Votre prénom est requis'
    if (pin.length !== 4) e.pin = '4 chiffres requis'
    if (pin2 !== pin) e.pin2 = 'Les codes ne correspondent pas'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleJoin() {
    if (!validateStep2()) return
    setLoading(true)
    try {
      const data = await joinDuoSpace({
        inviteCode: inviteCode.trim(),
        nameB: name.trim(),
        pinB: pin,
      })
      localStorage.setItem('vnus_space_id', data.id)
      onComplete({ space: data, side: 'B' })
    } catch (err) {
      setErrors({ global: err.message || 'Erreur. Vérifiez le code.' })
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
        {/* STEP 1 — Code invitation */}
        {step === 1 && (
          <div className="fade-in">
            <p style={{ fontSize: '10px', color: 'var(--sapin-mist)', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '10px' }}>
              Rejoindre un espace Duo
            </p>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '26px', color: 'var(--cream)', fontWeight: 400, marginBottom: '8px' }}>
              Entrez votre code d'invitation
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--ink-muted)', lineHeight: 1.6, marginBottom: '28px' }}>
              L'autre personne vous a envoyé un code au format <strong style={{ color: 'var(--cream)', fontFamily: 'var(--font-serif)' }}>VNUS-XXXX</strong>. Entrez-le ici.
            </p>
            <div style={{ marginBottom: '28px' }}>
              <label style={{ fontSize: '10px', color: 'var(--sapin-mist)', letterSpacing: '0.14em', textTransform: 'uppercase', display: 'block', marginBottom: '10px' }}>
                Code d'invitation
              </label>
              <input
                type="text"
                value={inviteCode}
                onChange={e => setInviteCode(e.target.value.toUpperCase())}
                placeholder="VNUS-XXXX"
                autoFocus
                maxLength={9}
                style={{
                  width: '100%', padding: '14px 16px',
                  background: 'rgba(255,255,255,0.08)',
                  border: `1px solid ${errors.code ? '#E05555' : 'rgba(255,255,255,0.15)'}`,
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--cream)', fontSize: '20px',
                  letterSpacing: '0.2em', outline: 'none',
                  fontFamily: 'var(--font-sans)',
                  textAlign: 'center',
                  textTransform: 'uppercase',
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(168,208,160,0.5)'}
                onBlur={e => e.target.style.borderColor = errors.code ? '#E05555' : 'rgba(255,255,255,0.15)'}
                onKeyDown={e => e.key === 'Enter' && validateStep1() && setStep(2)}
              />
              {errors.code && <p style={{ fontSize: '11px', color: '#E08888', marginTop: '5px' }}>{errors.code}</p>}
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Btn variant="ghost" onClick={onBack} style={{ flex: 1 }}>← Retour</Btn>
              <Btn onClick={() => validateStep1() && setStep(2)} style={{ flex: 2 }}>Continuer →</Btn>
            </div>
          </div>
        )}

        {/* STEP 2 — Prénom + PIN */}
        {step === 2 && (
          <div className="fade-in">
            <p style={{ fontSize: '10px', color: 'var(--sapin-mist)', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '10px' }}>
              Votre profil
            </p>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '26px', color: 'var(--cream)', fontWeight: 400, marginBottom: '8px' }}>
              Créez votre accès
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--ink-muted)', lineHeight: 1.6, marginBottom: '28px' }}>
              Code <strong style={{ color: 'var(--sapin-mist)' }}>{inviteCode}</strong> · Votre profil est entièrement privé.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '28px' }}>
              <TextInput
                value={name}
                onChange={setName}
                label="Votre prénom"
                placeholder="Ex: Thomas"
                error={errors.name}
                autoFocus
              />
              <div>
                <label style={{ fontSize: '10px', color: 'var(--sapin-mist)', letterSpacing: '0.14em', textTransform: 'uppercase', display: 'block', marginBottom: '10px' }}>
                  Votre code privé à 4 chiffres
                </label>
                <PinInput value={pin} onChange={setPin} error={errors.pin} />
              </div>
              <div>
                <label style={{ fontSize: '10px', color: 'var(--sapin-mist)', letterSpacing: '0.14em', textTransform: 'uppercase', display: 'block', marginBottom: '10px' }}>
                  Confirmer le code
                </label>
                <PinInput value={pin2} onChange={setPin2} placeholder="••••" error={errors.pin2} />
              </div>
            </div>
            {errors.global && <p style={{ fontSize: '12px', color: '#E08888', marginBottom: '12px' }}>{errors.global}</p>}
            <div style={{ display: 'flex', gap: '10px' }}>
              <Btn variant="ghost" onClick={() => setStep(1)} style={{ flex: 1 }}>← Retour</Btn>
              <Btn onClick={handleJoin} loading={loading} style={{ flex: 2 }}>Rejoindre →</Btn>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
