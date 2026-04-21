# Vnus v2 — Traductrice cognitive

## Stack
React 18 + Vite · Supabase · Anthropic API · Vercel

## Variables d'environnement

Sur Vercel (Settings → Environment Variables) :
- `VITE_SUPABASE_URL` — URL de ton projet Supabase
- `VITE_SUPABASE_ANON_KEY` — clé anon Supabase (préfixe VITE_ = accessible frontend)
- `ANTHROPIC_API_KEY` — ta clé Anthropic (sans VITE_ = côté serveur uniquement)

En local : copie `.env.example` en `.env.local` et remplis les valeurs, puis `npm install && npm run dev`

## Déploiement Vercel
1. Push sur GitHub
2. Importer sur vercel.com → Framework : Vite (auto-détecté)
3. Ajouter les 3 variables d'environnement ci-dessus
4. Deploy ✓

La fonction serverless `/api/translate.js` est détectée automatiquement par Vercel.

## SQL Supabase
Exécuter `supabase/schema.sql` dans Supabase → SQL Editor avant le premier déploiement.

## Flux utilisateur

### Mode Duo
1. Personne A → "Créer un espace Duo" → entre son prénom + PIN → reçoit un code VNUS-XXXX
2. Personne B → "Rejoindre un espace Duo" → entre le code + son prénom + son PIN
3. Chacun se connecte séparément avec son PIN privé
4. Traduction cognitive via Vnus

### Mode Solo
1. La personne crée son espace (prénom + PIN)
2. Sessions d'introspection privées
3. Vnus analyse les patterns de communication

## Architecture
```
src/
  lib/supabase.js       ← client + toutes les fonctions DB
  ai/provider.js        ← appelle /api/translate (jamais l'API directement)
  components/
    Landing.jsx         ← choix du mode (Duo créer / Duo rejoindre / Solo / Login)
    CreateDuo.jsx       ← personne A crée l'espace + reçoit le code
    JoinDuo.jsx         ← personne B rejoint via le code
    CreateSolo.jsx      ← onboarding solo
    Login.jsx           ← accès à un espace existant
    PinScreen.jsx       ← authentification PIN
    Dashboard.jsx       ← accueil + historique (Duo et Solo)
    Traduction.jsx      ← interface IA (Duo et Solo)
    ui.jsx              ← composants partagés
  App.jsx               ← router principal
api/
  translate.js          ← fonction Vercel serverless (clé Anthropic sécurisée)
supabase/
  schema.sql            ← SQL à exécuter dans Supabase
```
