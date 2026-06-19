export const AOS599_SECTIONS = [
  { key: "overview", href: "/app/aos" },
  { key: "organization", href: "/app/aos/organization" },
  { key: "operations", href: "/app/aos/operations" },
  { key: "companion", href: "/app/aos/companion" },
  { key: "intelligence", href: "/app/aos/intelligence" },
  { key: "businessPacks", href: "/app/aos/business-packs" },
  { key: "signals", href: "/app/aos/signals" },
  { key: "governance", href: "/app/aos/governance" },
  { key: "reports", href: "/app/aos/reports" },
] as const;

export type Aos599Section = (typeof AOS599_SECTIONS)[number]["key"];

export function getAos599ActiveSection(pathname: string): Aos599Section {
  if (pathname === "/app/aos" || pathname === "/app/aos/") return "overview";
  const match = AOS599_SECTIONS.find((s) => s.key !== "overview" && pathname.startsWith(s.href));
  return match?.key ?? "overview";
}

export function aos599SectionToRpc(section: Aos599Section): string {
  return section === "overview" ? "overview" : "full";
}
