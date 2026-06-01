import { extractLeadInfo } from "../utils/lead.extractor";
import { enrichLead } from "./lead.enrichment";
import { scoreLead } from "./lead.score";
import { matchICP } from "./lead.icp";
import { saveLead } from "../db/lead.repository";
import { findLeadByDomain } from "../db/lead.find";

const SERVICE_2_URL = process.env.SERVICE_2_URL || "http://localhost:5002";

const notifyAgentService = async (result: any): Promise<void> => {
    try {
        await fetch(`${SERVICE_2_URL}/webhook/lead`, {
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
        console.log(`🚀 Lead forwarded to Agent Service: ${result.domain}`);
    } catch (err) {
        console.error("Failed to notify Agent Service:", err);
    }
};

type ProductInput = {
    industry: string;
    minEmployees: number;
};

export const processLead = async (
    lead: string,
    product?: ProductInput
) => {
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

    const result = {
        ...extracted,
        ...enriched,
        ...score,
        ...(icp || {}),
    };

    await saveLead(result);
    await notifyAgentService(result);

    return result;
};
