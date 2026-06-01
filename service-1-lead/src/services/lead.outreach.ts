import { ollamaJSON } from "../lib/ollama";
import { EnrichmentResult } from "./lead.enrichment";
import { ScoreResult } from "./lead.score";

export type OutreachResult = {
  subject: string;
  opening: string;
  value_prop: string;
  cta: string;
  full_draft: string;
};

export const generateOutreach = async (
  enriched: EnrichmentResult,
  score: ScoreResult,
): Promise<OutreachResult> => {
  const leadSummary = `
Company: ${enriched.company}
Industry: ${enriched.industry}
Employees: ${enriched.employees}
Growth Signal: ${enriched.growthSignal}
Funding: ${enriched.funding}
Recent News: ${enriched.recentNews}
Tech Stack: ${enriched.techStack}
`.trim();

  const scoreSummary = `
Segment: ${score.segment}
Score: ${score.score}
Strengths: ${score.strengths.join(", ")}
Gaps: ${score.gaps.join(", ")}
Reasoning: ${score.reasoning}
`.trim();

  // Tone varies by segment so HOT leads get urgency, COLD leads get softer touch
  const toneGuide = {
    HOT: "confident and direct — they're a strong fit, create urgency",
    WARM: "curious and consultative — acknowledge partial fit, ask a question",
    COLD: "light and non-pushy — plant a seed, no hard sell",
  }[score.segment];

  const prompt = `You are a B2B sales copywriter writing a cold outreach email.

Lead Data:
${leadSummary}

ICP Score:
${scoreSummary}

Tone: ${toneGuide}

Rules:
- Subject line: under 8 words, no clickbait
- Opening: 1 sentence referencing something specific about the company (use recent news or growth signal)
- Value prop: 1-2 sentences on what problem you solve for companies like this
- CTA: one clear low-friction ask (a 15-min call, a reply, a demo)
- Full draft: combine all parts into a natural 4-6 sentence email, no subject line included
- Do NOT use generic phrases like "I hope this finds you well"

Return ONLY a raw JSON object, no markdown, no explanation:
{
  "subject": "...",
  "opening": "...",
  "value_prop": "...",
  "cta": "...",
  "full_draft": "..."
}`;

  const result = await ollamaJSON<OutreachResult>(prompt);

  return {
    subject: result.subject || "",
    opening: result.opening || "",
    value_prop: result.value_prop || "",
    cta: result.cta || "",
    full_draft: result.full_draft || "",
  };
};
