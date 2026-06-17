export type HospitalityProperty = {
  id?: string;
  property_key?: string;
  display_name?: string;
  platform_source?: string;
  status?: string;
  health_score?: number;
  property_type?: string;
  location?: string;
  capacity?: number;
  owner_name?: string;
  performance_label?: string;
  [key: string]: unknown;
};

export type HospitalityReservation = {
  id?: string;
  reservation_reference?: string;
  guest_name?: string;
  check_in_date?: string;
  check_out_date?: string;
  booking_status?: string;
  booking_channel?: string;
  number_of_guests?: number;
  property_id?: string | null;
  [key: string]: unknown;
};

export type HospitalityAdvisorSignal = {
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

export type HospitalityAccommodationCenter = {
  found?: boolean;
  has_access?: boolean;
  philosophy?: string;
  mission?: string;
  abos_principle?: string;
  industry_packs_route?: string;
  aipify_hosts_route?: string;
  distinction_note?: string;
  privacy_note?: string;
  error?: string;
  overview?: Record<string, unknown>;
  modules?: Array<{ key?: string; route?: string }>;
  properties?: HospitalityProperty[];
  reservations?: HospitalityReservation[];
  guests?: Array<Record<string, unknown>>;
  channels?: Array<Record<string, unknown>>;
  portfolios?: Array<Record<string, unknown>>;
  advisor_signals?: HospitalityAdvisorSignal[];
  audit_logs?: Array<Record<string, unknown>>;
  operations?: Record<string, string>;
  executive_dashboard?: Record<string, unknown>;
  [key: string]: unknown;
};
