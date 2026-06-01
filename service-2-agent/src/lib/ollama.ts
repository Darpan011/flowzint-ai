const OLLAMA_BASE = process.env.OLLAMA_URL ?? "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL ?? "qwen2.5:3b";

export const ollamaJSON = async <T>(prompt: string): Promise<T> => {
  const res = await fetch(`${OLLAMA_BASE}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      prompt,
      stream: false,
      options: {
        num_predict: 4096,
      },
    }),
  });

  if (!res.ok) throw new Error(`Ollama error: ${res.statusText}`);
  const data = await res.json();

  console.log("🔍 Ollama raw response:", data.response.substring(0, 300));

  const raw: string = data.response.replace(/```json\n?|```/g, "").trim();
  const arrayMatch = raw.match(/\[[\s\S]*\]/);
  const objMatch = raw.match(/\{[\s\S]*\}/);
  const jsonStr = arrayMatch?.[0] ?? objMatch?.[0];
  if (!jsonStr) throw new Error("No JSON found in Ollama response");
  const parsed = JSON.parse(jsonStr);
  console.log(
    "🔍 Parsed type:",
    Array.isArray(parsed) ? "array" : typeof parsed,
  );

  return parsed as T;
};

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
