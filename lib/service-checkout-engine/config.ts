export const POS612_SECTIONS = [
  { key: "overview", href: "/app/checkout" },
  { key: "openCheckouts", href: "/app/checkout/open-checkouts" },
  { key: "completedSales", href: "/app/checkout/completed-sales" },
  { key: "appointments", href: "/app/checkout/appointments" },
  { key: "products", href: "/app/checkout/products" },
  { key: "payments", href: "/app/checkout/payments" },
  { key: "tips", href: "/app/checkout/tips" },
  { key: "discounts", href: "/app/checkout/discounts" },
  { key: "giftCards", href: "/app/checkout/gift-cards" },
  { key: "packages", href: "/app/checkout/packages" },
  { key: "memberships", href: "/app/checkout/memberships" },
  { key: "refunds", href: "/app/checkout/refunds" },
  { key: "invoices", href: "/app/checkout/invoices" },
  { key: "cashManagement", href: "/app/checkout/cash-management" },
  { key: "reconciliation", href: "/app/checkout/reconciliation" },
  { key: "dailyClose", href: "/app/checkout/daily-close" },
  { key: "reports", href: "/app/checkout/reports" },
  { key: "frontDesk", href: "/app/checkout/front-desk" },
] as const;

export type Pos612Section = (typeof POS612_SECTIONS)[number]["key"];

export const POS612_TRANSACTION_STATUSES = [
  "open",
  "pending",
  "paid",
  "refunded",
] as const;

export function getPos612ActiveSection(pathname: string): Pos612Section {
  if (pathname === "/app/checkout" || pathname === "/app/checkout/") return "overview";
  const match = POS612_SECTIONS.find((s) => s.key !== "overview" && pathname.startsWith(s.href));
  return match?.key ?? "overview";
}

export function pos612SectionToRpc(section: Pos612Section): string {
  const map: Record<Pos612Section, string> = {
    overview: "overview",
    openCheckouts: "open_checkouts",
    completedSales: "completed_sales",
    appointments: "appointments",
    products: "products",
    payments: "payments",
    tips: "tips",
    discounts: "discounts",
    giftCards: "gift_cards",
    packages: "packages",
    memberships: "memberships",
    refunds: "refunds",
    invoices: "invoices",
    cashManagement: "cash_management",
    reconciliation: "reconciliation",
    dailyClose: "daily_close",
    reports: "reports",
    frontDesk: "front_desk",
  };
  return map[section];
}
