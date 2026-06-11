export * from "./types";
export * from "./parse";

export const STRATEGY_MODULE_PATH = "aipify-core/strategy";
export const STRATEGY_PHILOSOPHY =
  "Aipify recommends strategy. Humans decide strategy.";
export const STRATEGY_SAFETY_NOTE =
  "Strategic Intelligence never executes strategic decisions autonomously, overrides Governance, or initiates organizational change independently.";

export const HORIZON_LABELS: Record<string, string> = {
  short_term: "Short-Term (0–30 days)",
  mid_term: "Mid-Term (30–90 days)",
  long_term: "Long-Term (90–365 days)",
};
