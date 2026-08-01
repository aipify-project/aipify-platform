import type { Translator } from "@/lib/i18n/translate";
import { PLATFORM_CONTROL_PLANE_IA } from "./information-architecture";
import { PLATFORM_EXCEPTION_DEFINITIONS } from "./exceptions";

export function buildPlatformControlPlaneLabels(t: Translator) {
  return {
    title: t("platform.controlPlane.title"),
    subtitle: t("platform.controlPlane.subtitle"),
    principle: t("platform.controlPlane.principle"),
    openSurface: t("platform.controlPlane.openSurface"),
    readiness: {
      production: t("platform.controlPlane.readiness.production"),
      engine: t("platform.controlPlane.readiness.engine"),
      hub: t("platform.controlPlane.readiness.hub"),
      planned: t("platform.controlPlane.readiness.planned"),
      stub: t("platform.controlPlane.readiness.stub"),
    },
    metrics: {
      noData: t("platform.controlPlane.metrics.noData"),
      notConnected: t("platform.controlPlane.metrics.notConnected"),
      updateFailed: t("platform.controlPlane.metrics.updateFailed"),
      freshness: t("platform.controlPlane.metrics.freshness"),
      partial: t("platform.controlPlane.metrics.partial"),
      organizationsTotal: t("platform.controlPlane.metrics.organizationsTotal"),
      activeSubscriptions: t("platform.controlPlane.metrics.activeSubscriptions"),
      requiringAttention: t("platform.controlPlane.metrics.requiringAttention"),
      openSupport: t("platform.controlPlane.metrics.openSupport"),
      paymentPastDue: t("platform.controlPlane.metrics.paymentPastDue"),
      outstandingInvoices: t("platform.controlPlane.metrics.outstandingInvoices"),
      failedPayments: t("platform.controlPlane.metrics.failedPayments"),
      mrr: t("platform.controlPlane.metrics.mrr"),
      activePartners: t("platform.controlPlane.metrics.activePartners"),
      earnedCommission: t("platform.controlPlane.metrics.earnedCommission"),
      pendingPartnerInvoices: t("platform.controlPlane.metrics.pendingPartnerInvoices"),
      systemHealth: t("platform.controlPlane.metrics.systemHealth"),
      openIncidents: t("platform.controlPlane.metrics.openIncidents"),
      pendingApprovals: t("platform.controlPlane.metrics.pendingApprovals"),
    },
    health: {
      healthy: t("platform.controlPlane.health.healthy"),
      degraded: t("platform.controlPlane.health.degraded"),
      critical: t("platform.controlPlane.health.critical"),
      unknown: t("platform.controlPlane.health.unknown"),
      noSource: t("platform.controlPlane.health.noSource"),
    },
    partnersHub: {
      title: t("platform.controlPlane.partnersHub.title"),
      subtitle: t("platform.controlPlane.partnersHub.subtitle"),
      attribution: t("platform.controlPlane.partnersHub.attribution"),
      commissions: t("platform.controlPlane.partnersHub.commissions"),
      settlement: t("platform.controlPlane.partnersHub.settlement"),
      settlementNote: t("platform.controlPlane.partnersHub.settlementNote"),
      noPayoutHere: t("platform.controlPlane.partnersHub.noPayoutHere"),
    },
    exceptions: {
      title: t("platform.controlPlane.exceptions.title"),
      subtitle: t("platform.controlPlane.exceptions.subtitle"),
      open: t("platform.controlPlane.exceptions.open"),
      severity: {
        info: t("platform.controlPlane.exceptions.severity.info"),
        attention: t("platform.controlPlane.exceptions.severity.attention"),
        critical: t("platform.controlPlane.exceptions.severity.critical"),
      },
      items: Object.fromEntries(
        PLATFORM_EXCEPTION_DEFINITIONS.map((item) => [
          item.id,
          {
            label: t(item.labelKey),
            nextAction: t(item.nextActionKey),
          },
        ]),
      ) as Record<string, { label: string; nextAction: string }>,
    },
    sections: PLATFORM_CONTROL_PLANE_IA.map((section) => ({
      id: section.id,
      label: t(section.labelKey),
      description: t(section.descriptionKey),
    })),
  };
}

export type PlatformControlPlaneLabels = ReturnType<typeof buildPlatformControlPlaneLabels>;
