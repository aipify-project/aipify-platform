export const SERVICE_COMMUNICATIONS_SECTIONS = [
  { key: "overview", href: "/app/services/communications", rpc: "overview" },
  { key: "messages", href: "/app/services/communications/messages", rpc: "messages" },
  { key: "scheduled", href: "/app/services/communications/scheduled", rpc: "scheduled" },
  { key: "failed", href: "/app/services/communications/failed", rpc: "failed" },
  { key: "replies", href: "/app/services/communications/replies", rpc: "replies" },
  { key: "templates", href: "/app/services/communications/templates", rpc: "templates" },
  { key: "preferences", href: "/app/services/communications/preferences", rpc: "preferences" },
  { key: "settings", href: "/app/services/communications/settings", rpc: "settings" },
] as const;

export type ServiceCommunicationsSection = (typeof SERVICE_COMMUNICATIONS_SECTIONS)[number]["key"];

export function getServiceCommunicationsActiveSection(pathname: string): ServiceCommunicationsSection {
  if (pathname === "/app/services/communications" || pathname === "/app/services/communications/") {
    return "overview";
  }
  const match = SERVICE_COMMUNICATIONS_SECTIONS.find(
    (s) => s.key !== "overview" && pathname.startsWith(s.href)
  );
  return match?.key ?? "overview";
}

export function serviceCommunicationsSectionToRpc(section: ServiceCommunicationsSection): string {
  return SERVICE_COMMUNICATIONS_SECTIONS.find((s) => s.key === section)?.rpc ?? section;
}

export function isServiceCommunicationsPath(pathname: string): boolean {
  return pathname.startsWith("/app/services/communications");
}

export function isServiceExperiencePath(pathname: string): boolean {
  return (
    isServiceCommunicationsPath(pathname) ||
    pathname.startsWith("/app/services/rebooking") ||
    pathname.startsWith("/app/services/feedback") ||
    pathname.startsWith("/app/services/quality")
  );
}
