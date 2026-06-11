export * from "./types";
export * from "./parse";
export * from "./formats";

export const DOCUMENT_OUTPUT_ENGINE_PHILOSOPHY =
  "If Aipify generates operational value — save, export, share, automate, reproduce.";

/** Natural language document request examples — scaffold for future NLU, not full detection. */
export const DOCUMENT_REQUEST_INTENT_EXAMPLES = [
  "Export the executive summary as PDF",
  "Generate a support operations report for this month",
  "Schedule a weekly incident summary email",
  "Create a value realization export in CSV",
  "Share the certification report with the executive team",
  "Download the governance report as Word document",
  "Set up a quarterly benchmarking output",
  "Export org health metrics to Excel",
] as const;

export type DocumentRequestIntentExample = (typeof DOCUMENT_REQUEST_INTENT_EXAMPLES)[number];

/** Scaffold matcher — returns matched example index or null (not full NLU). */
export function matchDocumentRequestIntent(input: string): DocumentRequestIntentExample | null {
  const normalized = input.trim().toLowerCase();
  if (!normalized) return null;

  for (const example of DOCUMENT_REQUEST_INTENT_EXAMPLES) {
    const tokens = example.toLowerCase().split(/\s+/).filter((t) => t.length > 3);
    const matches = tokens.filter((t) => normalized.includes(t)).length;
    if (matches >= Math.min(3, tokens.length)) return example;
  }

  if (/export|download|generate|schedule|report|pdf|csv|xlsx/.test(normalized)) {
    return DOCUMENT_REQUEST_INTENT_EXAMPLES[0];
  }

  return null;
}
