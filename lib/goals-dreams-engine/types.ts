import type { AccountabilityLevel, GoalCategory, GoalTimeframe } from "./dimensions";

export type GdeSettings = {
  default_accountability: AccountabilityLevel;
  proactive_suggestions_enabled: boolean;
  celebration_enabled: boolean;
  setback_support_enabled: boolean;
  check_in_frequency_days: number;
  privacy_settings: Record<string, unknown>;
};

export type GoalMilestone = {
  id: string;
  title: string;
  status: string;
  progress_percent: number;
  sort_order: number;
};

export type GoalAction = {
  id: string;
  title: string;
  status: string;
  due_date: string | null;
};

export type UserGoal = {
  id: string;
  title: string;
  description: string;
  why_matters: string;
  category: GoalCategory;
  timeframe: GoalTimeframe;
  accountability_level: AccountabilityLevel;
  status: string;
  progress_percent: number;
  target_date: string | null;
  last_worked_at: string | null;
  milestones?: GoalMilestone[];
  actions?: GoalAction[];
};

export type GoalActivity = {
  id: string;
  goal_id: string;
  activity_type: string;
  message: string;
  created_at: string;
};

export type GoalsCenterBundle = {
  has_customer: boolean;
  user_name?: string;
  settings?: GdeSettings;
  active_goals?: UserGoal[];
  completed_goals?: Array<{
    id: string;
    title: string;
    category: string;
    progress_percent: number;
    completed_at: string | null;
  }>;
  recommended_next_steps?: Array<{ goal_id: string; message: string }>;
  celebrations?: GoalActivity[];
  check_ins?: GoalActivity[];
  stale_goals_count?: number;
  check_in_prompt?: string | null;
  privacy_note?: string;
  integrations?: Record<string, string>;
};

export type GoalDraft = {
  title: string;
  description: string;
  why_matters: string;
  category: GoalCategory;
  timeframe: GoalTimeframe;
  needs_clarification: boolean;
  clarification_question?: string;
  clarification_options?: string[];
};

export type GoalDetection = {
  detected: boolean;
  draft: GoalDraft | null;
  prompt: string;
  follow_up_options?: string[];
};
