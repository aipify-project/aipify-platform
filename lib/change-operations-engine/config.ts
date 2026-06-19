export const CHG605_SECTIONS = [
  { key: "overview", href: "/platform/change-operations" },
  { key: "changeRequests", href: "/platform/change-operations/change-requests" },
  { key: "releases", href: "/platform/change-operations/releases" },
  { key: "deployments", href: "/platform/change-operations/deployments" },
  { key: "approvals", href: "/platform/change-operations/approvals" },
  { key: "environments", href: "/platform/change-operations/environments" },
  { key: "featureFlags", href: "/platform/change-operations/feature-flags" },
  { key: "databaseChanges", href: "/platform/change-operations/database-changes" },
  { key: "emergencyChanges", href: "/platform/change-operations/emergency-changes" },
  { key: "rollback", href: "/platform/change-operations/rollback" },
  { key: "evidence", href: "/platform/change-operations/evidence" },
  { key: "reports", href: "/platform/change-operations/reports" },
] as const;

export type Chg605Section = (typeof CHG605_SECTIONS)[number]["key"];

export const CHG605_SPECIAL_ROUTES = {
  calendar: "/platform/change-operations/calendar",
  history: "/platform/change-operations/history",
  advisory: "/platform/change-operations/advisory",
} as const;

export function getChg605ActiveSection(pathname: string): Chg605Section | "calendar" | "history" | "advisory" {
  if (pathname.startsWith(CHG605_SPECIAL_ROUTES.calendar)) return "calendar";
  if (pathname.startsWith(CHG605_SPECIAL_ROUTES.history)) return "history";
  if (pathname.startsWith(CHG605_SPECIAL_ROUTES.advisory)) return "advisory";
  if (pathname === "/platform/change-operations" || pathname === "/platform/change-operations/") return "overview";
  const match = CHG605_SECTIONS.find((s) => s.key !== "overview" && pathname.startsWith(s.href));
  return match?.key ?? "overview";
}

export function chg605SectionToRpc(section: Chg605Section | "calendar" | "history" | "advisory"): string {
  if (section === "calendar") return "releaseCalendar";
  return section;
}
