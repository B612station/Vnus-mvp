import React, { useState, useEffect } from 'react'
import Onboarding from './components/Onboarding.jsx'
import PinScreen from './components/PinScreen.jsx'
import Dashboard from './components/Dashboard.jsx'
import Traduction from './components/Traduction.jsx'
import { getCoupleById } from './lib/supabase.js'

export default function App() {
  const [page, setPage] = useState('loading')
  const [couple, setCouple] = useState(null)
  const [activeSide, setActiveSide] = useState(null)
  const [joinId, setJoinId] = useState(null)

  useEffect(() => {
    // Vérifie si c'est un lien d'invitation (?join=ID)
    const params = new URLSearchParams(window.location.search)
    const join = params.get('join')
    if (join) {
      setJoinId(join)
      setPage('onboarding')
      return
    }

    // Vérifie si un espace existe déjà en localStorage
    const savedId = localStorage.getItem('vnus_couple_id')
    if (savedId) {
      getCoupleById(savedId)
        .then(c => {
          setCouple(c)
          setPage('pin')
        })
        .catch(() => {
          localStorage.removeItem('vnus_couple_id')
          setPage('onboarding')
        })
    } else {
      setPage('onboarding')
    }
  }, [])

  function handleOnboardingComplete(c, next) {
    setCouple(c)
    localStorage.setItem('vnus_couple_id', c.id)
    // Nettoie le ?join= de l'URL sans recharger
    window.history.replaceState({}, '', '/')
    setPage('pin')
  }

  function handlePinSuccess(side) {
    setActiveSide(side)
    setPage('dashboard')
  }

  function handleLogout() {
    setActiveSide(null)
    setPage('pin')
  }

  function handleChangeCouple() {
    setCouple(null)
    setActiveSide(null)
    localStorage.removeItem('vnus_couple_id')
    setPage('onboarding')
  }

  if (page === 'loading') return (
    <div style={{ minHeight: '100vh', background: 'var(--sapin)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', color: 'var(--cream)', letterSpacing: '0.04em', opacity: 0.6 }}>
        V<em style={{ fontStyle: 'italic', color: 'var(--sapin-mist)' }}>·</em>nus
      </div>
    </div>
  )

  if (page === 'onboarding') return (
    <Onboarding joinId={joinId} onComplete={handleOnboardingComplete} />
  )

  if (page === 'pin') return (
    <PinScreen couple={couple} onSuccess={handlePinSuccess} onBack={handleChangeCouple} />
  )

  if (page === 'dashboard') return (
    <Dashboard couple={couple} activeSide={activeSide} onNavigate={p => setPage(p)} onLogout={handleLogout} />
  )

  if (page === 'traduction') return (
    <Traduction couple={couple} activeSide={activeSide} onBack={() => setPage('dashboard')} />
  )

  return null
}
