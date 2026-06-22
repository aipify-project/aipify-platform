import {
  getEccHealthMetricBadge,
  mapHealthScoreToHealthState,
  type SemanticBadgeType,
} from "@/lib/design/semantic-status-system";

export type CommandBriefKpiStatusLabels = {
  sinceLastLoginZero: string;
  sinceLastLoginActive: string;
  preparedZero: string;
  preparedActive: string;
  attentionZero: string;
  attentionActive: string;
  approvalZero: string;
  approvalActive: string;
  healthHealthy: string;
  healthModerate: string;
  healthLow: string;
  healthCritical: string;
  healthUnavailable: string;
  nextActionZero: string;
  nextActionActive: string;
};

export type CommandBriefKpiStatus = {
  semanticType: SemanticBadgeType;
  semanticValue: string;
  statusLabel: string;
  a11yLabel: string;
};

function withCount(template: string, count: number): string {
  return template.replace("{count}", String(count));
}

export function resolveSinceLastLoginKpiStatus(
  count: number,
  labels: CommandBriefKpiStatusLabels
): CommandBriefKpiStatus {
  if (count <= 0) {
    return {
      semanticType: "severity",
      semanticValue: "info",
      statusLabel: labels.sinceLastLoginZero,
      a11yLabel: labels.sinceLastLoginZero,
    };
  }
  const label = withCount(labels.sinceLastLoginActive, count);
  return {
    semanticType: "severity",
    semanticValue: count >= 5 ? "high" : "medium",
    statusLabel: label,
    a11yLabel: label,
  };
}

export function resolvePreparedKpiStatus(
  count: number,
  labels: CommandBriefKpiStatusLabels
): CommandBriefKpiStatus {
  if (count <= 0) {
    return {
      semanticType: "severity",
      semanticValue: "info",
      statusLabel: labels.preparedZero,
      a11yLabel: labels.preparedZero,
    };
  }
  const label = withCount(labels.preparedActive, count);
  return {
    semanticType: "workflow",
    semanticValue: "in_progress",
    statusLabel: label,
    a11yLabel: label,
  };
}

export function resolveAttentionKpiStatus(
  count: number,
  labels: CommandBriefKpiStatusLabels
): CommandBriefKpiStatus {
  if (count <= 0) {
    return {
      semanticType: "workflow",
      semanticValue: "completed",
      statusLabel: labels.attentionZero,
      a11yLabel: labels.attentionZero,
    };
  }
  const label = withCount(labels.attentionActive, count);
  return {
    semanticType: "severity",
    semanticValue: count >= 3 ? "high" : "medium",
    statusLabel: label,
    a11yLabel: label,
  };
}

export function resolveAwaitingApprovalKpiStatus(
  count: number,
  labels: CommandBriefKpiStatusLabels
): CommandBriefKpiStatus {
  if (count <= 0) {
    return {
      semanticType: "workflow",
      semanticValue: "completed",
      statusLabel: labels.approvalZero,
      a11yLabel: labels.approvalZero,
    };
  }
  const label = withCount(labels.approvalActive, count);
  return {
    semanticType: "workflow",
    semanticValue: "awaiting_approval",
    statusLabel: label,
    a11yLabel: label,
  };
}

export function resolveHealthKpiStatus(
  score: number | null,
  labels: CommandBriefKpiStatusLabels
): CommandBriefKpiStatus {
  if (score == null || Number.isNaN(score)) {
    return {
      semanticType: "access",
      semanticValue: "restricted",
      statusLabel: labels.healthUnavailable,
      a11yLabel: labels.healthUnavailable,
    };
  }

  const badge = getEccHealthMetricBadge(score);
  const state = mapHealthScoreToHealthState(score);
  const statusLabel =
    state === "healthy"
      ? labels.healthHealthy
      : state === "moderate"
        ? labels.healthModerate
        : state === "poor"
          ? labels.healthLow
          : labels.healthCritical;

  return {
    semanticType: badge.type,
    semanticValue: badge.value,
    statusLabel,
    a11yLabel: statusLabel,
  };
}

export function resolveNextActionKpiStatus(
  hasAction: boolean,
  labels: CommandBriefKpiStatusLabels
): CommandBriefKpiStatus {
  if (!hasAction) {
    return {
      semanticType: "workflow",
      semanticValue: "completed",
      statusLabel: labels.nextActionZero,
      a11yLabel: labels.nextActionZero,
    };
  }
  return {
    semanticType: "workflow",
    semanticValue: "in_progress",
    statusLabel: labels.nextActionActive,
    a11yLabel: labels.nextActionActive,
  };
}
