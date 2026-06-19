export const OEB591_SECTIONS = [
  { key: "overview", href: "/app/events" },
  { key: "liveActivity", href: "/app/events/live-activity" },
  { key: "signals", href: "/app/events/signals" },
  { key: "alerts", href: "/app/events/alerts" },
  { key: "subscriptions", href: "/app/events/subscriptions" },
  { key: "sources", href: "/app/events/sources" },
  { key: "history", href: "/app/events/history" },
  { key: "reports", href: "/app/events/reports" },
] as const;

export type Oeb591Section = (typeof OEB591_SECTIONS)[number]["key"];

export function getOeb591ActiveSection(pathname: string): Oeb591Section {
  if (pathname === "/app/events" || pathname === "/app/events/") return "overview";
  const match = OEB591_SECTIONS.find((s) => s.key !== "overview" && pathname.startsWith(s.href));
  return match?.key ?? "overview";
}

export function oeb591SectionToRpc(section: Oeb591Section): string {
  return section === "overview" ? "overview" : "full";
}
