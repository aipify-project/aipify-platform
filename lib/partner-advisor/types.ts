export type PartnerAdvisorProfile = {
  id: string;
  advisor_key: string;
  display_name: string;
  role_title: string;
  advisor_type: string;
  photo_url: string;
  languages: string[];
  availability_status: string;
  availability_note: string;
  contact_email: string;
  contact_calendar_url: string;
  contact_chat_enabled: boolean;
  partners_supported: number;
  avg_partner_growth_pct: number;
  partner_retention_pct: number;
};

export type PartnerAdvisorMessage = {
  id: string;
  message_key?: string;
  message_source: string;
  message_type: string;
  subject: string;
  body: string;
  sender_name: string;
  direction?: string;
  is_read: boolean;
  created_at: string;
};

export type PartnerAdvisorReview = {
  id: string;
  review_key?: string;
  review_type: string;
  scheduled_date: string;
  review_status: string;
  advisor_notes: string;
  recommendations: string[];
  action_items: string[];
  updated_at?: string;
};

export type PartnerAdvisorGoal = {
  id: string;
  goal_key?: string;
  goal_type: string;
  title: string;
  description: string;
  target_value: number;
  current_value: number;
  goal_status: string;
  due_date: string;
  updated_at?: string;
};

export type PartnerAdvisorSuccessPlan = {
  current_stage: string;
  next_milestone: string;
  recommended_actions: string[];
  estimated_time: string;
  expected_outcome: string;
};

export type PartnerAdvisorJourneyMilestone = {
  id: string;
  milestone_category: string;
  title: string;
  summary: string;
  achieved_at: string;
};

export type PartnerAdvisorOverview = {
  has_access: boolean;
  can_write?: boolean;
  team_role?: string;
  access_denied?: boolean;
  positioning?: string;
  partner_info?: {
    org_name: string;
    partner_type: string;
    country_code: string;
    joined_date: string;
    contact_email: string;
    company_name: string;
  };
  has_advisor?: boolean;
  advisor?: PartnerAdvisorProfile | null;
  assignment?: {
    status: string;
    introduction_scheduled_at: string;
    introduction_completed_at: string;
  } | null;
  health_score_label: string;
  health_score_pct: number;
  readiness_score_pct: number;
  recommendations: string[];
  advisor_insights: string[];
  upcoming_reviews: Array<{
    id: string;
    review_type: string;
    scheduled_date: string;
    review_status: string;
  }>;
  recent_messages: PartnerAdvisorMessage[];
  success_plan?: PartnerAdvisorSuccessPlan | null;
  journey: PartnerAdvisorJourneyMilestone[];
  companion_signals: Array<{
    id: string;
    signal_type: string;
    summary: string;
    priority: string;
    created_at: string;
  }>;
  empty_state?: { title: string; message: string; cta: string };
};

export type PartnerAdvisorReviewsBundle = {
  has_access: boolean;
  can_write?: boolean;
  reviews: PartnerAdvisorReview[];
};

export type PartnerAdvisorMessagesBundle = {
  has_access: boolean;
  can_write?: boolean;
  messages: PartnerAdvisorMessage[];
};

export type PartnerAdvisorGoalsBundle = {
  has_access: boolean;
  can_write?: boolean;
  goals: PartnerAdvisorGoal[];
};

export type PartnerAdvisorFilters = {
  advisor_type?: string;
  health_score?: string;
  performance?: string;
  country?: string;
  partner_tier?: string;
  goal_status?: string;
  message_source?: string;
  message_type?: string;
  review_type?: string;
  review_status?: string;
  goal_type?: string;
  search?: string;
};
