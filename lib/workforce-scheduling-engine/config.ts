export const WFS608_SECTIONS = [
  { key: "overview", href: "/app/workforce-scheduling" },
  { key: "schedule", href: "/app/workforce-scheduling/schedule" },
  { key: "employees", href: "/app/workforce-scheduling/employees" },
  { key: "teams", href: "/app/workforce-scheduling/teams" },
  { key: "shifts", href: "/app/workforce-scheduling/shifts" },
  { key: "availability", href: "/app/workforce-scheduling/availability" },
  { key: "coverage", href: "/app/workforce-scheduling/coverage" },
  { key: "onCall", href: "/app/workforce-scheduling/on-call" },
  { key: "locations", href: "/app/workforce-scheduling/locations" },
  { key: "requests", href: "/app/workforce-scheduling/requests" },
  { key: "conflicts", href: "/app/workforce-scheduling/conflicts" },
  { key: "templates", href: "/app/workforce-scheduling/templates" },
  { key: "policies", href: "/app/workforce-scheduling/policies" },
  { key: "reports", href: "/app/workforce-scheduling/reports" },
] as const;

export type Wfs608Section = (typeof WFS608_SECTIONS)[number]["key"];

export const WFS608_PARTNER_SECTIONS = [
  { key: "overview", href: "/partners/workforce-scheduling" },
  { key: "shifts", href: "/partners/workforce-scheduling/shifts" },
  { key: "coverage", href: "/partners/workforce-scheduling/coverage" },
  { key: "onCall", href: "/partners/workforce-scheduling/on-call" },
] as const;

export type Wfs608PartnerSection = (typeof WFS608_PARTNER_SECTIONS)[number]["key"];

export const WFS608_SHIFT_STATUSES = [
  "unassigned",
  "partially_staffed",
  "fully_covered",
  "coverage_gap",
] as const;

export function getWfs608ActiveSection(pathname: string): Wfs608Section {
  if (pathname === "/app/workforce-scheduling/on-call" || pathname.startsWith("/app/workforce-scheduling/on-call/")) {
    return "onCall";
  }
  if (pathname === "/app/workforce-scheduling" || pathname === "/app/workforce-scheduling/") return "overview";
  const match = WFS608_SECTIONS.find((s) => s.key !== "overview" && pathname.startsWith(s.href));
  return match?.key ?? "overview";
}

export function getWfs608PartnerActiveSection(pathname: string): Wfs608PartnerSection {
  if (pathname === "/partners/workforce-scheduling" || pathname === "/partners/workforce-scheduling/") return "overview";
  const match = WFS608_PARTNER_SECTIONS.find((s) => s.key !== "overview" && pathname.startsWith(s.href));
  return match?.key ?? "overview";
}

export function wfs608SectionToRpc(section: Wfs608Section): string {
  if (section === "onCall") return "on_call";
  if (section === "overview") return "overview";
  return section;
}

export function wfs608PartnerSectionToRpc(section: Wfs608PartnerSection): string {
  if (section === "onCall") return "on_call";
  return section === "overview" ? "overview" : section;
}
