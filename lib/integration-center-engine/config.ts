export const OIH592_SECTIONS = [
  { key: "overview", href: "/app/integrations" },
  { key: "connectedApps", href: "/app/integrations/connected-apps" },
  { key: "availableApps", href: "/app/integrations/available-apps" },
  { key: "apiKeys", href: "/app/integrations/api-keys" },
  { key: "permissions", href: "/app/integrations/permissions" },
  { key: "logs", href: "/app/integrations/logs" },
  { key: "health", href: "/app/integrations/health" },
  { key: "reports", href: "/app/integrations/reports" },
] as const;

export type Oih592Section = (typeof OIH592_SECTIONS)[number]["key"];

export function getOih592ActiveSection(pathname: string): Oih592Section {
  if (pathname === "/app/integrations" || pathname === "/app/integrations/") return "overview";
  const match = OIH592_SECTIONS.find((s) => s.key !== "overview" && pathname.startsWith(s.href));
  return match?.key ?? "overview";
}

export function oih592SectionToRpc(section: Oih592Section): string {
  return section === "overview" ? "overview" : "full";
}
