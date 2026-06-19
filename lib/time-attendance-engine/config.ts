export const TA609_SECTIONS = [
  { key: "overview", href: "/app/time-attendance" },
  { key: "myTime", href: "/app/time-attendance/my-time" },
  { key: "teamTime", href: "/app/time-attendance/team-time" },
  { key: "attendance", href: "/app/time-attendance/attendance" },
  { key: "timesheets", href: "/app/time-attendance/timesheets" },
  { key: "leave", href: "/app/time-attendance/leave" },
  { key: "balances", href: "/app/time-attendance/balances" },
  { key: "overtime", href: "/app/time-attendance/overtime" },
  { key: "corrections", href: "/app/time-attendance/corrections" },
  { key: "approvals", href: "/app/time-attendance/approvals" },
  { key: "payrollPreparation", href: "/app/time-attendance/payroll-preparation" },
  { key: "projects", href: "/app/time-attendance/projects" },
  { key: "policies", href: "/app/time-attendance/policies" },
  { key: "reports", href: "/app/time-attendance/reports" },
] as const;

export type Ta609Section = (typeof TA609_SECTIONS)[number]["key"];

export const TA609_PARTNER_SECTIONS = [
  { key: "overview", href: "/partners/team-time" },
  { key: "team", href: "/partners/team-time/team" },
  { key: "time", href: "/partners/team-time/time" },
  { key: "leave", href: "/partners/team-time/leave" },
] as const;

export type Ta609PartnerSection = (typeof TA609_PARTNER_SECTIONS)[number]["key"];

export function getTa609ActiveSection(pathname: string): Ta609Section {
  if (pathname === "/app/time-attendance" || pathname === "/app/time-attendance/") return "overview";
  const match = TA609_SECTIONS.find((s) => s.key !== "overview" && pathname.startsWith(s.href));
  return match?.key ?? "overview";
}

export function getTa609PartnerActiveSection(pathname: string): Ta609PartnerSection {
  if (pathname === "/partners/team-time" || pathname === "/partners/team-time/") return "overview";
  const match = TA609_PARTNER_SECTIONS.find((s) => s.key !== "overview" && pathname.startsWith(s.href));
  return match?.key ?? "overview";
}

export function ta609SectionToRpc(section: Ta609Section): string {
  const map: Partial<Record<Ta609Section, string>> = {
    myTime: "my_time",
    teamTime: "team_time",
    payrollPreparation: "payroll_preparation",
  };
  return map[section] ?? section.replace(/([A-Z])/g, "_$1").toLowerCase();
}
