export type AssetRecord = {
  id: string;
  asset_number: string;
  name: string;
  description?: string;
  category: string;
  asset_type: string;
  status: string;
  serial_number?: string | null;
  manufacturer?: string | null;
  qr_code?: string | null;
  barcode?: string | null;
  department_id?: string | null;
  department_name?: string;
  assigned_employee_id?: string | null;
  assigned_employee_name?: string;
  domain?: string;
  location_name?: string;
  warranty_date?: string | null;
  warranty_start?: string | null;
  purchase_cost?: number | null;
  current_value?: number | null;
  is_reservable?: boolean;
  deep_link?: string;
  metadata?: Record<string, unknown>;
};

export type AssetAssignment = {
  id: string;
  asset_id: string;
  asset_name?: string;
  asset_number?: string;
  assignment_type: string;
  assigned_label?: string | null;
  assigned_at?: string | null;
  returned_at?: string | null;
  expected_return_at?: string | null;
};

export type AssetVehicle = {
  asset_id: string;
  asset_number?: string;
  name: string;
  status: string;
  registration_number?: string | null;
  mileage?: number | null;
  next_service_date?: string | null;
  insurance_expiry?: string | null;
  assigned_employee_name?: string | null;
};

export type AssetAudit = {
  id: string;
  audit_number?: string | null;
  audit_type: string;
  status: string;
  summary?: string | null;
  created_at?: string | null;
  items_verified?: number;
};

export type AssetManagementCenter = {
  found: boolean;
  principle?: string;
  philosophy?: string;
  overview?: {
    total_assets?: number;
    active?: number;
    assigned?: number;
    available?: number;
    maintenance_required?: number;
    vehicles?: number;
    software_licenses?: number;
    properties?: number;
    it_equipment?: number;
    reserved?: number;
    warranty_expiring_30d?: number;
    license_expiring_30d?: number;
    audits_in_progress?: number;
    total_value?: number;
  };
  assets?: AssetRecord[];
  assignments?: AssetAssignment[];
  vehicles?: AssetVehicle[];
  audits?: AssetAudit[];
  maintenance?: Record<string, unknown>[];
  reservations?: Record<string, unknown>[];
  software_licenses?: Record<string, unknown>[];
  warranties?: Record<string, unknown>[];
  reports?: Record<string, unknown>;
  audit_recent?: { action: string; summary: string; created_at: string }[];
  sections?: string[];
  routes?: Record<string, string>;
};
