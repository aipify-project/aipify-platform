export const KFTW597_SECTIONS = [
  { key: "overview", href: "/app/knowledge-fabric" },
  { key: "sources", href: "/app/knowledge-fabric/sources" },
  { key: "knowledge", href: "/app/knowledge-fabric/knowledge" },
  { key: "conflicts", href: "/app/knowledge-fabric/conflicts" },
  { key: "trust", href: "/app/knowledge-fabric/trust" },
  { key: "reviews", href: "/app/knowledge-fabric/reviews" },
  { key: "insights", href: "/app/knowledge-fabric/insights" },
  { key: "reports", href: "/app/knowledge-fabric/reports" },
] as const;

export type Kftw597Section = (typeof KFTW597_SECTIONS)[number]["key"];

export function getKftw597ActiveSection(pathname: string): Kftw597Section {
  if (pathname === "/app/knowledge-fabric" || pathname === "/app/knowledge-fabric/") return "overview";
  const match = KFTW597_SECTIONS.find((s) => s.key !== "overview" && pathname.startsWith(s.href));
  return match?.key ?? "overview";
}

export function kftw597SectionToRpc(section: Kftw597Section): string {
  return section === "overview" ? "overview" : "full";
}
