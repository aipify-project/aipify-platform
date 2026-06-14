import type {
  ArchiveItem,
  LegacyInsight,
  LegacyMilestone,
  LegacyRecommendation,
  LegacyReflectionPrompt,
  LegacySession,
  LegacySnapshot,
  LegacyTimelineEvent,
  LegacyProject,
  OrganizationalLegacyCenter,
  PreservedValue,
} from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export function parseOrganizationalLegacyCenter(raw: unknown): OrganizationalLegacyCenter {
  const row = asRecord(raw);
  const dash = asRecord(row.dashboard);
  const exec = asRecord(row.executive_view);

  return {
    dashboard:
      Object.keys(dash).length > 0
        ? {
            legacy_score: Number(dash.legacy_score ?? 0),
            legacy_health_label: String(dash.legacy_health_label ?? "maturing"),
            projects_in_progress: Number(dash.projects_in_progress ?? 0),
            milestones_documented: Number(dash.milestones_documented ?? 0),
            values_preserved: Number(dash.values_preserved ?? 0),
            archives_maintained: Number(dash.archives_maintained ?? 0),
            reflection_participation_pct: Number(dash.reflection_participation_pct ?? 0),
            institutional_continuity_pct: Number(dash.institutional_continuity_pct ?? 0),
            values_awareness_pct: Number(dash.values_awareness_pct ?? 0),
            leadership_confidence: Number(dash.leadership_confidence ?? 0),
          }
        : null,
    legacy_projects: Array.isArray(row.legacy_projects)
      ? row.legacy_projects.map((p) => {
          const item = asRecord(p);
          return {
            project_key: String(item.project_key ?? ""),
            domain: String(item.domain ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
            status: String(item.status ?? "in_progress"),
          } satisfies LegacyProject;
        })
      : [],
    milestones: Array.isArray(row.milestones)
      ? row.milestones.map((m) => {
          const item = asRecord(m);
          return {
            milestone_key: String(item.milestone_key ?? ""),
            domain: String(item.domain ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
            documented_at: item.documented_at ? String(item.documented_at) : null,
            status: String(item.status ?? "documented"),
          } satisfies LegacyMilestone;
        })
      : [],
    values_preserved: Array.isArray(row.values_preserved)
      ? row.values_preserved.map((v) => {
          const item = asRecord(v);
          return {
            value_key: String(item.value_key ?? ""),
            label: String(item.label ?? ""),
            principle: String(item.principle ?? ""),
          } satisfies PreservedValue;
        })
      : [],
    legacy_archive: Array.isArray(row.legacy_archive)
      ? row.legacy_archive.map((a) => {
          const item = asRecord(a);
          return {
            archive_key: String(item.archive_key ?? ""),
            archive_type: String(item.archive_type ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
            archived_at: item.archived_at ? String(item.archived_at) : null,
          } satisfies ArchiveItem;
        })
      : [],
    reflection_prompts: Array.isArray(row.reflection_prompts)
      ? row.reflection_prompts.map((r) => {
          const item = asRecord(r);
          return {
            reflection_key: String(item.reflection_key ?? ""),
            prompt: String(item.prompt ?? ""),
            domain: String(item.domain ?? ""),
          } satisfies LegacyReflectionPrompt;
        })
      : [],
    timeline: Array.isArray(row.timeline)
      ? row.timeline.map((t) => {
          const item = asRecord(t);
          return {
            timeline_key: String(item.timeline_key ?? ""),
            event_type: String(item.event_type ?? ""),
            domain: String(item.domain ?? ""),
            label: String(item.label ?? ""),
            summary: String(item.summary ?? ""),
            recorded_at: item.recorded_at ? String(item.recorded_at) : null,
          } satisfies LegacyTimelineEvent;
        })
      : [],
    snapshots: Array.isArray(row.snapshots)
      ? row.snapshots.map((s) => {
          const item = asRecord(s);
          return {
            snapshot_key: String(item.snapshot_key ?? ""),
            period_label: String(item.period_label ?? ""),
            legacy_score: Number(item.legacy_score ?? 0),
            summary: String(item.summary ?? ""),
            captured_at: item.captured_at ? String(item.captured_at) : null,
          } satisfies LegacySnapshot;
        })
      : [],
    insights: Array.isArray(row.insights)
      ? row.insights.map((i) => {
          const item = asRecord(i);
          return {
            insight_key: String(item.insight_key ?? ""),
            message: String(item.message ?? ""),
            priority: String(item.priority ?? "medium"),
          } satisfies LegacyInsight;
        })
      : [],
    recommendations: Array.isArray(row.recommendations)
      ? row.recommendations.map((r) => {
          const item = asRecord(r);
          return {
            recommendation_key: String(item.recommendation_key ?? ""),
            message: String(item.message ?? ""),
            priority: String(item.priority ?? "medium"),
          } satisfies LegacyRecommendation;
        })
      : [],
    legacy_sessions: Array.isArray(row.legacy_sessions)
      ? row.legacy_sessions.map((s) => {
          const item = asRecord(s);
          return {
            session_key: String(item.session_key ?? ""),
            session_type: String(item.session_type ?? ""),
            prompt: String(item.prompt ?? ""),
            status: String(item.status ?? "pending"),
            completed_at: item.completed_at ? String(item.completed_at) : null,
          } satisfies LegacySession;
        })
      : [],
    executive_view:
      Object.keys(exec).length > 0
        ? {
            historical_milestones: String(exec.historical_milestones ?? ""),
            values_continuity: String(exec.values_continuity ?? ""),
            reflection_trends: String(exec.reflection_trends ?? ""),
            stewardship_opportunities: String(exec.stewardship_opportunities ?? ""),
          }
        : null,
    links: row.links
      ? Object.fromEntries(Object.entries(asRecord(row.links)).map(([k, v]) => [k, String(v)]))
      : null,
    can_manage: Boolean(row.can_manage),
    can_contribute: Boolean(row.can_contribute),
    privacy_note: row.privacy_note ? String(row.privacy_note) : null,
  };
}
