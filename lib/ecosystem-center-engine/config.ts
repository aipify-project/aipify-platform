export const EP601_SECTIONS = [
  { key: "overview", href: "/platform/ecosystem" },
  { key: "providers", href: "/platform/ecosystem/providers" },
  { key: "businessPacks", href: "/platform/ecosystem/business-packs" },
  { key: "certifications", href: "/platform/ecosystem/certifications" },
  { key: "marketplace", href: "/platform/ecosystem/marketplace" },
  { key: "reviews", href: "/platform/ecosystem/reviews" },
  { key: "revenue", href: "/platform/ecosystem/revenue" },
  { key: "governance", href: "/platform/ecosystem/governance" },
  { key: "reports", href: "/platform/ecosystem/reports" },
] as const;

export type Ep601Section = (typeof EP601_SECTIONS)[number]["key"];

export function getEp601ActiveSection(pathname: string): Ep601Section {
  if (pathname === "/platform/ecosystem" || pathname === "/platform/ecosystem/") return "overview";
  const match = EP601_SECTIONS.find((s) => s.key !== "overview" && pathname.startsWith(s.href));
  return match?.key ?? "overview";
}

export function ep601SectionToRpc(section: Ep601Section): string {
  return section;
}
