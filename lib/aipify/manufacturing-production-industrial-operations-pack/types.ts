export type ManufacturingWorkOrder = {
  id?: string;
  work_order_key?: string;
  product_name?: string;
  quantity?: number;
  work_order_status?: string;
  priority?: string;
  production_line_id?: string | null;
  start_date?: string | null;
  completion_date?: string | null;
  [key: string]: unknown;
};

export type ManufacturingMaterial = {
  id?: string;
  material_key?: string;
  material_name?: string;
  material_type?: string;
  inventory_quantity?: number;
  availability_status?: string;
  material_cost?: number;
  [key: string]: unknown;
};

export type ManufacturingProductionLine = {
  id?: string;
  line_key?: string;
  line_name?: string;
  capacity_units?: number;
  output_units?: number;
  utilization_percent?: number;
  maintenance_status?: string;
  quality_score?: number;
  [key: string]: unknown;
};

export type ManufacturingAdvisorSignal = {
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

export type ManufacturingProductionIndustrialOperationsCenter = {
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
  work_orders?: ManufacturingWorkOrder[];
  materials?: ManufacturingMaterial[];
  production_lines?: ManufacturingProductionLine[];
  quality_inspections?: Array<Record<string, unknown>>;
  advisor_signals?: ManufacturingAdvisorSignal[];
  audit_logs?: Array<Record<string, unknown>>;
  operations?: Record<string, string>;
  executive_dashboard?: Record<string, unknown>;
  [key: string]: unknown;
};
