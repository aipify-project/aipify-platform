import type {
  HealthcareAdvisorSignal,
  HealthcareAppointment,
  HealthcareClinicPatientOperationsCenter,
  HealthcarePatient,
  HealthcareProvider,
} from "./types";

function parsePatient(raw: unknown): HealthcarePatient {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    patient_key: typeof d.patient_key === "string" ? d.patient_key : undefined,
    display_name: typeof d.display_name === "string" ? d.display_name : undefined,
    patient_status: typeof d.patient_status === "string" ? d.patient_status : undefined,
    consent_on_file: Boolean(d.consent_on_file),
    care_plan_count: Number(d.care_plan_count ?? 0),
    satisfaction_score: typeof d.satisfaction_score === "number" ? d.satisfaction_score : null,
  };
}

function parseAppointment(raw: unknown): HealthcareAppointment {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    appointment_key: typeof d.appointment_key === "string" ? d.appointment_key : undefined,
    appointment_type: typeof d.appointment_type === "string" ? d.appointment_type : undefined,
    appointment_status: typeof d.appointment_status === "string" ? d.appointment_status : undefined,
    scheduled_at: typeof d.scheduled_at === "string" ? d.scheduled_at : null,
    location_label: typeof d.location_label === "string" ? d.location_label : undefined,
    follow_up_required: Boolean(d.follow_up_required),
    patient_id: typeof d.patient_id === "string" ? d.patient_id : null,
    provider_id: typeof d.provider_id === "string" ? d.provider_id : null,
  };
}

function parseProvider(raw: unknown): HealthcareProvider {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    provider_key: typeof d.provider_key === "string" ? d.provider_key : undefined,
    full_name: typeof d.full_name === "string" ? d.full_name : undefined,
    provider_role: typeof d.provider_role === "string" ? d.provider_role : undefined,
    specialization: typeof d.specialization === "string" ? d.specialization : undefined,
    availability_status: typeof d.availability_status === "string" ? d.availability_status : undefined,
    capacity_percent: Number(d.capacity_percent ?? 0),
    compliance_status: typeof d.compliance_status === "string" ? d.compliance_status : undefined,
  };
}

function parseSignal(raw: unknown): HealthcareAdvisorSignal {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    signal_type: typeof d.signal_type === "string" ? d.signal_type : undefined,
    observation: typeof d.observation === "string" ? d.observation : undefined,
    impact: typeof d.impact === "string" ? d.impact : undefined,
    recommendation: typeof d.recommendation === "string" ? d.recommendation : undefined,
    effort: typeof d.effort === "string" ? d.effort : undefined,
    confidence: typeof d.confidence === "string" ? d.confidence : undefined,
    created_at: typeof d.created_at === "string" ? d.created_at : undefined,
  };
}

export function parseHealthcareClinicPatientOperationsCenter(
  raw: unknown
): HealthcareClinicPatientOperationsCenter {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    found: Boolean(d.found),
    has_access: Boolean(d.has_access),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    mission: typeof d.mission === "string" ? d.mission : undefined,
    abos_principle: typeof d.abos_principle === "string" ? d.abos_principle : undefined,
    governance_note: typeof d.governance_note === "string" ? d.governance_note : undefined,
    industry_packs_route: typeof d.industry_packs_route === "string" ? d.industry_packs_route : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    privacy_note: typeof d.privacy_note === "string" ? d.privacy_note : undefined,
    error: typeof d.error === "string" ? d.error : undefined,
    overview: typeof d.overview === "object" && d.overview ? (d.overview as Record<string, unknown>) : undefined,
    modules: Array.isArray(d.modules) ? (d.modules as Array<{ key?: string; route?: string }>) : [],
    patients: Array.isArray(d.patients) ? d.patients.map(parsePatient) : [],
    appointments: Array.isArray(d.appointments) ? d.appointments.map(parseAppointment) : [],
    providers: Array.isArray(d.providers) ? d.providers.map(parseProvider) : [],
    care_plans: Array.isArray(d.care_plans) ? (d.care_plans as Array<Record<string, unknown>>) : [],
    consent_records: Array.isArray(d.consent_records) ? (d.consent_records as Array<Record<string, unknown>>) : [],
    advisor_signals: Array.isArray(d.advisor_signals) ? d.advisor_signals.map(parseSignal) : [],
    audit_logs: Array.isArray(d.audit_logs) ? (d.audit_logs as Array<Record<string, unknown>>) : [],
    operations: typeof d.operations === "object" && d.operations ? (d.operations as Record<string, string>) : undefined,
    executive_dashboard: typeof d.executive_dashboard === "object" && d.executive_dashboard
      ? (d.executive_dashboard as Record<string, unknown>)
      : undefined,
  };
}
