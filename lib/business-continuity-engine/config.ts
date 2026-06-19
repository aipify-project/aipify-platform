export const BC607_SECTIONS = [
  { key: "overview", href: "/app/business-continuity" },
  { key: "plans", href: "/app/business-continuity/plans" },
  { key: "criticalOperations", href: "/app/business-continuity/critical-operations" },
  { key: "businessImpact", href: "/app/business-continuity/business-impact" },
  { key: "crisisMode", href: "/app/business-continuity/crisis-mode" },
  { key: "recoveryPlans", href: "/app/business-continuity/recovery-plans" },
  { key: "emergencyContacts", href: "/app/business-continuity/emergency-contacts" },
  { key: "communication", href: "/app/business-continuity/communication" },
  { key: "dependencies", href: "/app/business-continuity/dependencies" },
  { key: "exercises", href: "/app/business-continuity/exercises" },
  { key: "evidence", href: "/app/business-continuity/evidence" },
  { key: "reports", href: "/app/business-continuity/reports" },
] as const;

export type Bc607Section = (typeof BC607_SECTIONS)[number]["key"];

export const BC607_RPC_SECTION_MAP: Record<Bc607Section, string> = {
  overview: "overview",
  plans: "plans",
  criticalOperations: "critical_operations",
  businessImpact: "business_impact",
  crisisMode: "crisis_mode",
  recoveryPlans: "recovery_plans",
  emergencyContacts: "emergency_contacts",
  communication: "communication",
  dependencies: "dependencies",
  exercises: "exercises",
  evidence: "evidence",
  reports: "reports",
};

export const PARTNER_BC607_SECTIONS = [
  { key: "overview", href: "/partners/business-continuity" },
  { key: "portfolio", href: "/partners/business-continuity/portfolio" },
  { key: "commission", href: "/partners/business-continuity/commission" },
  { key: "communications", href: "/partners/business-continuity/communications" },
  { key: "reports", href: "/partners/business-continuity/reports" },
] as const;

export type PartnerBc607Section = (typeof PARTNER_BC607_SECTIONS)[number]["key"];

export function getBc607ActiveSection(pathname: string): Bc607Section {
  if (pathname === "/app/business-continuity" || pathname === "/app/business-continuity/") {
    return "overview";
  }
  if (pathname.startsWith("/app/business-continuity/crisis")) return "crisisMode";
  if (pathname.startsWith("/app/business-continuity/recovery")) return "recoveryPlans";
  const match = BC607_SECTIONS.find((s) => s.key !== "overview" && pathname.startsWith(s.href));
  return match?.key ?? "overview";
}

export function getPartnerBc607ActiveSection(pathname: string): PartnerBc607Section {
  if (pathname === "/partners/business-continuity" || pathname === "/partners/business-continuity/") {
    return "overview";
  }
  const match = PARTNER_BC607_SECTIONS.find((s) => s.key !== "overview" && pathname.startsWith(s.href));
  return match?.key ?? "overview";
}

export function bc607SectionToRpc(section: Bc607Section): string {
  return BC607_RPC_SECTION_MAP[section] ?? "overview";
}

export function partnerBc607SectionToRpc(section: PartnerBc607Section): string {
  if (section === "overview") return "overview";
  return "full";
}
