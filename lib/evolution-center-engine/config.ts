export const CE600_SECTIONS = [
  { key: "overview", href: "/app/evolution" },
  { key: "platform", href: "/app/evolution/platform" },
  { key: "companion", href: "/app/evolution/companion" },
  { key: "businessPacks", href: "/app/evolution/business-packs" },
  { key: "roadmaps", href: "/app/evolution/roadmaps" },
  { key: "recommendations", href: "/app/evolution/recommendations" },
  { key: "opportunities", href: "/app/evolution/opportunities" },
  { key: "reports", href: "/app/evolution/reports" },
] as const;

export type Ce600Section = (typeof CE600_SECTIONS)[number]["key"];

export function getCe600ActiveSection(pathname: string): Ce600Section {
  if (pathname === "/app/evolution" || pathname === "/app/evolution/") return "overview";
  const match = CE600_SECTIONS.find((s) => s.key !== "overview" && pathname.startsWith(s.href));
  return match?.key ?? "overview";
}

export function ce600SectionToRpc(section: Ce600Section): string {
  return section === "overview" ? "overview" : "full";
}
