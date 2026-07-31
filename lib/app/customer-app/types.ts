import type { HealthScoreOverview } from "./health-score";
import type { QuickActionId } from "@/lib/notification/command-center";

export type CustomerAppHomeBundle = {
  has_customer: boolean;
  timezone?: string;
  greeting_period?: string;
  welcome_message?: string;
  company_name?: string;
  user_name?: string;
  health_score?: HealthScoreOverview;
  executive_overview?: string;
  recent_activity?: Array<{ id: string; title: string; created_at: string }>;
  recommendations_preview?: Array<{ id: string; title: string; message: string }>;
  pending_approvals_count?: number;
  recommendations_count?: number;
  active_skills?: number;
  quick_actions?: Array<{ id: QuickActionId; label: string; href?: string }>;
  onboarding_complete?: boolean;
};

export type CustomerRecommendation = {
  id: string;
  source: "customer" | "ai";
  title: string;
  description: string;
  reason: string;
  expected_impact: string;
  risk_level: string;
  suggested_action: string;
  confidence: number;
  status: string;
  created_at: string;
};

export type CustomerApproval = {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  risk_level: string;
  created_at: string;
  action_name?: string;
  skill_name?: string;
  confidence_score?: number;
  approver_role_required?: string;
  undo_available?: boolean;
  source?: string;
  resource_type?: string;
  resource_id?: string;
  return_to_kompis?: boolean;
  /** Website Kompis binding (optional — absent for non-website actions). */
  website_id?: string | null;
  website_path?: string | null;
  website_locale?: string | null;
  candidate_id?: string | null;
  expected_current_version_id?: string | null;
  current_version_id?: string | null;
  action_checksum?: string | null;
  binding_complete?: boolean | null;
  expires_at?: string | null;
  audit_reference?: string | null;
  tool_key?: string | null;
  run_id?: string | null;
  step_id?: string | null;
};

export type CustomerTeamMember = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
};

export type CustomerTeamInvitation = {
  id: string;
  email: string;
  role: string;
  status: string;
  created_at: string;
};

export type CustomerPresenceEvent = {
  id: string;
  category: string;
  title: string;
  created_at: string;
};

export type CustomerExecutiveDashboard = {
  has_customer: boolean;
  health_score?: HealthScoreOverview;
  executive_summary?: string;
  recent_activity?: Array<{ id: string; title: string; created_at: string }>;
  recommendations?: Array<{ id: string; message: string }>;
  pending_approvals?: number;
  active_skills?: number;
  installation_status?: {
    total: number;
    healthy: number;
    attention: number;
  };
  quick_actions?: Array<{ id: QuickActionId; label: string; href?: string }>;
};
