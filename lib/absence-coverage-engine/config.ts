export const VAC606_SECTIONS = [
  { key: "overview", href: "/app/absence", rpc: "overview" },
  { key: "myVacationMode", href: "/app/absence/my-vacation", rpc: "my_vacation_mode" },
  { key: "teamAvailability", href: "/app/absence/team-availability", rpc: "team_availability" },
  { key: "coverage", href: "/app/absence/coverage", rpc: "coverage" },
  { key: "delegation", href: "/app/absence/delegation", rpc: "delegation" },
  { key: "aipifyResponses", href: "/app/absence/aipify-responses", rpc: "aipify_responses" },
  { key: "schedules", href: "/app/absence/schedules", rpc: "schedules" },
  { key: "policies", href: "/app/absence/policies", rpc: "policies" },
  { key: "returnSummary", href: "/app/absence/return-summary", rpc: "return_summary" },
  { key: "history", href: "/app/absence/history", rpc: "history" },
  { key: "reports", href: "/app/absence/reports", rpc: "reports" },
] as const;

export type Vac606Section = (typeof VAC606_SECTIONS)[number]["key"];

export const PARTNER_VAC606_SECTIONS = VAC606_SECTIONS.map((s) => ({
  ...s,
  href: s.href.replace("/app/absence", "/partners/absence"),
}));

export function getVac606ActiveSection(pathname: string, basePath = "/app/absence"): Vac606Section {
  if (pathname === basePath || pathname === `${basePath}/`) return "overview";
  const match = VAC606_SECTIONS.find(
    (s) => s.key !== "overview" && pathname.startsWith(s.href.replace("/app/absence", basePath))
  );
  return match?.key ?? "overview";
}

export function vac606SectionToRpc(section: Vac606Section): string {
  const found = VAC606_SECTIONS.find((s) => s.key === section);
  return found?.rpc ?? "overview";
}
