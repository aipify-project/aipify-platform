export type CommunicationCampaign = {
  id?: string;
  campaign_name?: string;
  stakeholder_type?: string;
  communication_type?: string;
  status?: string;
  owner_user_id?: string;
  scheduled_at?: string;
  delivery_channels?: unknown[];
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

export type CommunicationDelivery = {
  id?: string;
  campaign_id?: string;
  channel?: string;
  status?: string;
  delivered_at?: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
  [key: string]: unknown;
};

export type CommunicationEngagement = {
  id?: string;
  campaign_id?: string;
  engagement_metadata?: Record<string, unknown>;
  recorded_at?: string;
  created_at?: string;
  [key: string]: unknown;
};

export type CommunicationOutcome = {
  id?: string;
  campaign_id?: string;
  outcome_summary?: string;
  org_memory_hook_metadata?: Record<string, unknown>;
  created_at?: string;
  [key: string]: unknown;
};

export type StakeholderCommunicationEngineCard = {
  has_organization: boolean;
  philosophy?: string;
  active_campaigns?: number;
  scheduled_campaigns?: number;
  draft_campaigns?: number;
  [key: string]: unknown;
};

export type StakeholderCommunicationEngineDashboard = {
  has_organization: boolean;
  philosophy?: string;
  principles?: string[];
  summary?: Record<string, unknown>;
  campaigns?: CommunicationCampaign[];
  deliveries?: CommunicationDelivery[];
  engagement?: CommunicationEngagement[];
  outcomes?: CommunicationOutcome[];
  executive_summary?: Record<string, unknown>;
  integration_notes?: Record<string, string>;
  integration_summaries?: Record<string, unknown>;
  [key: string]: unknown;
};

export type CommunicationCampaignExportPayload = {
  campaigns?: CommunicationCampaign[];
  deliveries?: CommunicationDelivery[];
  outcomes?: CommunicationOutcome[];
  exported_at?: string;
  privacy_note?: string;
  [key: string]: unknown;
};
