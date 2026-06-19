export type TrustCenterTab =
  | "overview"
  | "identity"
  | "verification"
  | "security"
  | "devices"
  | "sessions"
  | "audit"
  | "permissions"
  | "compliance"
  | "executive"
  | "reports";

export type TrustIdentity = {
  id: string;
  identity_key?: string;
  display_name: string;
  identity_type?: string;
  role_label?: string;
  department_label?: string;
  status?: string;
  verification_status?: string;
  two_factor_enabled?: boolean;
  last_login_at?: string;
  device_count?: number;
};

export type TrustDevice = {
  id: string;
  device_key?: string;
  device_name: string;
  platform_label?: string;
  browser_label?: string;
  location_label?: string;
  approval_status?: string;
  risk_score?: number;
  last_activity_at?: string;
};

export type TrustSession = {
  id: string;
  session_key?: string;
  status?: string;
  device_label?: string;
  location_label?: string;
  ip_label?: string;
  auth_method?: string;
  duration_minutes?: number;
  started_at?: string;
};

export type TrustCenterOperations = {
  found: boolean;
  principle?: string;
  section?: string;
  organization?: { id: string; name: string };
  overview?: Record<string, string | number | undefined>;
  identity_engine?: { identities?: TrustIdentity[] };
  verification_engine?: {
    verifications?: Record<string, unknown>[];
    organization_verifications?: Record<string, unknown>[];
  };
  device_trust_center?: { devices?: TrustDevice[] };
  session_management?: { sessions?: TrustSession[] };
  security_events?: Record<string, unknown>[];
  identity_protection?: string[];
  two_factor_center?: Record<string, unknown>;
  partner_verification?: Record<string, unknown>[];
  organization_verification?: Record<string, unknown>[];
  audit_history?: { event_type: string; event_category?: string; summary: string; created_at?: string }[];
  permission_explorer?: { snapshots?: Record<string, unknown>[] };
  companion_trust_advisor?: Record<string, unknown>;
  compliance_integration?: Record<string, unknown>[];
  security_score_engine?: Record<string, unknown>;
  platform_governor?: Record<string, unknown>;
  execution_coordination?: Record<string, unknown>;
  executive_dashboard?: Record<string, unknown>;
  reports?: Record<string, unknown>;
  audit_recent?: { event_type: string; summary: string; created_at?: string }[];
  mobile_access?: Record<string, unknown>;
  routes?: Record<string, string>;
  error?: string;
};

export type TrustCenterOperationsLabels = {
  title: string;
  subtitle: string;
  loading: string;
  back: string;
  principle: string;
  emptyState: string;
  accessDenied: string;
  tabs: Record<TrustCenterTab, string>;
  overview: {
    trustScore: string;
    securityStatus: string;
    verificationStatus: string;
    twoFactorAdoption: string;
    deviceHealth: string;
    activeSessions: string;
    recentSecurityEvents: string;
    registeredIdentities: string;
  };
  actions: {
    refreshScore: string;
    approveDevice: string;
    blockDevice: string;
    terminateSession: string;
    enable2fa: string;
    completeVerification: string;
    openDevices: string;
    open2fa: string;
    openAudit: string;
    openActionEngine: string;
  };
  trustStatuses: Record<string, string>;
  deviceStatuses: Record<string, string>;
  verificationStatuses: Record<string, string>;
  devicesPage: { title: string; subtitle: string };
  twoFactorPage: { title: string; subtitle: string };
  auditPage: { title: string; subtitle: string };
};
