export type PolicyCategory =
  | "information_security"
  | "privacy_data_protection"
  | "employee_policies"
  | "acceptable_use"
  | "incident_response"
  | "vendor_management"
  | "financial_controls"
  | "business_continuity"
  | "operational_procedures"
  | "custom";

export type PolicyStatus = "draft" | "active" | "under_review" | "retired";
export type PolicyAudience = "all_organization_members" | "managers" | "owners_admins" | "custom";
import type { ReviewFrequency } from "../responsibilities/types";

export type AcknowledgementStats = {
  acknowledged_count: number;
  outstanding_count: number;
  completion_rate: number;
};

export type ComplianceReadiness = {
  score: number;
  label: "building" | "strong" | "moderate" | "needs_attention";
};

export type PolicyItem = {
  id: string;
  title: string;
  description: string;
  description_full?: string;
  category: PolicyCategory;
  owner_id?: string | null;
  owner_name: string;
  contributor_ids?: string[];
  audience_user_ids?: string[];
  status: PolicyStatus;
  version_number: number;
  effective_date?: string | null;
  review_date?: string | null;
  review_frequency?: ReviewFrequency | null;
  audience: PolicyAudience;
  related_playbook_ids?: string[];
  related_knowledge_content?: string[];
  notes?: string;
  notes_full?: string;
  needs_review?: boolean;
  acknowledgement?: AcknowledgementStats;
  created_at: string;
  updated_at: string;
};

export type PolicyRecommendation = {
  id: string;
  key: string;
  priority: string;
  policy_id?: string;
};

export type ComplianceDashboard = {
  active: number;
  needs_review: number;
  outstanding_acknowledgements: number;
  without_owner: number;
  recently_updated: PolicyItem[];
  readiness: ComplianceReadiness;
};

export type PolicyListResponse = {
  found: boolean;
  can_manage?: boolean;
  items: PolicyItem[];
  dashboard?: ComplianceDashboard;
  recommendations?: PolicyRecommendation[];
  principle?: string;
};

export type PolicyVersionSummary = {
  id: string;
  version_number: number;
  change_summary: string;
  updated_by: string;
  created_at: string;
};

export type PolicyAcknowledgement = {
  user_id: string;
  user_name: string;
  acknowledged_at: string;
};

export type PolicyDetail = {
  found: boolean;
  can_manage?: boolean;
  policy?: PolicyItem;
  contributors?: Array<{ user_id: string; name: string }>;
  version_history?: PolicyVersionSummary[];
  acknowledgements?: PolicyAcknowledgement[];
  user_acknowledged?: boolean;
  activity_timeline?: Array<{ id: string; event_type: string; description: string; created_at: string; performed_by: string }>;
  audit_history?: Array<{ id: string; event_type: string; description: string; created_at: string; performed_by: string }>;
  recommendations?: PolicyRecommendation[];
};

export type ComplianceLabels = {
  title: string;
  subtitle: string;
  loading: string;
  principle: string;
  emptyTitle: string;
  emptyBody: string;
  emptyCta: string;
  back: string;
  notFound: string;
  filters: {
    search: string;
    category: string;
    status: string;
    owner: string;
    audience: string;
    recentlyUpdated: string;
    all: string;
    yes: string;
    no: string;
  };
  dashboard: {
    active: string;
    needsReview: string;
    outstandingAck: string;
    withoutOwner: string;
    recent: string;
    readiness: string;
    readinessLabels: Record<ComplianceReadiness["label"], string>;
  };
  form: {
    createTitle: string;
    title: string;
    description: string;
    category: string;
    owner: string;
    audience: string;
    effectiveDate: string;
    reviewDate: string;
    reviewFrequency: string;
    notes: string;
    submit: string;
    cancel: string;
  };
  card: {
    owner: string;
    version: string;
    effectiveDate: string;
    reviewDate: string;
    acknowledgement: string;
    view: string;
  };
  detail: {
    overview: string;
    versionHistory: string;
    contributors: string;
    acknowledgements: string;
    acknowledge: string;
    acknowledged: string;
    activity: string;
    audit: string;
    save: string;
    saved: string;
    recommendations: string;
    changeSummary: string;
    completionRate: string;
    outstanding: string;
  };
  categories: Record<PolicyCategory, string>;
  statuses: Record<PolicyStatus, string>;
  audiences: Record<PolicyAudience, string>;
  frequencies: Record<ReviewFrequency, string>;
  recommendations: Record<string, string>;
  faq: {
    title: string;
    whatIs: string;
    whatIsAnswer: string;
    legalAdvice: string;
    legalAdviceAnswer: string;
    acknowledgements: string;
    acknowledgementsAnswer: string;
  };
};
