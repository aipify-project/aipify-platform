import type { Translator } from "@/lib/i18n/translate";
import type { TrustCenterOperationsLabels, TrustCenterTab } from "./types";
import { DEVICE_STATUSES, TRUST_STATUSES, VERIFICATION_STATUSES } from "./constants";

const TAB_KEYS: TrustCenterTab[] = [
  "overview",
  "identity",
  "verification",
  "security",
  "devices",
  "sessions",
  "audit",
  "permissions",
  "compliance",
  "executive",
  "reports",
];

export function buildTrustCenterOperationsLabels(t: Translator): TrustCenterOperationsLabels {
  const p = "trustCenterOperations";

  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    loading: t(`${p}.loading`),
    back: t(`${p}.back`),
    principle: t(`${p}.principle`),
    emptyState: t(`${p}.emptyState`),
    accessDenied: t(`${p}.accessDenied`),
    tabs: Object.fromEntries(
      TAB_KEYS.map((key) => [key, t(`${p}.tabs.${key}`)])
    ) as TrustCenterOperationsLabels["tabs"],
    overview: {
      trustScore: t(`${p}.overview.trustScore`),
      securityStatus: t(`${p}.overview.securityStatus`),
      verificationStatus: t(`${p}.overview.verificationStatus`),
      twoFactorAdoption: t(`${p}.overview.twoFactorAdoption`),
      deviceHealth: t(`${p}.overview.deviceHealth`),
      activeSessions: t(`${p}.overview.activeSessions`),
      recentSecurityEvents: t(`${p}.overview.recentSecurityEvents`),
      registeredIdentities: t(`${p}.overview.registeredIdentities`),
    },
    actions: {
      refreshScore: t(`${p}.actions.refreshScore`),
      approveDevice: t(`${p}.actions.approveDevice`),
      blockDevice: t(`${p}.actions.blockDevice`),
      terminateSession: t(`${p}.actions.terminateSession`),
      enable2fa: t(`${p}.actions.enable2fa`),
      completeVerification: t(`${p}.actions.completeVerification`),
      openDevices: t(`${p}.actions.openDevices`),
      open2fa: t(`${p}.actions.open2fa`),
      openAudit: t(`${p}.actions.openAudit`),
      openActionEngine: t(`${p}.actions.openActionEngine`),
    },
    trustStatuses: Object.fromEntries(
      TRUST_STATUSES.map((key) => [key, t(`${p}.trustStatuses.${key}`)])
    ) as TrustCenterOperationsLabels["trustStatuses"],
    deviceStatuses: Object.fromEntries(
      DEVICE_STATUSES.map((key) => [key, t(`${p}.deviceStatuses.${key}`)])
    ) as TrustCenterOperationsLabels["deviceStatuses"],
    verificationStatuses: Object.fromEntries(
      VERIFICATION_STATUSES.map((key) => [key, t(`${p}.verificationStatuses.${key}`)])
    ) as TrustCenterOperationsLabels["verificationStatuses"],
    devicesPage: {
      title: t(`${p}.devicesPage.title`),
      subtitle: t(`${p}.devicesPage.subtitle`),
    },
    twoFactorPage: {
      title: t(`${p}.twoFactorPage.title`),
      subtitle: t(`${p}.twoFactorPage.subtitle`),
    },
    auditPage: {
      title: t(`${p}.auditPage.title`),
      subtitle: t(`${p}.auditPage.subtitle`),
    },
  };
}
