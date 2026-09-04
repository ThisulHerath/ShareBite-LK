/**
 * gemini.js — ShareBite LK AI assistant service
 * Calls Google Gemini Flash directly from the browser (no extra server needed).
 * The API key is stored in VITE_GEMINI_API_KEY environment variable.
 */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const GEMINI_MODEL = import.meta.env.VITE_GEMINI_MODEL || 'gemini-3.6-flash'

// System prompt that defines the assistant's persona and knowledge
export const SYSTEM_PROMPT = `You are ShareBite LK Assistant, a friendly and helpful AI chatbot for the ShareBite LK food-sharing platform in Sri Lanka.

ShareBite LK is a community food sharing app where:
- Food businesses (cafés, bakeries, caterers, restaurants) and households can list surplus food for free
- Community members, households, and organizations can browse and reserve portions
- All food is available for same-day collection only (today's date)
- Listings show how many portions are left and a countdown timer until the collection deadline
- Users can cancel reservations up to 1 hour before the deadline; after that, cancellation is locked

Platform features you know about:
1. FIND FOOD (/find-food): Browse food listings filtered by category (Meals, Bakery, Produce, Other) and district. See remaining portions, countdown timers, and reserve up to the available count.
2. SHARE FOOD (/share-food): Donors create a listing with: food title, description, category, total portions, district, pickup address, contact phone, and a cutoff time today.
3. DASHBOARD (/dashboard): See your shared listings (edit, delete) and your reservations (cancel if >1 hour remains, with live countdown timer).
4. LOGIN / REGISTER: Free account required. Email + password login.

Districts in Sri Lanka supported: Colombo, Gampaha, Kalutara, Kandy, Matale, Nuwara Eliya, Galle, Matara, Hambantota, Jaffna, Kilinochchi, Mannar, Mullaitivu, Vavuniya, Puttalam, Kurunegala, Anuradhapura, Polonnaruwa, Badulla, Monaragala, Ratnapura, Kegalle, Trincomalee, Batticaloa, Ampara.

Food safety guidelines you promote:
- Check the listing description for allergen info
- Collect food within the stated time window
- If food looks or smells off, do not consume it
- Donors must only list food that is safe to eat

Your personality:
- Warm, friendly, and community-focused
- Brief and clear answers (2–4 sentences usually enough)
- Use relevant emojis sparingly to be approachable
- Always encourage sharing and reducing food waste
- If asked something outside ShareBite LK or food sharing, politely redirect to platform topics

You speak English but can understand Sinhala or Tamil queries — respond in English.`

/**
 * Send a message to Gemini and get a response.
 * Uses a configurable Gemini Flash model via the Gemini REST API.
 * @param {Array<{role: 'user'|'model', text: string}>} history - conversation history
 * @param {string} userMessage - the new user message
 * @returns {Promise<string>} - the assistant's reply
 */
export async function sendMessage(history, userMessage) {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key is not configured.')
  }

  // Build the contents array from conversation history + new message
  const contents = []

  // Add history (skip the very first assistant message which is just a greeting)
  for (const msg of history) {
    if (msg.role === 'user' || msg.role === 'model') {
      contents.push({
        role: msg.role,
        parts: [{ text: msg.text }],
      })
    }
  }

  // Add the new user message
  contents.push({
    role: 'user',
    parts: [{ text: userMessage }],
  })

  const requestBody = {
    system_instruction: {
      parts: [{ text: SYSTEM_PROMPT }],
    },
    contents,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 500,
      topP: 0.9,
    },
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    const apiMsg = errorData?.error?.message || ''
    const status = response.status

    if (status === 400 && apiMsg.includes('API key')) {
      throw new Error('The Gemini API key is invalid. Please update VITE_GEMINI_API_KEY in the .env file with a key from aistudio.google.com.')
    }
    if (status === 401 || status === 403) {
      throw new Error('API key authentication failed. Please get a valid key from aistudio.google.com and update VITE_GEMINI_API_KEY.')
    }
    if (status === 429) {
      throw new Error('Rate limit reached. Please wait a moment and try again.')
    }
    if (status === 404 || apiMsg.toLowerCase().includes('no longer available')) {
      throw new Error(`The configured Gemini model (${GEMINI_MODEL}) is unavailable. Update VITE_GEMINI_MODEL and restart the frontend.`)
    }
    throw new Error(apiMsg || `API error ${status}. Please try again.`)
  }

  const data = await response.json()
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text

  if (!text) {
    throw new Error('No response received. Please try again.')
  }

  return text.trim()
}
