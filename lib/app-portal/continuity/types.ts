export type ContinuityCategory =
  | "business_continuity"
  | "incident_response"
  | "technology_recovery"
  | "workforce_continuity"
  | "vendor_continuity"
  | "communications_continuity"
  | "executive_continuity"
  | "operational_recovery"
  | "facility_preparedness"
  | "custom_continuity_area";

export type ContinuityStatus = "draft" | "active" | "under_review" | "testing" | "archived";

export type ContinuityCriticality = "low" | "moderate" | "high" | "mission_critical";

import type { ReviewFrequency } from "../responsibilities/types";

export type ExerciseType = "tabletop" | "simulation";

export type ContinuityPlanItem = {
  id: string;
  title: string;
  description?: string;
  description_full?: string;
  category: ContinuityCategory;
  owner_id?: string | null;
  owner_name: string;
  backup_owner_id?: string | null;
  backup_owner_name: string;
  criticality_level: ContinuityCriticality;
  status: ContinuityStatus;
  review_frequency: ReviewFrequency;
  last_reviewed_date?: string | null;
  next_review_date?: string | null;
  needs_review?: boolean;
  upcoming_exercise_date?: string | null;
  recovery_objectives?: string;
  critical_dependencies?: string[];
  alternative_procedures?: string;
  escalation_paths?: string;
  minimum_operational_requirements?: string;
  notes?: string;
  notes_full?: string;
  created_at: string;
  updated_at: string;
};

export type ContinuityExercise = {
  id: string;
  title: string;
  exercise_type: ExerciseType;
  exercise_date: string;
  lessons_learned?: string;
  improvement_actions?: string;
  notes?: string;
  created_at: string;
};

export type ContinuityRecommendation = {
  id: string;
  key: string;
  priority: string;
  plan_id?: string;
};

export type ContinuityDashboard = {
  active: number;
  needs_review: number;
  mission_critical: number;
  without_owner: number;
  upcoming_exercises: number;
  recently_updated: ContinuityPlanItem[];
};

export type ContinuityListResponse = {
  found: boolean;
  can_manage?: boolean;
  items: ContinuityPlanItem[];
  dashboard?: ContinuityDashboard;
  recommendations?: ContinuityRecommendation[];
  principle?: string;
};

export type ContinuityDetail = {
  found: boolean;
  can_manage?: boolean;
  plan?: ContinuityPlanItem;
  exercises?: ContinuityExercise[];
  related_risks?: Array<{ id: string; title: string; status: string }>;
  related_playbooks?: Array<{ id: string; title: string; status: string }>;
  related_external_relationships?: Array<{ id: string; name: string; status: string }>;
  activity_timeline?: Array<{ id: string; event_type: string; description: string; created_at: string; performed_by: string }>;
  audit_history?: Array<{ id: string; event_type: string; description: string; created_at: string; performed_by: string }>;
  recommendations?: ContinuityRecommendation[];
};

export type ContinuityLabels = {
  title: string;
  subtitle: string;
  loading: string;
  principle: string;
  emptyTitle: string;
  emptyBody: string;
  emptyCta: string;
  back: string;
  notFound: string;
  filters: { search: string; category: string; status: string; owner: string; criticality: string; reviewBefore: string; exerciseBefore: string; all: string };
  dashboard: { active: string; needsReview: string; missionCritical: string; withoutOwner: string; upcomingExercises: string; recent: string };
  form: { createTitle: string; title: string; description: string; category: string; criticality: string; reviewFrequency: string; recoveryObjectives: string; notes: string; submit: string; cancel: string };
  card: { owner: string; backupOwner: string; nextReview: string; criticality: string; view: string };
  detail: {
    overview: string; ownership: string; recovery: string; dependencies: string; alternativeProcedures: string;
    escalationPaths: string; minimumRequirements: string; relatedPlaybooks: string; relatedRisks: string;
    relatedRelationships: string; exercises: string; activity: string; audit: string; save: string; saved: string;
    recommendations: string; addExercise: string; exerciseTitle: string; exerciseType: string; exerciseDate: string;
    lessonsLearned: string; improvementActions: string;
  };
  categories: Record<ContinuityCategory, string>;
  statuses: Record<ContinuityStatus, string>;
  criticality: Record<ContinuityCriticality, string>;
  frequencies: Record<ReviewFrequency, string>;
  exerciseTypes: Record<ExerciseType, string>;
  recommendations: Record<string, string>;
  faq: { title: string; whatIs: string; whatIsAnswer: string; exercises: string; exercisesAnswer: string; autoManage: string; autoManageAnswer: string };
};
