export const KOMPIS_WORKSPACE_SURFACES = [
  "public_website",
  "authenticated_portal",
  "member_area",
  "customer_app_module",
] as const;
export type KompisWorkspaceSurface = (typeof KOMPIS_WORKSPACE_SURFACES)[number];

export const KOMPIS_CONFIRMATION_LEVELS = [
  "none",
  "lightweight",
  "explicit",
  "strong",
  "prohibited",
] as const;
export type KompisConfirmationLevel = (typeof KOMPIS_CONFIRMATION_LEVELS)[number];

export const KOMPIS_TOOL_KINDS = ["read", "draft", "write"] as const;
export type KompisToolKind = (typeof KOMPIS_TOOL_KINDS)[number];

export const KOMPIS_RISK_CLASSES = ["low", "moderate", "elevated", "high", "critical"] as const;
export type KompisRiskClass = (typeof KOMPIS_RISK_CLASSES)[number];

export const KOMPIS_KNOWLEDGE_SOURCE_TYPES = [
  "system_rules",
  "approved_faq",
  "product_service_catalog",
  "help_documentation",
  "authorized_account_context",
  "general_guidance",
] as const;
export type KompisKnowledgeSourceType = (typeof KOMPIS_KNOWLEDGE_SOURCE_TYPES)[number];

export const KOMPIS_SESSION_KINDS = ["public", "authenticated"] as const;
export type KompisSessionKind = (typeof KOMPIS_SESSION_KINDS)[number];

export const KOMPIS_CONTRACT_STATUSES = ["draft", "published", "deprecated"] as const;
export type KompisContractStatus = (typeof KOMPIS_CONTRACT_STATUSES)[number];

function isMember<T extends readonly string[]>(value: unknown, values: T): value is T[number] {
  return typeof value === "string" && (values as readonly string[]).includes(value);
}

export const isKompisWorkspaceSurface = (v: unknown): v is KompisWorkspaceSurface =>
  isMember(v, KOMPIS_WORKSPACE_SURFACES);
export const isKompisConfirmationLevel = (v: unknown): v is KompisConfirmationLevel =>
  isMember(v, KOMPIS_CONFIRMATION_LEVELS);
export const isKompisToolKind = (v: unknown): v is KompisToolKind => isMember(v, KOMPIS_TOOL_KINDS);
export const isKompisRiskClass = (v: unknown): v is KompisRiskClass => isMember(v, KOMPIS_RISK_CLASSES);
export const isKompisKnowledgeSourceType = (v: unknown): v is KompisKnowledgeSourceType =>
  isMember(v, KOMPIS_KNOWLEDGE_SOURCE_TYPES);
export const isKompisSessionKind = (v: unknown): v is KompisSessionKind =>
  isMember(v, KOMPIS_SESSION_KINDS);
export const isKompisContractStatus = (v: unknown): v is KompisContractStatus =>
  isMember(v, KOMPIS_CONTRACT_STATUSES);
