export * from "./types";
export * from "./parse";

export const DIGITAL_TWIN_MODULE_PATH = "aipify-core/digital-twin";
export const DIGITAL_TWIN_PHILOSOPHY =
  "The Twin models responsibilities — not people. Organizational intelligence, not surveillance.";
export const DIGITAL_TWIN_SAFETY_NOTE =
  "No employee scoring, ranking, hidden monitoring, or behavioral surveillance.";

export const TWIN_COMPONENTS = [
  "Structure Twin",
  "Responsibility Twin",
  "Communication Twin",
  "Process Twin",
] as const;
