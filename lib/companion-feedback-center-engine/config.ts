export const CIFE596_SECTIONS = [
  { key: "overview", href: "/app/feedback" },
  { key: "feedback", href: "/app/feedback/collection" },
  { key: "suggestions", href: "/app/feedback/suggestions" },
  { key: "ratings", href: "/app/feedback/ratings" },
  { key: "insights", href: "/app/feedback/insights" },
  { key: "improvements", href: "/app/feedback/improvements" },
  { key: "reports", href: "/app/feedback/reports" },
] as const;

export type Cife596Section = (typeof CIFE596_SECTIONS)[number]["key"];

export function getCife596ActiveSection(pathname: string): Cife596Section {
  if (pathname === "/app/feedback" || pathname === "/app/feedback/") return "overview";
  const match = CIFE596_SECTIONS.find((s) => s.key !== "overview" && pathname.startsWith(s.href));
  return match?.key ?? "overview";
}

export function cife596SectionToRpc(section: Cife596Section): string {
  return section === "overview" ? "overview" : "full";
}
