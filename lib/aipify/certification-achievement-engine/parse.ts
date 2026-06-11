import type {
  CertificateExportPayload,
  CertificationAchievementEngineCard,
  CertificationAchievementEngineDashboard,
  CertificationAchievementSummary,
} from "./types";

function asRecordList(value: unknown): Array<Record<string, unknown>> {
  return Array.isArray(value) ? (value as Array<Record<string, unknown>>) : [];
}

export function parseCertificationAchievementEngineCard(
  data: unknown
): CertificationAchievementEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    active_certifications:
      typeof d.active_certifications === "number" ? d.active_certifications : undefined,
    expired_certifications:
      typeof d.expired_certifications === "number" ? d.expired_certifications : undefined,
    badges_awarded: typeof d.badges_awarded === "number" ? d.badges_awarded : undefined,
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    ...d,
  };
}

export function parseCertificationAchievementEngineDashboard(
  data: unknown
): CertificationAchievementEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  const summary =
    typeof d.summary === "object" && d.summary
      ? (d.summary as CertificationAchievementSummary)
      : undefined;

  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    principles: Array.isArray(d.principles) ? (d.principles as string[]) : undefined,
    summary,
    my_certifications: asRecordList(d.my_certifications),
    certification_definitions: asRecordList(d.certification_definitions),
    team_readiness: asRecordList(d.team_readiness),
    achievement_badges: asRecordList(d.achievement_badges),
    user_badges: asRecordList(d.user_badges),
    training_integration:
      typeof d.training_integration === "object" && d.training_integration
        ? (d.training_integration as Record<string, unknown>)
        : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    ...d,
  };
}

export function parseCertificateExportPayload(data: unknown): CertificateExportPayload {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    certificate_number:
      typeof d.certificate_number === "string" ? d.certificate_number : undefined,
    user_name: typeof d.user_name === "string" ? d.user_name : undefined,
    certification_name:
      typeof d.certification_name === "string" ? d.certification_name : undefined,
    issued_at: typeof d.issued_at === "string" ? d.issued_at : undefined,
    issued_at_european:
      typeof d.issued_at_european === "string" ? d.issued_at_european : undefined,
    expires_at: typeof d.expires_at === "string" ? d.expires_at : null,
    expires_at_european:
      typeof d.expires_at_european === "string" ? d.expires_at_european : null,
    certificate_status:
      typeof d.certificate_status === "string"
        ? (d.certificate_status as CertificateExportPayload["certificate_status"])
        : undefined,
    template_text: typeof d.template_text === "string" ? d.template_text : undefined,
    html_scaffold: typeof d.html_scaffold === "string" ? d.html_scaffold : undefined,
    export_format: typeof d.export_format === "string" ? d.export_format : undefined,
    ...d,
  };
}
