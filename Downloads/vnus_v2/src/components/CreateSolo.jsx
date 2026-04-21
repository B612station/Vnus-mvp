import React, { useState } from 'react'
import { createSoloSpace } from '../lib/supabase.js'
import { VnusLogo, TextInput, PinInput, Btn, Card } from './ui.jsx'

export default function CreateSolo({ onComplete, onBack }) {
  const [step, setStep] = useState(1)
  const [name, setName] = useState('')
  const [pin, setPin] = useState('')
  const [pin2, setPin2] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

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
      const data = await createSoloSpace({ name: name.trim(), pin })
      localStorage.setItem('vnus_space_id', data.id)
      onComplete({ space: data, side: 'A' })
    } catch (err) {
      setErrors({ global: 'Erreur lors de la création. Réessayez.' })
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
        {step === 1 && (
          <div className="fade-in">
            <p style={{ fontSize: '10px', color: 'var(--sapin-mist)', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '10px' }}>
              Espace Solo · Étape 1/2
            </p>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '26px', color: 'var(--cream)', fontWeight: 400, marginBottom: '8px' }}>
              Comment vous appelez-vous ?
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--ink-muted)', lineHeight: 1.6, marginBottom: '28px' }}>
              Vnus vous accompagnera dans la compréhension de vos propres patterns de communication, sans jugement.
            </p>

            {/* Ce que Vnus fera */}
            <div style={{
              background: 'rgba(168,208,160,0.06)',
              border: '0.5px solid rgba(168,208,160,0.2)',
              borderRadius: 'var(--radius-sm)',
              padding: '16px',
              marginBottom: '24px',
            }}>
              {[
                'Identifier vos besoins non exprimés',
                'Comprendre vos réactions émotionnelles',
                'Apprendre à vous exprimer différemment',
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: i < 2 ? '10px' : 0 }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--sapin-mist)', flexShrink: 0 }} />
                  <span style={{ fontSize: '12px', color: 'var(--ink-muted)', lineHeight: 1.5 }}>{item}</span>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: '28px' }}>
              <TextInput
                value={name}
                onChange={setName}
                label="Votre prénom"
                placeholder="Ex: Sarah"
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

        {step === 2 && (
          <div className="fade-in">
            <p style={{ fontSize: '10px', color: 'var(--sapin-mist)', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '10px' }}>
              Espace Solo · Étape 2/2
            </p>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '26px', color: 'var(--cream)', fontWeight: 400, marginBottom: '8px' }}>
              Votre code privé, {name}
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--ink-muted)', lineHeight: 1.6, marginBottom: '28px' }}>
              Personne d'autre n'y aura accès. C'est votre espace.
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
              <Btn onClick={handleCreate} loading={loading} style={{ flex: 2 }}>Créer mon espace →</Btn>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
