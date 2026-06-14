export type CommandBarPortal = "customer" | "platform" | "super_admin";

export type CommandBarSection =
  | "navigation"
  | "action"
  | "search"
  | "recommendation"
  | "recent";

export type CustomerRole = "owner" | "admin" | "support" | "staff" | "read_only";

export type PlatformRole = "super_admin" | "platform_support";

export type CommandBarItem = {
  id: string;
  label: string;
  description?: string;
  href?: string;
  section: CommandBarSection;
  keywords?: string[];
  minCustomerRoles?: CustomerRole[];
  minPlatformRole?: PlatformRole;
  superAdminOnly?: boolean;
};

export type CommandBarRecentEntry = {
  id: string;
  label: string;
  href: string;
  visitedAt: number;
};

export type CommandBarRecommendation = {
  id: string;
  label: string;
  description?: string;
  href: string;
  priority?: number;
};

export type CommandBarSearchResult = {
  id: string;
  label: string;
  description?: string;
  href: string;
  category: string;
};

export type CommandBarContextResponse = {
  recommendations: CommandBarRecommendation[];
};

export type CommandBarSearchResponse = {
  results: CommandBarSearchResult[];
};

export type CommandBarNavSource = {
  id: string;
  label: string;
  href: string;
  description?: string;
  keywords?: string[];
};

export type CommandBarLabels = {
  placeholder: string;
  close: string;
  noResults: string;
  openCommandBar: string;
  sections: {
    navigation: string;
    action: string;
    search: string;
    recommendation: string;
    recent: string;
  };
  shortcuts: {
    title: string;
    navigate: string;
    select: string;
    close: string;
    open: string;
  };
  recommendations: {
    pendingApprovals: string;
    failedAutomations: string;
    growthPartnerApplications: string;
    executiveSummary: string;
  };
  actions: {
    createAutomation: string;
    exportAuditLogs: string;
    viewFailedWorkflows: string;
    launchInstallWizard: string;
    generateExecutiveReport: string;
    findGrowthPartners: string;
    superAdminAudit: string;
    searchKnowledgeCenter: string;
    inviteGrowthPartner: string;
    openCustomerProfile: string;
    restartFailedWorkflow: string;
  };
  categories: {
    customers: string;
    support: string;
    knowledge: string;
    skills: string;
    actions: string;
    growthPartners: string;
    automations: string;
    users: string;
    subscriptions: string;
    modules: string;
  };
};

export type CommandBarRoleContext = {
  portal: CommandBarPortal;
  customerRole?: CustomerRole;
  platformRole?: PlatformRole;
};
