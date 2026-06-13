import type { BusinessDiscoveryCenter } from "./types";
import { DISCOVERY_PHASES } from "./constants";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export function parseBusinessDiscoveryCenter(raw: unknown): BusinessDiscoveryCenter {
  const row = asRecord(raw);
  const settings = asRecord(row.settings);
  const phase = Number(settings.current_phase ?? row.current_phase ?? 1);

  return {
    current_phase: DISCOVERY_PHASES.includes(phase as (typeof DISCOVERY_PHASES)[number])
      ? (phase as BusinessDiscoveryCenter["current_phase"])
      : 1,
    overall_readiness: String(settings.overall_readiness ?? row.overall_readiness ?? "learning"),
    introduction_message: String(row.introduction_message ?? ""),
    profile: row.profile
      ? {
          company_name: asRecord(row.profile).company_name
            ? String(asRecord(row.profile).company_name)
            : null,
          industry: asRecord(row.profile).industry ? String(asRecord(row.profile).industry) : null,
          company_size: asRecord(row.profile).company_size
            ? String(asRecord(row.profile).company_size)
            : null,
          primary_language: asRecord(row.profile).primary_language
            ? String(asRecord(row.profile).primary_language)
            : null,
          confidence_score: Number(asRecord(row.profile).confidence_score ?? 0),
        }
      : null,
    systems: Array.isArray(row.systems)
      ? row.systems.map((s) => {
          const item = asRecord(s);
          return {
            system_key: String(item.system_key ?? ""),
            system_name: String(item.system_name ?? ""),
            system_type: String(item.system_type ?? ""),
            purpose: item.purpose ? String(item.purpose) : null,
            access_level: String(item.access_level ?? "metadata_only"),
            integration_status: String(item.integration_status ?? "discovered"),
            confidence_score: Number(item.confidence_score ?? 0),
          };
        })
      : [],
    knowledge: Array.isArray(row.knowledge_sources)
      ? row.knowledge_sources.map((k) => {
          const item = asRecord(k);
          return {
            source_key: String(item.source_key ?? ""),
            source_label: String(item.source_label ?? ""),
            source_type: String(item.source_type ?? ""),
            item_count: Number(item.item_count ?? 0),
            coverage_score: Number(item.coverage_score ?? 0),
            status: String(item.status ?? "discovered"),
          };
        })
      : Array.isArray(row.knowledge)
        ? row.knowledge.map((k) => {
            const item = asRecord(k);
            return {
              source_key: String(item.source_key ?? ""),
              source_label: String(item.source_label ?? ""),
              source_type: String(item.source_type ?? ""),
              item_count: Number(item.item_count ?? 0),
              coverage_score: Number(item.coverage_score ?? 0),
              status: String(item.status ?? "discovered"),
            };
          })
        : [],
    workflows: Array.isArray(row.workflows)
      ? row.workflows.map((w) => {
          const item = asRecord(w);
          return {
            workflow_key: String(item.workflow_key ?? ""),
            workflow_name: String(item.workflow_name ?? ""),
            workflow_type: String(item.workflow_type ?? ""),
            trigger_event: item.trigger_event ? String(item.trigger_event) : null,
            automation_opportunity: Boolean(item.automation_opportunity),
            confidence_score: Number(item.confidence_score ?? 0),
          };
        })
      : [],
    actions: Array.isArray(row.actions)
      ? row.actions.map((a) => {
          const item = asRecord(a);
          return {
            action_key: String(item.action_key ?? ""),
            action_label: String(item.action_label ?? ""),
            action_type: String(item.action_type ?? ""),
            approval_level: Number(item.approval_level ?? 1),
            available: Boolean(item.available),
            confidence_score: Number(item.confidence_score ?? 0),
          };
        })
      : [],
    people: Array.isArray(row.people)
      ? row.people.map((p) => {
          const item = asRecord(p);
          return {
            team_key: String(item.team_key ?? ""),
            team_name: String(item.team_name ?? ""),
            roles: item.roles,
          };
        })
      : [],
    readiness: Array.isArray(row.readiness_assessment)
      ? row.readiness_assessment.map((r) => {
          const item = asRecord(r);
          return {
            companion_key: String(item.companion_key ?? ""),
            readiness_state: String(item.readiness_state ?? "learning"),
            confidence_score: Number(item.confidence_score ?? 0),
          };
        })
      : Array.isArray(row.readiness)
        ? row.readiness.map((r) => {
            const item = asRecord(r);
            return {
              companion_key: String(item.companion_key ?? ""),
              readiness_state: String(item.readiness_state ?? "learning"),
              confidence_score: Number(item.confidence_score ?? 0),
            };
          })
        : [],
    recommendations: Array.isArray(row.recommendations)
      ? row.recommendations.map((rec) => {
          const item = asRecord(rec);
          return {
            key: String(item.key ?? ""),
            message: String(item.message ?? item.recommendation ?? ""),
          };
        })
      : [],
    recent_audit: Array.isArray(row.recent_audit)
      ? row.recent_audit.map((entry) => {
          const e = asRecord(entry);
          return {
            id: String(e.id ?? ""),
            event_type: String(e.event_type ?? ""),
            summary: e.summary ? String(e.summary) : null,
            created_at: String(e.created_at ?? ""),
          };
        })
      : [],
    blueprint: row.blueprint ? asRecord(row.blueprint) : null,
    can_manage: Boolean(row.can_manage),
    can_run: Boolean(row.can_run),
    privacy_note: row.privacy_note ? String(row.privacy_note) : null,
  };
}
