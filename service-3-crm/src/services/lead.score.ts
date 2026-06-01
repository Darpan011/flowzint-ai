import { ollamaJSON } from "../lib/ollama";
import { EnrichmentResult } from "./lead.enrichment";

export type ScoreResult = {
  score: number;
  segment: "HOT" | "WARM" | "COLD";
  reasoning: string;
  strengths: string[];
  gaps: string[];
};

const DEFAULT_ICP =
  "B2B SaaS companies, 100-5000 employees, funded startups, tech industry";

export const scoreLead = async (
  enriched: EnrichmentResult,
  icpRubric?: string,
): Promise<ScoreResult> => {
  const icp = icpRubric ?? DEFAULT_ICP;

  // Flatten enriched data into plain text — easier for small models than raw JSON
  const leadSummary = `
Company: ${enriched.company}
Industry: ${enriched.industry}
Employees: ${enriched.employees}
Growth: ${enriched.growthSignal}
Funding: ${enriched.funding}
Recent News: ${enriched.recentNews}
Tech Stack: ${enriched.techStack}
`.trim();

  const prompt = `You are a B2B sales analyst. Score this lead against the ICP.

ICP (Ideal Customer Profile):
${icp}

Lead:
${leadSummary}

Scoring guide:
- 80-100 = HOT: matches ICP well, strong signals
- 50-79  = WARM: partial match, some gaps
- 0-49   = COLD: poor fit or missing data

Return ONLY a raw JSON object, no markdown, no explanation:
{
  "score": 75,
  "segment": "WARM",
  "reasoning": "one sentence explaining the score",
  "strengths": ["specific strength 1", "specific strength 2"],
  "gaps": ["specific gap 1", "specific gap 2"]
}`;

  const result = await ollamaJSON<ScoreResult>(prompt);

  // Sanitize — ensure score is a valid number and segment is valid
  const score = Math.min(
    100,
    Math.max(0, Math.round(Number(result.score) || 0)),
  );
  const segment = inferSegment(score, result.segment);

  return {
    score,
    segment,
    reasoning: result.reasoning || "No reasoning provided",
    strengths: Array.isArray(result.strengths) ? result.strengths : [],
    gaps: Array.isArray(result.gaps) ? result.gaps : [],
  };
};

const inferSegment = (score: number, raw?: string): "HOT" | "WARM" | "COLD" => {
  const upper = (raw ?? "").toUpperCase();
  if (upper === "HOT" || upper === "WARM" || upper === "COLD") {
    return upper as "HOT" | "WARM" | "COLD";
  }
  // Fallback: derive from score if model returned something unexpected
  if (score >= 80) return "HOT";
  if (score >= 50) return "WARM";
  return "COLD";
};
