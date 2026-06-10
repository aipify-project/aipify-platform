import type { PlanType } from "@/lib/platform/types";

/** Phase 17 — ten-step installation workflow (INSTALL_ENGINE.md §3). */
export type InstallWorkflowStepId =
  | "create_account"
  | "select_plan"
  | "register_domains"
  | "connect_systems"
  | "environment_discovery"
  | "recommend_skills"
  | "customer_approval"
  | "activate"
  | "learning_phase"
  | "first_executive_briefing";

export type BusinessType =
  | "saas"
  | "ecommerce"
  | "membership_platform"
  | "consulting"
  | "hospitality"
  | "education"
  | "community_platform"
  | "service_business"
  | "marketplace"
  | "unknown";

export type DetectedSystem =
  | "shopify"
  | "woocommerce"
  | "wordpress"
  | "supabase"
  | "stripe"
  | "klarna"
  | "resend"
  | "hubspot"
  | "custom_api"
  | "other";

export type WorkflowArea =
  | "customer_support"
  | "billing"
  | "onboarding"
  | "marketing"
  | "membership_management"
  | "product_management"
  | "moderation"
  | "reporting";

/** Embedded installation heartbeat (INSTALL_ENGINE.md §13). */
export type HeartbeatStatus =
  | "healthy"
  | "warning"
  | "disconnected"
  | "pending_update"
  | "paused";

export type HumanValidationAction = "approve" | "modify" | "reject";

export type InstallRolloutStage =
  | "aipify_internal"
  | "unonight_pilot"
  | "limited_beta"
  | "public";

export type InstallHealthDimension =
  | "connectivity"
  | "skill_adoption"
  | "support_effectiveness"
  | "recommendation_acceptance"
  | "operational_stability";

export type DiscoveryFinding = {
  businessType: BusinessType;
  confidence: number;
  workflows: WorkflowArea[];
  systems: DetectedSystem[];
  automationOpportunities: string[];
  supportNeeds: string[];
};

export type SkillRecommendation = {
  skillId: string;
  reason: string;
  priority: "high" | "medium" | "low";
};

export type EnvironmentDiscoveryResult = {
  installationId?: string;
  findings: DiscoveryFinding;
  recommendations: SkillRecommendation[];
  generatedAt: string;
};

export type HumanValidationState = {
  action: HumanValidationAction;
  confirmedBusinessType?: BusinessType;
  confirmedWorkflows?: WorkflowArea[];
  confirmedSystems?: DetectedSystem[];
  notes?: string;
  validatedAt: string;
};

export type InstallHealthInput = Partial<Record<InstallHealthDimension, number>>;

export type InstallTokenRecord = {
  installationId: string;
  tenantId: string;
  domain?: string;
  activationStatus: string;
  heartbeatScheduleMinutes: number;
};

export type PlanInstallLimits = {
  plan: PlanType;
  domains: number | "custom";
  installations: number | "custom";
};
