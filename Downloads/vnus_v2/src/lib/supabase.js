import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// ── Utilitaires ───────────────────────────────────────────
function generateInviteCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = 'VNUS-'
  for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)]
  return code
}

// ── Espaces Duo ───────────────────────────────────────────
// Étape 1 : Personne A crée l'espace et reçoit un code d'invitation
export async function createDuoSpace({ nameA, pinA }) {
  const inviteCode = generateInviteCode()
  const { data, error } = await supabase
    .from('spaces')
    .insert({
      mode: 'duo',
      person_a_name: nameA,
      person_a_pin: pinA,
      invite_code: inviteCode,
      status: 'pending', // en attente que B rejoigne
    })
    .select()
    .single()
  if (error) throw error
  return data
}

// Étape 2 : Personne B rejoint via le code
export async function joinDuoSpace({ inviteCode, nameB, pinB }) {
  // Chercher l'espace par code
  const { data: space, error: findErr } = await supabase
    .from('spaces')
    .select('*')
    .eq('invite_code', inviteCode.toUpperCase())
    .eq('status', 'pending')
    .single()
  if (findErr || !space) throw new Error('Code invalide ou déjà utilisé.')

  // Mettre à jour avec les infos de B
  const { data, error } = await supabase
    .from('spaces')
    .update({
      person_b_name: nameB,
      person_b_pin: pinB,
      status: 'active',
    })
    .eq('id', space.id)
    .select()
    .single()
  if (error) throw error
  return data
}

// ── Espaces Solo ──────────────────────────────────────────
export async function createSoloSpace({ name, pin }) {
  const { data, error } = await supabase
    .from('spaces')
    .insert({
      mode: 'solo',
      person_a_name: name,
      person_a_pin: pin,
      status: 'active',
    })
    .select()
    .single()
  if (error) throw error
  return data
}

// ── Récupérer un espace ───────────────────────────────────
export async function getSpaceById(id) {
  const { data, error } = await supabase
    .from('spaces')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

// Vérifier un PIN
export async function verifyPin(spaceId, side, pin) {
  const space = await getSpaceById(spaceId)
  const field = side === 'A' ? 'person_a_pin' : 'person_b_pin'
  return space[field] === pin
}

// ── Sessions ──────────────────────────────────────────────
export async function createSession({ spaceId, title, personSide, rawMessage, translation, markers }) {
  const { data, error } = await supabase
    .from('sessions')
    .insert({
      space_id: spaceId,
      title,
      person_side: personSide,
      raw_message: rawMessage,
      translation,
      markers: markers || [],
    })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function getSessionsBySpace(spaceId) {
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('space_id', spaceId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}
