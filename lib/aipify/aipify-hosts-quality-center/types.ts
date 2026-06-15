export type HostsQualityCenterSectionKey =
  | "upcoming_inspections"
  | "active_inspections"
  | "completed_inspections"
  | "quality_reviews"
  | "standards_library";

export type HostsInspectionRow = {
  id: string;
  inspection_key: string;
  property: string;
  property_id: string | null;
  inspection_type: string;
  status: string;
  assigned_inspector: string;
  scheduled_date: string | null;
  completion_date: string | null;
  outcome: string | null;
  checklist_results: Record<string, unknown>;
  photo_count: number;
  created_at: string;
};

export type HostsQualityReviewRow = {
  id: string;
  property: string;
  property_id: string | null;
  inspection_id: string | null;
  property_score: number;
  inspector_notes: string | null;
  recommended_actions: string | null;
  improvement_opportunities: string | null;
  created_at: string;
};

export type HostsCorrectiveActionRow = {
  id: string;
  inspection_id: string;
  action_summary: string;
  assigned_owner: string | null;
  due_date: string | null;
  escalated: boolean;
  action_status: string;
  created_at: string;
};

export type HostsPhotoEvidenceRow = {
  id: string;
  inspection_id: string;
  checklist_category: string;
  reference_label: string;
  caption: string | null;
  created_at: string;
};

export type HostsStandardItem = {
  key: string;
  title: string;
  expectation: string;
};

export type HostsTimelineRow = {
  id: string;
  inspection_id: string;
  timeline_type: string;
  summary: string;
  created_at: string;
};

export type HostsQualityStats = {
  upcoming_count: number;
  active_count: number;
  overdue_count: number;
  failed_count: number;
  avg_property_score: number;
};

export type HostsPropertyOption = {
  id: string;
  display_name: string;
};

export type HostsQualityCenterDashboard = {
  has_customer: boolean;
  enabled: boolean;
  package_key: string;
  active_section: string;
  positioning: string;
  governance: Record<string, boolean>;
  sections: Array<{ key: string; label: string }>;
  inspection_types: string[];
  inspection_statuses: string[];
  checklist_categories: string[];
  inspection_outcomes: string[];
  standards_library: HostsStandardItem[];
  stats: HostsQualityStats;
  properties: HostsPropertyOption[];
  timeline: HostsTimelineRow[];
  upcoming_inspections: HostsInspectionRow[];
  active_inspections: HostsInspectionRow[];
  completed_inspections: HostsInspectionRow[];
  quality_reviews: HostsQualityReviewRow[];
  corrective_actions: HostsCorrectiveActionRow[];
  photo_evidence: HostsPhotoEvidenceRow[];
};

export type HostsQualityCenterActionResult = {
  success: boolean;
  inspection_id?: string;
  action_id?: string;
  evidence_id?: string;
  status?: string;
  outcome?: string;
};
