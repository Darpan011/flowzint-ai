import { ollamaJSON } from "../lib/ollama";
import { LeadPayload } from "./agent.service";

export type SequenceStep = {
  day: number;
  channel: "email" | "linkedin" | "whatsapp";
  subject?: string;
  message: string;
  objective: string;
};

export type Sequence = {
  domain: string;
  segment: string;
  steps: SequenceStep[];
};

export const buildSequence = async (lead: LeadPayload): Promise<Sequence> => {
  const segment = lead.segment || lead.icp_score?.segment || "COLD";

  const touchpoints =
    {
      HOT: [
        { day: 1, channel: "email" },
        { day: 3, channel: "linkedin" },
        { day: 7, channel: "email" },
        { day: 14, channel: "whatsapp" },
        { day: 30, channel: "email" },
      ],
      WARM: [
        { day: 1, channel: "email" },
        { day: 7, channel: "linkedin" },
        { day: 14, channel: "email" },
        { day: 30, channel: "whatsapp" },
        { day: 45, channel: "email" },
      ],
      COLD: [
        { day: 1, channel: "email" },
        { day: 14, channel: "linkedin" },
        { day: 30, channel: "email" },
        { day: 60, channel: "email" },
        { day: 90, channel: "linkedin" },
      ],
    }[segment] ?? [];

  const leadSummary = `
Company: ${lead.company}
Domain: ${lead.domain}
Industry: ${lead.industry}
Employees: ${lead.employees}
Funding: ${lead.funding}
Recent News: ${lead.recentNews}
Tech Stack: ${lead.techStack}
Segment: ${segment}
Score: ${lead.score || lead.icp_score?.score}
Strengths: ${(lead.strengths || lead.icp_score?.strengths || []).join(", ")}
Gaps: ${(lead.gaps || lead.icp_score?.gaps || []).join(", ")}
Initial Outreach Subject: ${lead.outreach_draft?.subject || "N/A"}
`.trim();

  const prompt = `You are a B2B sales sequence strategist. Build a 5-touch follow-up sequence for this lead.

Lead:
${leadSummary}

Touchpoints to generate (in order):
${touchpoints.map((t, i) => `${i + 1}. Day ${t.day} — ${t.channel}`).join("\n")}

Rules:
- Each message must reference something specific about the company
- Tone: ${segment === "HOT" ? "confident and urgent" : segment === "WARM" ? "consultative and curious" : "light and non-pushy"}
- Each step builds on the previous — no repetition
- Email: include subject line
- LinkedIn: short connection message under 300 chars
- WhatsApp: casual, under 200 chars
- Keep ALL messages concise — email under 100 words, linkedin under 50 words
- Objective: what this specific touch is trying to achieve

Return ONLY a raw JSON array, no markdown:
[
  {
    "day": 1,
    "channel": "email",
    "subject": "...",
    "message": "...",
    "objective": "..."
  }
]`;

  const raw = await ollamaJSON<unknown>(prompt);

  // Ollama sometimes wraps array in { steps: [...] } or { sequence: [...] }
  let steps: SequenceStep[] = [];
  const rawSteps = Array.isArray(raw)
    ? raw
    : Array.isArray((raw as any)?.steps)
      ? (raw as any).steps
      : (Object.values(raw as object).find((v) => Array.isArray(v)) ?? []);

  steps = (rawSteps as any[]).map((s, i) => ({
    day: s.day ?? touchpoints[i]?.day,
    channel: s.channel ?? touchpoints[i]?.channel,
    subject: s.subject,
    message: s.message ?? "",
    objective:
      s.objective ??
      s.goal ??
      s.purpose ??
      `Day ${s.day ?? touchpoints[i]?.day} ${s.channel ?? touchpoints[i]?.channel} outreach`,
  }));

  return {
    domain: lead.domain,
    segment,
    steps,
  };
};
