import React from 'react'

export default function Landing({ onChoose }) {
  return (
    <div style={{
      minHeight: '100vh', background: 'var(--sapin)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '48px 32px',
    }}>

      {/* Logo + titre */}
      <div className="fade-up" style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div style={{ fontFamily: 'var(--font-serif)', fontSize: '48px', color: 'var(--cream)', letterSpacing: '0.04em', lineHeight: 1 }}>
          V<em style={{ fontStyle: 'italic', color: 'var(--sapin-mist)' }}>·</em>nus
        </div>
        <div style={{ fontSize: '11px', color: 'var(--sapin-mist)', letterSpacing: '0.22em', textTransform: 'uppercase', marginTop: '8px' }}>
          Traducteur cognitif
        </div>
      </div>

      {/* Description */}
      <p className="fade-up delay-1" style={{
        fontFamily: 'var(--font-serif)', fontSize: '17px',
        color: 'var(--ink-muted)', lineHeight: 1.75,
        textAlign: 'center', maxWidth: '520px',
        marginBottom: '52px', fontStyle: 'italic',
      }}>
        Vnus analyse le fonctionnement cognitif de chaque personne et retranscrit ses besoins dans un langage compréhensible pour l'autre. Parce que ce n'est pas ce qu'on dit qui crée les conflits — c'est ce que l'autre reçoit.
      </p>

      {/* Les 2 grands rectangles */}
      <div className="fade-up delay-2" style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: '16px', width: '100%', maxWidth: '800px',
        marginBottom: '32px',
      }}>

        {/* Espace Duo */}
        <div style={{
          background: 'rgba(255,255,255,0.06)',
          border: '0.5px solid rgba(255,255,255,0.15)',
          borderRadius: 'var(--radius)',
          padding: '40px 36px',
          display: 'flex', flexDirection: 'column',
        }}>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', color: 'var(--cream)', fontWeight: 400, marginBottom: '12px' }}>
            Espace Duo
          </div>
          <p style={{ fontSize: '13px', color: 'var(--ink-muted)', lineHeight: 1.65, marginBottom: '36px', flex: 1 }}>
            Deux personnes — couple, amis, famille, collègues — qui veulent mieux se comprendre. Chacun dispose de son propre espace privé.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              onClick={() => onChoose('create-duo')}
              style={{
                background: 'var(--cream)', color: 'var(--sapin)',
                border: 'none', borderRadius: 'var(--radius-xs)',
                padding: '14px 20px', textAlign: 'left',
                cursor: 'pointer', transition: 'opacity 0.2s',
                fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 600,
                letterSpacing: '0.04em',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              Créer un espace →
            </button>
            <button
              onClick={() => onChoose('join-duo')}
              style={{
                background: 'transparent',
                border: '0.5px solid rgba(255,255,255,0.2)',
                borderRadius: 'var(--radius-xs)',
                padding: '14px 20px', textAlign: 'left',
                cursor: 'pointer', transition: 'background 0.2s',
                fontFamily: 'var(--font-sans)', fontSize: '13px',
                color: 'var(--cream)', letterSpacing: '0.04em',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              Rejoindre un espace →
            </button>
          </div>
        </div>

        {/* Espace Solo */}
        <button
          onClick={() => onChoose('solo')}
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '0.5px solid rgba(255,255,255,0.15)',
            borderRadius: 'var(--radius)',
            padding: '40px 36px', textAlign: 'left',
            cursor: 'pointer', transition: 'background 0.2s',
            display: 'flex', flexDirection: 'column',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
        >
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', color: 'var(--cream)', fontWeight: 400, marginBottom: '12px' }}>
            Espace Solo
          </div>
          <p style={{ fontSize: '13px', color: 'var(--ink-muted)', lineHeight: 1.65, marginBottom: '36px', flex: 1 }}>
            Pour ceux qui ont des difficultés à communiquer ou à se connaître. Vnus vous aide à comprendre vos propres patterns, identifier vos besoins et trouver vos mots.
          </p>
          <div style={{
            background: 'var(--sapin-mid)', color: 'var(--cream)',
            borderRadius: 'var(--radius-xs)', padding: '14px 20px',
            fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 600,
            letterSpacing: '0.04em',
          }}>
            Commencer seul →
          </div>
        </button>
      </div>

      {/* Déjà un espace */}
      <div className="fade-up delay-3" style={{ textAlign: 'center' }}>
        <button
          onClick={() => onChoose('login')}
          style={{
            background: 'none', border: 'none',
            color: 'var(--ink-muted)', fontSize: '12px',
            cursor: 'pointer', letterSpacing: '0.04em',
            textDecoration: 'underline', textUnderlineOffset: '3px',
          }}
        >
          J'ai déjà un espace → Se connecter
        </button>
      </div>
    </div>
  )
}
