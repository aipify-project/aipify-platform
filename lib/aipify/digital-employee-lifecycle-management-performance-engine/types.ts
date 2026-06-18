export type DigitalEmployeeRecord = {
  id?: string;
  employee_key?: string;
  employee_name?: string;
  department?: string;
  employee_role?: string;
  career_level?: string;
  employee_status?: string;
  supervisor_name?: string;
  performance_score?: number;
  health_score?: number;
  tasks_completed?: number;
  success_rate?: number;
  [key: string]: unknown;
};

export type DigitalEmployeeRole = {
  id?: string;
  role_key?: string;
  role_name?: string;
  responsibilities?: unknown;
  permissions?: unknown;
  [key: string]: unknown;
};

export type DigitalEmployeeTraining = {
  id?: string;
  training_key?: string;
  training_title?: string;
  training_type?: string;
  training_status?: string;
  coverage_percent?: number;
  employee_id?: string | null;
  [key: string]: unknown;
};

export type DigitalEmployeeReview = {
  id?: string;
  review_key?: string;
  review_type?: string;
  review_status?: string;
  performance_score?: number | null;
  summary?: string;
  employee_id?: string | null;
  [key: string]: unknown;
};

export type DigitalEmployeeAdvisorSignal = {
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

export type DigitalEmployeeLifecycleManagementCenter = {
  found?: boolean;
  has_access?: boolean;
  philosophy?: string;
  mission?: string;
  abos_principle?: string;
  orchestration_route?: string;
  distinction_note?: string;
  privacy_note?: string;
  error?: string;
  overview?: Record<string, unknown>;
  modules?: Array<{ key?: string; route?: string }>;
  employees?: DigitalEmployeeRecord[];
  roles?: DigitalEmployeeRole[];
  training_records?: DigitalEmployeeTraining[];
  reviews?: DigitalEmployeeReview[];
  advisor_signals?: DigitalEmployeeAdvisorSignal[];
  audit_logs?: Array<Record<string, unknown>>;
  operations?: Record<string, string>;
  executive_dashboard?: Record<string, unknown>;
  [key: string]: unknown;
};
