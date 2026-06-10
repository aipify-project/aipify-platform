/**
 * Skill placement and development workflow.
 * See CORE_FOUNDATION.md §21
 */

export const SKILL_LAYERS = [
  "platform",
  "customer_app",
  "embedded",
] as const;

export type SkillLayer = (typeof SKILL_LAYERS)[number];

export const SKILL_LAYER_PATHS: Record<
  SkillLayer,
  { routes: string[]; components: string[]; logic?: string[] }
> = {
  platform: {
    routes: ["app/platform/skills/"],
    components: ["components/platform/skills/"],
    logic: ["lib/platform/skills/", "services/platform/skills/"],
  },
  customer_app: {
    routes: ["app/app/skills/"],
    components: ["components/app/skills/"],
    logic: ["lib/app/skills/", "services/app/skills/"],
  },
  embedded: {
    routes: ["app/api/install/", "app/api/embed/"],
    components: ["components/embed/"],
    logic: ["lib/install/", "lib/embed/", "services/install/"],
  },
};

export const SKILL_DEVELOPMENT_WORKFLOW = [
  "define_skill",
  "determine_layer",
  "define_permissions",
  "define_approval_requirements",
  "implement",
  "validate_internally",
  "pilot_unonight",
  "release_publicly",
] as const;

export type SkillWorkflowStep = (typeof SKILL_DEVELOPMENT_WORKFLOW)[number];

export const PLATFORM_SKILL_RESPONSIBILITIES = [
  "enable_or_disable_globally",
  "define_plan_availability",
  "monitor_skill_health",
  "review_learning_behaviour",
  "manage_rollouts",
  "approve_public_release",
] as const;

export const CUSTOMER_SKILL_RESPONSIBILITIES = [
  "view_installed_skills",
  "configure_preferences",
  "enable_companion_settings",
  "review_recommendations",
  "manage_approvals",
  "monitor_activity",
] as const;

export const EMBEDDED_SKILL_RESPONSIBILITIES = [
  "collect_operational_context",
  "deliver_assistance",
  "execute_approved_actions",
  "surface_recommendations",
  "monitor_environment_health",
] as const;
