export const CARE593_SECTIONS = [
  { key: "overview", href: "/app/actions" },
  { key: "pending", href: "/app/actions/pending" },
  { key: "approved", href: "/app/actions/approved" },
  { key: "completedActions", href: "/app/actions/completed-actions" },
  { key: "approvals", href: "/app/actions/approvals" },
  { key: "permissions", href: "/app/actions/permissions" },
  { key: "history", href: "/app/actions/history" },
  { key: "reports", href: "/app/actions/reports" },
] as const;

export type Care593Section = (typeof CARE593_SECTIONS)[number]["key"];

export function getCare593ActiveSection(pathname: string): Care593Section {
  if (pathname === "/app/actions" || pathname === "/app/actions/") return "overview";
  const match = CARE593_SECTIONS.find((s) => s.key !== "overview" && pathname.startsWith(s.href));
  return match?.key ?? "overview";
}

export function care593SectionToRpc(section: Care593Section): string {
  return section === "overview" ? "overview" : "full";
}
