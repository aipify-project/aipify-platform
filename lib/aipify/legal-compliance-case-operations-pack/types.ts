export type LegalCase = {
  id?: string;
  case_key?: string;
  case_number?: string;
  case_title?: string;
  case_type?: string;
  case_status?: string;
  priority?: string;
  risk_level?: string;
  deadline_at?: string | null;
  client_id?: string | null;
  assigned_team?: string;
  [key: string]: unknown;
};

export type LegalClient = {
  id?: string;
  client_key?: string;
  client_name?: string;
  organization_label?: string;
  compliance_status?: string;
  case_count?: number;
  [key: string]: unknown;
};

export type LegalContract = {
  id?: string;
  contract_key?: string;
  contract_name?: string;
  contract_status?: string;
  parties_label?: string;
  renewal_date?: string | null;
  expiration_date?: string | null;
  risk_status?: string;
  client_id?: string | null;
  [key: string]: unknown;
};

export type LegalAdvisorSignal = {
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

export type LegalComplianceCaseOperationsCenter = {
  found?: boolean;
  has_access?: boolean;
  philosophy?: string;
  mission?: string;
  abos_principle?: string;
  governance_note?: string;
  disclaimer?: string;
  industry_packs_route?: string;
  distinction_note?: string;
  privacy_note?: string;
  error?: string;
  overview?: Record<string, unknown>;
  modules?: Array<{ key?: string; route?: string }>;
  cases?: LegalCase[];
  clients?: LegalClient[];
  contracts?: LegalContract[];
  compliance_reviews?: Array<Record<string, unknown>>;
  deadlines?: Array<Record<string, unknown>>;
  advisor_signals?: LegalAdvisorSignal[];
  audit_logs?: Array<Record<string, unknown>>;
  operations?: Record<string, string>;
  executive_dashboard?: Record<string, unknown>;
  [key: string]: unknown;
};
