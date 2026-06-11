export const DEVELOPER_KNOWLEDGE_BASE_PATH = "content/knowledge/aipify/developers";

export const DEVELOPER_ASSISTANT_RULES = [
  "Use Developer Knowledge Center first.",
  "Explain required permissions.",
  "Explain Governance implications.",
  "Explain Sandbox restrictions.",
  "Provide examples whenever possible.",
  "Never recommend bypassing security.",
  "Promote least-privilege architecture.",
  "Explain publishing expectations.",
  "Encourage testing before deployment.",
  "Recommend auditable implementations.",
] as const;

export const DEVELOPER_RECOMMENDATIONS = [
  "Minimal permissions.",
  "Reusable components.",
  "Clear documentation.",
  "Versioned releases.",
  "Safe defaults.",
  "Governance compatibility.",
  "Tenant isolation awareness.",
  "Strong error handling.",
  "Audit-friendly designs.",
  "Knowledge Center documentation for every extension.",
] as const;

export const DEVELOPER_KNOWLEDGE_TOPICS = [
  "SDK",
  "Skills",
  "Agents",
  "Marketplace",
  "Governance",
  "Permissions",
  "Sandbox",
  "Desktop Extensions",
  "Blueprints",
  "Publishing",
  "Integrations",
  "Workflows",
] as const;

/** Low-confidence footer when developer guidance should be escalated for review. */
export const DEVELOPER_LOW_CONFIDENCE_NOTE =
  "I'm not fully confident in this developer guidance. Please verify against the Developer Portal (/developers) or escalate for human review before deploying to production.";
