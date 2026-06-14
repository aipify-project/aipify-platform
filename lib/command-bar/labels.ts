import type { CommandBarLabels } from "./types";
import type { Translator } from "@/lib/i18n/translate";

export function buildCommandBarLabels(t: Translator): CommandBarLabels {
  return {
    placeholder: t("commandBar.placeholder"),
    close: t("commandBar.close"),
    noResults: t("commandBar.noResults"),
    openCommandBar: t("commandBar.openCommandBar"),
    sections: {
      navigation: t("commandBar.sections.navigation"),
      action: t("commandBar.sections.action"),
      search: t("commandBar.sections.search"),
      recommendation: t("commandBar.sections.recommendation"),
      recent: t("commandBar.sections.recent"),
    },
    shortcuts: {
      title: t("commandBar.shortcuts.title"),
      navigate: t("commandBar.shortcuts.navigate"),
      select: t("commandBar.shortcuts.select"),
      close: t("commandBar.shortcuts.close"),
      open: t("commandBar.shortcuts.open"),
    },
    recommendations: {
      pendingApprovals: t("commandBar.recommendations.pendingApprovals"),
      failedAutomations: t("commandBar.recommendations.failedAutomations"),
      growthPartnerApplications: t("commandBar.recommendations.growthPartnerApplications"),
      executiveSummary: t("commandBar.recommendations.executiveSummary"),
    },
    actions: {
      createAutomation: t("commandBar.actions.createAutomation"),
      exportAuditLogs: t("commandBar.actions.exportAuditLogs"),
      viewFailedWorkflows: t("commandBar.actions.viewFailedWorkflows"),
      launchInstallWizard: t("commandBar.actions.launchInstallWizard"),
      generateExecutiveReport: t("commandBar.actions.generateExecutiveReport"),
      findGrowthPartners: t("commandBar.actions.findGrowthPartners"),
      superAdminAudit: t("commandBar.actions.superAdminAudit"),
      searchKnowledgeCenter: t("commandBar.actions.searchKnowledgeCenter"),
      inviteGrowthPartner: t("commandBar.actions.inviteGrowthPartner"),
      openCustomerProfile: t("commandBar.actions.openCustomerProfile"),
      restartFailedWorkflow: t("commandBar.actions.restartFailedWorkflow"),
    },
    categories: {
      customers: t("commandBar.categories.customers"),
      support: t("commandBar.categories.support"),
      knowledge: t("commandBar.categories.knowledge"),
      skills: t("commandBar.categories.skills"),
      actions: t("commandBar.categories.actions"),
      growthPartners: t("commandBar.categories.growthPartners"),
      automations: t("commandBar.categories.automations"),
      users: t("commandBar.categories.users"),
      subscriptions: t("commandBar.categories.subscriptions"),
      modules: t("commandBar.categories.modules"),
    },
  };
}
