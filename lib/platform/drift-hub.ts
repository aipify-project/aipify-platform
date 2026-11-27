/**
 * Platform Drift Premium V2 — sidebar hubs with horizontal page tabs.
 * Historical URLs stay live; sidebar highlights the parent hub.
 */

export const DRIFT_OPERATIONS_HUB_ID = "operationsOverview" as const;
export const DRIFT_PUBLISH_VERIFY_HUB_ID = "publishAndVerify" as const;
export const DRIFT_KOMPIS_HUB_ID = "kompisAi" as const;

export type DriftHubId =
  | typeof DRIFT_OPERATIONS_HUB_ID
  | typeof DRIFT_PUBLISH_VERIFY_HUB_ID
  | typeof DRIFT_KOMPIS_HUB_ID;

export type DriftHubTabId =
  | "overview"
  | "platformHealth"
  | "installations"
  | "auditLogs"
  | "pilot"
  | "deployments"
  | "websiteVerification"
  | "verificationHistory"
  | "kompis";

export type DriftHubTab = {
  id: DriftHubTabId;
  href: string;
  /** i18n key under platform.driftHub.tabs.* */
  labelKey: string;
  /** Legacy nav id this tab replaces in the sidebar */
  legacyNavId?: string;
};

export const DRIFT_OPERATIONS_TABS: readonly DriftHubTab[] = [
  {
    id: "overview",
    href: "/platform/operations/overview",
    labelKey: "platform.driftHub.tabs.overview",
    legacyNavId: "operationsOverview",
  },
  {
    id: "platformHealth",
    href: "/platform/operations/platform-health",
    labelKey: "platform.driftHub.tabs.platformHealth",
    legacyNavId: "platformHealth",
  },
  {
    id: "installations",
    href: "/platform/installations",
    labelKey: "platform.driftHub.tabs.installations",
    legacyNavId: "installationOversight",
  },
  {
    id: "auditLogs",
    href: "/platform/operations/audit-logs",
    labelKey: "platform.driftHub.tabs.auditLogs",
    legacyNavId: "operationsAuditLogs",
  },
  {
    id: "pilot",
    href: "/platform/unonight-pilot",
    labelKey: "platform.driftHub.tabs.pilot",
    legacyNavId: "unonightPilot",
  },
] as const;

export const DRIFT_PUBLISH_VERIFY_TABS: readonly DriftHubTab[] = [
  {
    id: "deployments",
    href: "/platform/operations/deployments",
    labelKey: "platform.driftHub.tabs.deployments",
    legacyNavId: "deployments",
  },
  {
    id: "websiteVerification",
    href: "/platform/website-verification",
    labelKey: "platform.driftHub.tabs.websiteVerification",
    legacyNavId: "websiteReleaseVerification",
  },
  {
    id: "verificationHistory",
    href: "/platform/website-verification?section=history",
    labelKey: "platform.driftHub.tabs.verificationHistory",
    legacyNavId: "websiteReleaseVerification",
  },
] as const;

export const DRIFT_KOMPIS_TABS: readonly DriftHubTab[] = [
  {
    id: "kompis",
    href: "/platform/kompis-ai",
    labelKey: "platform.driftHub.tabs.kompis",
    legacyNavId: "kompisAi",
  },
] as const;

/** Canonical hub entry — deployments tab (no intermediate redirect). */
export const PUBLISH_AND_VERIFY_HREF = "/platform/operations/deployments";

/** Paths that belong to Driftsoversikt hub (sidebar highlight). */
export function isDriftOperationsPath(pathname: string): boolean {
  if (pathname.startsWith("/platform/operations/overview")) return true;
  if (pathname.startsWith("/platform/operations/platform-health")) return true;
  if (pathname.startsWith("/platform/operations/audit-logs")) return true;
  if (pathname.startsWith("/platform/operations/playbooks")) return true;
  if (pathname.startsWith("/platform/installations")) return true;
  if (pathname.startsWith("/platform/unonight-pilot")) return true;
  return false;
}

/** Paths that belong to Publisering og verifisering hub. */
export function isDriftPublishVerifyPath(pathname: string): boolean {
  if (pathname.startsWith("/platform/operations/publish-verify")) return true;
  if (pathname.startsWith("/platform/operations/deployments")) return true;
  if (pathname.startsWith("/platform/website-verification")) return true;
  if (pathname.startsWith("/platform/updates")) return true;
  return false;
}

export function isDriftKompisPath(pathname: string): boolean {
  return pathname.startsWith("/platform/kompis-ai");
}

export function getDriftHubForPath(pathname: string): DriftHubId | null {
  if (isDriftKompisPath(pathname)) return DRIFT_KOMPIS_HUB_ID;
  if (isDriftPublishVerifyPath(pathname)) return DRIFT_PUBLISH_VERIFY_HUB_ID;
  if (isDriftOperationsPath(pathname)) return DRIFT_OPERATIONS_HUB_ID;
  return null;
}

export function getDriftTabsForHub(hub: DriftHubId): readonly DriftHubTab[] {
  switch (hub) {
    case DRIFT_PUBLISH_VERIFY_HUB_ID:
      return DRIFT_PUBLISH_VERIFY_TABS;
    case DRIFT_KOMPIS_HUB_ID:
      return DRIFT_KOMPIS_TABS;
    default:
      return DRIFT_OPERATIONS_TABS;
  }
}

export function getDriftActiveTabId(
  pathname: string,
  searchParams?: URLSearchParams | { get(name: string): string | null } | null,
): DriftHubTabId | null {
  const hub = getDriftHubForPath(pathname);
  if (!hub) return null;

  if (hub === DRIFT_KOMPIS_HUB_ID) return "kompis";

  if (hub === DRIFT_PUBLISH_VERIFY_HUB_ID) {
    if (pathname.startsWith("/platform/operations/deployments")) return "deployments";
    if (pathname.startsWith("/platform/operations/publish-verify")) return "deployments";
    if (pathname.startsWith("/platform/updates")) return "deployments";
    if (pathname.startsWith("/platform/website-verification")) {
      const section = searchParams?.get("section") ?? null;
      if (section === "history" || section === "runs") return "verificationHistory";
      return "websiteVerification";
    }
    return "deployments";
  }

  if (pathname.startsWith("/platform/operations/platform-health")) return "platformHealth";
  if (pathname.startsWith("/platform/installations")) return "installations";
  if (pathname.startsWith("/platform/operations/audit-logs")) return "auditLogs";
  if (pathname.startsWith("/platform/unonight-pilot")) return "pilot";
  return "overview";
}

/** Sidebar active id for Drift routes after Premium V2 consolidation. */
export function getDriftSidebarNavId(pathname: string): DriftHubId | null {
  return getDriftHubForPath(pathname);
}
