/** Allowlisted Kompis Operator tools — server-only contract (V1–V4). */

export const KOMPIS_OPERATOR_TOOL_KEYS = [
  "customer_profile_read",
  "agreement_status_read",
  "license_status_read",
  "domain_installation_status_read",
  "website_kompis_status_read",
  "app_access_status_read",
  "support_cases_read",
  "support_case_read",
  "notifications_read",
  "organization_members_read",
  "activity_summary_read",
  "knowledge_search",
  "content_inventory_read",
  "operator_history_read",
  "website_overview_read",
  "website_pages_read",
  "website_page_read",
  "website_navigation_read",
  "website_seo_audit",
  "website_content_quality_audit",
  "website_locale_coverage_read",
  "website_publish_history_read",
  "website_health_read",
  "website_preview_status_read",
  "website_page_draft_create",
  "website_page_draft_update",
  "website_seo_draft_update",
  "website_navigation_draft_update",
  "website_translation_draft_create",
  "website_section_draft_update",
  "website_image_metadata_draft_update",
  "website_draft_preview_create",
  "website_publish_approved_draft",
  "website_publish_rollback",
  "support_case_create",
  "support_case_reply",
  "notification_mark_read",
  "organization_profile_draft",
  "content_draft_create",
  "content_draft_update",
  "knowledge_draft_create",
] as const;

export type KompisOperatorToolKey = (typeof KOMPIS_OPERATOR_TOOL_KEYS)[number];

export type KompisOperatorRiskClass = 0 | 1 | 2 | 3;

export type KompisOperatorToolDefinition = {
  key: KompisOperatorToolKey;
  version: string;
  category: string;
  description: string;
  riskClass: KompisOperatorRiskClass;
  kind: "read" | "write";
  requiresApproval: boolean;
  requiredRoles: readonly string[];
  available: boolean;
  unavailableReason?: string;
  timeoutMs: number;
};

const READ = {
  kind: "read" as const,
  requiresApproval: false,
  requiredRoles: [] as const,
  available: true,
};

