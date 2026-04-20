import React, { useState, useEffect } from 'react'
import { createEspace, joinEspace, getCoupleById } from '../lib/supabase.js'
import { Spinner } from './ui.jsx'

function PinInput({ value, onChange, placeholder, error }) {
  const [focused, setFocused] = useState(false)
  return (
    <div>
      <input
        type="password"
        inputMode="numeric"
        maxLength={4}
        value={value}
        onChange={e => onChange(e.target.value.replace(/\D/g, '').slice(0, 4))}
        placeholder={placeholder || 'Code à 4 chiffres'}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%', padding: '12px 16px',
          background: 'rgba(255,255,255,0.08)',
          border: `1px solid ${error ? '#E05555' : focused ? 'rgba(168,208,160,0.5)' : 'rgba(255,255,255,0.15)'}`,
          borderRadius: 'var(--radius-sm)',
          color: 'var(--cream)', fontSize: '16px',
          letterSpacing: '0.3em', outline: 'none',
          transition: 'border-color 0.2s',
          fontFamily: 'var(--font-sans)',
        }}
      />
      {error && <p style={{ fontSize: '11px', color: '#E08888', marginTop: '4px' }}>{error}</p>}
    </div>
  )
}

function TextInput({ value, onChange, placeholder, label, error }) {
  const [focused, setFocused] = useState(false)
  return (
    <div>
      {label && <label style={{ fontSize: '11px', color: 'var(--sapin-mist)', letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>{label}</label>}
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%', padding: '12px 16px',
          background: 'rgba(255,255,255,0.08)',
          border: `1px solid ${error ? '#E05555' : focused ? 'rgba(168,208,160,0.5)' : 'rgba(255,255,255,0.15)'}`,
          borderRadius: 'var(--radius-sm)',
          color: 'var(--cream)', fontSize: '15px', outline: 'none',
          transition: 'border-color 0.2s',
          fontFamily: 'var(--font-serif)',
        }}
      />
      {error && <p style={{ fontSize: '11px', color: '#E08888', marginTop: '4px' }}>{error}</p>}
    </div>
  )
}

function ModeCard({ icon, title, desc, selected, onClick }) {
  return (
    <button onClick={onClick} style={{
      flex: 1, padding: '20px 16px', textAlign: 'left',
      background: selected ? 'rgba(168,208,160,0.12)' : 'rgba(255,255,255,0.05)',
      border: `1px solid ${selected ? 'rgba(168,208,160,0.4)' : 'rgba(255,255,255,0.1)'}`,
      borderRadius: 'var(--radius-sm)', cursor: 'pointer',
      transition: 'all 0.2s',
    }}>
      <div style={{ fontSize: '24px', marginBottom: '10px' }}>{icon}</div>
      <div style={{ fontSize: '14px', fontWeight: 600, color: selected ? 'var(--sapin-mist)' : 'var(--cream)', marginBottom: '6px', fontFamily: 'var(--font-sans)' }}>{title}</div>
      <div style={{ fontSize: '11px', color: 'var(--ink-muted)', lineHeight: 1.5 }}>{desc}</div>
    </button>
  )
}

