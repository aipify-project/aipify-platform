export type WorkforcePosition = {
  id?: string;
  position_key?: string;
  position_name?: string;
  position_type?: string;
  department?: string;
  responsibilities?: unknown;
  skills?: unknown;
  [key: string]: unknown;
};

export type WorkforceHiringRequest = {
  id?: string;
  request_key?: string;
  request_title?: string;
  request_type?: string;
  request_status?: string;
  department?: string;
  position_id?: string | null;
  [key: string]: unknown;
};

export type WorkforcePlan = {
  id?: string;
  plan_key?: string;
  plan_name?: string;
  department?: string;
  current_headcount?: number;
  future_headcount?: number;
  capacity_utilization?: number;
  gap_type?: string;
  [key: string]: unknown;
};

export type WorkforceForecast = {
  id?: string;
  forecast_key?: string;
  forecast_title?: string;
  forecast_horizon?: string;
  projected_hires?: number;
  projected_capacity?: number;
  [key: string]: unknown;
};

export type WorkforceAdvisorSignal = {
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

export type DigitalWorkforceRecruitmentProvisioningCenter = {
  found?: boolean;
  has_access?: boolean;
  philosophy?: string;
  mission?: string;
  abos_principle?: string;
  lifecycle_route?: string;
  distinction_note?: string;
  privacy_note?: string;
  error?: string;
  overview?: Record<string, unknown>;
  modules?: Array<{ key?: string; route?: string }>;
  positions?: WorkforcePosition[];
  hiring_requests?: WorkforceHiringRequest[];
  workforce_plans?: WorkforcePlan[];
  forecasts?: WorkforceForecast[];
  advisor_signals?: WorkforceAdvisorSignal[];
  audit_logs?: Array<Record<string, unknown>>;
  operations?: Record<string, string>;
  executive_dashboard?: Record<string, unknown>;
  [key: string]: unknown;
};
