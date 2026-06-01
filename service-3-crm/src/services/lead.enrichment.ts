import { serperSearch } from "../lib/serper";
import { ollamaJSON } from "../lib/ollama";

export type EnrichmentResult = {
  company: string;
  domain: string;
  industry: string;
  employees: number;
  growthSignal: string;
  funding: string;
  recentNews: string;
  techStack: string;
};

// Truncate search results so qwen2.5:3b doesn't get overwhelmed
const truncate = (text: string, chars = 1500): string =>
  text.length > chars ? text.slice(0, chars) + "..." : text;

export const enrichLead = async (
  company: string,
  domain: string,
): Promise<EnrichmentResult> => {
  const [companyData, newsData, techData] = await Promise.all([
    serperSearch(
      `${company} number of employees headcount site:linkedin.com OR site:craft.co OR site:zoominfo.com`,
    ),
    serperSearch(`${company} funding round valuation 2024 2025`),
    serperSearch(
      `${company} engineering tech stack programming languages tools`,
    ),
  ]);

  const prompt = `You are a B2B data extractor. Extract structured company info from search snippets below.

Company: ${company}
Domain: ${domain}

--- COMPANY & HEADCOUNT ---
${truncate(companyData)}

--- FUNDING & NEWS ---
${truncate(newsData)}

--- TECH STACK ---
${truncate(techData)}

Rules:
- "employees" must be an INTEGER (e.g. 5000). Look for headcount numbers in the text. Never use 0 unless truly not found.
- "growthSignal" must be exactly one of: Expansion, Stable, Declining
- "funding" should be the most recent round/amount, or "Unknown"
- "techStack" should be comma-separated tool names
- Return ONLY a raw JSON object, no markdown, no explanation

{
  "company": "${company}",
  "domain": "${domain}",
  "industry": "string",
  "employees": 1000,
  "growthSignal": "Expansion",
  "funding": "string",
  "recentNews": "one sentence",
  "techStack": "Tool1, Tool2, Tool3"
}`;

  const result = await ollamaJSON<EnrichmentResult>(prompt);

  // Ensure employees is always a number, never null/string
  return {
    ...result,
    company: result.company || company,
    domain: result.domain || domain,
    employees:
      typeof result.employees === "number" && result.employees > 0
        ? result.employees
        : parseEmployeesFromText(companyData),
  };
};

// Fallback: scan raw search text for headcount patterns like "3,000 employees" or "3k employees"
const parseEmployeesFromText = (text: string): number => {
  const patterns = [
    /(\d[\d,]+)\s+employees/i,
    /(\d[\d,]+)\s+people/i,
    /headcount[^\d]*(\d[\d,]+)/i,
    /team of\s+(\d[\d,]+)/i,
    /(\d+)k\s+employees/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const raw = match[1].replace(/,/g, "");
      const num = pattern.source.includes("k")
        ? parseInt(raw) * 1000
        : parseInt(raw);
      if (num > 0) return num;
    }
  }

  return 0;
};
