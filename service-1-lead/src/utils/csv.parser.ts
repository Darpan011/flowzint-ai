import { parse } from "csv-parse/sync";

export type CsvRow = {
  domain: string;
  product_industry?: string;
  min_employees?: string;
};

export const parseCsvBuffer = (buffer: Buffer): CsvRow[] => {
  const records = parse(buffer, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  return (records as Record<string, string>[]).map((row) => {
    const domain = row["domain"] ?? row["Domain"] ?? row["DOMAIN"] ?? "";
    if (!domain)
      throw new Error(
        `Row missing required 'domain' column: ${JSON.stringify(row)}`,
      );
    return {
      domain: domain.trim().toLowerCase(),
      product_industry: row["product_industry"] ?? row["industry"] ?? undefined,
      min_employees: row["min_employees"] ?? row["employees"] ?? undefined,
    };
  });
};
