import supabase from "./supabase";

export const saveLead = async (data: any): Promise<void> => {
  const row = {
    // Required fields — provide fallbacks so NOT NULL never fails
    name: data.company ?? "Unknown",
    title: data.inputType ?? "Lead",
    company: data.company ?? "Unknown",

    // Core enrichment
    domain: data.domain ?? null,
    industry: data.industry ?? null,
    employees: data.employees ?? null,
    linkedin_url: data.linkedinUrl ?? null,
    tech_stack: data.techStack ?? null,
    recent_news: data.recentNews ?? null,
    company_size: data.employees ? String(data.employees) : null,

    // Scoring — store as JSONB
    icp_score: {
      score: data.score ?? null,
      segment: data.segment ?? null,
      reasoning: data.reasoning ?? null,
      strengths: data.strengths ?? [],
      gaps: data.gaps ?? [],
      growthSignal: data.growthSignal ?? null,
      funding: data.funding ?? null,
    },

    // Metadata
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase.from("leads").insert([row]);

  if (error) {
    throw new Error(error.message);
  }
};
