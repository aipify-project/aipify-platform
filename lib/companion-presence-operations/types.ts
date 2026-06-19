export type CompanionPresenceOperationsTab =
  | "overview"
  | "desktop_companion"
  | "mobile_companion"
  | "presence"
  | "notifications"
  | "memory"
  | "preferences"
  | "devices"
  | "executive";

export type CompanionDevice = {
  id: string;
  device_type?: string;
  platform?: string;
  device_label: string;
  device_status?: string;
  app_version?: string;
  last_activity_at?: string;
  registered_at?: string;
};

export type OfflineCacheItem = {
  id: string;
  cache_type?: string;
  title: string;
  content_summary?: string;
  sync_status?: string;
  created_at?: string;
};

export type CompanionPresenceOperationsCenter = {
  found: boolean;
  principle?: string;
  philosophy?: string;
  companion_identity?: Record<string, unknown>;
  overview?: Record<string, string | number | undefined>;
  desktop_companion?: Record<string, unknown>;
  mobile_companion?: Record<string, unknown>;
  presence_engine?: Record<string, unknown>;
  notifications?: Record<string, unknown>;
  companion_memory?: Record<string, unknown>;
  preferences?: Record<string, unknown>;
  devices?: CompanionDevice[];
  offline_cache?: OfflineCacheItem[];
  meeting_awareness?: Record<string, unknown>;
  meeting_integrations?: string[];
  role_experience?: Record<string, unknown>;
  companion_store?: Record<string, unknown>;
  business_pack_integration?: Record<string, unknown>;
  search_integration?: Record<string, unknown>;
  companion_intelligence?: Record<string, unknown>;
  device_management?: Record<string, unknown>;
  executive_dashboard?: Record<string, unknown>;
  reports?: Record<string, unknown>;
  mobile_access?: Record<string, unknown>;
  audit_recent?: { action: string; summary: string; section?: string; created_at?: string }[];
  routes?: Record<string, string>;
  error?: string;
};
