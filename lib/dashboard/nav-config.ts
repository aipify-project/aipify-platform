export type CustomerNavId =
  | "overview"
  | "assistant"
  | "install"
  | "support"
  | "analytics"
  | "commerce"
  | "notifications"
  | "team"
  | "billing"
  | "settings";

export type CustomerNavItem = {
  id: CustomerNavId;
  href: string;
  labelKey: string;
};

/** Legacy shell nav — hrefs point at canonical /app routes (redirects handle /dashboard/* bookmarks). */
export const CUSTOMER_CONTROL_CENTER_NAV: CustomerNavItem[] = [
  { id: "overview", href: "/app", labelKey: "dashboard.nav.overview" },
  { id: "assistant", href: "/app/assistant", labelKey: "dashboard.nav.assistant" },
  { id: "install", href: "/app/installations", labelKey: "dashboard.nav.install" },
  { id: "support", href: "/app/support/history", labelKey: "dashboard.nav.support" },
  { id: "analytics", href: "/app/analytics", labelKey: "dashboard.nav.analytics" },
  { id: "commerce", href: "/app/commerce", labelKey: "dashboard.nav.commerce" },
  { id: "notifications", href: "/app/notifications", labelKey: "dashboard.nav.notifications" },
  { id: "team", href: "/app/team", labelKey: "dashboard.nav.team" },
  { id: "billing", href: "/app/billing", labelKey: "dashboard.nav.billing" },
  { id: "settings", href: "/app/settings", labelKey: "dashboard.nav.settings" },
];

export const CUSTOMER_MOBILE_NAV_IDS: CustomerNavId[] = [
  "overview",
  "assistant",
  "install",
  "notifications",
  "settings",
];

export function getCustomerActiveNavId(pathname: string): CustomerNavId {
  const normalized =
    pathname.startsWith("/dashboard/") ? `/app${pathname.slice("/dashboard".length)}` : pathname;

  if (normalized.startsWith("/app/installations") || normalized.startsWith("/app/install")) return "install";
  if (normalized.startsWith("/app/assistant")) return "assistant";
  if (normalized.startsWith("/app/support")) return "support";
  if (normalized.startsWith("/app/analytics")) return "analytics";
  if (normalized.startsWith("/app/commerce")) return "commerce";
  if (normalized.startsWith("/app/notifications")) return "notifications";
  if (normalized.startsWith("/app/team")) return "team";
  if (normalized.startsWith("/app/billing")) return "billing";
  if (normalized.startsWith("/app/settings")) return "settings";
  return "overview";
}
