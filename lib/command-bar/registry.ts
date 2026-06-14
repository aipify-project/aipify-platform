import type { CommandBarItem, CommandBarLabels, CommandBarNavSource, CommandBarPortal } from "./types";

export function navSourcesToCommands(sources: CommandBarNavSource[]): CommandBarItem[] {
  return sources.map((source) => ({
    id: `nav:${source.id}`,
    label: source.label,
    description: source.description,
    href: source.href,
    section: "navigation" as const,
    keywords: source.keywords,
  }));
}

export function buildPlatformActionCommands(labels: CommandBarLabels): CommandBarItem[] {
  return [
    {
      id: "action:approve-pending",
      label: labels.recommendations.pendingApprovals,
      href: "/platform/actions",
      section: "action",
      keywords: ["approve", "pending", "actions"],
    },
    {
      id: "action:create-automation",
      label: labels.actions.createAutomation,
      href: "/platform/automations",
      section: "action",
      keywords: ["automation", "create", "workflow"],
      minPlatformRole: "platform_support",
    },
    {
      id: "action:export-audit",
      label: labels.actions.exportAuditLogs,
      href: "/platform/actions/logs",
      section: "action",
      keywords: ["audit", "export", "logs"],
      minPlatformRole: "super_admin",
      superAdminOnly: true,
    },
    {
      id: "action:failed-workflows",
      label: labels.actions.viewFailedWorkflows,
      href: "/platform/actions/failed",
      section: "action",
      keywords: ["failed", "workflow", "restart"],
    },
    {
      id: "action:launch-install",
      label: labels.actions.launchInstallWizard,
      href: "/platform/install-engine",
      section: "action",
      keywords: ["install", "wizard", "onboarding"],
    },
    {
      id: "action:executive-report",
      label: labels.actions.generateExecutiveReport,
      href: "/platform/executive",
      section: "action",
      keywords: ["executive", "report", "summary"],
    },
    {
      id: "action:restart-failed",
      label: labels.actions.restartFailedWorkflow,
      href: "/platform/actions/failed",
      section: "action",
      keywords: ["restart", "failed", "workflow", "retry"],
    },
    {
      id: "action:growth-partners",
      label: labels.actions.findGrowthPartners,
      href: "/platform/pilot-operations",
      section: "action",
      keywords: ["growth partner", "affiliate", "partner"],
      minPlatformRole: "super_admin",
      superAdminOnly: true,
    },
    {
      id: "action:invite-growth-partner",
      label: labels.actions.inviteGrowthPartner,
      href: "/platform/pilot-operations",
      section: "action",
      keywords: ["invite", "growth partner", "partner"],
      minPlatformRole: "super_admin",
      superAdminOnly: true,
    },
  ];
}

export function buildCustomerActionCommands(labels: CommandBarLabels): CommandBarItem[] {
  return [
    {
      id: "action:approve-pending",
      label: labels.recommendations.pendingApprovals,
      href: "/app/approvals",
      section: "action",
      keywords: ["approve", "pending", "actions"],
      minCustomerRoles: ["admin", "owner"],
    },
    {
      id: "action:create-automation",
      label: labels.actions.createAutomation,
      href: "/app/adaptive-automation",
      section: "action",
      keywords: ["automation", "create", "workflow"],
      minCustomerRoles: ["admin", "owner"],
    },
    {
      id: "action:executive-summary",
      label: labels.recommendations.executiveSummary,
      href: "/app/executive",
      section: "action",
      keywords: ["executive", "summary", "briefing"],
    },
    {
      id: "action:launch-install",
      label: labels.actions.launchInstallWizard,
      href: "/app/install",
      section: "action",
      keywords: ["install", "wizard"],
      minCustomerRoles: ["admin", "owner"],
    },
    {
      id: "action:knowledge-search",
      label: labels.actions.searchKnowledgeCenter,
      href: "/app/knowledge-center-engine",
      section: "action",
      keywords: ["knowledge", "faq", "articles"],
    },
    {
      id: "action:failed-automations",
      label: labels.recommendations.failedAutomations,
      href: "/app/adaptive-automation",
      section: "action",
      keywords: ["failed", "automation"],
      minCustomerRoles: ["admin", "owner", "support"],
    },
  ];
}

export function buildSuperAdminActionCommands(labels: CommandBarLabels): CommandBarItem[] {
  return [
    ...buildPlatformActionCommands(labels),
    {
      id: "action:super-audit",
      label: labels.actions.superAdminAudit,
      href: "/super",
      section: "action",
      keywords: ["audit", "super admin"],
      superAdminOnly: true,
    },
  ];
}

export function buildRegistryForPortal(
  portal: CommandBarPortal,
  labels: CommandBarLabels,
  navSources: CommandBarNavSource[]
): CommandBarItem[] {
  const navigation = navSourcesToCommands(navSources);

  if (portal === "customer") {
    return [...navigation, ...buildCustomerActionCommands(labels)];
  }

  if (portal === "platform") {
    return [...navigation, ...buildPlatformActionCommands(labels)];
  }

  return [...navigation, ...buildSuperAdminActionCommands(labels)];
}
