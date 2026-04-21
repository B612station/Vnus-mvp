import React, { useState } from 'react'
import { createDuoSpace } from '../lib/supabase.js'
import { VnusLogo, TextInput, PinInput, Btn, Card } from './ui.jsx'

export default function CreateDuo({ onComplete, onBack }) {
  const [step, setStep] = useState(1) // 1=prénom, 2=pin, 3=confirmation+code
  const [name, setName] = useState('')
  const [pin, setPin] = useState('')
  const [pin2, setPin2] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [spaceData, setSpaceData] = useState(null)
  const [copied, setCopied] = useState(false)

  function validateStep1() {
    const e = {}
    if (!name.trim()) e.name = 'Votre prénom est requis'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function validateStep2() {
    const e = {}
    if (pin.length !== 4) e.pin = '4 chiffres requis'
    if (pin2 !== pin) e.pin2 = 'Les codes ne correspondent pas'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleCreate() {
    if (!validateStep2()) return
    setLoading(true)
    try {
      const data = await createDuoSpace({ nameA: name.trim(), pinA: pin })
      setSpaceData(data)
      setStep(3)
    } catch (err) {
      setErrors({ global: 'Erreur lors de la création. Réessayez.' })
    } finally {
      setLoading(false)
    }
  }

  function handleCopy() {
    navigator.clipboard?.writeText(spaceData.invite_code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleDone() {
    localStorage.setItem('vnus_space_id', spaceData.id)
    onComplete({ space: spaceData, side: 'A' })
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
        {/* STEP 1 — Prénom */}
        {step === 1 && (
          <div className="fade-in">
            <p style={{ fontSize: '10px', color: 'var(--sapin-mist)', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '10px' }}>
              Espace Duo · Étape 1/2
            </p>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '26px', color: 'var(--cream)', fontWeight: 400, marginBottom: '8px' }}>
              Comment vous appelez-vous ?
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--ink-muted)', lineHeight: 1.6, marginBottom: '28px' }}>
              Vous créez l'espace. L'autre personne le rejoindra avec le code que vous recevrez.
            </p>
            <div style={{ marginBottom: '28px' }}>
              <TextInput
                value={name}
                onChange={setName}
                label="Votre prénom"
                placeholder="Ex: Marie"
                error={errors.name}
                autoFocus
              />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Btn variant="ghost" onClick={onBack} style={{ flex: 1 }}>← Retour</Btn>
              <Btn onClick={() => validateStep1() && setStep(2)} style={{ flex: 2 }}>Continuer →</Btn>
            </div>
          </div>
        )}

        {/* STEP 2 — PIN */}
        {step === 2 && (
          <div className="fade-in">
            <p style={{ fontSize: '10px', color: 'var(--sapin-mist)', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '10px' }}>
              Espace Duo · Étape 2/2
            </p>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '26px', color: 'var(--cream)', fontWeight: 400, marginBottom: '8px' }}>
              Votre code privé, {name}
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--ink-muted)', lineHeight: 1.6, marginBottom: '28px' }}>
              Ce code est uniquement le vôtre. L'autre personne ne pourra jamais y accéder.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '28px' }}>
              <div>
                <label style={{ fontSize: '10px', color: 'var(--sapin-mist)', letterSpacing: '0.14em', textTransform: 'uppercase', display: 'block', marginBottom: '10px' }}>
                  Choisir un code à 4 chiffres
                </label>
                <PinInput value={pin} onChange={setPin} error={errors.pin} autoFocus />
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
              <Btn onClick={handleCreate} loading={loading} style={{ flex: 2 }}>Créer l'espace →</Btn>
            </div>
          </div>
        )}

        {/* STEP 3 — Code d'invitation */}
        {step === 3 && spaceData && (
          <div className="fade-in">
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <div style={{
                width: 48, height: 48, borderRadius: '50%',
                background: 'var(--sapin-fog)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px',
                fontSize: '22px',
              }}>✓</div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', color: 'var(--cream)', fontWeight: 400, marginBottom: '6px' }}>
                Votre espace est créé, {name} !
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--ink-muted)', lineHeight: 1.6 }}>
                Envoyez ce code à l'autre personne pour qu'elle puisse rejoindre votre espace.
              </p>
            </div>

            {/* Code d'invitation */}
            <div style={{
              background: 'rgba(168,208,160,0.1)',
              border: '1px solid rgba(168,208,160,0.3)',
              borderRadius: 'var(--radius-sm)',
              padding: '20px',
              textAlign: 'center',
              marginBottom: '20px',
            }}>
              <p style={{ fontSize: '10px', color: 'var(--sapin-mist)', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '10px' }}>
                Code d'invitation
              </p>
              <p style={{
                fontFamily: 'var(--font-serif)', fontSize: '28px',
                color: 'var(--cream)', letterSpacing: '0.15em',
                fontWeight: 500, marginBottom: '14px',
              }}>
                {spaceData.invite_code}
              </p>
              <button
                onClick={handleCopy}
                style={{
                  background: copied ? 'rgba(168,208,160,0.2)' : 'rgba(255,255,255,0.1)',
                  border: '0.5px solid rgba(255,255,255,0.2)',
                  borderRadius: 'var(--radius-xs)',
                  padding: '8px 16px',
                  color: 'var(--cream)',
                  fontSize: '11px',
                  fontFamily: 'var(--font-sans)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  letterSpacing: '0.06em',
                }}
              >
                {copied ? '✓ Copié !' : 'Copier le code'}
              </button>
            </div>

            <p style={{ fontSize: '11px', color: 'var(--ink-muted)', lineHeight: 1.6, marginBottom: '24px', textAlign: 'center' }}>
              L'autre personne doit aller sur <strong style={{ color: 'var(--sapin-mist)' }}>le même lien</strong> et choisir "Rejoindre un espace Duo".
            </p>

            <Btn onClick={handleDone} style={{ width: '100%' }}>
              Accéder à mon espace →
            </Btn>
          </div>
        )}
      </Card>
    </div>
  )
}
