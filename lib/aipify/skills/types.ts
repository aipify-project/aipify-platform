export const SKILL_RISK_LEVELS = ["low", "medium", "high"] as const;
export type SkillRiskLevel = (typeof SKILL_RISK_LEVELS)[number];

export const SKILL_STORE_CATEGORIES = [
  "Support",
  "Quality",
  "Governance",
  "Automation",
  "Knowledge",
  "Marketing",
  "Commerce",
  "Developer",
  "Analytics",
  "Industry",
  "Executive",
  "Operational",
  "Companion",
  "Moderation",
] as const;

export type SkillCatalogItem = {
  id: string;
  key: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  version: string;
  author: string;
  risk_level: string;
  minimum_plan: string;
  requires_approval: boolean;
  requires_installation: boolean;
  status: string;
  installed: boolean;
  plan_allowed: boolean;
};

export type SkillDependency = {
  key: string;
  name: string;
  required?: boolean;
};

export type SkillDetail = SkillCatalogItem & {
  required_permissions: string[];
  required_integrations: string[];
  documentation_links: string[];
  knowledge_center_category?: string | null;
  module_key?: string | null;
  dependencies: SkillDependency[];
  dependency_check: { satisfied: boolean; missing: SkillDependency[] };
  tenant_skill_id?: string | null;
  tenant_status?: string | null;
  permissions: Array<{ permission_key: string; scope: string; approved: boolean }>;
};

export type SkillStoreCard = {
  has_customer: boolean;
  installed_count?: number;
  available_count?: number;
  pending_approvals?: number;
  philosophy?: string;
  privacy_note?: string;
};

export type SkillInstallEvent = {
  id: string;
  event_type: string;
  skill_key: string;
  skill_name: string;
  metadata: Record<string, unknown>;
  created_at: string;
};

export type SkillInstallResult = {
  status: string;
  tenant_skill_id?: string;
  skill_key?: string;
};
