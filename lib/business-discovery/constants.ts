export const BUSINESS_DISCOVERY_ROUTE = "/app/onboarding/aipify-install";

export const DISCOVERY_PHASES = [1, 2, 3, 4, 5, 6, 7] as const;

export const DISCOVERY_PHASE_NAMES: Record<(typeof DISCOVERY_PHASES)[number], string> = {
  1: "Organization Profile",
  2: "System Discovery",
  3: "Knowledge Discovery",
  4: "Workflow Discovery",
  5: "Action Discovery",
  6: "People Discovery",
  7: "Readiness Assessment",
};

export const READINESS_STATES = [
  "not_ready",
  "learning",
  "partially_ready",
  "ready_to_assist",
  "ready_to_execute",
] as const;

export const INSTALL_PHILOSOPHY =
  "Traditional software: You configure the software. Aipify: I will understand how your business works.";

export const INSTALL_CORE_PRINCIPLE =
  "Do not force organizations to teach Aipify everything manually. Aipify should learn through approved access.";

export const CONTINUOUS_LEARNING_PRINCIPLE =
  "Discovery is not a one-time event. Discovery is continuous.";
