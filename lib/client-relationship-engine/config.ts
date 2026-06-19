export const CRM611_SECTIONS = [
  { key: "overview", href: "/app/client-relationships" },
  { key: "clients", href: "/app/client-relationships/clients" },
  { key: "journeys", href: "/app/client-relationships/journeys" },
  { key: "rebooking", href: "/app/client-relationships/rebooking" },
  { key: "retention", href: "/app/client-relationships/retention" },
  { key: "loyalty", href: "/app/client-relationships/loyalty" },
  { key: "memberships", href: "/app/client-relationships/memberships" },
  { key: "packages", href: "/app/client-relationships/packages" },
  { key: "referrals", href: "/app/client-relationships/referrals" },
  { key: "campaigns", href: "/app/client-relationships/campaigns" },
  { key: "feedback", href: "/app/client-relationships/feedback" },
  { key: "serviceRecovery", href: "/app/client-relationships/service-recovery" },
  { key: "consent", href: "/app/client-relationships/consent" },
  { key: "automation", href: "/app/client-relationships/automation" },
  { key: "reports", href: "/app/client-relationships/reports" },
] as const;

export type Crm611Section = (typeof CRM611_SECTIONS)[number]["key"];

export function getCrm611ActiveSection(pathname: string): Crm611Section {
  if (pathname === "/app/client-relationships" || pathname === "/app/client-relationships/") {
    return "overview";
  }
  const match = CRM611_SECTIONS.find((s) => s.key !== "overview" && pathname.startsWith(s.href));
  return match?.key ?? "overview";
}

export function crm611SectionToRpc(section: Crm611Section): string {
  const map: Record<Crm611Section, string> = {
    overview: "overview",
    clients: "clients",
    journeys: "journeys",
    rebooking: "rebooking",
    retention: "retention",
    loyalty: "loyalty",
    memberships: "memberships",
    packages: "packages",
    referrals: "referrals",
    campaigns: "campaigns",
    feedback: "feedback",
    serviceRecovery: "service_recovery",
    consent: "consent",
    automation: "automation",
    reports: "reports",
  };
  return map[section];
}
