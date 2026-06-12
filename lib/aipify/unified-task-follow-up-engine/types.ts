export type OrganizationTask = {
  id?: string;
  title?: string;
  description?: string;
  assigned_user_id?: string;
  created_by?: string;
  priority?: string;
  status?: string;
  due_date?: string;
  source_type?: string;
  source_id?: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

export type OrganizationTaskReminder = {
  id?: string;
  task_id?: string;
  remind_at?: string;
  channel?: string;
  status?: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
  [key: string]: unknown;
};

export type OrganizationTaskEscalation = {
  id?: string;
  task_id?: string;
  escalation_level?: string;
  reason?: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
  [key: string]: unknown;
};

export type SuccessCriterion = {
  key?: string;
  label?: string;
  met?: boolean;
  note?: string | null;
  [key: string]: unknown;
};

export type TaskObjective = {
  key?: string;
  label?: string;
  [key: string]: unknown;
};

export type PriorityLevel = {
  key?: string;
  label?: string;
  focus?: string;
  [key: string]: unknown;
};

export type PriorityFramework = {
  principle?: string;
  levels?: PriorityLevel[];
  recommendation_note?: string;
  priority_focus_engine_route?: string;
  priority_focus_engine_note?: string;
  [key: string]: unknown;
};

export type CompanionAssistanceExample = {
  key?: string;
  scenario?: string;
  example?: string;
  [key: string]: unknown;
};

export type BellMomentsBlueprint = {
  emoji?: string;
  label?: string;
  principle?: string;
  frequency_note?: string;
  examples?: Array<{ key?: string; text?: string; [key: string]: unknown }>;
  gratitude_route?: string;
  gratitude_note?: string;
  [key: string]: unknown;
};

export type ConnectionBlueprint = {
  principle?: string;
  flows?: Array<Record<string, unknown>>;
  [key: string]: unknown;
};

export type SelfLoveConnection = {
  principle?: string;
  task_patterns?: string[];
  self_love_route?: string;
  naming_doc?: string;
  boundary_note?: string;
  [key: string]: unknown;
};

export type TrustConnection = {
  principle?: string;
  users_should_know?: string[];
  organizations_should_understand?: string[];
  audit_note?: string;
  [key: string]: unknown;
};

export type ImplementationBlueprintMeta = {
  phase?: string;
  doc?: string;
  engine_phase?: string;
  route?: string;
  mapping_note?: string;
  [key: string]: unknown;
};

export type IntegrationLink = {
  label?: string;
  route?: string;
  note?: string;
  [key: string]: unknown;
};

export type UnifiedTaskFollowUpEngineCard = {
  has_organization: boolean;
  philosophy?: string;
  mission?: string;
  abos_principle?: string;
  my_open_tasks?: number;
  overdue_tasks?: number;
  critical_tasks?: number;
  completed_tasks_30d?: number;
  implementation_blueprint?: ImplementationBlueprintMeta;
  unified_task_follow_up_engine_note?: string;
  [key: string]: unknown;
};

export type UnifiedTaskFollowUpEngineDashboard = {
  has_organization: boolean;
  philosophy?: string;
  mission?: string;
  abos_principle?: string;
  vision?: string;
  distinction_note?: string;
  implementation_blueprint?: ImplementationBlueprintMeta;
  unified_task_follow_up_engine_note?: string;
  task_objectives?: TaskObjective[];
  task_attributes?: Record<string, unknown>;
  priority_framework?: PriorityFramework;
  companion_assistance_examples?: CompanionAssistanceExample[];
  self_love_connection?: SelfLoveConnection;
  self_love_note?: string;
  bell_moments?: BellMomentsBlueprint;
  kc_connection?: ConnectionBlueprint;
  organizational_memory_connection?: ConnectionBlueprint;
  trust_connection?: TrustConnection;
  dogfooding?: Record<string, unknown>;
  success_criteria?: SuccessCriterion[];
  vision_phrases?: string[];
  integration_links?: IntegrationLink[];
  principles?: string[];
  summary?: Record<string, unknown>;
  sections?: {
    my_tasks?: OrganizationTask[];
    team_tasks?: OrganizationTask[];
    overdue_tasks?: OrganizationTask[];
    upcoming_deadlines?: OrganizationTask[];
    critical_tasks?: OrganizationTask[];
    completed_tasks?: OrganizationTask[];
  };
  reminders?: OrganizationTaskReminder[];
  escalations?: OrganizationTaskEscalation[];
  settings?: Record<string, unknown>;
  executive_summary?: Record<string, unknown>;
  integration_notes?: Record<string, string>;
  integration_summaries?: Record<string, unknown>;
  [key: string]: unknown;
};

export type UnifiedTaskFollowUpExport = {
  has_organization?: boolean;
  exported_at?: string;
  manifest_type?: string;
  tasks?: OrganizationTask[];
  reminders?: OrganizationTaskReminder[];
  escalations?: OrganizationTaskEscalation[];
  summary?: Record<string, unknown>;
  [key: string]: unknown;
};
