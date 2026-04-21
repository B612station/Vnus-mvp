import React, { useState, useEffect } from 'react'
import Landing from './components/Landing.jsx'
import CreateDuo from './components/CreateDuo.jsx'
import JoinDuo from './components/JoinDuo.jsx'
import CreateSolo from './components/CreateSolo.jsx'
import PinScreen from './components/PinScreen.jsx'
import Dashboard from './components/Dashboard.jsx'
import Traduction from './components/Traduction.jsx'
import Login from './components/Login.jsx'
import { getSpaceById } from './lib/supabase.js'

export default function App() {
  const [page, setPage] = useState('loading')
  const [space, setSpace] = useState(null)
  const [activeSide, setActiveSide] = useState(null)

  // Au chargement : vérifie si un espace est déjà en localStorage
  useEffect(() => {
    const savedId = localStorage.getItem('vnus_space_id')
    if (savedId) {
      getSpaceById(savedId)
        .then(s => {
          setSpace(s)
          setPage('pin')
        })
        .catch(() => {
          localStorage.removeItem('vnus_space_id')
          setPage('landing')
        })
    } else {
      setPage('landing')
    }
  }, [])

  // Landing — choix du parcours
  function handleLandingChoice(choice) {
    setPage(choice) // 'create-duo' | 'join-duo' | 'solo' | 'login'
  }

  // Création Duo terminée (côté A)
  function handleCreateDuoComplete({ space: s, side }) {
    setSpace(s)
    setActiveSide(side)
    setPage('dashboard')
  }

  // Rejoindre Duo terminée (côté B)
  function handleJoinDuoComplete({ space: s, side }) {
    setSpace(s)
    setActiveSide(side)
    setPage('dashboard')
  }

  // Création Solo terminée
  function handleCreateSoloComplete({ space: s, side }) {
    setSpace(s)
    setActiveSide(side)
    setPage('dashboard')
  }

  // Login (espace existant retrouvé)
  function handleLoginFound(s) {
    setSpace(s)
    setPage('pin')
  }

  // PIN validé
  function handlePinSuccess(side) {
    setActiveSide(side)
    setPage('dashboard')
  }

  // Changer d'espace — retour landing
  function handleChangeSpace() {
    setSpace(null)
    setActiveSide(null)
    localStorage.removeItem('vnus_space_id')
    setPage('landing')
  }

  // Logout — retour PIN
  function handleLogout() {
    setActiveSide(null)
    setPage('pin')
  }

  // Loading
  if (page === 'loading') {
    return (
      <div style={{
        minHeight: '100vh', background: 'var(--sapin)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          fontFamily: 'var(--font-serif)', fontSize: '28px',
          color: 'var(--cream)', letterSpacing: '0.04em', opacity: 0.6,
        }}>
          V<em style={{ fontStyle: 'italic', color: 'var(--sapin-mist)' }}>·</em>nus
        </div>
      </div>
    )
  }

  if (page === 'landing') return <Landing onChoose={handleLandingChoice} />

  if (page === 'create-duo') return (
    <CreateDuo
      onComplete={handleCreateDuoComplete}
      onBack={() => setPage('landing')}
    />
  )

  if (page === 'join-duo') return (
    <JoinDuo
      onComplete={handleJoinDuoComplete}
      onBack={() => setPage('landing')}
    />
  )

  if (page === 'solo') return (
    <CreateSolo
      onComplete={handleCreateSoloComplete}
      onBack={() => setPage('landing')}
    />
  )

  if (page === 'login') return (
    <Login
      onFound={handleLoginFound}
      onBack={() => setPage('landing')}
    />
  )

  if (page === 'pin') return (
    <PinScreen
      space={space}
      onSuccess={handlePinSuccess}
      onChangeSpace={handleChangeSpace}
    />
  )

  if (page === 'dashboard') return (
    <Dashboard
      space={space}
      activeSide={activeSide}
      onNavigate={p => setPage(p)}
      onLogout={handleLogout}
    />
  )

  if (page === 'traduction') return (
    <Traduction
      space={space}
      activeSide={activeSide}
      onBack={() => setPage('dashboard')}
    />
  )

  return null
}
