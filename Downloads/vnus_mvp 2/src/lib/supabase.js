import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://arrubxedzwfxxdwxsbeg.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFycnVieGVkendmeHhkd3hzYmVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2NzUyODUsImV4cCI6MjA5MjI1MTI4NX0.Eg9F6Nu17hEl00Awu-2rvzihcz42MPVwBaRustjvBKw'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// ── Espaces (remplace "couples") ──────────────────────────
// mode: 'duo' | 'solo'
// status: 'pending' (B pas encore rejoint) | 'active'

export async function createEspace({ personAName, personAPin, mode }) {
  const { data, error } = await supabase
    .from('couples')
    .insert({
      person_a_name: personAName,
      person_a_pin: personAPin,
      person_b_name: mode === 'solo' ? null : null,
      person_b_pin: mode === 'solo' ? null : null,
      mode: mode || 'duo',
      status: mode === 'solo' ? 'active' : 'pending',
    })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function joinEspace({ espaceId, personBName, personBPin }) {
  const { data, error } = await supabase
    .from('couples')
    .update({
      person_b_name: personBName,
      person_b_pin: personBPin,
      status: 'active',
    })
    .eq('id', espaceId)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function getCoupleById(id) {
  const { data, error } = await supabase
    .from('couples')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function verifyPin(coupleId, side, pin) {
  const couple = await getCoupleById(coupleId)
  const field = side === 'A' ? 'person_a_pin' : 'person_b_pin'
  return couple[field] === pin
}

// ── Sessions ─────────────────────────────────────────────
export async function createSession({ coupleId, title, personSide, rawMessage, translation, markers }) {
  const { data, error } = await supabase
    .from('sessions')
    .insert({
      couple_id: coupleId,
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

export async function getSessionsByCouple(coupleId) {
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('couple_id', coupleId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}
