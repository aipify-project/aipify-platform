export type ConnectedSystem = {
  id: string;
  system_key: string;
  system_name: string;
  connection_method: string;
  auth_status: string;
  sync_mode: string;
  sync_health: string;
  last_sync_at?: string | null;
  business_pack_key?: string | null;
  updated_at?: string | null;
};

export type ConnectionCatalogItem = {
  system_key: string;
  system_name: string;
  category: string;
  connection_method: string;
  method_priority: number;
};

export type InstallDiscoveryCenter = {
  found: boolean;
  principle?: string;
  overview?: Record<string, unknown>;
  connected_systems?: ConnectedSystem[];
  connection_catalog?: ConnectionCatalogItem[];
  discovery_results?: Record<string, unknown>[];
  data_sources?: Record<string, unknown>[];
  import_jobs?: Record<string, unknown>[];
  permissions?: Record<string, unknown>[];
  recommendations?: Record<string, unknown>[];
  installation_status?: Record<string, unknown>;
  sync_schedules?: Record<string, unknown>[];
  reports?: Record<string, unknown>;
  audit_recent?: { action: string; summary: string; created_at: string }[];
  routes?: Record<string, string>;
};
