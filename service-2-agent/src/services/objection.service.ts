import { ollamaJSON } from "../lib/ollama";

export type ObjectionResult = {
  objection: string;
  rebuttal: string;
  followUp: string;
};

export const handleObjection = async (
  objection: string,
  company: string,
  segment: string,
): Promise<ObjectionResult> => {
  const prompt = `You are an expert B2B sales coach for ZintSales AI.
Help handle this sales objection concisely and confidently.
Tone: ${segment === "HOT" ? "urgent and direct" : segment === "WARM" ? "consultative" : "soft and patient"}

Lead company: ${company}
Segment: ${segment}
Objection: "${objection}"

Return ONLY a raw JSON object, no markdown:
{
  "objection": "<repeat the objection>",
  "rebuttal": "<your rebuttal in 2-3 sentences>",
  "followUp": "<one follow-up question to keep the conversation going>"
}`;

  const parsed = await ollamaJSON<ObjectionResult>(prompt);

  console.log(`🧠 Objection handled for ${company}`);
  console.log(`   Objection: ${parsed.objection}`);
  console.log(`   Rebuttal: ${parsed.rebuttal}`);

  return parsed;
};
