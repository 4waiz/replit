// groqService — thin wrapper over the Groq Chat Completions REST API.
// No SDK dependency (keeps the Expo/RN bundle clean). Reads the key from
// EXPO_PUBLIC_GROQ_API_KEY so it works on web + native without extra config.
//
// The agent engine calls this for natural-language reasoning. If the key is
// missing, the call fails, or Groq is rate-limited, callers fall back to
// deterministic templates so the live demo never hard-crashes.

const GROQ_URL = 'https://api.groq.com/openai/chat/completions';
const MODEL = 'llama-3.3-70b-versatile';

export const GROQ_KEY: string =
  process.env.EXPO_PUBLIC_GROQ_API_KEY ?? '';

export const groqEnabled = (): boolean => GROQ_KEY.length > 0;

type ChatOpts = {
  system: string;
  user: string;
  temperature?: number;
  maxTokens?: number;
  json?: boolean;
};

export async function groqChat(opts: ChatOpts): Promise<string> {
  if (!groqEnabled()) throw new Error('GROQ_DISABLED');

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);

  try {
    const res = await fetch(GROQ_URL, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GROQ_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: opts.temperature ?? 0.6,
        max_tokens: opts.maxTokens ?? 700,
        ...(opts.json ? { response_format: { type: 'json_object' } } : {}),
        messages: [
          { role: 'system', content: opts.system },
          { role: 'user', content: opts.user },
        ],
      }),
    });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`GROQ_${res.status}`);
    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content;
    if (typeof text !== 'string' || !text.trim()) throw new Error('GROQ_EMPTY');
    return text.trim();
  } catch (e) {
    clearTimeout(timeout);
    throw e;
  }
}

// Parse a JSON object out of an LLM response, tolerating code fences / prose.
export function safeJson<T>(raw: string): T | null {
  try {
    return JSON.parse(raw) as T;
  } catch {
    const match = raw.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]) as T;
      } catch {
        return null;
      }
    }
    return null;
  }
}
