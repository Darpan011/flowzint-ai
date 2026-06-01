export type ExtractedLead = {
  company: string;
  domain: string;
  linkedinUrl: string | null;
  inputType: "linkedin" | "domain" | "company";
};

export const extractLeadInfo = (lead: string): ExtractedLead => {
  const trimmed = lead.trim();

  // --- LinkedIn URL ---
  // e.g. https://linkedin.com/company/openai or linkedin.com/company/openai
  if (trimmed.includes("linkedin.com/company/")) {
    const match = trimmed.match(/linkedin\.com\/company\/([^/?#]+)/);
    const slug = match?.[1] ?? "unknown";
    const company = slugToName(slug);

    return {
      company,
      domain: `${slug}.com`, // best-guess domain, enrichment will correct it
      linkedinUrl: trimmed.startsWith("http") ? trimmed : `https://${trimmed}`,
      inputType: "linkedin",
    };
  }

  // --- Plain domain ---
  // e.g. openai.com or https://openai.com
  if (trimmed.includes(".") && !trimmed.includes(" ")) {
    const normalized = trimmed.startsWith("http")
      ? trimmed
      : `https://${trimmed}`;
    try {
      const url = new URL(normalized);
      const domain = url.hostname.replace(/^www\./, "");
      const company = slugToName(domain.split(".")[0]);

      return {
        company,
        domain,
        linkedinUrl: null,
        inputType: "domain",
      };
    } catch {
      // fall through to company name handling
    }
  }

  // --- Plain company name ---
  // e.g. "OpenAI" or "stripe" or "Notion Labs"
  const company = trimmed
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");

  const domain = `${trimmed.toLowerCase().replace(/\s+/g, "")}.com`;

  return {
    company,
    domain,
    linkedinUrl: null,
    inputType: "company",
  };
};

// "openai" → "Openai", "notion-labs" → "Notion Labs"
const slugToName = (slug: string): string =>
  slug
    .split(/[-_]/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
