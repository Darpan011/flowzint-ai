import { extractLeadInfo } from "../utils/lead.extractor";
import { enrichLead } from "./lead.enrichment";
import { scoreLead } from "./lead.score";
import { matchICP } from "./lead.icp";
import { generateOutreach } from "./lead.outreach"; // ← add
import { saveLead } from "../db/lead.repository";
import { findLeadByDomain } from "../db/lead.find";

const notifyService2 = async (result: any): Promise<void> => {
  try {
    await fetch("http://localhost:5002/webhook/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        domain: result.domain,
        company: result.company,
        segment: result.segment,
        score: result.score,
        reasoning: result.reasoning,
        strengths: result.strengths,
        gaps: result.gaps,
        industry: result.industry,
        employees: result.employees,
        funding: result.funding,
        recentNews: result.recentNews,
        techStack: result.techStack,
        outreach_draft: result.outreach_draft,
      }),
    });
    console.log(`🚀 Lead forwarded to Service 2: ${result.domain}`);
  } catch (err) {
    console.error("Failed to notify Service 2:", err);
  }
};

type ProductInput = {
  industry: string;
  minEmployees: number;
};

export const processLead = async (lead: string, product?: ProductInput) => {
  const extracted = extractLeadInfo(lead);

  console.log("Searching:", extracted.domain);

  const existing = await findLeadByDomain(extracted.domain);

  console.log("Existing:", existing);

  if (existing) {
    return { ...existing, cached: true };
  }

  const enriched = await enrichLead(extracted.company, extracted.domain);

  const score = await scoreLead(enriched, product?.industry);

  const icp = product
    ? matchICP(enriched.industry, enriched.employees, product)
    : null;

  const outreach = await generateOutreach(enriched, score); // ← add

  const result = {
    ...extracted,
    ...enriched,
    ...score,
    ...(icp || {}),
    outreach_draft: outreach, // ← add
  };

  await saveLead(result);
  await notifyService2(result);

  return result;
};
