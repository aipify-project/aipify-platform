export const SERVICE_PAYMENTS_SECTIONS = [
  { key: "overview", href: "/app/services/payments", rpc: "overview" },
  { key: "payments", href: "/app/services/payments/payments", rpc: "payments" },
  { key: "deposits", href: "/app/services/payments/deposits", rpc: "deposits" },
  { key: "balances", href: "/app/services/payments/balances", rpc: "balances" },
  { key: "refunds", href: "/app/services/payments/refunds", rpc: "refunds" },
  { key: "cancellations", href: "/app/services/payments/cancellations", rpc: "cancellations" },
  { key: "noShows", href: "/app/services/payments/no-shows", rpc: "no_shows" },
  { key: "reconciliation", href: "/app/services/payments/reconciliation", rpc: "reconciliation" },
  { key: "policies", href: "/app/services/payments/policies", rpc: "policies" },
] as const;

export type ServicePaymentsSection = (typeof SERVICE_PAYMENTS_SECTIONS)[number]["key"];

export function getServicePaymentsActiveSection(pathname: string): ServicePaymentsSection {
  if (pathname === "/app/services/payments" || pathname === "/app/services/payments/") return "overview";
  const match = SERVICE_PAYMENTS_SECTIONS.find((s) => s.key !== "overview" && pathname.startsWith(s.href));
  return match?.key ?? "overview";
}

export function servicePaymentsSectionToRpc(section: ServicePaymentsSection): string {
  return SERVICE_PAYMENTS_SECTIONS.find((s) => s.key === section)?.rpc ?? section;
}
