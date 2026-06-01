import { parseCsvBuffer } from "../utils/csv.parser";
import { runWithConcurrency } from "../utils/concurrency";
import { processLead } from "./lead.service";

const CONCURRENCY_LIMIT = 5; // tune based on your Serper/Ollama rate limits

export type BulkResult = {
  domain: string;
  status: "success" | "error";
  data?: Record<string, unknown>;
  error?: string;
  cached?: boolean;
};

export const processBulkCsv = async (
  buffer: Buffer,
): Promise<{
  results: BulkResult[];
  summary: { total: number; success: number; errors: number; cached: number };
}> => {
  // 1. Parse
  const rows = parseCsvBuffer(buffer);

  // 2. Deduplicate by domain (keep first occurrence)
  const seen = new Set<string>();
  const unique = rows.filter(({ domain }) => {
    if (seen.has(domain)) return false;
    seen.add(domain);
    return true;
  });

  // 3. Build tasks
  const tasks = unique.map((row) => async (): Promise<BulkResult> => {
    const product =
      row.product_industry || row.min_employees
        ? {
            industry: row.product_industry ?? "",
            minEmployees: row.min_employees
              ? parseInt(row.min_employees, 10)
              : 0,
          }
        : undefined;

    try {
      const data = await processLead(row.domain, product);
      return {
        domain: row.domain,
        status: "success",
        data,
        cached: (data as { cached?: boolean }).cached ?? false,
      };
    } catch (err) {
      return {
        domain: row.domain,
        status: "error",
        error: err instanceof Error ? err.message : String(err),
      };
    }
  });

  // 4. Run with concurrency cap
  const settled = await runWithConcurrency(tasks, CONCURRENCY_LIMIT);

  // settled is always fulfilled (errors are caught inside each task)
  const results = settled.map((r) =>
    r.status === "fulfilled"
      ? r.value
      : {
          domain: "unknown",
          status: "error" as const,
          error: String((r as PromiseRejectedResult).reason),
        },
  );

  // 5. Summary
  const summary = {
    total: results.length,
    success: results.filter((r) => r.status === "success").length,
    errors: results.filter((r) => r.status === "error").length,
    cached: results.filter((r) => r.cached).length,
  };

  return { results, summary };
};
