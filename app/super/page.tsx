import { SuperAdminControlCenterPanel } from "@/components/super-admin";
import { SUPER_ADMIN_SECTIONS } from "@/lib/super-admin/nav-config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function SuperAdminPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["superAdmin"]);
  const t = createTranslator(dict);

  const sectionLabels = Object.fromEntries(
    SUPER_ADMIN_SECTIONS.map((section) => [
      section.id,
      {
        title: t(section.titleKey),
        purpose: t(section.purposeKey),
      },
    ])
  );

  const moduleLabels: Record<string, { label: string; description: string }> = {};
  for (const section of SUPER_ADMIN_SECTIONS) {
    for (const module of section.modules) {
      moduleLabels[module.id] = {
        label: t(module.labelKey),
        description: t(module.descriptionKey),
      };
    }
  }

  return (
    <SuperAdminControlCenterPanel
      labels={{
        loading: t("superAdmin.controlCenter.loading"),
        loadError: t("superAdmin.controlCenter.loadError"),
        emptyStateTitle: t("superAdmin.controlCenter.emptyStateTitle"),
        emptyStateBody: t("superAdmin.controlCenter.emptyStateBody"),
        setupNotice: t("superAdmin.controlCenter.setupNotice"),
        privacyNote: t("superAdmin.controlCenter.privacyNote"),
        sectionsTitle: t("superAdmin.controlCenter.sectionsTitle"),
        openModule: t("superAdmin.controlCenter.openModule"),
        executiveHeader: {
          headquarters: t("superAdmin.executiveHeader.headquarters"),
          operationsCenter: t("superAdmin.executiveHeader.operationsCenter"),
          subtext: t("superAdmin.executiveHeader.subtext"),
          platformStatus: t("superAdmin.executiveHeader.platformStatus"),
          organizationsServed: t("superAdmin.executiveHeader.organizationsServed"),
          activeWorkspaces: t("superAdmin.executiveHeader.activeWorkspaces"),
          actionsToday: t("superAdmin.executiveHeader.actionsToday"),
          systemUptime: t("superAdmin.executiveHeader.systemUptime"),
          statusOperational: t("superAdmin.status.operational"),
          statusPendingSetup: t("superAdmin.status.pendingSetup"),
          statusAttentionRequired: t("superAdmin.status.attentionRequired"),
        },
        executiveSummary: {
          title: t("superAdmin.executiveSummary.title"),
          greetingMorning: t("superAdmin.executiveSummary.greetingMorning"),
          greetingAfternoon: t("superAdmin.executiveSummary.greetingAfternoon"),
          greetingEvening: t("superAdmin.executiveSummary.greetingEvening"),
          allSystemsOperational: t("superAdmin.executiveSummary.allSystemsOperational"),
          subscriptionsReview: t("superAdmin.executiveSummary.subscriptionsReview"),
          growthPartnerActivity: t("superAdmin.executiveSummary.growthPartnerActivity"),
          marketplaceReviews: t("superAdmin.executiveSummary.marketplaceReviews"),
          criticalIncidents: t("superAdmin.executiveSummary.criticalIncidents"),
          noInterventionRequired: t("superAdmin.executiveSummary.noInterventionRequired"),
          platformStable: t("superAdmin.executiveSummary.platformStable"),
        },
        systemStatus: {
          title: t("superAdmin.systemStatus.title"),
          lastCheck: t("superAdmin.systemStatus.lastCheck"),
          lastCheckSeconds: t("superAdmin.systemStatus.lastCheckSeconds"),
          avgResponse: t("superAdmin.systemStatus.avgResponse"),
          avgResponseMs: t("superAdmin.systemStatus.avgResponseMs"),
          statusOperational: t("superAdmin.status.operational"),
          statusPendingSetup: t("superAdmin.status.pendingSetup"),
          statusAttentionRequired: t("superAdmin.status.attentionRequired"),
          services: {
            supabase: t("superAdmin.systemStatus.services.supabase"),
            resend: t("superAdmin.systemStatus.services.resend"),
            stripe: t("superAdmin.systemStatus.services.stripe"),
            klarna: t("superAdmin.systemStatus.services.klarna"),
            aipifyApi: t("superAdmin.systemStatus.services.aipifyApi"),
            webhooks: t("superAdmin.systemStatus.services.webhooks"),
          },
        },
        trustSignals: {
          title: t("superAdmin.trustSignals.title"),
          backupOk: t("superAdmin.trustSignals.backupOk"),
          twoFactorEnforced: t("superAdmin.trustSignals.twoFactorEnforced"),
          auditLoggingActive: t("superAdmin.trustSignals.auditLoggingActive"),
          complianceMonitoringActive: t("superAdmin.trustSignals.complianceMonitoringActive"),
        },
        actionCenter: {
          title: t("superAdmin.actionCenter.title"),
          subtitle: t("superAdmin.actionCenter.subtitle"),
          open: t("superAdmin.actionCenter.open"),
          priorityCritical: t("superAdmin.actionCenter.priorityCritical"),
          priorityAttention: t("superAdmin.actionCenter.priorityAttention"),
          priorityInformational: t("superAdmin.actionCenter.priorityInformational"),
          criticalIncidents: t("superAdmin.actionCenter.criticalIncidents"),
          subscriptionReview: t("superAdmin.actionCenter.subscriptionReview"),
          growthPartnerApplications: t("superAdmin.actionCenter.growthPartnerApplications"),
          marketplaceReviews: t("superAdmin.actionCenter.marketplaceReviews"),
          organizationHealth: t("superAdmin.actionCenter.organizationHealth"),
          supportEscalations: t("superAdmin.actionCenter.supportEscalations"),
          globalGovernance: t("superAdmin.actionCenter.globalGovernance"),
        },
      }}
      sectionLabels={sectionLabels}
      moduleLabels={moduleLabels}
    />
  );
}
