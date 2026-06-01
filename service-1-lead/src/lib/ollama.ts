const OLLAMA_BASE = process.env.OLLAMA_BASE_URL ?? "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL ?? "llama3.2:1b";


export const ollamaCall = async (prompt: string): Promise<string> => {
  const res = await fetch(`${OLLAMA_BASE}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      prompt,
      stream: false,
    }),
  });

  if (!res.ok) {
    throw new Error(
      `Ollama error ${res.status} — is Ollama running? Try: ollama serve`,
    );
  }

  const data = await res.json();
  return data.response ?? "";
};

export const ollamaJSON = async <T>(prompt: string): Promise<T> => {
  const raw = await ollamaCall(prompt);
  const clean = raw
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .trim();
  try {
    return JSON.parse(clean) as T;
  } catch {
    const match = clean.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]) as T;
    throw new Error(`Ollama returned invalid JSON: ${clean.slice(0, 200)}`);
  }
};
