import React, { useState } from 'react'
import { sendMessage } from '../ai/provider.js'
import { createSession } from '../lib/supabase.js'
import { Avatar } from './ui.jsx'

const STEPS = ['Vnus écoute', 'Analyse cognitive', 'Traduction', 'Sauvegardé']

export default function Traduction({ couple, activeSide, onBack }) {
  const [activeStep, setActiveStep] = useState(0)
  const [inputText, setInputText] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [translation, setTranslation] = useState(null)
  const [error, setError] = useState(null)
  const [saved, setSaved] = useState(false)

  const isSolo = !couple.person_b_name
  const personA = { name: couple.person_a_name, initial: couple.person_a_name[0].toUpperCase() }
  const personB = couple.person_b_name ? { name: couple.person_b_name, initial: couple.person_b_name[0].toUpperCase() } : null
  const currentPerson = activeSide === 'A' ? personA : personB
  const otherPerson = activeSide === 'A' ? personB : personA
  const otherType = activeSide === 'A' ? 'B' : 'A'

  async function handleTranslate() {
    if (!inputText.trim() || loading) return
    setLoading(true); setError(null); setActiveStep(1); setSaved(false)

    const userMsg = {
      role: 'user',
      content: `${currentPerson.name} dit à ${otherPerson.name} : "${inputText.trim()}"\n\nFais la traduction cognitive complète.`,
    }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)

    try {
      setTimeout(() => setActiveStep(2), 800)
      const response = await sendMessage(newMessages)

      // Sauvegarde en base
      await createSession({
        coupleId: couple.id,
        title: inputText.trim().slice(0, 80),
        personSide: activeSide,
        rawMessage: inputText.trim(),
        translation: response,
        markers: [],
      })

      setActiveStep(3)
      setSaved(true)
      setTranslation(response)
      setMessages(prev => [...prev, { role: 'assistant', content: response }])
    } catch (err) {
      setError(err.message); setActiveStep(0)
    } finally {
      setLoading(false)
    }
  }

  function handleReset() { setInputText(''); setTranslation(null); setActiveStep(0); setError(null); setSaved(false) }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream-soft)' }}>
      {/* Header */}
      <div style={{ background: 'var(--sapin)', padding: '28px 48px 24px', borderBottom: '0.5px solid var(--border-dark)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontSize: '10px', color: 'var(--sapin-mist)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '8px' }}>
                {personA.name} & {personB.name} · Espace privé
              </p>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '26px', color: 'var(--cream)', fontWeight: 400 }}>
                Nouvelle traduction
              </h2>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 'var(--radius-sm)' }}>
                <Avatar letter={currentPerson.initial} type={activeSide} size={22} />
                <span style={{ fontSize: '12px', color: 'var(--cream)', fontFamily: 'var(--font-sans)' }}>{currentPerson.name}</span>
                <span style={{ fontSize: '9px', color: 'var(--sapin-mist)', background: 'rgba(168,208,160,0.15)', padding: '2px 6px', borderRadius: '10px', letterSpacing: '0.06em' }}>privé</span>
              </div>
              <button onClick={onBack} style={{ fontSize: '11px', color: 'var(--ink-muted)', fontFamily: 'var(--font-sans)', background: 'none', border: '0.5px solid var(--border-dark)', padding: '8px 12px', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}>
                ← Accueil
              </button>
            </div>
          </div>

          {/* Steps */}
          <div style={{ display: 'flex', gap: '0', marginTop: '20px' }}>
            {STEPS.map((step, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '7px 16px', background: i === activeStep ? 'rgba(255,255,255,0.12)' : 'transparent', borderRadius: 'var(--radius-xs)', border: i === activeStep ? '0.5px solid rgba(255,255,255,0.2)' : '0.5px solid transparent', transition: 'all 0.3s' }}>
                  <div style={{ width: 18, height: 18, borderRadius: '50%', background: i < activeStep ? 'var(--sapin-mist)' : i === activeStep ? 'var(--cream)' : 'transparent', border: `1px solid ${i <= activeStep ? 'var(--sapin-mist)' : 'var(--border-dark)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 700, color: i <= activeStep ? 'var(--sapin)' : 'var(--border-dark)', transition: 'all 0.3s' }}>
                    {i < activeStep ? '✓' : i + 1}
                  </div>
                  <span style={{ fontSize: '11px', letterSpacing: '0.06em', color: i === activeStep ? 'var(--cream)' : i < activeStep ? 'var(--sapin-mist)' : 'var(--border-dark)', transition: 'color 0.3s' }}>{step}</span>
                </div>
                {i < STEPS.length - 1 && <div style={{ width: '20px', height: '0.5px', background: 'var(--border-dark)' }} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px 48px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Left */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: 'var(--white)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius)', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <Avatar letter={currentPerson.initial} type={activeSide} size={32} />
              <div>
                <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--ink)' }}>{currentPerson.name} parle</div>
                <div style={{ fontSize: '10px', color: 'var(--ink-faint)' }}>session privée · non partagé</div>
              </div>
              {saved && (
                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--sapin-mist)' }} />
                  <span style={{ fontSize: '10px', color: 'var(--sapin-mist)' }}>sauvegardé</span>
                </div>
              )}
            </div>
            <textarea value={inputText} onChange={e => setInputText(e.target.value)} placeholder={`${currentPerson.name} → Racontez ce qui s'est passé, Vnus écoute…`} disabled={loading || !!translation}
              style={{ width: '100%', minHeight: '180px', fontFamily: 'var(--font-serif)', fontSize: '16px', color: 'var(--ink)', lineHeight: 1.7, border: 'none', outline: 'none', resize: 'none', background: 'transparent', opacity: loading || translation ? 0.6 : 1 }}
              onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleTranslate() }}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            {!translation ? (
              <button onClick={handleTranslate} disabled={!inputText.trim() || loading} style={{ flex: 1, background: 'var(--sapin)', color: 'var(--cream)', fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 500, letterSpacing: '0.06em', padding: '12px', borderRadius: 'var(--radius-xs)', border: 'none', cursor: inputText.trim() && !loading ? 'pointer' : 'not-allowed', opacity: !inputText.trim() ? 0.5 : 1, transition: 'all 0.2s' }}>
                {loading ? 'Vnus analyse…' : 'Traduire →'}
              </button>
            ) : (
              <button onClick={handleReset} style={{ flex: 1, background: 'var(--sapin)', color: 'var(--cream)', fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 500, padding: '12px', borderRadius: 'var(--radius-xs)', border: 'none', cursor: 'pointer' }}>
                Nouvelle traduction →
              </button>
            )}
            <button onClick={onBack} style={{ padding: '12px 16px', borderRadius: 'var(--radius-xs)', border: '0.5px solid var(--border)', color: 'var(--ink-faint)', fontSize: '12px', background: 'transparent', cursor: 'pointer' }}>
              Accueil
            </button>
          </div>
          {error && <div style={{ background: '#FFF0F0', border: '0.5px solid #FFCCCC', borderRadius: 'var(--radius-sm)', padding: '12px 16px', fontSize: '12px', color: '#CC4444' }}>{error}</div>}
        </div>

        {/* Right */}
        <div>
          {!translation && !loading && (
            <div style={{ background: 'var(--white)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius)', padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '260px', textAlign: 'center' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--sapin-fog)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <div style={{ width: 16, height: 16, borderRadius: '50%', background: 'var(--sapin-mid)' }} />
              </div>
              <p style={{ fontFamily: 'var(--font-serif)', fontSize: '16px', color: 'var(--ink)', fontStyle: 'italic', marginBottom: '8px' }}>Vnus attend votre message.</p>
              <p style={{ fontSize: '12px', color: 'var(--ink-faint)', lineHeight: 1.6 }}>Écrivez ce que vous ressentez ou voulez dire.<br />Vnus traduira pour {otherPerson.name}.</p>
            </div>
          )}
          {loading && (
            <div style={{ background: 'var(--sapin)', border: '0.5px solid var(--border-dark)', borderRadius: 'var(--radius)', padding: '28px', minHeight: '260px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <p style={{ fontSize: '10px', color: 'var(--sapin-mist)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '16px' }}>Pour {otherPerson.name}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[80,60,90,50].map((w,i) => <div key={i} style={{ height: 10, borderRadius: '5px', background: 'rgba(168,208,160,0.15)', width: `${w}%`, animation: `pulse 1.5s ease ${i*0.15}s infinite` }} />)}
              </div>
            </div>
          )}
          {translation && (
            <div className="fade-in" style={{ background: 'var(--sapin)', border: '0.5px solid var(--border-dark)', borderRadius: 'var(--radius)', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <Avatar letter={otherPerson.initial} type={otherType} size={32} />
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--cream)' }}>Pour {otherPerson.name}</div>
                  <div style={{ fontSize: '10px', color: 'var(--ink-muted)' }}>version partageable</div>
                </div>
                {saved && <div style={{ marginLeft: 'auto', fontSize: '9px', color: 'var(--sapin-mist)', background: 'rgba(168,208,160,0.1)', padding: '3px 8px', borderRadius: '10px', border: '0.5px solid rgba(168,208,160,0.2)' }}>✓ Sauvegardé</div>}
              </div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '15px', color: 'var(--cream)', lineHeight: 1.75, whiteSpace: 'pre-wrap' }}>
                {translation}
              </div>
              <div style={{ marginTop: '20px', padding: '14px', background: 'rgba(168,208,160,0.08)', border: '0.5px solid rgba(168,208,160,0.2)', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '9px', color: 'var(--sapin-mist)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '6px' }}>Mot pour passer la passerelle</div>
                <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '13px', color: 'var(--cream)', lineHeight: 1.6 }}>
                  Cette traduction peut être partagée avec {otherPerson.name} telle quelle.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                <button onClick={() => navigator.clipboard?.writeText(translation)} style={{ flex: 1, background: 'var(--cream)', color: 'var(--sapin)', fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 600, padding: '10px', borderRadius: 'var(--radius-xs)', border: 'none', cursor: 'pointer' }}>
                  Copier pour {otherPerson.name}
                </button>
                <button onClick={handleReset} style={{ padding: '10px 14px', border: '0.5px solid var(--border-dark)', color: 'var(--ink-muted)', fontSize: '11px', background: 'transparent', borderRadius: 'var(--radius-xs)', cursor: 'pointer' }}>
                  Nouvelle
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
