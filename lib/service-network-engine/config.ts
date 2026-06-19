export const SERVICE_NETWORK_SECTIONS = [
  { key: "network", href: "/app/services/network", rpc: "network" },
  { key: "locations", href: "/app/services/locations", rpc: "locations" },
  { key: "resources", href: "/app/services/resources", rpc: "resources" },
  { key: "providers", href: "/app/services/providers", rpc: "providers" },
  { key: "rentals", href: "/app/services/rentals", rpc: "rentals" },
] as const;

export type ServiceNetworkSection = (typeof SERVICE_NETWORK_SECTIONS)[number]["key"];

export const SERVICE_NETWORK_DETAIL_ROUTES = {
  location: "/app/services/locations",
  resource: "/app/services/resources",
  provider: "/app/services/providers",
  rental: "/app/services/rentals",
} as const;

export type ServiceNetworkEntityType = keyof typeof SERVICE_NETWORK_DETAIL_ROUTES;

export function getServiceNetworkActiveSection(pathname: string): ServiceNetworkSection {
  if (pathname === "/app/services/network" || pathname === "/app/services/network/") {
    return "network";
  }
  const match = SERVICE_NETWORK_SECTIONS.find(
    (s) => s.key !== "network" && pathname.startsWith(s.href),
  );
  return match?.key ?? "network";
}

export function serviceNetworkSectionToRpc(section: ServiceNetworkSection): string {
  return SERVICE_NETWORK_SECTIONS.find((s) => s.key === section)?.rpc ?? section;
}

export function parseLocationContext(searchParams: URLSearchParams): string {
  return searchParams.get("locationId") ?? searchParams.get("location") ?? "";
}
