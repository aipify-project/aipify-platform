export type ChangeInitiativeRecord = {
  id?: string;
  initiative_name?: string;
  description?: string;
  change_type?: string;
  status?: string;
  target_date?: string;
  owner_user_id?: string;
  created_at?: string;
  [key: string]: unknown;
};

export type ChangeImpactAssessmentRecord = {
  id?: string;
  initiative_id?: string;
  affected_users?: unknown[];
  affected_teams?: unknown[];
  training_requirements?: unknown[];
  communication_needs?: unknown[];
  operational_risks?: unknown[];
  [key: string]: unknown;
};

export type ChangeCommunicationPlanRecord = {
  id?: string;
  initiative_id?: string;
  communication_type?: string;
  subject?: string;
  message_summary?: string;
  status?: string;
  [key: string]: unknown;
};

export type ChangeAdoptionMetricRecord = {
  id?: string;
  initiative_id?: string;
  metric_type?: string;
  metric_value?: number;
  metric_metadata?: Record<string, unknown>;
  [key: string]: unknown;
};

export type ChangeMilestoneRecord = {
  id?: string;
  initiative_id?: string;
  milestone_name?: string;
  status?: string;
  milestone_order?: number;
  [key: string]: unknown;
};

export type ChangeManagementEngineCard = {
  has_organization: boolean;
  philosophy?: string;
  active_initiatives?: number;
  pending_milestones?: number;
  [key: string]: unknown;
};

export type ChangeManagementEngineDashboard = {
  has_organization: boolean;
  philosophy?: string;
  principles?: string[];
  summary?: Record<string, unknown>;
  initiatives?: ChangeInitiativeRecord[];
  impact_assessments?: ChangeImpactAssessmentRecord[];
  communication_plans?: ChangeCommunicationPlanRecord[];
  adoption_metrics?: ChangeAdoptionMetricRecord[];
  milestones?: ChangeMilestoneRecord[];
  integration_notes?: Record<string, string>;
  integration_summaries?: Record<string, unknown>;
  [key: string]: unknown;
};