export const KOMPIS_OPERATOR_TOOL_REGISTRY: readonly KompisOperatorToolDefinition[] = [
  { key: "customer_profile_read", version: "1", category: "profile", description: "Read organization profile", riskClass: 0, ...READ, timeoutMs: 8000 },
  { key: "agreement_status_read", version: "1", category: "license", description: "Read agreement status", riskClass: 0, ...READ, timeoutMs: 8000 },
  { key: "license_status_read", version: "1", category: "license", description: "Read APP license", riskClass: 0, ...READ, timeoutMs: 8000 },
  { key: "domain_installation_status_read", version: "1", category: "install", description: "Read domain and installation", riskClass: 0, ...READ, timeoutMs: 8000 },
  { key: "website_kompis_status_read", version: "1", category: "kompis", description: "Read Website Kompis delivery", riskClass: 0, ...READ, timeoutMs: 8000 },
  { key: "app_access_status_read", version: "1", category: "access", description: "Read APP access status", riskClass: 0, ...READ, timeoutMs: 8000 },
  { key: "support_cases_read", version: "1", category: "support", description: "List organization support cases", riskClass: 0, ...READ, timeoutMs: 10000 },
  { key: "support_case_read", version: "1", category: "support", description: "Read one support case", riskClass: 0, ...READ, timeoutMs: 10000 },
  { key: "notifications_read", version: "1", category: "notifications", description: "Read own notifications", riskClass: 0, ...READ, timeoutMs: 8000 },
  { key: "organization_members_read", version: "1", category: "members", description: "Read organization members", riskClass: 0, ...READ, timeoutMs: 10000 },
  { key: "activity_summary_read", version: "1", category: "activity", description: "Read activity summary", riskClass: 0, ...READ, timeoutMs: 10000 },
  { key: "knowledge_search", version: "1", category: "knowledge", description: "Search authorized knowledge", riskClass: 0, ...READ, timeoutMs: 10000 },
  { key: "content_inventory_read", version: "1", category: "content", description: "List organization drafts", riskClass: 0, ...READ, timeoutMs: 8000 },
  { key: "operator_history_read", version: "1", category: "history", description: "Read Kompis history", riskClass: 0, ...READ, timeoutMs: 8000 },
  { key: "website_overview_read", version: "1", category: "website", description: "Read website operations overview", riskClass: 0, ...READ, timeoutMs: 8000 },
  { key: "website_pages_read", version: "1", category: "website", description: "List website page drafts", riskClass: 0, ...READ, timeoutMs: 8000 },
  { key: "website_page_read", version: "1", category: "website", description: "Read one website page draft", riskClass: 0, ...READ, timeoutMs: 8000 },
  { key: "website_navigation_read", version: "1", category: "website", description: "Read navigation drafts", riskClass: 0, ...READ, timeoutMs: 8000 },
  { key: "website_seo_audit", version: "1", category: "website", description: "Audit website SEO using authoritative drafts and delivery context", riskClass: 0, ...READ, timeoutMs: 10000 },
  { key: "website_content_quality_audit", version: "1", category: "website", description: "Audit website draft content quality", riskClass: 0, ...READ, timeoutMs: 10000 },
  { key: "website_locale_coverage_read", version: "1", category: "website", description: "Read website locale coverage", riskClass: 0, ...READ, timeoutMs: 8000 },
  { key: "website_publish_history_read", version: "1", category: "website", description: "Read website publish history", riskClass: 0, ...READ, timeoutMs: 8000 },
  { key: "website_health_read", version: "1", category: "website", description: "Read website runtime health", riskClass: 0, ...READ, timeoutMs: 8000 },
  { key: "website_preview_status_read", version: "1", category: "website", description: "Read website draft preview status", riskClass: 0, ...READ, timeoutMs: 8000 },
  {
    key: "website_page_draft_create",
    version: "1",
    category: "website",
    description: "Create website page draft",
    riskClass: 1,
    kind: "write",
    requiresApproval: true,
    requiredRoles: [],
    available: true,
    timeoutMs: 8000,
  },
  {
    key: "website_page_draft_update",
    version: "1",
    category: "website",
    description: "Update website page draft",
    riskClass: 1,
    kind: "write",
    requiresApproval: true,
    requiredRoles: [],
    available: true,
    timeoutMs: 8000,
  },
  {
    key: "website_seo_draft_update",
    version: "1",
    category: "website",
    description: "Create or update website SEO draft",
    riskClass: 1,
    kind: "write",
    requiresApproval: true,
    requiredRoles: [],
    available: true,
    timeoutMs: 8000,
  },
  {
    key: "website_navigation_draft_update",
    version: "1",
    category: "website",
    description: "Create navigation draft",
    riskClass: 2,
    kind: "write",
    requiresApproval: true,
    requiredRoles: ["owner", "admin", "organization_owner", "organization_admin"],
    available: true,
    timeoutMs: 8000,
  },
  {
    key: "website_translation_draft_create",
    version: "1",
    category: "website",
    description: "Create website translation draft",
    riskClass: 1,
    kind: "write",
    requiresApproval: true,
    requiredRoles: [],
    available: true,
    timeoutMs: 8000,
  },
  {
    key: "website_section_draft_update",
    version: "1",
    category: "website",
    description: "Create website section draft",
    riskClass: 1,
    kind: "write",
    requiresApproval: true,
    requiredRoles: [],
    available: true,
    timeoutMs: 8000,
  },
  {
    key: "website_image_metadata_draft_update",
    version: "1",
    category: "website",
    description: "Create image metadata draft",
    riskClass: 1,
    kind: "write",
    requiresApproval: true,
    requiredRoles: [],
    available: true,
    timeoutMs: 8000,
  },
  {
    key: "website_draft_preview_create",
    version: "1",
    category: "website",
    description: "Create APP-internal website draft preview",
    riskClass: 1,
    kind: "write",
    requiresApproval: true,
    requiredRoles: [],
    available: true,
    timeoutMs: 8000,
  },
  {
    key: "website_publish_approved_draft",
    version: "1",
    category: "website",
    description: "Publish approved website draft",
    riskClass: 2,
    kind: "write",
    requiresApproval: true,
    requiredRoles: ["owner", "admin", "organization_owner", "organization_admin"],
    available: false,
    unavailableReason: "no_authoritative_website_cms_publish_path_v4",
    timeoutMs: 12000,
  },
  {
    key: "website_publish_rollback",
    version: "1",
    category: "website",
    description: "Roll back website publish",
    riskClass: 2,
    kind: "write",
    requiresApproval: true,
    requiredRoles: ["owner", "admin", "organization_owner", "organization_admin"],
    available: false,
    unavailableReason: "no_authoritative_website_version_rollback_path_v4",
    timeoutMs: 12000,
  },
  {
    key: "support_case_create",
    version: "1",
    category: "support",
    description: "Create support case",
    riskClass: 2,
    kind: "write",
    requiresApproval: true,
    requiredRoles: ["owner", "admin", "organization_owner", "organization_admin"],
    available: true,
    timeoutMs: 12000,
  },
  {
    key: "support_case_reply",
    version: "1",
    category: "support",
    description: "Reply to support case",
    riskClass: 2,
    kind: "write",
    requiresApproval: true,
    requiredRoles: ["owner", "admin", "organization_owner", "organization_admin"],
    available: false,
    unavailableReason: "no_safe_support_reply_draft_path_v2",
    timeoutMs: 12000,
  },
  { key: "notification_mark_read", version: "1", category: "notifications", description: "Mark notification read", riskClass: 1, kind: "write", requiresApproval: true, requiredRoles: [], available: true, timeoutMs: 8000 },
  { key: "organization_profile_draft", version: "1", category: "profile", description: "Create profile draft", riskClass: 1, kind: "write", requiresApproval: true, requiredRoles: [], available: true, timeoutMs: 8000 },
  { key: "content_draft_create", version: "1", category: "content", description: "Create content draft", riskClass: 1, kind: "write", requiresApproval: true, requiredRoles: [], available: true, timeoutMs: 8000 },
  { key: "content_draft_update", version: "1", category: "content", description: "Update content draft", riskClass: 1, kind: "write", requiresApproval: true, requiredRoles: [], available: true, timeoutMs: 8000 },
  { key: "knowledge_draft_create", version: "1", category: "knowledge", description: "Create knowledge draft", riskClass: 1, kind: "write", requiresApproval: true, requiredRoles: [], available: true, timeoutMs: 8000 },
] as const;

export function getKompisOperatorTool(key: string): KompisOperatorToolDefinition | null {
  return KOMPIS_OPERATOR_TOOL_REGISTRY.find((tool) => tool.key === key) ?? null;
}

export function isKompisOperatorToolKey(value: string): value is KompisOperatorToolKey {
  return KOMPIS_OPERATOR_TOOL_REGISTRY.some((tool) => tool.key === value);
}

export function listAvailableKompisOperatorTools() {
  return KOMPIS_OPERATOR_TOOL_REGISTRY.filter((tool) => tool.available);
}
