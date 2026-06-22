export type AppPortalFeatureAccess = {
  feature: string;
  enabled: boolean;
  plan_key: string;
  upgrade_required: boolean;
  upgrade_href: string;
};

export type AppPortalDashboard = {
  principle: string;
  organization_overview: {
    name: string;
    team_active: number;
    organization_role: string;
  };
  team_activity_summary: {
    active_members: number;
    actions_today: number;
  };
  subscription_status: {
    status: string;
    plan_key: string;
  };
  business_pack_status: Array<{ module_key: string; status: string }>;
  tasks_requiring_attention: number;
  recommended_actions: Array<{ id: string; title: string; href: string }>;
  notifications_count: number;
  since_last_login_summary: {
    important_updates: number;
    completed_actions: number;
    new_notifications: number;
    recommended_next_steps: Array<{ id: string; title: string; href: string }>;
    business_pack_highlights: Array<{ module_key: string; status: string }>;
  };
  privacy_note: string;
};

export type AppPortalLabels = {
  dashboard: {
    title: string;
    subtitle: string;
    loading: string;
    principle: string;
    privacyNote: string;
    organizationOverview: string;
    teamActivity: string;
    subscriptionStatus: string;
    businessPackStatus: string;
    tasksAttention: string;
    recommendedActions: string;
    notifications: string;
    sinceLastLogin: string;
    importantUpdates: string;
    completedActions: string;
    newNotifications: string;
    businessPackHighlights: string;
    noBusinessPacks: string;
    openModule: string;
    portalModules: string;
    activeMembers: string;
    plan: string;
    status: string;
  };
  foundation: {
    back: string;
    structureNote: string;
    comingSoon: string;
  };
  license: {
    upgradeTitle: string;
    upgradeBody: string;
    upgradeCta: string;
    unavailableTitle: string;
    pageLoadError: string;
  };
  knowledge: {
    title: string;
    subtitle: string;
  };
  sinceLastLoginPage: {
    title: string;
    subtitle: string;
  };
};
