export const BPR603_PLATFORM_SECTIONS = [
  { key: "overview", href: "/platform/business-pack-runtime" },
  { key: "installedPacks", href: "/platform/business-pack-runtime/installed-packs" },
  { key: "deployments", href: "/platform/business-pack-runtime/deployments" },
  { key: "versions", href: "/platform/business-pack-runtime/versions" },
  { key: "health", href: "/platform/business-pack-runtime/health" },
  { key: "permissions", href: "/platform/business-pack-runtime/permissions" },
  { key: "domains", href: "/platform/business-pack-runtime/domains" },
  { key: "rollbacks", href: "/platform/business-pack-runtime/rollbacks" },
  { key: "incidents", href: "/platform/business-pack-runtime/incidents" },
  { key: "reports", href: "/platform/business-pack-runtime/reports" },
] as const;

export type Bpr603PlatformSection = (typeof BPR603_PLATFORM_SECTIONS)[number]["key"];

export const BPR603_CUSTOMER_SECTIONS = [
  { key: "overview", href: "/app/settings/business-packs" },
  { key: "installed", href: "/app/settings/business-packs/installed" },
  { key: "health", href: "/app/settings/business-packs/health" },
  { key: "permissions", href: "/app/settings/business-packs/permissions" },
  { key: "updates", href: "/app/settings/business-packs/updates" },
  { key: "billing", href: "/app/settings/business-packs/billing" },
] as const;

export type Bpr603CustomerSection = (typeof BPR603_CUSTOMER_SECTIONS)[number]["key"];

const PLATFORM_RPC_MAP: Record<Bpr603PlatformSection, string> = {
  overview: "overview",
  installedPacks: "installed_packs",
  deployments: "deployments",
  versions: "versions",
  health: "health",
  permissions: "permissions",
  domains: "domains",
  rollbacks: "rollbacks",
  incidents: "incidents",
  reports: "reports",
};

export function getBpr603PlatformActiveSection(pathname: string): Bpr603PlatformSection {
  if (pathname === "/platform/business-pack-runtime" || pathname === "/platform/business-pack-runtime/") {
    return "overview";
  }
  if (pathname.startsWith("/platform/business-pack-runtime/instances")) return "installedPacks";
  const match = BPR603_PLATFORM_SECTIONS.find(
    (s) => s.key !== "overview" && pathname.startsWith(s.href),
  );
  return match?.key ?? "overview";
}

export function bpr603PlatformSectionToRpc(section: Bpr603PlatformSection): string {
  return PLATFORM_RPC_MAP[section];
}

export function getBpr603CustomerActiveSection(pathname: string): Bpr603CustomerSection {
  if (pathname === "/app/settings/business-packs" || pathname === "/app/settings/business-packs/") {
    return "overview";
  }
  const match = BPR603_CUSTOMER_SECTIONS.find(
    (s) => s.key !== "overview" && pathname.startsWith(s.href),
  );
  return match?.key ?? "overview";
}

export function bpr603CustomerSectionToRpc(section: Bpr603CustomerSection): string {
  return section;
}
