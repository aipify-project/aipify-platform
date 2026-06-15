export type HostsGuestModuleKey =
  | "guest_profile_intelligence"
  | "returning_guest_recognition"
  | "guest_satisfaction_monitor"
  | "early_warning_experience"
  | "personalized_hospitality_recommendations"
  | "loyalty_return_strategy"
  | "guest_segmentation"
  | "executive_loyalty_dashboard"
  | "feedback_intelligence"
  | "guest_journey_mapping";

export type HostsGuestModule = {
  key: HostsGuestModuleKey;
  label: string;
  description: string;
};

export type HostsGuestSegment = {
  key: string;
  label: string;
};

export type HostsGuestJourneyStage = {
  key: string;
  label: string;
  focus: string[];
};

export type HostsGuestInsight = {
  key: string;
  label: string;
  type: "recognition" | "satisfaction" | "recommendation" | "early_warning" | "loyalty" | string;
};

export type HostsExecutiveMetric = {
  key: string;
  label: string;
  value: string | number;
};

export type HostsLoyaltySnapshot = {
  overall_satisfaction: number;
  repeat_guest_pct: number;
  returning_guests: number;
  at_risk_guests: number;
  loyalty_opportunities: number;
};

export type AipifyHostsGuestIntelligenceDashboard = {
  has_customer: boolean;
  enabled: boolean;
  package_key: string;
  property_count: number;
  human_oversight_required: boolean;
  positioning: string;
  vision: string;
  modules: HostsGuestModule[];
  segments: HostsGuestSegment[];
  journey_stages: HostsGuestJourneyStage[];
  feedback_categories: string[];
  governance: {
    principle: string;
    approval_required: boolean;
    audit_required: boolean;
    data_minimization: boolean;
    no_raw_chat: boolean;
  };
  success_metrics: { key: string; label: string }[];
  knowledge_categories: string[];
  loyalty_snapshot: HostsLoyaltySnapshot;
  guest_insights: HostsGuestInsight[];
  executive_metrics: HostsExecutiveMetric[];
};

export type AipifyHostsGuestIntelligenceCard = {
  has_customer: boolean;
  enabled?: boolean;
  package_key?: string;
  property_count?: number;
  human_oversight_required?: boolean;
  positioning?: string;
  route?: string;
};
