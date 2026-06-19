export const PROF615_SECTIONS = [
  { key: "overview", href: "/app/profitability" },
  { key: "services", href: "/app/profitability/services" },
  { key: "pricing", href: "/app/profitability/pricing" },
  { key: "costs", href: "/app/profitability/costs" },
  { key: "margins", href: "/app/profitability/margins" },
  { key: "employees", href: "/app/profitability/employees" },
  { key: "locations", href: "/app/profitability/locations" },
  { key: "resources", href: "/app/profitability/resources" },
  { key: "products", href: "/app/profitability/products" },
  { key: "customers", href: "/app/profitability/customers" },
  { key: "forecasts", href: "/app/profitability/forecasts" },
  { key: "scenarios", href: "/app/profitability/scenarios" },
  { key: "recommendations", href: "/app/profitability/recommendations" },
  { key: "approvals", href: "/app/profitability/approvals" },
  { key: "policies", href: "/app/profitability/policies" },
  { key: "reports", href: "/app/profitability/reports" },
  { key: "allocations", href: "/app/profitability/allocations" },
  { key: "exceptions", href: "/app/profitability/exceptions" },
] as const;

export type Prof615Section = (typeof PROF615_SECTIONS)[number]["key"];

export function getProf615ActiveSection(pathname: string): Prof615Section {
  if (pathname === "/app/profitability" || pathname === "/app/profitability/") return "overview";
  const match = PROF615_SECTIONS.find((s) => s.key !== "overview" && pathname.startsWith(s.href));
  return match?.key ?? "overview";
}

export function prof615SectionToRpc(section: Prof615Section): string {
  return section.replace(/([A-Z])/g, "_$1").toLowerCase();
}
