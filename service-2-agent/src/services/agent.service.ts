import { buildSequence } from "./sequence.service";
import supabase from "../lib/supabase";
import { sendEmail } from "./email.service";
import { draftLinkedin } from "./linkedin.service";
import { draftWhatsapp } from "./whatsapp.service";
import { syncLeadToCRM } from "./crm.service";

export type LeadPayload = {
  domain: string;
  company: string;
  segment: string;
  score: number;
  reasoning: string;
  strengths: string[];
  gaps: string[];
  industry: string;
  employees: number;
  funding: string;
  recentNews: string;
  techStack: string;
  outreach_draft?: {
    subject: string;
    opening: string;
    value_prop: string;
    cta: string;
    full_draft: string;
  };
  icp_score?: {
    segment: string;
    score: number;
    reasoning: string;
    strengths: string[];
    gaps: string[];
  };
};

export const processAgentLead = async (lead: LeadPayload): Promise<void> => {
  const segment = lead.segment || lead.icp_score?.segment || "COLD";

  console.log(`🤖 Processing [${segment}] lead: ${lead.domain}`);

  // Build sequence
  console.log(`📋 Building ${segment} sequence...`);
  const sequence = await buildSequence(lead);
  console.log(`✅ Sequence built — ${sequence.steps.length} steps`);
  sequence.steps.forEach((s) => {
    console.log(`  Day ${s.day} [${s.channel}]: ${s.objective}`);
  });

  // Send Day 1 email immediately
  const day1Email = sequence.steps.find(
    (s) => s.day === 1 && s.channel === "email",
  );
  if (day1Email) {
    const to = "chauhandeepak21103@gmail.com";
    await sendEmail(to, day1Email, lead.company);
  }

  // Draft LinkedIn + WhatsApp steps
  sequence.steps.forEach((s) => {
    draftLinkedin(s, lead.company);
    draftWhatsapp(s, lead.company);
  });

  await syncLeadToCRM(
    lead.domain,
    lead.company,
    segment,
    lead.score,
    sequence.steps,
  );

  // Save to Supabase
  const { error } = await supabase.from("sequences").insert({
    domain: lead.domain,
    company: lead.company,
    segment,
    steps: sequence.steps,
    status: "active",
    created_at: new Date().toISOString(),
  });

  if (error) {
    console.error("Failed to save sequence:", error.message);
  } else {
    console.log(`💾 Sequence saved to Supabase for ${lead.domain}`);
  }
};
