export * from "./types";
export * from "./parse";
export * from "./labels";

export const COMMUNITY_NETWORK_BASE = "/app/community";

export const COMMUNITY_NETWORK_SECTIONS = [
  { key: "overview", href: "/app/community" },
  { key: "discussions", href: "/app/community/discussions" },
  { key: "knowledge", href: "/app/community/knowledge" },
  { key: "bestPractices", href: "/app/community/best-practices" },
  { key: "industryGroups", href: "/app/community/industry-groups" },
  { key: "partnerNetwork", href: "/app/community/partner-network" },
  { key: "events", href: "/app/community/events" },
  { key: "certifications", href: "/app/community/certifications" },
  { key: "reputation", href: "/app/community/reputation" },
  { key: "intelligence", href: "/app/community/intelligence" },
  { key: "successStories", href: "/app/community/success-stories" },
  { key: "executive", href: "/app/community/executive" },
  { key: "governance", href: "/app/community/governance" },
  { key: "marketplace", href: "/app/community/marketplace" },
] as const;
