export type HealthcarePatient = {
  id?: string;
  patient_key?: string;
  display_name?: string;
  patient_status?: string;
  consent_on_file?: boolean;
  care_plan_count?: number;
  satisfaction_score?: number | null;
  [key: string]: unknown;
};

export type HealthcareAppointment = {
  id?: string;
  appointment_key?: string;
  appointment_type?: string;
  appointment_status?: string;
  scheduled_at?: string | null;
  location_label?: string;
  follow_up_required?: boolean;
  patient_id?: string | null;
  provider_id?: string | null;
  [key: string]: unknown;
};

export type HealthcareProvider = {
  id?: string;
  provider_key?: string;
  full_name?: string;
  provider_role?: string;
  specialization?: string;
  availability_status?: string;
  capacity_percent?: number;
  compliance_status?: string;
  [key: string]: unknown;
};

export type HealthcareAdvisorSignal = {
  id?: string;
  signal_type?: string;
  observation?: string;
  impact?: string;
  recommendation?: string;
  effort?: string;
  confidence?: string;
  created_at?: string;
  [key: string]: unknown;
};

export type HealthcareClinicPatientOperationsCenter = {
  found?: boolean;
  has_access?: boolean;
  philosophy?: string;
  mission?: string;
  abos_principle?: string;
  governance_note?: string;
  industry_packs_route?: string;
  distinction_note?: string;
  privacy_note?: string;
  error?: string;
  overview?: Record<string, unknown>;
  modules?: Array<{ key?: string; route?: string }>;
  patients?: HealthcarePatient[];
  appointments?: HealthcareAppointment[];
  providers?: HealthcareProvider[];
  care_plans?: Array<Record<string, unknown>>;
  consent_records?: Array<Record<string, unknown>>;
  advisor_signals?: HealthcareAdvisorSignal[];
  audit_logs?: Array<Record<string, unknown>>;
  operations?: Record<string, string>;
  executive_dashboard?: Record<string, unknown>;
  [key: string]: unknown;
};
