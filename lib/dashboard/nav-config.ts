export type DashboardNavId =
  | "overview"
  | "install"
  | "team"
  | "settings";

export type DashboardNavItem = {
  id: DashboardNavId;
  href: string;
  labelKey: string;
};

export const CONTROL_CENTER_NAV: DashboardNavItem[] = [
  { id: "overview", href: "/dashboard", labelKey: "dashboard.nav.overview" },
  {
    id: "install",
    href: "/dashboard/installs",
    labelKey: "dashboard.nav.install",
  },
  { id: "team", href: "/dashboard/team", labelKey: "dashboard.nav.team" },
  {
    id: "settings",
    href: "/dashboard/settings",
    labelKey: "dashboard.nav.settings",
  },
];

export const MOBILE_NAV_IDS: DashboardNavId[] = [
  "overview",
  "install",
  "settings",
];

export function getActiveNavId(pathname: string): DashboardNavId {
  if (pathname.startsWith("/dashboard/installs")) return "install";
  if (pathname.startsWith("/dashboard/team")) return "team";
  if (pathname.startsWith("/dashboard/settings")) return "settings";
  return "overview";
}
