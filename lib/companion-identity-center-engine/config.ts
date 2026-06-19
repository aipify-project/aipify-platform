export const CIPA595_SECTIONS = [
  { key: "overview", href: "/app/companion/identity" },
  { key: "identity", href: "/app/companion/identity/core" },
  { key: "personality", href: "/app/companion/identity/personality" },
  { key: "communication", href: "/app/companion/identity/communication" },
  { key: "preferences", href: "/app/companion/identity/preferences" },
  { key: "themes", href: "/app/companion/identity/themes" },
  { key: "behavior", href: "/app/companion/identity/behavior" },
  { key: "reports", href: "/app/companion/identity/reports" },
] as const;

export type Cipa595Section = (typeof CIPA595_SECTIONS)[number]["key"];

export function getCipa595ActiveSection(pathname: string): Cipa595Section {
  if (pathname === "/app/companion/identity" || pathname === "/app/companion/identity/") return "overview";
  const match = CIPA595_SECTIONS.find((s) => s.key !== "overview" && pathname.startsWith(s.href));
  return match?.key ?? "overview";
}

export function cipa595SectionToRpc(section: Cipa595Section): string {
  return section === "overview" ? "overview" : "full";
}
