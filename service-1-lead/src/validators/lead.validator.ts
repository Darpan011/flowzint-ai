import validator from "validator";

export const validateLead = (lead: string): boolean => {
  if (!lead || typeof lead !== "string") {
    throw new Error("Lead required");
  }

  const trimmed = lead.trim();

  if (trimmed.length < 2) {
    throw new Error("Lead too short");
  }

  if (trimmed.length > 200) {
    throw new Error("Lead too long");
  }

  // LinkedIn URL — valid
  if (trimmed.includes("linkedin.com/company/")) {
    return true;
  }

  // Looks like a domain or URL — validate as URL
  if (trimmed.includes(".") && !trimmed.includes(" ")) {
    const formatted = trimmed.startsWith("http")
      ? trimmed
      : `https://${trimmed}`;
    if (!validator.isURL(formatted)) {
      throw new Error("Invalid domain URL");
    }
    return true;
  }

  // Plain company name — allow letters, numbers, spaces, hyphens
  if (/^[a-zA-Z0-9\s\-\.]+$/.test(trimmed)) {
    return true;
  }

  throw new Error(
    "Invalid lead — provide a domain, LinkedIn URL, or company name",
  );
};