// ── Onboarding Personne A (créateur) ──────────────────────
function OnboardingCreator({ onComplete }) {
  const [mode, setMode] = useState(null)
  const [name, setName] = useState('')
  const [pin, setPin] = useState('')
  const [pin2, setPin2] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState('mode') // mode | infos | done

  function validateInfos() {
    const e = {}
    if (!name.trim()) e.name = 'Obligatoire'
    if (pin.length !== 4) e.pin = '4 chiffres requis'
    if (pin !== pin2) e.pin2 = 'Les codes ne correspondent pas'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleCreate() {
    if (!validateInfos()) return
    setLoading(true)
    try {
      const espace = await createEspace({ personAName: name.trim(), personAPin: pin, mode })
      onComplete(espace, mode)
    } catch {
      setErrors({ global: 'Erreur lors de la création. Réessayez.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--sapin)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 24px' }}>
      <div style={{ marginBottom: '36px', textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', color: 'var(--cream)', letterSpacing: '0.04em' }}>
          V<em style={{ fontStyle: 'italic', color: 'var(--sapin-mist)' }}>·</em>nus
        </div>
        <div style={{ fontSize: '10px', color: 'var(--ink-muted)', letterSpacing: '0.18em', textTransform: 'uppercase', marginTop: '4px' }}>
          Traducteur cognitif
        </div>
      </div>

      <div style={{ background: 'rgba(255,255,255,0.05)', border: '0.5px solid rgba(255,255,255,0.12)', borderRadius: 'var(--radius)', padding: '36px', width: '100%', maxWidth: '460px' }}>

        {step === 'mode' && (
          <div className="fade-in">
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '26px', color: 'var(--cream)', fontWeight: 400, marginBottom: '6px' }}>
              Comment voulez-vous utiliser Vnus ?
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--ink-muted)', marginBottom: '24px', lineHeight: 1.6 }}>
              Choisissez le mode qui correspond à votre situation.
            </p>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '28px' }}>
              <ModeCard
                icon="💑"
                title="Duo"
                desc="Deux personnes — couple, amis, famille, collègues — qui veulent mieux se comprendre."
                selected={mode === 'duo'}
                onClick={() => setMode('duo')}
              />
              <ModeCard
                icon="🪞"
                title="Solo"
                desc="Une seule personne qui veut mieux se connaître et comprendre ses propres patterns de communication."
                selected={mode === 'solo'}
                onClick={() => setMode('solo')}
              />
            </div>
            <button
              onClick={() => mode && setStep('infos')}
              style={{ width: '100%', background: mode ? 'var(--cream)' : 'rgba(255,255,255,0.1)', color: mode ? 'var(--sapin)' : 'var(--ink-muted)', fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 600, padding: '14px', borderRadius: 'var(--radius-xs)', border: 'none', cursor: mode ? 'pointer' : 'not-allowed', transition: 'all 0.2s' }}
            >
              Continuer →
            </button>
          </div>
        )}

        {step === 'infos' && (
          <div className="fade-in">
            <button onClick={() => setStep('mode')} style={{ fontSize: '11px', color: 'var(--ink-muted)', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '20px', letterSpacing: '0.06em' }}>← Retour</button>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '26px', color: 'var(--cream)', fontWeight: 400, marginBottom: '6px' }}>
              {mode === 'solo' ? 'Votre espace personnel' : 'Créez votre espace'}
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--ink-muted)', marginBottom: '24px', lineHeight: 1.6 }}>
              {mode === 'solo'
                ? 'Votre prénom et votre code PIN — uniquement pour vous.'
                : "Commencez par votre prénom et votre code PIN. Vous enverrez ensuite un lien à l'autre personne pour qu'elle crée le sien."}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
              <TextInput value={name} onChange={setName} label="Votre prénom" placeholder="Ex: Marie" error={errors.name} />
              <div>
                <label style={{ fontSize: '11px', color: 'var(--sapin-mist)', letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                  Votre code PIN (4 chiffres)
                </label>
                <PinInput value={pin} onChange={setPin} error={errors.pin} />
              </div>
              <div>
                <label style={{ fontSize: '11px', color: 'var(--sapin-mist)', letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                  Confirmer le code
                </label>
                <PinInput value={pin2} onChange={setPin2} placeholder="Répétez le code" error={errors.pin2} />
              </div>
            </div>
            {errors.global && <p style={{ fontSize: '12px', color: '#E08888', marginBottom: '12px' }}>{errors.global}</p>}
            <button onClick={handleCreate} disabled={loading} style={{ width: '100%', background: 'var(--cream)', color: 'var(--sapin)', fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 600, padding: '14px', borderRadius: 'var(--radius-xs)', border: 'none', cursor: loading ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              {loading ? <Spinner /> : mode === 'solo' ? 'Créer mon espace →' : 'Créer et inviter →'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Écran de partage du lien (après création) ──────────────
function ShareScreen({ espace, mode, onContinue }) {
  const [copied, setCopied] = useState(false)
  const joinUrl = `${window.location.origin}?join=${espace.id}`

  function copyLink() {
    navigator.clipboard?.writeText(joinUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (mode === 'solo') {
    onContinue()
    return null
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--sapin)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 24px' }}>
      <div style={{ background: 'rgba(255,255,255,0.05)', border: '0.5px solid rgba(255,255,255,0.12)', borderRadius: 'var(--radius)', padding: '36px', width: '100%', maxWidth: '460px', textAlign: 'center' }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(168,208,160,0.15)', border: '1px solid rgba(168,208,160,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '24px' }}>
          ✓
        </div>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '26px', color: 'var(--cream)', fontWeight: 400, marginBottom: '8px' }}>
          Votre espace est créé.
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--ink-muted)', lineHeight: 1.6, marginBottom: '28px' }}>
          Envoyez ce lien à l'autre personne pour qu'elle rejoigne votre espace et crée son propre code PIN.
        </p>

        <div style={{ background: 'rgba(255,255,255,0.08)', border: '0.5px solid rgba(255,255,255,0.15)', borderRadius: 'var(--radius-sm)', padding: '12px 16px', marginBottom: '16px', wordBreak: 'break-all', textAlign: 'left' }}>
          <p style={{ fontSize: '11px', color: 'var(--sapin-mist)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px' }}>Lien d'invitation</p>
          <p style={{ fontSize: '12px', color: 'var(--cream)', fontFamily: 'var(--font-mono, monospace)', lineHeight: 1.5 }}>{joinUrl}</p>
        </div>

        <button onClick={copyLink} style={{ width: '100%', background: copied ? 'rgba(168,208,160,0.2)' : 'var(--cream)', color: copied ? 'var(--sapin-mist)' : 'var(--sapin)', fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 600, padding: '14px', borderRadius: 'var(--radius-xs)', border: 'none', cursor: 'pointer', marginBottom: '12px', transition: 'all 0.2s' }}>
          {copied ? '✓ Lien copié !' : 'Copier le lien'}
        </button>

        <button onClick={onContinue} style={{ width: '100%', background: 'transparent', border: '0.5px solid var(--border-dark)', color: 'var(--ink-muted)', fontFamily: 'var(--font-sans)', fontSize: '13px', padding: '14px', borderRadius: 'var(--radius-xs)', cursor: 'pointer' }}>
          Continuer vers mon espace →
        </button>

        <p style={{ fontSize: '11px', color: 'var(--ink-faint)', marginTop: '16px', lineHeight: 1.5 }}>
          L'autre personne créera son propre code PIN en toute confidentialité.
        </p>
      </div>
    </div>
  )
}

// ── Onboarding Personne B (rejoindre via lien) ─────────────
function OnboardingJoiner({ espaceId, onComplete }) {
  const [espace, setEspace] = useState(null)
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [pin, setPin] = useState('')
  const [pin2, setPin2] = useState('')
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    getCoupleById(espaceId)
      .then(e => {
        if (e.status === 'active' && e.person_b_pin) {
          // Déjà rejoint — rediriger vers login
          onComplete(e, 'already_joined')
        } else {
          setEspace(e)
        }
      })
      .catch(() => setErrors({ global: 'Lien invalide ou expiré.' }))
      .finally(() => setLoading(false))
  }, [espaceId])

  function validate() {
    const e = {}
    if (!name.trim()) e.name = 'Obligatoire'
    if (pin.length !== 4) e.pin = '4 chiffres requis'
    if (pin !== pin2) e.pin2 = 'Les codes ne correspondent pas'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleJoin() {
    if (!validate()) return
    setSaving(true)
    try {
      const updated = await joinEspace({ espaceId, personBName: name.trim(), personBPin: pin })
      onComplete(updated, 'joined')
    } catch {
      setErrors({ global: 'Erreur. Réessayez.' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'var(--sapin)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', color: 'var(--cream)', opacity: 0.5 }}>Chargement…</div>
    </div>
  )

  if (errors.global && !espace) return (
    <div style={{ minHeight: '100vh', background: 'var(--sapin)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px' }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ color: '#E08888', fontSize: '14px', marginBottom: '16px' }}>{errors.global}</p>
        <button onClick={() => window.location.href = '/'} style={{ color: 'var(--ink-muted)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px' }}>
          Créer un nouvel espace →
        </button>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'var(--sapin)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 24px' }}>
      <div style={{ marginBottom: '36px', textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', color: 'var(--cream)', letterSpacing: '0.04em' }}>
          V<em style={{ fontStyle: 'italic', color: 'var(--sapin-mist)' }}>·</em>nus
        </div>
        <div style={{ fontSize: '10px', color: 'var(--ink-muted)', letterSpacing: '0.18em', textTransform: 'uppercase', marginTop: '4px' }}>
          Traducteur cognitif
        </div>
      </div>

      <div style={{ background: 'rgba(255,255,255,0.05)', border: '0.5px solid rgba(255,255,255,0.12)', borderRadius: 'var(--radius)', padding: '36px', width: '100%', maxWidth: '460px' }}>
        <div style={{ fontSize: '11px', color: 'var(--sapin-mist)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '16px' }}>
          Invitation de {espace?.person_a_name}
        </div>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '26px', color: 'var(--cream)', fontWeight: 400, marginBottom: '8px' }}>
          Rejoignez l'espace de {espace?.person_a_name}
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--ink-muted)', marginBottom: '24px', lineHeight: 1.6 }}>
          Créez votre propre code PIN — {espace?.person_a_name} ne pourra jamais y accéder.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
          <TextInput value={name} onChange={setName} label="Votre prénom" placeholder="Ex: Thomas" error={errors.name} />
          <div>
            <label style={{ fontSize: '11px', color: 'var(--sapin-mist)', letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
              Votre code PIN (4 chiffres)
            </label>
            <PinInput value={pin} onChange={setPin} error={errors.pin} />
          </div>
          <div>
            <label style={{ fontSize: '11px', color: 'var(--sapin-mist)', letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
              Confirmer le code
            </label>
            <PinInput value={pin2} onChange={setPin2} placeholder="Répétez le code" error={errors.pin2} />
          </div>
        </div>

        {errors.global && <p style={{ fontSize: '12px', color: '#E08888', marginBottom: '12px' }}>{errors.global}</p>}

        <button onClick={handleJoin} disabled={saving} style={{ width: '100%', background: 'var(--cream)', color: 'var(--sapin)', fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 600, padding: '14px', borderRadius: 'var(--radius-xs)', border: 'none', cursor: saving ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          {saving ? <Spinner /> : 'Rejoindre l\'espace →'}
        </button>
      </div>
    </div>
  )
}

// ── Export principal ───────────────────────────────────────
export default function Onboarding({ joinId, onComplete }) {
  const [phase, setPhase] = useState(joinId ? 'join' : 'create')
  const [espace, setEspace] = useState(null)
  const [mode, setMode] = useState(null)

  if (phase === 'join') {
    return <OnboardingJoiner espaceId={joinId} onComplete={(e, status) => {
      if (status === 'already_joined') {
        onComplete(e, 'pin')
      } else {
        onComplete(e, 'pin')
      }
    }} />
  }

  if (phase === 'share') {
    return <ShareScreen espace={espace} mode={mode} onContinue={() => onComplete(espace, 'pin')} />
  }

  return (
    <OnboardingCreator onComplete={(e, m) => {
      setEspace(e)
      setMode(m)
      if (m === 'solo') {
        onComplete(e, 'pin')
      } else {
        setPhase('share')
      }
    }} />
  )
}
