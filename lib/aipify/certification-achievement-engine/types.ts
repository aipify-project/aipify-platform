export type CertificateStatus = "active" | "expired" | "revoked";

export type CertificationAchievementEngineCard = {
  has_organization: boolean;
  active_certifications?: number;
  expired_certifications?: number;
  badges_awarded?: number;
  philosophy?: string;
  [key: string]: unknown;
};

export type CertificationAchievementSummary = {
  active_certifications?: number;
  expired_certifications?: number;
  revoked_certifications?: number;
  badges_awarded?: number;
  definitions_count?: number;
};

export type CertificationAchievementEngineDashboard = {
  has_organization: boolean;
  philosophy?: string;
  principles?: string[];
  summary?: CertificationAchievementSummary;
  my_certifications: Array<Record<string, unknown>>;
  certification_definitions: Array<Record<string, unknown>>;
  team_readiness: Array<Record<string, unknown>>;
  achievement_badges: Array<Record<string, unknown>>;
  user_badges: Array<Record<string, unknown>>;
  training_integration?: Record<string, unknown>;
  distinction_note?: string;
  [key: string]: unknown;
};

export type CertificateExportPayload = {
  certificate_number?: string;
  user_name?: string;
  certification_name?: string;
  issued_at?: string;
  issued_at_european?: string;
  expires_at?: string | null;
  expires_at_european?: string | null;
  certificate_status?: CertificateStatus;
  template_text?: string;
  html_scaffold?: string;
  export_format?: string;
  [key: string]: unknown;
};
