export type LogisticsVehicle = {
  id?: string;
  vehicle_key?: string;
  vehicle_name?: string;
  vehicle_type?: string;
  vehicle_status?: string;
  utilization_percent?: number;
  fleet_value?: number;
  [key: string]: unknown;
};

export type LogisticsShipment = {
  id?: string;
  shipment_reference?: string;
  origin_label?: string;
  destination_label?: string;
  shipment_status?: string;
  transportation_cost?: number;
  on_time?: boolean | null;
  route_id?: string | null;
  [key: string]: unknown;
};

export type LogisticsAdvisorSignal = {
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

export type LogisticsTransportationFleetOperationsCenter = {
  found?: boolean;
  has_access?: boolean;
  philosophy?: string;
  mission?: string;
  abos_principle?: string;
  industry_packs_route?: string;
  warehouse_operations_route?: string;
  distinction_note?: string;
  privacy_note?: string;
  error?: string;
  overview?: Record<string, unknown>;
  modules?: Array<{ key?: string; route?: string }>;
  vehicles?: LogisticsVehicle[];
  drivers?: Array<Record<string, unknown>>;
  routes?: Array<Record<string, unknown>>;
  shipments?: LogisticsShipment[];
  distribution_centers?: Array<Record<string, unknown>>;
  advisor_signals?: LogisticsAdvisorSignal[];
  audit_logs?: Array<Record<string, unknown>>;
  operations?: Record<string, string>;
  executive_dashboard?: Record<string, unknown>;
  [key: string]: unknown;
};
