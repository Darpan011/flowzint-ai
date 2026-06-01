import supabase from "../lib/supabase";
import { SequenceStep } from "./sequence.service";

export const syncLeadToCRM = async (
  domain: string,
  company: string,
  segment: string,
  score: number,
  steps: SequenceStep[],
): Promise<void> => {
  const { error } = await supabase
    .from("leads")
    .update({
      segment,
      score,
      sequence: steps,
      updated_at: new Date().toISOString(),
    })
    .eq("domain", domain);

  if (error) {
    console.error(`❌ CRM sync failed for ${domain}:`, error.message);
  } else {
    console.log(`📊 CRM updated for ${company} [${segment}]`);
  }
};
