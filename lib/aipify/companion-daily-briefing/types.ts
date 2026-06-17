export type BriefingMode = "ultra_short" | "summary" | "standard" | "detailed" | "executive";
export type BriefingPriority = "critical" | "high" | "medium" | "low" | "informational";
export type BriefingStatusIndicator = "critical" | "attention_required" | "upcoming" | "on_track" | "completed";
export type BriefingSection = "since_last_login" | "priorities" | "calendar" | "insights_recommendations" | "focus_card";

export type BriefingItem = {
  id: string;
  section: BriefingSection | string;
  title: string;
  description: string;
  priority: BriefingPriority | string;
  status_indicator: BriefingStatusIndicator | string;
  recommended_action: string;
  owner_label?: string;
  due_date?: string | null;
  category?: string;
  department?: string;
  source_key?: string;
};

export type FocusArea = {
  focus_key: string;
  focus_label: string;
  focus_score: number;
};

export type SinceLastLogin = {
  completed_tasks?: number;
  new_notifications?: number;
  new_support_requests?: number;
  new_approvals?: number;
  important_activity?: string;
};

export type BriefingTimelineEvent = {
  id: string;
  event_type: string;
  description: string;
  created_at: string;
};

export type DailyBriefingDashboard = {
  found: boolean;
  has_briefing?: boolean;
  role?: string;
  can_team?: boolean;
  can_organization?: boolean;
  can_executive?: boolean;
  readiness_score?: number;
  briefing_mode?: string;
  todays_focus?: string;
  greeting?: string;
  executive_summary?: string;
  since_last_login?: SinceLastLogin;
  briefing_date?: string;
  generated_at?: string;
  items?: BriefingItem[];
  focus_areas?: FocusArea[];
  new_insights_count?: number;
  new_recommendations_count?: number;
  timeline?: BriefingTimelineEvent[];
  usage_example?: string;
  privacy_note?: string;
  principle?: string;
};

export const FOCUS_AREA_KEYS = [
  "customer_success", "growth", "operations", "team_management", "strategic_planning", "support",
] as const;

export type CompanionDailyBriefingLabels = {
  title: string;
  subtitle: string;
  loading: string;
  principle: string;
  privacyNote: string;
  emptyTitle: string;
  emptyBody: string;
  emptyCta: string;
  accessDenied: string;
  filters: { search: string; priority: string; department: string; category: string; status: string; all: string };
  header: { goodMorning: string; welcomeBack: string; dailyBriefing: string; date: string; role: string; organization: string };
  sections: {
    sinceLastLogin: string;
    priorities: string;
    calendar: string;
    insightsRecommendations: string;
    executiveSummary: string;
    focusAreas: string;
    timeline: string;
    usageExamples: string;
  };
  dashboard: {
    readinessScore: string;
    focusAreas: string;
    upcomingEvents: string;
    outstandingTasks: string;
    newInsights: string;
    newRecommendations: string;
    sinceLastLoginSummary: string;
    todaysFocus: string;
    briefingMode: string;
  };
  card: { recommendedAction: string; owner: string; dueDate: string; priority: string; status: string };
  actions: { generate: string; viewDetails: string; dismiss: string };
  priorities: Record<string, string>;
  statuses: Record<string, string>;
  briefingModes: Record<string, string>;
  focusAreas: Record<string, string>;
  sinceLastLogin: Record<string, string>;
  faq: { title: string; whatIs: string; whatIsAnswer: string; howGenerated: string; howGeneratedAnswer: string; customize: string; customizeAnswer: string };
};
