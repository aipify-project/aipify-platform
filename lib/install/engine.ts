import { getPlanLimit } from "@/lib/core/plans";
import type { PlanType } from "@/lib/platform/types";
import type {
  BusinessType,
  DetectedSystem,
  HeartbeatStatus,
  InstallRolloutStage,
  InstallWorkflowStepId,
  WorkflowArea,
} from "./types";

/** Default supervised learning period (INSTALL_ENGINE.md §14). */
export const LEARNING_PHASE_DAYS = 30;

/** Default embedded heartbeat interval in minutes (INSTALL_ENGINE.md §13). */
export const DEFAULT_HEARTBEAT_INTERVAL_MINUTES = 15;

export const INSTALL_WORKFLOW_STEPS: ReadonlyArray<{
  id: InstallWorkflowStepId;
  order: number;
  layer: "platform" | "customer" | "embed" | "shared";
}> = [
  { id: "create_account", order: 1, layer: "platform" },
  { id: "select_plan", order: 2, layer: "customer" },
  { id: "register_domains", order: 3, layer: "customer" },
  { id: "connect_systems", order: 4, layer: "customer" },
  { id: "environment_discovery", order: 5, layer: "embed" },
  { id: "recommend_skills", order: 6, layer: "shared" },
  { id: "customer_approval", order: 7, layer: "customer" },
  { id: "activate", order: 8, layer: "embed" },
  { id: "learning_phase", order: 9, layer: "shared" },
  { id: "first_executive_briefing", order: 10, layer: "customer" },
] as const;

export const BUSINESS_TYPES: readonly BusinessType[] = [
  "saas",
  "ecommerce",
  "membership_platform",
  "consulting",
  "hospitality",
  "education",
  "community_platform",
  "service_business",
  "marketplace",
  "unknown",
] as const;

export const DETECTED_SYSTEMS: readonly DetectedSystem[] = [
  "shopify",
  "woocommerce",
  "wordpress",
  "supabase",
  "stripe",
  "klarna",
  "resend",
  "hubspot",
  "custom_api",
  "other",
] as const;

export const WORKFLOW_AREAS: readonly WorkflowArea[] = [
  "customer_support",
  "billing",
  "onboarding",
  "marketing",
  "membership_management",
  "product_management",
  "moderation",
  "reporting",
] as const;

export const HEARTBEAT_STATUSES: readonly HeartbeatStatus[] = [
  "healthy",
  "warning",
  "disconnected",
  "pending_update",
  "paused",
] as const;

/** Internal rollout order (INSTALL_ENGINE.md §21). */
export const INSTALL_ROLLOUT_STAGES: readonly InstallRolloutStage[] = [
  "aipify_internal",
  "unonight_pilot",
  "limited_beta",
  "public",
] as const;

export const HUMAN_VALIDATION_PROMPT =
  "Have we understood your business correctly?";

export function getPlanInstallLimits(plan: PlanType) {
  return {
    plan,
    domains: getPlanLimit(plan, "domains"),
    installations: getPlanLimit(plan, "installations"),
  };
}

export function isHeartbeatStatus(value: string): value is HeartbeatStatus {
  return (HEARTBEAT_STATUSES as readonly string[]).includes(value);
}

export function mapHeartbeatToInstallationStatus(
  heartbeat: HeartbeatStatus
): "active" | "warning" | "suspended" {
  switch (heartbeat) {
    case "healthy":
      return "active";
    case "warning":
    case "pending_update":
      return "warning";
    case "disconnected":
    case "paused":
      return "suspended";
  }
}

export function getLearningPhaseEndDate(startedAt: Date): Date {
  const end = new Date(startedAt);
  end.setDate(end.getDate() + LEARNING_PHASE_DAYS);
  return end;
}

export function isLearningPhaseActive(startedAt: Date | string | null): boolean {
  if (!startedAt) return false;
  const start = typeof startedAt === "string" ? new Date(startedAt) : startedAt;
  return new Date() < getLearningPhaseEndDate(start);
}
