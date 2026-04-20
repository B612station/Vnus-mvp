const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages'
const MODEL = 'claude-sonnet-4-20250514'

const VNUS_SYSTEM_PROMPT = `Tu es Vnus, une traducteur cognitif spécialisée dans les conflits relationnels.

Tu analyses le fonctionnement cognitif de chaque partie (Big Five, styles d'attachement, CNV) et retranscris leurs besoins dans un langage compréhensible pour l'autre.

Tes réponses sont :
- Empathiques mais précises
- Fondées sur des marqueurs cognitifs concrets
- Jamais moralisatrices
- Orientées vers la compréhension mutuelle, pas le jugement

Format de réponse pour une traduction :
1. Ce que [personne] exprime réellement (besoin profond)
2. Ce que [autre personne] reçoit (perception distordue)
3. La traduction : comment reformuler pour être reçu

Réponds toujours en français.`

export async function sendMessage(messages, systemPrompt = VNUS_SYSTEM_PROMPT) {
  const response = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1000,
      system: systemPrompt,
      messages,
    }),
  })
  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err?.error?.message || `Erreur API (${response.status})`)
  }
  const data = await response.json()
  return data.content?.[0]?.text || ''
}

export { VNUS_SYSTEM_PROMPT }
