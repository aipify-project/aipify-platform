import type { DeploymentEntry, DeploymentGovernanceCenter } from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function parseDeployment(raw: unknown): DeploymentEntry {
  const row = asRecord(raw);
  return {
    deployment_key: String(row.deployment_key ?? ""),
    deployment_type: String(row.deployment_type ?? ""),
    version_label: String(row.version_label ?? ""),
    summary: String(row.summary ?? ""),
    pipeline_stage: String(row.pipeline_stage ?? ""),
    status: String(row.status ?? "pending"),
    risk_level: String(row.risk_level ?? "medium"),
    owner: String(row.owner ?? ""),
    rollback_ready: Boolean(row.rollback_ready),
    deployed_at: row.deployed_at ? String(row.deployed_at) : null,
    created_at: row.created_at ? String(row.created_at) : null,
  };
}

export function parseDeploymentGovernanceCenter(raw: unknown): DeploymentGovernanceCenter {
  const row = asRecord(raw);
  const dash = asRecord(row.dashboard);

  return {
    dashboard:
      Object.keys(dash).length > 0
        ? {
            current_production_version: String(dash.current_production_version ?? "main"),
            pending_deployments: Number(dash.pending_deployments ?? 0),
            failed_deployments: Number(dash.failed_deployments ?? 0),
            recent_releases: Number(dash.recent_releases ?? 0),
            rollback_ready_count: Number(dash.rollback_ready_count ?? 0),
            deployment_health_score: Number(dash.deployment_health_score ?? 0),
            deployment_health_band: String(dash.deployment_health_band ?? "healthy"),
            deployment_success_rate: Number(dash.deployment_success_rate ?? 0),
            validation_completion_rate: Number(dash.validation_completion_rate ?? 0),
            mean_time_to_recovery_hours: Number(dash.mean_time_to_recovery_hours ?? 0),
            operational_confidence: Number(dash.operational_confidence ?? 0),
            executive_trust_score: Number(dash.executive_trust_score ?? 0),
          }
        : null,
    deployments: Array.isArray(row.deployments) ? row.deployments.map(parseDeployment) : [],
    checklist_items: Array.isArray(row.checklist_items)
      ? row.checklist_items.map((c) => {
          const item = asRecord(c);
          return {
            checklist_key: String(item.checklist_key ?? ""),
            deployment_key: item.deployment_key ? String(item.deployment_key) : null,
            item_key: String(item.item_key ?? ""),
            label: String(item.label ?? ""),
            status: String(item.status ?? "pending"),
            is_critical: Boolean(item.is_critical),
          };
        })
      : [],
    post_validations: Array.isArray(row.post_validations)
      ? row.post_validations.map((v) => {
          const item = asRecord(v);
          return {
            validation_key: String(item.validation_key ?? ""),
            deployment_key: item.deployment_key ? String(item.deployment_key) : null,
            check_key: String(item.check_key ?? ""),
            label: String(item.label ?? ""),
            status: String(item.status ?? "pending"),
          };
        })
      : [],
    rollback_points: Array.isArray(row.rollback_points)
      ? row.rollback_points.map((r) => {
          const item = asRecord(r);
          return {
            rollback_key: String(item.rollback_key ?? ""),
            version_label: String(item.version_label ?? ""),
            readiness_status: String(item.readiness_status ?? "ready"),
            recovery_notes: String(item.recovery_notes ?? ""),
            risk_assessment: String(item.risk_assessment ?? ""),
          };
        })
      : [],
    approvals: Array.isArray(row.approvals)
      ? row.approvals.map((a) => {
          const item = asRecord(a);
          return {
            approval_key: String(item.approval_key ?? ""),
            deployment_key: String(item.deployment_key ?? ""),
            approval_level: Number(item.approval_level ?? 1),
            approver_role: String(item.approver_role ?? ""),
            status: String(item.status ?? "pending"),
            decided_at: item.decided_at ? String(item.decided_at) : null,
          };
        })
      : [],
    release_notes: Array.isArray(row.release_notes)
      ? row.release_notes.map((n) => {
          const item = asRecord(n);
          return {
            note_key: String(item.note_key ?? ""),
            deployment_key: item.deployment_key ? String(item.deployment_key) : null,
            audience: String(item.audience ?? "internal"),
            title: String(item.title ?? ""),
            content: String(item.content ?? ""),
            created_at: item.created_at ? String(item.created_at) : null,
          };
        })
      : [],
    insights: Array.isArray(row.insights)
      ? row.insights.map((i) => {
          const item = asRecord(i);
          return {
            insight_key: String(item.insight_key ?? ""),
            message: String(item.message ?? ""),
            priority: String(item.priority ?? "medium"),
          };
        })
      : [],
    recommendations: Array.isArray(row.recommendations)
      ? row.recommendations.map((r) => {
          const item = asRecord(r);
          return {
            recommendation_key: String(item.recommendation_key ?? ""),
            message: String(item.message ?? ""),
            priority: String(item.priority ?? "medium"),
          };
        })
      : [],
    governance_reviews: Array.isArray(row.governance_reviews)
      ? row.governance_reviews.map((gr) => {
          const item = asRecord(gr);
          return {
            review_key: String(item.review_key ?? ""),
            review_type: String(item.review_type ?? ""),
            prompt: String(item.prompt ?? ""),
            status: String(item.status ?? "pending"),
            completed_at: item.completed_at ? String(item.completed_at) : null,
          };
        })
      : [],
    links: row.links
      ? Object.fromEntries(Object.entries(asRecord(row.links)).map(([k, v]) => [k, String(v)]))
      : null,
    can_manage: Boolean(row.can_manage),
    can_contribute: Boolean(row.can_contribute),
    privacy_note: row.privacy_note ? String(row.privacy_note) : null,
  };
}
