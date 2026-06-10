import { resolveAppHref } from "./route-aliases";

export type AppNavId =
  | "overview"
  | "presence"
  | "assistant"
  | "support"
  | "actions"
  | "recommendations"
  | "installations"
  | "domains"
  | "team"
  | "billing"
  | "settings";

export type AppNavItem = {
  id: AppNavId;
  href: string;
  labelKey: string;
};

/** Canonical customer product navigation (Layer 2). Hrefs use /app; aliases resolve during migration. */
export const APP_NAV: AppNavItem[] = [
  { id: "overview", href: "/app", labelKey: "dashboard.nav.overview" },
  { id: "presence", href: "/app/presence", labelKey: "dashboard.nav.presence" },
  { id: "assistant", href: "/app/assistant", labelKey: "dashboard.nav.assistant" },
  { id: "support", href: "/app/support", labelKey: "dashboard.nav.support" },
  { id: "actions", href: "/app/actions", labelKey: "dashboard.nav.actions" },
  {
    id: "recommendations",
    href: "/app/recommendations",
    labelKey: "dashboard.nav.recommendations",
  },
  { id: "installations", href: "/app/installations", labelKey: "dashboard.nav.install" },
  { id: "domains", href: "/app/domains", labelKey: "dashboard.nav.domains" },
  { id: "team", href: "/app/team", labelKey: "dashboard.nav.team" },
  { id: "billing", href: "/app/billing", labelKey: "dashboard.nav.billing" },
  { id: "settings", href: "/app/settings", labelKey: "dashboard.nav.settings" },
];

export const APP_MOBILE_NAV_IDS: AppNavId[] = [
  "overview",
  "presence",
  "assistant",
  "support",
  "settings",
];

export function getAppActiveNavId(pathname: string): AppNavId {
  if (pathname.startsWith("/app/presence") || pathname.startsWith("/dashboard/presence")) {
    return "presence";
  }
  if (
    pathname.startsWith("/app/assistant") ||
    pathname.startsWith("/dashboard/assistant")
  ) {
    return "assistant";
  }
  if (pathname.startsWith("/app/support") || pathname.startsWith("/dashboard/support")) {
    return "support";
  }
  if (pathname.startsWith("/app/actions")) return "actions";
  if (pathname.startsWith("/app/recommendations")) return "recommendations";
  if (
    pathname.startsWith("/app/installations") ||
    pathname.startsWith("/dashboard/installs")
  ) {
    return "installations";
  }
  if (pathname.startsWith("/app/domains")) return "domains";
  if (pathname.startsWith("/app/team") || pathname.startsWith("/dashboard/team")) {
    return "team";
  }
  if (pathname.startsWith("/app/billing") || pathname.startsWith("/dashboard/billing")) {
    return "billing";
  }
  if (pathname.startsWith("/app/settings") || pathname.startsWith("/dashboard/settings")) {
    return "settings";
  }
  return "overview";
}

/** Nav items with hrefs resolved to active routes during /dashboard → /app migration. */
export function getAppNavItemsForShell(): AppNavItem[] {
  return APP_NAV.map((item) => ({
    ...item,
    href: resolveAppHref(item.href),
  }));
}
