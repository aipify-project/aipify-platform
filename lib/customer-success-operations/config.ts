export const CSAR587_CUSTOMER_SECTIONS = [
  { key: "overview", href: "/app/customer-success" },
  { key: "onboarding", href: "/app/customer-success/onboarding" },
  { key: "health", href: "/app/customer-success/health" },
  { key: "adoption", href: "/app/customer-success/adoption" },
  { key: "risks", href: "/app/customer-success/risks" },
  { key: "opportunities", href: "/app/customer-success/opportunities" },
  { key: "renewals", href: "/app/customer-success/renewals" },
  { key: "reports", href: "/app/customer-success/reports" },
  { key: "journey", href: "/app/customer-success/journey" },
  { key: "executive", href: "/app/customer-success/executive" },
] as const;

export type Csar587CustomerSection = (typeof CSAR587_CUSTOMER_SECTIONS)[number]["key"];

export const CSAR587_PLATFORM_SECTIONS = [
  { key: "overview", href: "/platform/customer-success" },
  { key: "customers", href: "/platform/customer-success/customers" },
  { key: "onboarding", href: "/platform/customer-success/onboarding" },
  { key: "healthScores", href: "/platform/customer-success/health-scores" },
  { key: "adoption", href: "/platform/customer-success/adoption" },
  { key: "risks", href: "/platform/customer-success/risks" },
  { key: "opportunities", href: "/platform/customer-success/opportunities" },
  { key: "renewals", href: "/platform/customer-success/renewals" },
  { key: "reports", href: "/platform/customer-success/reports" },
] as const;

export type Csar587PlatformSection = (typeof CSAR587_PLATFORM_SECTIONS)[number]["key"];

export const CSAR587_HEALTH_STATUSES = ["healthy", "attention_required", "at_risk"] as const;

export function getCsar587PlatformActiveNavId(pathname: string): Csar587PlatformSection {
  if (pathname === "/platform/customer-success" || pathname === "/platform/customer-success/") {
    return "overview";
  }
  const match = CSAR587_PLATFORM_SECTIONS.find(
    (s) => s.key !== "overview" && pathname.startsWith(s.href)
  );
  return match?.key ?? "overview";
}
