import type { GoalCategory, GoalPriority, GoalStatus } from "./dimensions";

export type StrategicGoal = {
  id: string;
  title: string;
  description: string;
  category: GoalCategory;
  status: GoalStatus;
  priority: GoalPriority;
  owner_user_id?: string | null;
  parent_goal_id?: string | null;
  baseline_value: number;
  target_value: number;
  current_value: number;
  measurement_unit: string;
  progress_percent: number;
  start_date: string;
  target_date?: string | null;
  completed_at?: string | null;
  health_explanation: string;
  pulse_influence?: string;
  created_at: string;
  updated_at: string;
};

export type GoalMilestone = {
  id: string;
  goal_id?: string;
  goal_title?: string;
  milestone_name: string;
  target_value: number;
  achieved_at?: string | null;
};

export type GoalActivity = {
  id: string;
  goal_id: string;
  goal_title?: string;
  activity_type: string;
  activity_description: string;
  created_by?: string | null;
  created_at: string;
};

export type GoalRecommendation = {
  goal_id: string;
  goal_title: string;
  recommendation: string;
  action_center_hint: string;
};

export type StrategicGoalsCenter = {
  has_customer: boolean;
  has_access?: boolean;
  upgrade_required?: boolean;
  plan?: string;
  enterprise_features?: boolean;
  briefing?: string;
  active_goals?: StrategicGoal[];
  goals_at_risk?: StrategicGoal[];
  completed_goals?: StrategicGoal[];
  upcoming_milestones?: GoalMilestone[];
  goal_timeline?: GoalActivity[];
  recommended_actions?: GoalRecommendation[];
  health_summary?: {
    on_track: number;
    needs_attention: number;
    total_active: number;
  };
  privacy_note?: string;
};

export type CreateGoalInput = {
  title: string;
  description?: string;
  category?: GoalCategory;
  priority?: GoalPriority;
  owner_user_id?: string | null;
  parent_goal_id?: string | null;
  baseline_value?: number;
  target_value?: number;
  current_value?: number;
  measurement_unit?: string;
  start_date?: string;
  target_date?: string | null;
};
