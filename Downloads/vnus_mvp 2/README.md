# Vnus MVP — Traductrice cognitive

## Stack
- React 18 + Vite
- Supabase (base de données + auth)
- Anthropic API (Claude)
- Vercel (déploiement)

## Lancer en local
```bash
npm install
npm run dev
```

## Déployer sur Vercel
1. Push sur GitHub
2. Importer sur vercel.com
3. Framework : Vite (auto-détecté)
4. Deploy ✓

## Flux utilisateur
1. **Onboarding** — un couple crée son espace (prénoms + PINs)
2. **Login PIN** — chaque personne se connecte avec son code privé
3. **Traduction** — session privée, Vnus traduit, sauvegarde en base
4. **Historique** — toutes les traductions sont consultables

## Architecture
```
src/
  lib/supabase.js     ← client + fonctions DB
  ai/provider.js      ← couche LLM interchangeable
  components/
    Onboarding.jsx    ← création couple + PINs
    PinScreen.jsx     ← login
    Dashboard.jsx     ← accueil + historique
    Traduction.jsx    ← interface IA
    ui.jsx            ← composants partagés
  App.jsx             ← router principal
```
