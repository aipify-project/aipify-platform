export type InnovationIdea = {
  id: string;
  idea_key: string;
  title: string;
  problem_statement: string;
  proposed_solution: string;
  expected_outcomes: string;
  target_audience: string;
  source: string;
  status: string;
  customer_value_score: number;
  strategic_alignment_score: number;
  feasibility_score: number;
  risk_level: string;
  estimated_effort: string;
};

export type InnovationExperiment = {
  id: string;
  experiment_key: string;
  title: string;
  description: string;
  experiment_type: string;
  status: string;
  stage: string;
  progress_pct: number;
  participant_count: number;
};

export type PilotProgram = {
  id: string;
  program_key: string;
  title: string;
  description: string;
  status: string;
  max_participants: number;
  current_participants: number;
  success_criteria: string;
};

export type InnovationFeatureFlag = {
  id: string;
  flag_key: string;
  title: string;
  description: string;
  status: string;
  target_segment: string;
  exposure_pct: number;
};

export type InnovationScorecard = {
  period_label?: string;
  experiment_completion_pct?: number;
  customer_satisfaction_impact?: number;
  adoption_potential_pct?: number;
  business_value_score?: number;
  return_on_innovation?: number;
};

export type LessonLearned = {
  id: string;
  title: string;
  summary: string;
  outcome_type: string;
};

export type InnovationLabCard = {
  has_customer: boolean;
  innovation_score?: number;
  active_experiments?: number;
  philosophy?: string;
  human_oversight_required?: boolean;
};

export type InnovationLabDashboard = {
  has_customer: boolean;
  human_oversight_required?: boolean;
  philosophy?: string;
  safety_note?: string;
  lab_enabled?: boolean;
  sandbox_enabled?: boolean;
  customer_cocreation_enabled?: boolean;
  feature_flags_enabled?: boolean;
  executive_approval_required?: boolean;
  failure_learning_enabled?: boolean;
  innovation_score?: number;
  experiment_completion_pct?: number;
  active_experiments?: number;
  ideas_in_pipeline?: number;
  return_on_innovation?: number;
  lab_structure?: Array<{ area: string; label: string }>;
  experiment_stages?: string[];
  sandbox_capabilities?: string[];
  ideas: InnovationIdea[];
  experiments: InnovationExperiment[];
  pilot_programs: PilotProgram[];
  feature_flags: InnovationFeatureFlag[];
  scorecard?: InnovationScorecard;
  lessons_learned: LessonLearned[];
  governance_controls?: string[];
  briefings: Array<{ id: string; summary: string; created_at?: string }>;
  integrations?: Record<string, string>;
};

export type InnovationLabActionResult = {
  status?: string;
  error?: string;
};

export type InnovationLabBriefingResult = {
  briefing_id?: string;
  summary?: string;
  error?: string;
};
