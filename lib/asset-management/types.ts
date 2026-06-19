export type AssetRecord = {
  id: string;
  asset_number: string;
  name: string;
  category: string;
  asset_type: string;
  status: string;
  department_id?: string | null;
  department_name?: string;
  assigned_employee_id?: string | null;
  assigned_employee_name?: string;
  domain?: string;
  location_name?: string;
  warranty_date?: string | null;
  purchase_cost?: number | null;
  current_value?: number | null;
  is_reservable?: boolean;
  metadata?: Record<string, unknown>;
};

export type AssetManagementCenter = {
  found: boolean;
  principle?: string;
  overview?: {
    total_assets?: number;
    active?: number;
    maintenance_required?: number;
    vehicles?: number;
    software_licenses?: number;
    properties?: number;
    it_equipment?: number;
    reserved?: number;
    warranty_expiring_30d?: number;
  };
  assets?: AssetRecord[];
  maintenance?: Record<string, unknown>[];
  reservations?: Record<string, unknown>[];
  software_licenses?: Record<string, unknown>[];
  reports?: Record<string, unknown>;
  audit_recent?: { action: string; summary: string; created_at: string }[];
  routes?: { vehicles?: string; calendar?: string; tasks?: string; organization?: string };
};
