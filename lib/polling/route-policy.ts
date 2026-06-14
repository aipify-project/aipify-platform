export type PollingSurface = "customer" | "platform" | "super";

const NO_POLL_PREFIXES = [
  "/app/settings",
  "/app/audit",
  "/app/verification",
  "/platform/settings",
] as const;

export function isSettingsRoute(pathname: string): boolean {
  return NO_POLL_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

export function isAuditRoute(pathname: string): boolean {
  return pathname === "/app/audit" || pathname.startsWith("/app/audit/");
}

export function isExecutiveRoute(pathname: string): boolean {
  return pathname === "/app/executive" || pathname.startsWith("/app/executive/");
}

export function isOperationsRoute(pathname: string): boolean {
  return pathname === "/app/operations" || pathname.startsWith("/app/operations/");
}

export function isSecurityRoute(pathname: string): boolean {
  return (
    pathname === "/app/settings/security" ||
    pathname.startsWith("/app/settings/security/")
  );
}

export function isCommandCenterRoute(pathname: string): boolean {
  return pathname === "/app/command-center" || pathname.startsWith("/app/command-center/");
}

export function allowsExecutivePolling(pathname: string): boolean {
  return isExecutiveRoute(pathname) && !isSettingsRoute(pathname);
}

export function allowsOperationsPolling(pathname: string): boolean {
  if (isSettingsRoute(pathname)) return false;
  return isOperationsRoute(pathname) || isCommandCenterRoute(pathname);
}

export function allowsPresenceDetailPolling(drawerOpen: boolean): boolean {
  return drawerOpen;
}

export function allowsCompanionDetailPolling(panelOpen: boolean, collapsed: boolean): boolean {
  return panelOpen && !collapsed;
}

export function allowsSuperAdminHealthPolling(pathname: string): boolean {
  return pathname === "/super" || pathname.startsWith("/super/");
}

export function allowsPlatformWidgetPolling(
  pathname: string,
  surface: PollingSurface
): boolean {
  if (surface !== "platform") return false;
  if (isSettingsRoute(pathname)) return false;
  return pathname === "/platform" || pathname.startsWith("/platform/");
}

export function shouldPollNotifications(pathname: string): boolean {
  if (!pathname.startsWith("/app")) {
    return false;
  }
  return !isSettingsRoute(pathname) && !isAuditRoute(pathname);
}

/** Summary polling when the presence indicator is enabled (drawer open or collapsed indicator). */
export function allowsPresenceSummaryPolling(
  pathname: string,
  presenceVisible: boolean
): boolean {
  if (!presenceVisible || isSettingsRoute(pathname) || isAuditRoute(pathname)) {
    return false;
  }
  return true;
}

/** Daily briefing RPC only on Executive Center or when the drawer is open. */
export function allowsPresenceBriefingFetch(pathname: string, drawerOpen: boolean): boolean {
  if (drawerOpen) return true;
  return isExecutiveRoute(pathname) && !isSettingsRoute(pathname);
}
