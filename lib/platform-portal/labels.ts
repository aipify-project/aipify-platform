import type { Translator } from "@/lib/i18n/translate";
import type { PlatformPortalLabels } from "./types";

export function buildPlatformPortalLabels(t: Translator): PlatformPortalLabels {
  const d = "platform.portalStructure.dashboard";
  const f = "platform.portalStructure.foundation";

  return {
    dashboard: {
      title: t(`${d}.title`),
      subtitle: t(`${d}.subtitle`),
      loading: t(`${d}.loading`),
      principle: t(`${d}.principle`),
      privacyNote: t(`${d}.privacyNote`),
      organizationsRequiringAttention: t(`${d}.organizationsRequiringAttention`),
      activeSubscriptions: t(`${d}.activeSubscriptions`),
      openSupportWorkload: t(`${d}.openSupportWorkload`),
      paymentStatusSummary: t(`${d}.paymentStatusSummary`),
      paymentActive: t(`${d}.paymentActive`),
      paymentPastDue: t(`${d}.paymentPastDue`),
      paymentTrialing: t(`${d}.paymentTrialing`),
      customerSuccessIndicators: t(`${d}.customerSuccessIndicators`),
      healthyRatio: t(`${d}.healthyRatio`),
      marketplaceModeration: t(`${d}.marketplaceModeration`),
      pendingReview: t(`${d}.pendingReview`),
      published: t(`${d}.published`),
      partnerProgramSummary: t(`${d}.partnerProgramSummary`),
      activePrograms: t(`${d}.activePrograms`),
      pendingApplications: t(`${d}.pendingApplications`),
      productDeploymentUpdates: t(`${d}.productDeploymentUpdates`),
      noUpdates: t(`${d}.noUpdates`),
      portalModules: t(`${d}.portalModules`),
      openModule: t(`${d}.openModule`),
    },
    foundation: {
      loading: t(`${f}.loading`),
      back: t(`${f}.back`),
      structureNote: t(`${f}.structureNote`),
    },
  };
}
