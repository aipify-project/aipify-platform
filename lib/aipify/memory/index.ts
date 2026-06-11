export * from "./types";
export * from "./parse";
export { UNONIGHT_MEMORY_OBSERVATIONS } from "./presets/unonight-memory";
export { collectPresetMemoryObservations, observationsToRpcPayload } from "./collectors";

export const MEMORY_MODULE_PATH = "aipify-core/modules/memory/phase-62";
export const MEMORY_PHILOSOPHY = "Observe → Learn → Remember → Recommend → Improve";
export const MEMORY_PRIVACY_NOTE =
  "Memory is tenant-isolated. Passwords, API secrets, payment details, and sensitive health data are never stored.";
export const MEMORY_NEVER_STORE = [
  "passwords",
  "API secrets",
  "sensitive personal health data",
  "payment details",
  "cross-tenant memory",
] as const;
