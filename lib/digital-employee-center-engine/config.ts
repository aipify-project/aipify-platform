export const DEWF598_SECTIONS = [
  { key: "overview", href: "/app/digital-employees" },
  { key: "employees", href: "/app/digital-employees/employees" },
  { key: "roles", href: "/app/digital-employees/roles" },
  { key: "assignments", href: "/app/digital-employees/assignments" },
  { key: "performance", href: "/app/digital-employees/performance" },
  { key: "approvals", href: "/app/digital-employees/approvals" },
  { key: "permissions", href: "/app/digital-employees/permissions" },
  { key: "reports", href: "/app/digital-employees/reports" },
] as const;

export type Dewf598Section = (typeof DEWF598_SECTIONS)[number]["key"];

export function getDewf598ActiveSection(pathname: string): Dewf598Section {
  if (pathname === "/app/digital-employees" || pathname === "/app/digital-employees/") return "overview";
  const match = DEWF598_SECTIONS.find((s) => s.key !== "overview" && pathname.startsWith(s.href));
  return match?.key ?? "overview";
}

export function dewf598SectionToRpc(section: Dewf598Section): string {
  return section === "overview" ? "overview" : "full";
}
