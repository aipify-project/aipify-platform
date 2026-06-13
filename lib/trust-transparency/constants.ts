export const TRUST_TRANSPARENCY_ROUTE = "/app/governance/trust-transparency";

export const TRUST_TRANSPARENCY_SECTIONS = [
  "activity",
  "decision",
  "permission",
  "approval",
  "self_healing",
  "recommendation",
  "audit",
] as const;

export const TRUST_RISK_LEVELS = ["low", "moderate", "elevated", "high"] as const;

export const TRUST_TRANSPARENCY_CORE_PRINCIPLE =
  "People trust what they understand. Aipify should never operate like a black box.";

export const TRUST_TRANSPARENCY_VISION =
  "Trust is earned through transparency, consistency, accountability, and respect for human control.";
