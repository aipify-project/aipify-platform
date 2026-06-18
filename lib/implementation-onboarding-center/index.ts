export * from "./types";
export * from "./parse";
export * from "./labels";

export const IMPLEMENTATION_ONBOARDING_BASE = "/app/onboarding";

export const IMPLEMENTATION_ONBOARDING_SECTIONS = [
  { key: "welcome", href: "/app/onboarding" },
  { key: "setup", href: "/app/onboarding/setup" },
  { key: "organization", href: "/app/onboarding/organization" },
  { key: "users", href: "/app/onboarding/users" },
  { key: "companion", href: "/app/onboarding/companion" },
  { key: "knowledge", href: "/app/onboarding/knowledge" },
  { key: "integrations", href: "/app/onboarding/integrations" },
  { key: "businessPacks", href: "/app/onboarding/business-packs" },
  { key: "training", href: "/app/onboarding/training" },
  { key: "launch", href: "/app/onboarding/launch" },
  { key: "timeline", href: "/app/onboarding/timeline" },
  { key: "executive", href: "/app/onboarding/executive" },
  { key: "governance", href: "/app/onboarding/governance" },
] as const;
