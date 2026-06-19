export type CompanionSkillsTab =
  | "overview"
  | "installed"
  | "marketplace"
  | "specialists"
  | "knowledge"
  | "permissions"
  | "training"
  | "companion"
  | "executive"
  | "reports";

export type SkillRow = {
  id: string;
  skill_key?: string;
  skill_id_label?: string;
  skill_name: string;
  category?: string;
  description?: string;
  version_label?: string;
  status?: string;
  permissions?: unknown;
  knowledge_sources?: unknown;
};

export type CompanionSkillsCenter = {
  found: boolean;
  principle?: string;
  governance_note?: string;
  section?: string;
  organization?: { id: string; name: string };
  overview?: Record<string, string | number | undefined>;
  skill_registry?: SkillRow[];
  skill_marketplace?: Record<string, unknown>[];
  specialist_framework?: Record<string, unknown>[];
  knowledge_source_governance?: Record<string, unknown>[];
  skill_permissions?: Record<string, unknown>;
  training_engine?: Record<string, unknown>[];
  capability_profiles?: Record<string, unknown>[];
  capability_bundles?: Record<string, unknown>[];
  business_pack_integration?: Record<string, unknown>[];
  skill_health_monitoring?: Record<string, unknown>[];
  installation_workflow?: Record<string, unknown>;
  companion_skill_advisor?: Record<string, unknown>;
  executive_dashboard?: Record<string, unknown>;
  reports?: Record<string, unknown>;
  audit_recent?: { event_type: string; summary: string; created_at?: string }[];
  mobile_access?: Record<string, unknown>;
  routes?: Record<string, string>;
  error?: string;
};

export type CompanionSkillsLabels = {
  title: string;
  subtitle: string;
  loading: string;
  back: string;
  principle: string;
  governanceNote: string;
  emptyState: string;
  accessDenied: string;
  tabs: Record<CompanionSkillsTab, string>;
  overview: {
    installedSkills: string;
    activeSkills: string;
    marketplaceAvailable: string;
    specialists: string;
    knowledgeSources: string;
    trainingInProgress: string;
    capabilityBundles: string;
    skillsNeedingAttention: string;
  };
  actions: {
    installSkill: string;
    activateSkill: string;
    completeTraining: string;
    createSpecialist: string;
    installBundle: string;
    openMarketplace: string;
    openTraining: string;
    openLegacyMarketplace: string;
  };
  skillStatuses: Record<string, string>;
  healthStatuses: Record<string, string>;
  marketplacePage: { title: string; subtitle: string };
  trainingPage: { title: string; subtitle: string };
};
