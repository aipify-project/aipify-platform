export * from "./types";
export * from "./parse";

export const OUTCOMES_MODULE_PATH = "aipify-core/outcomes";
export const OUTCOMES_PHILOSOPHY =
  "Aipify validates outcomes. Humans interpret outcomes.";
export const OUTCOMES_SAFETY_NOTE =
  "Validation never manipulates metrics, hides failed initiatives, or inflates value estimates.";

export const VALIDATION_STATUS_LABELS: Record<string, string> = {
  validated: "Validated",
  partially_validated: "Partially Validated",
  not_validated: "Not Validated",
  in_review: "In Review",
};
