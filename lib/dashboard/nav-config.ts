export type CustomerNavId =
  | "overview"
  | "assistant"
  | "install"
  | "support"
  | "analytics"
  | "commerce"
  | "notifications"
  | "team"
  | "settings";

export type CustomerNavItem = {
  id: CustomerNavId;
  href: string;
  labelKey: string;
};

export const CUSTOMER_CONTROL_CENTER_NAV: CustomerNavItem[] = [
  { id: "overview", href: "/dashboard", labelKey: "dashboard.nav.overview" },
  {
    id: "assistant",
    href: "/dashboard/assistant",
    labelKey: "dashboard.nav.assistant",
  },
  {
    id: "install",
    href: "/dashboard/installs",
    labelKey: "dashboard.nav.install",
  },
  {
    id: "support",
    href: "/dashboard/support",
    labelKey: "dashboard.nav.support",
  },
  {
    id: "analytics",
    href: "/dashboard/analytics",
    labelKey: "dashboard.nav.analytics",
  },
  {
    id: "commerce",
    href: "/dashboard/commerce",
    labelKey: "dashboard.nav.commerce",
  },
  {
    id: "notifications",
    href: "/dashboard/notifications",
    labelKey: "dashboard.nav.notifications",
  },
  { id: "team", href: "/dashboard/team", labelKey: "dashboard.nav.team" },
  {
    id: "settings",
    href: "/dashboard/settings",
    labelKey: "dashboard.nav.settings",
  },
];

export const CUSTOMER_MOBILE_NAV_IDS: CustomerNavId[] = [
  "overview",
  "assistant",
  "install",
  "notifications",
  "settings",
];

export function getCustomerActiveNavId(pathname: string): CustomerNavId {
  if (pathname.startsWith("/dashboard/installs")) return "install";
  if (pathname.startsWith("/dashboard/assistant")) return "assistant";
  if (pathname.startsWith("/dashboard/support")) return "support";
  if (pathname.startsWith("/dashboard/analytics")) return "analytics";
  if (pathname.startsWith("/dashboard/commerce")) return "commerce";
  if (pathname.startsWith("/dashboard/notifications")) return "notifications";
  if (pathname.startsWith("/dashboard/team")) return "team";
  if (pathname.startsWith("/dashboard/settings")) return "settings";
  return "overview";
}
