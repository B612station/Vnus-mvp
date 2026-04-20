import React, { useEffect, useState } from 'react'
import { getSessionsByCouple } from '../lib/supabase.js'
import { Avatar, formatDate } from './ui.jsx'

export default function Dashboard({ couple, activeSide, onNavigate, onLogout }) {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)

  const isSolo = couple.mode === 'solo' || !couple.person_b_name
  const personA = { name: couple.person_a_name, initial: couple.person_a_name[0].toUpperCase() }
  const personB = couple.person_b_name ? { name: couple.person_b_name, initial: couple.person_b_name[0].toUpperCase() } : null
  const currentPerson = activeSide === 'A' ? personA : (personB || personA)

  useEffect(() => {
    getSessionsByCouple(couple.id)
      .then(setSessions)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [couple.id])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream-soft)' }}>

      {/* Hero */}
      <div style={{ background: 'var(--sapin)', padding: '36px 48px 48px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: '-40px', top: '-40px', width: '280px', height: '280px', borderRadius: '50%', border: '0.5px solid rgba(255,255,255,0.06)' }} />
        <div style={{ position: 'absolute', right: '60px', top: '30px', width: '160px', height: '160px', borderRadius: '50%', border: '0.5px solid rgba(255,255,255,0.05)' }} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '32px', position: 'relative', alignItems: 'start' }}>
          <div>
            <p className="fade-up" style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: 'var(--sapin-mist)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '16px' }}>
              {personA.name} & {personB.name} · Espace privé
            </p>
            <h1 className="fade-up delay-1" style={{ fontFamily: 'var(--font-serif)', fontSize: '48px', color: 'var(--cream)', lineHeight: 1.1, fontWeight: 400, marginBottom: '8px' }}>
              Vous ne vous comprenez pas<br />toujours vous-même.
            </h1>
            <h1 className="fade-up delay-2" style={{ fontFamily: 'var(--font-serif)', fontSize: '48px', color: 'var(--sapin-mist)', lineHeight: 1.1, fontWeight: 400, fontStyle: 'italic', marginBottom: '24px' }}>
              Pourtant vous parlez.
            </h1>
            <p className="fade-up delay-3" style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--ink-muted)', lineHeight: 1.7, marginBottom: '32px', maxWidth: '400px' }}>
              Vnus écoute chacun séparément, apprend votre fonctionnement, et traduit ce que l'autre ne reçoit pas.
            </p>
            <div className="fade-up delay-4" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <button onClick={() => onNavigate('traduction')} style={{ background: 'var(--cream)', color: 'var(--sapin)', fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', padding: '12px 24px', borderRadius: 'var(--radius-xs)', border: 'none', cursor: 'pointer' }}>
                Nouvelle traduction
              </button>
              <button onClick={onLogout} style={{ background: 'transparent', border: '0.5px solid var(--border-dark)', color: 'var(--ink-muted)', fontFamily: 'var(--font-sans)', fontSize: '12px', padding: '12px 20px', borderRadius: 'var(--radius-xs)', cursor: 'pointer' }}>
                Changer d'espace
              </button>
            </div>
          </div>

          {/* Panneau droit */}
          <div className="fade-up delay-3" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ background: 'rgba(255,255,255,0.06)', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius)', padding: '18px' }}>
              <p style={{ fontSize: '9px', color: 'var(--sapin-mist)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '14px' }}>État du lien</p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div style={{ textAlign: 'center' }}>
                  <Avatar letter={personA.initial} type="A" size={36} />
                  <div style={{ fontSize: '11px', color: 'var(--cream)', marginTop: '6px', fontWeight: 500 }}>{personA.name}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <div style={{ width: '24px', height: '0.5px', background: 'var(--sapin-mist)' }} />
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--sapin-mist)', animation: 'pulse 2s infinite' }} />
                  <div style={{ width: '24px', height: '0.5px', background: 'var(--sapin-mist)' }} />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <Avatar letter={personB.initial} type="B" size={36} />
                  <div style={{ fontSize: '11px', color: 'var(--cream)', marginTop: '6px', fontWeight: 500 }}>{personB.name}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '16px', borderTop: '0.5px solid rgba(255,255,255,0.08)', paddingTop: '12px' }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', color: 'var(--cream)', lineHeight: 1 }}>
                    {sessions.length}<span style={{ fontSize: '12px', color: 'var(--sapin-mist)' }}></span>
                  </div>
                  <div style={{ fontSize: '9px', color: 'var(--ink-muted)', marginTop: '2px' }}>Traductions</div>
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', color: 'var(--cream)', lineHeight: 1 }}>
                    {sessions.filter(s => s.person_side === activeSide).length}
                  </div>
                  <div style={{ fontSize: '9px', color: 'var(--ink-muted)', marginTop: '2px' }}>Vos sessions</div>
                </div>
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.06)', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius)', padding: '18px' }}>
              <p style={{ fontSize: '9px', color: 'var(--sapin-mist)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '10px' }}>Connecté en tant que</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Avatar letter={currentPerson.initial} type={activeSide} size={28} />
                <div>
                  <div style={{ fontSize: '13px', color: 'var(--cream)', fontWeight: 500 }}>{currentPerson.name}</div>
                  <div style={{ fontSize: '10px', color: 'var(--ink-muted)' }}>Session privée active</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats band */}
      <div style={{ background: 'var(--white)', borderBottom: '0.5px solid var(--border)', display: 'flex', padding: '0 48px' }}>
        {[
          { n: sessions.length.toString(), unit: '', label: 'Traductions totales' },
          { n: sessions.filter(s => s.person_side === 'A').length.toString(), unit: '', label: `Sessions de ${personA.name}` },
          { n: sessions.filter(s => s.person_side === 'B').length.toString(), unit: '', label: `Sessions de ${personB.name}` },
        ].map((s, i) => (
          <div key={i} style={{ padding: '20px 48px 20px 0', borderRight: i < 2 ? '0.5px solid var(--border)' : 'none', marginRight: i < 2 ? '48px' : 0 }}>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', color: 'var(--ink)', lineHeight: 1 }}>
              {s.n}<span style={{ fontSize: '16px', color: 'var(--sapin-mid)' }}>{s.unit}</span>
            </div>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: 'var(--ink-faint)', marginTop: '4px', letterSpacing: '0.04em' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Sessions */}
      <div style={{ padding: '48px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', color: 'var(--ink)', fontWeight: 400, display: 'inline' }}>
            Tout ce qui a été <em style={{ fontStyle: 'italic', color: 'var(--sapin-mid)' }}>traduit.</em>
          </h2>
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--ink-faint)', fontSize: '13px' }}>Chargement…</div>
        )}

        {!loading && sessions.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px', background: 'var(--white)', borderRadius: 'var(--radius)', border: '0.5px solid var(--border)' }}>
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', color: 'var(--ink)', fontStyle: 'italic', marginBottom: '8px' }}>Aucune traduction pour l'instant.</p>
            <p style={{ fontSize: '13px', color: 'var(--ink-faint)', marginBottom: '20px' }}>Commencez votre première session pour voir l'historique ici.</p>
            <button onClick={() => onNavigate('traduction')} style={{ background: 'var(--sapin)', color: 'var(--cream)', fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 600, padding: '12px 24px', borderRadius: 'var(--radius-xs)', border: 'none', cursor: 'pointer' }}>
              Commencer →
            </button>
          </div>
        )}

        {!loading && sessions.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {sessions.map((s, i) => {
              const fromPerson = s.person_side === 'A' ? personA : personB
              const toPerson = s.person_side === 'A' ? personB : personA
              const fromType = s.person_side
              const toType = s.person_side === 'A' ? 'B' : 'A'
              return (
                <div key={s.id} onClick={() => onNavigate('traduction')} style={{ background: 'var(--white)', border: '0.5px solid var(--border)', borderRadius: i === 0 ? 'var(--radius) var(--radius) 0 0' : i === sessions.length - 1 ? '0 0 var(--radius) var(--radius)' : '0', borderTop: i > 0 ? 'none' : '0.5px solid var(--border)', padding: '18px 24px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--cream-soft)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'var(--white)'}
                >
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: 'var(--ink-faint)', minWidth: '70px' }}>
                    <div>{formatDate(s.created_at)}</div>
                    <div style={{ color: 'var(--border)', marginTop: '2px', fontSize: '10px' }}>SES.{sessions.length - i}</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: '15px', color: 'var(--ink)', fontStyle: 'italic', marginBottom: '3px' }}>
                      « {s.title || s.raw_message.slice(0, 60) + '…'} »
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--sapin-mid)', letterSpacing: '0.04em' }}>
                      {s.person_side === activeSide ? 'Votre session' : `Session de ${fromPerson.name}`}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Avatar letter={fromPerson.initial} type={fromType} size={24} />
                    <span style={{ fontSize: '10px', color: 'var(--border)' }}>→</span>
                    <Avatar letter={toPerson.initial} type={toType} size={24} />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
