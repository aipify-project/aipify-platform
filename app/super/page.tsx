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
          monitoringAreas: t("superAdmin.executiveSummary.monitoringAreas"),
          allSystemsOperational: t("superAdmin.executiveSummary.allSystemsOperational"),
          subscriptionsReview: t("superAdmin.executiveSummary.subscriptionsReview"),
          growthPartnerActivity: t("superAdmin.executiveSummary.growthPartnerActivity"),
          marketplaceReviews: t("superAdmin.executiveSummary.marketplaceReviews"),
          paymentProviderIncomplete: t("superAdmin.executiveSummary.paymentProviderIncomplete"),
          criticalIncidents: t("superAdmin.executiveSummary.criticalIncidents"),
          noInterventionRequired: t("superAdmin.executiveSummary.noInterventionRequired"),
          platformStable: t("superAdmin.executiveSummary.platformStable"),
          attentionRequiredToday: t("superAdmin.executiveSummary.attentionRequiredToday"),
          estimatedReviewTime: t("superAdmin.executiveSummary.estimatedReviewTime"),
        },
        systemStatus: {
          title: t("superAdmin.systemStatus.title"),
          lastCheck: t("superAdmin.systemStatus.lastCheck"),
          lastCheckSeconds: t("superAdmin.systemStatus.lastCheckSeconds"),
          avgResponse: t("superAdmin.systemStatus.avgResponse"),
          avgResponseMs: t("superAdmin.systemStatus.avgResponseMs"),
          uptimeTrend: t("superAdmin.systemStatus.uptimeTrend"),
          uptimeTrendValue: t("superAdmin.systemStatus.uptimeTrendValue"),
          setupProgress: t("superAdmin.systemStatus.setupProgress"),
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
          subtitle: t("superAdmin.trustSignals.subtitle"),
          backupOk: t("superAdmin.trustSignals.backupOk"),
          backupVerified: t("superAdmin.trustSignals.backupVerified"),
          twoFactorEnforced: t("superAdmin.trustSignals.twoFactorEnforced"),
          auditLoggingActive: t("superAdmin.trustSignals.auditLoggingActive"),
          complianceMonitoringActive: t("superAdmin.trustSignals.complianceMonitoringActive"),
          securityPosture: t("superAdmin.trustSignals.securityPosture"),
          securityPostureStrong: t("superAdmin.trustSignals.securityPostureStrong"),
          securityPostureReview: t("superAdmin.trustSignals.securityPostureReview"),
          complianceHealth: t("superAdmin.trustSignals.complianceHealth"),
          incidentFreeDays: t("superAdmin.trustSignals.incidentFreeDays"),
          executiveVisibility: t("superAdmin.trustSignals.executiveVisibility"),
        },
        actionCenter: {
          title: t("superAdmin.actionCenter.title"),
          subtitle: t("superAdmin.actionCenter.subtitle"),
          open: t("superAdmin.actionCenter.open"),
          takeAction: t("superAdmin.actionCenter.takeAction"),
          priorityCritical: t("superAdmin.actionCenter.priorityCritical"),
          priorityAttention: t("superAdmin.actionCenter.priorityAttention"),
          priorityInformational: t("superAdmin.actionCenter.priorityInformational"),
          categoryRequiresApproval: t("superAdmin.actionCenter.categoryRequiresApproval"),
          categoryRecommended: t("superAdmin.actionCenter.categoryRecommended"),
          categoryCritical: t("superAdmin.actionCenter.categoryCritical"),
          categoryMilestones: t("superAdmin.actionCenter.categoryMilestones"),
          impactHigh: t("superAdmin.actionCenter.impactHigh"),
          impactMedium: t("superAdmin.actionCenter.impactMedium"),
          impactLow: t("superAdmin.actionCenter.impactLow"),
          estimatedTime: t("superAdmin.actionCenter.estimatedTime"),
          criticalIncidents: t("superAdmin.actionCenter.criticalIncidents"),
          subscriptionReview: t("superAdmin.actionCenter.subscriptionReview"),
          growthPartnerApplications: t("superAdmin.actionCenter.growthPartnerApplications"),
          marketplaceReviews: t("superAdmin.actionCenter.marketplaceReviews"),
          organizationHealth: t("superAdmin.actionCenter.organizationHealth"),
          supportEscalations: t("superAdmin.actionCenter.supportEscalations"),
          globalGovernance: t("superAdmin.actionCenter.globalGovernance"),
          paymentProviderSetup: t("superAdmin.actionCenter.paymentProviderSetup"),
        },
      }}
      sectionLabels={sectionLabels}
      moduleLabels={moduleLabels}
    />
  );
}
