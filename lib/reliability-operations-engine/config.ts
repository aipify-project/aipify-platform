export const REL604_PLATFORM_SECTIONS = [
  { key: "overview", href: "/platform/reliability" },
  { key: "services", href: "/platform/reliability/services" },
  { key: "incidents", href: "/platform/reliability/incidents" },
  { key: "healthSignals", href: "/platform/reliability/health-signals" },
  { key: "selfHealing", href: "/platform/reliability/self-healing" },
  { key: "dependencies", href: "/platform/reliability/dependencies" },
  { key: "serviceLevels", href: "/platform/reliability/service-levels" },
  { key: "maintenance", href: "/platform/reliability/maintenance" },
  { key: "statusCommunication", href: "/platform/reliability/status-communication" },
  { key: "reports", href: "/platform/reliability/reports" },
] as const;

export type Rel604PlatformSection = (typeof REL604_PLATFORM_SECTIONS)[number]["key"];

export function getRel604PlatformActiveSection(pathname: string): Rel604PlatformSection {
  if (pathname === "/platform/reliability" || pathname === "/platform/reliability/") return "overview";
  const match = REL604_PLATFORM_SECTIONS.find((s) => s.key !== "overview" && pathname.startsWith(s.href));
  return match?.key ?? "overview";
}

export function rel604PlatformSectionToRpc(section: Rel604PlatformSection): string {
  return section;
}

export const REL604_CUSTOMER_SECTIONS = [
  { key: "overview", href: "/app/system-health" },
  { key: "connectedApps", href: "/app/system-health/connected-apps" },
  { key: "businessPacks", href: "/app/system-health/business-packs" },
  { key: "workflows", href: "/app/system-health/workflows" },
  { key: "domains", href: "/app/system-health/domains" },
  { key: "notifications", href: "/app/system-health/notifications" },
  { key: "recentIncidents", href: "/app/system-health/recent-incidents" },
  { key: "maintenance", href: "/app/system-health/maintenance" },
  { key: "support", href: "/app/system-health/support" },
] as const;

export type Rel604CustomerSection = (typeof REL604_CUSTOMER_SECTIONS)[number]["key"];

export function getRel604CustomerActiveSection(pathname: string): Rel604CustomerSection {
  if (pathname === "/app/system-health" || pathname === "/app/system-health/") return "overview";
  const match = REL604_CUSTOMER_SECTIONS.find((s) => s.key !== "overview" && pathname.startsWith(s.href));
  return match?.key ?? "overview";
}

export function rel604CustomerSectionToRpc(section: Rel604CustomerSection): string {
  return section;
}
