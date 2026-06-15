import type {
  ContentLanguage,
  ContentSurface,
  DeliveryMethod,
  NotificationType,
  RequestStatus,
  ResourceType,
  TargetAudience,
  WorkflowStage,
} from "./constants";

export type ContentRequestOverview = {
  open_requests: number;
  in_production: number;
  awaiting_review: number;
  completed_requests: number;
  recently_published_assets: number;
  average_delivery_time: number;
};

export type DuplicateRecommendation = {
  kind: string;
  id: string;
  title: string;
  match_score: number;
  reason: string;
};

export type ContentRequest = {
  id: string;
  tenant_id: string;
  request_title: string;
  resource_type: ResourceType;
  industry: string;
  target_audience: TargetAudience;
  country: string;
  language: ContentLanguage;
  business_objective: string;
  additional_notes: string;
  desired_completion_date: string | null;
  status: RequestStatus;
  priority_score: number;
  assigned_owner: string;
  assigned_partner: string;
  production_progress: number;
  clarification_required: boolean;
  clarification_message: string;
  published_asset_id: string | null;
  delivery_method: DeliveryMethod;
  duplicate_recommendations: DuplicateRecommendation[];
  created_at: string;
  updated_at: string;
  published_at: string | null;
};

export type ContentNotification = {
  id: string;
  request_id: string;
  notification_type: NotificationType;
  message: string;
  read_at: string | null;
  created_at: string;
};

export type ContentAuditEntry = {
  id: string;
  request_id: string | null;
  event_type: string;
  summary: string;
  created_at: string;
};

export type ContentReporting = {
  most_requested_types: Array<{ resource_type: string; request_count: number }>;
  industry_demand: Array<{ industry: string; request_count: number }>;
  average_production_days: number;
  partner_satisfaction: number;
};

export type WorkflowStageInfo = {
  stage: WorkflowStage;
  label_key: string;
};

export type GrowthPartnerContentRequestCenter = {
  has_access: boolean;
  surface?: ContentSurface;
  overview?: ContentRequestOverview;
  requests?: ContentRequest[];
  notifications?: ContentNotification[];
  audit?: ContentAuditEntry[];
  reporting?: ContentReporting;
  workflow_stages?: WorkflowStageInfo[];
  delivery_methods?: DeliveryMethod[];
  principle?: string;
  foundation_principle?: string;
};

export type GrowthPartnerContentRequestLabels = {
  title: string;
  subtitle: string;
  loading: string;
  back: string;
  principle: string;
  foundationPrinciple: string;
  emptyState: string;
  overview: Record<string, string>;
  sections: Record<string, string>;
  table: Record<string, string>;
  resourceTypes: Record<string, string>;
  targetAudiences: Record<string, string>;
  requestStatuses: Record<string, string>;
  workflowStages: Record<string, string>;
  deliveryMethods: Record<string, string>;
  languages: Record<string, string>;
  notifications: Record<string, string>;
  reporting: Record<string, string>;
  quickActions: Record<string, string>;
  requestForm: Record<string, string>;
  duplicates: Record<string, string>;
};
