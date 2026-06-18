export type ProfessionalServicesClient = {
  id?: string;
  client_key?: string;
  client_name?: string;
  client_status?: string;
  health_score?: number;
  satisfaction_score?: number | null;
  revenue_total?: number;
  project_count?: number;
  [key: string]: unknown;
};

export type ProfessionalServicesProject = {
  id?: string;
  project_key?: string;
  project_name?: string;
  project_status?: string;
  budget_amount?: number;
  revenue_amount?: number;
  gross_margin_percent?: number;
  client_id?: string | null;
  owner_name?: string;
  consultant_id?: string | null;
  satisfaction_score?: number | null;
  [key: string]: unknown;
};

export type ProfessionalServicesConsultant = {
  id?: string;
  consultant_key?: string;
  full_name?: string;
  availability_status?: string;
  utilization_percent?: number;
  performance_score?: number;
  project_count?: number;
  [key: string]: unknown;
};

export type ProfessionalServicesAdvisorSignal = {
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

export type ProfessionalServicesConsultingClientDeliveryCenter = {
  found?: boolean;
  has_access?: boolean;
  philosophy?: string;
  mission?: string;
  abos_principle?: string;
  industry_packs_route?: string;
  distinction_note?: string;
  privacy_note?: string;
  error?: string;
  overview?: Record<string, unknown>;
  modules?: Array<{ key?: string; route?: string }>;
  clients?: ProfessionalServicesClient[];
  projects?: ProfessionalServicesProject[];
  consultants?: ProfessionalServicesConsultant[];
  deliverables?: Array<Record<string, unknown>>;
  expansion_opportunities?: Array<Record<string, unknown>>;
  advisor_signals?: ProfessionalServicesAdvisorSignal[];
  audit_logs?: Array<Record<string, unknown>>;
  operations?: Record<string, string>;
  executive_dashboard?: Record<string, unknown>;
  [key: string]: unknown;
};
