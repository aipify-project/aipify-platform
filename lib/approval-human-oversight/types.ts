import type { APPROVAL_CATEGORIES, APPROVAL_RISK_LEVELS } from "./constants";

export type ApprovalCategory = (typeof APPROVAL_CATEGORIES)[number];
export type ApprovalRiskLevel = (typeof APPROVAL_RISK_LEVELS)[number];

export type ApprovalRequest = {
  request_key: string;
  action_title: string;
  category: ApprovalCategory | string;
  approval_level: number;
  risk_level: ApprovalRiskLevel | string;
  aipify_recommendation_reason: string;
  business_impact: string | null;
  financial_impact: Record<string, unknown>;
  if_approved: string | null;
  if_rejected: string | null;
  risks_summary: string | null;
  status: string;
  priority: string;
  delegated_to: string | null;
  snoozed_until: string | null;
  deadline_at: string | null;
  created_at: string | null;
};

export type ApprovalHistoryEntry = {
  history_key: string;
  action_title: string;
  decision: string;
  approver_label: string;
  reason: string | null;
  created_at: string | null;
};

export type ApprovalRecommendation = {
  recommendation_key: string;
  message: string;
  priority: string;
};

export type ApprovalHumanOversightCenter = {
  dashboard: {
    pending_count: number;
    high_priority_count: number;
    delegated_count: number;
    completed_7d: number;
    avg_response_hours: number;
    compliance_rate: number;
  } | null;
  pending: ApprovalRequest[];
  recent_completed: ApprovalHistoryEntry[];
  recommendations: ApprovalRecommendation[];
  executive_reporting: Record<string, unknown> | null;
  links: Record<string, string> | null;
  can_manage: boolean;
  can_record: boolean;
  privacy_note: string | null;
};
