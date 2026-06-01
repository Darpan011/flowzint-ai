const SERPER_BASE = "https://google.serper.dev/search";

export const serperSearch = async (query: string): Promise<string> => {
  const res = await fetch(SERPER_BASE, {
    method: "POST",
    headers: {
      "X-API-KEY": process.env.SERPER_API_KEY!,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ q: query, num: 5 }),
  });

  if (!res.ok) {
    throw new Error(`Serper error ${res.status}`);
  }

  const data = await res.json();
  const organic = (data.organic ?? []) as { title: string; snippet: string }[];
  return organic.map((r) => `[${r.title}] ${r.snippet}`).join("\n\n");
};
