import type { CommandBriefPanel, CommandBriefSection, CommandBriefSectionKey, CommandBriefSignal } from "./types";

const CORE_PREFIX = "customerApp.companionPlatformKnowledge.commandBriefCore";

const SECTION_META: Record<
  CommandBriefSectionKey,
  {
    title_key: string;
    empty_title_key: string;
    empty_explanation_key: string;
    empty_action_key: string;
  }
> = {
  requires_attention: {
    title_key: `${CORE_PREFIX}.sections.requiresAttention.title`,
    empty_title_key: `${CORE_PREFIX}.sections.requiresAttention.emptyTitle`,
    empty_explanation_key: `${CORE_PREFIX}.sections.requiresAttention.emptyExplanation`,
    empty_action_key: `${CORE_PREFIX}.sections.requiresAttention.emptyAction`,
  },
  since_last: {
    title_key: `${CORE_PREFIX}.sections.sinceLast.title`,
    empty_title_key: `${CORE_PREFIX}.sections.sinceLast.emptyTitle`,
    empty_explanation_key: `${CORE_PREFIX}.sections.sinceLast.emptyExplanation`,
    empty_action_key: `${CORE_PREFIX}.sections.sinceLast.emptyAction`,
  },
  completed_by_aipify: {
    title_key: `${CORE_PREFIX}.sections.completedByAipify.title`,
    empty_title_key: `${CORE_PREFIX}.sections.completedByAipify.emptyTitle`,
    empty_explanation_key: `${CORE_PREFIX}.sections.completedByAipify.emptyExplanation`,
    empty_action_key: `${CORE_PREFIX}.sections.completedByAipify.emptyAction`,
  },
  opportunities: {
    title_key: `${CORE_PREFIX}.sections.opportunities.title`,
    empty_title_key: `${CORE_PREFIX}.sections.opportunities.emptyTitle`,
    empty_explanation_key: `${CORE_PREFIX}.sections.opportunities.emptyExplanation`,
    empty_action_key: `${CORE_PREFIX}.sections.opportunities.emptyAction`,
  },
  recommended_next_steps: {
    title_key: `${CORE_PREFIX}.sections.recommendedNextSteps.title`,
    empty_title_key: `${CORE_PREFIX}.sections.recommendedNextSteps.emptyTitle`,
    empty_explanation_key: `${CORE_PREFIX}.sections.recommendedNextSteps.emptyExplanation`,
    empty_action_key: `${CORE_PREFIX}.sections.recommendedNextSteps.emptyAction`,
  },
};

function isAttentionSignal(signal: CommandBriefSignal): boolean {
  return (
    signal.signal_type === "attention" ||
    signal.signal_type === "alert" ||
    signal.signal_type === "risk" ||
    signal.signal_type === "anomaly" ||
    signal.severity === "critical" ||
    signal.severity === "high"
  );
}

function isOpportunitySignal(signal: CommandBriefSignal): boolean {
  return signal.signal_type === "opportunity" || signal.signal_type === "health_score";
}

function isRecommendationSignal(signal: CommandBriefSignal): boolean {
  return signal.signal_type === "recommendation" || signal.signal_type === "follow_up";
}

function buildSection(
  sectionKey: CommandBriefSectionKey,
  signals: readonly CommandBriefSignal[],
): CommandBriefSection {
  const meta = SECTION_META[sectionKey];
  return {
    section_key: sectionKey,
    title_key: meta.title_key,
    empty_title_key: meta.empty_title_key,
    empty_explanation_key: meta.empty_explanation_key,
    empty_action_key: meta.empty_action_key,
    signals,
  };
}

export function buildCommandBriefSections(
  signals: readonly CommandBriefSignal[],
): CommandBriefSection[] {
  const requiresAttention = signals.filter(
    (signal) =>
      isAttentionSignal(signal) &&
      (signal.status === "unresolved" || signal.status === "new" || signal.status === "acknowledged"),
  );

  const sinceLast = signals.filter(
    (signal) =>
      signal.since_last_bucket === "since_last" || signal.since_last_bucket === "still_unresolved",
  );

  const completedByAipify = signals.filter(
    (signal) =>
      signal.status === "completed" || signal.since_last_bucket === "recently_completed",
  );

  const opportunities = signals.filter(
    (signal) => isOpportunitySignal(signal) && signal.status !== "completed",
  );

  const recommendedNextSteps = signals.filter(
    (signal) => isRecommendationSignal(signal) && signal.related_action?.executable !== false,
  );

  return [
    buildSection("requires_attention", requiresAttention.slice(0, 12)),
    buildSection("since_last", sinceLast.slice(0, 12)),
    buildSection("completed_by_aipify", completedByAipify.slice(0, 8)),
    buildSection("opportunities", opportunities.slice(0, 8)),
    buildSection("recommended_next_steps", recommendedNextSteps.slice(0, 8)),
  ];
}

export function resolveCommandBriefPanelFromPermissions(input: {
  effectivePermissions: readonly string[];
  surface?: "app" | "platform" | "partners" | "super";
}): CommandBriefPanel {
  if (input.surface === "super") return "super_admin";
  if (input.surface === "platform") return "platform";
  if (input.surface === "partners") return "partners";
  return "app";
}

export const COMMAND_BRIEF_PANEL_PERMISSIONS: Record<CommandBriefPanel, readonly string[]> = {
  app: ["executive.view"],
  platform: ["platform.view", "platform_support.view"],
  partners: ["partners.view"],
  super_admin: ["super_admin.view"],
};

export function canAccessCommandBriefPanel(
  panel: CommandBriefPanel,
  effectivePermissions: readonly string[],
): boolean {
  const required = COMMAND_BRIEF_PANEL_PERMISSIONS[panel];
  return required.some((permission) => effectivePermissions.includes(permission));
}
