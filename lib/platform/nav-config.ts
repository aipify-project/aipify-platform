export type PlatformNavId =
  | "overview"
  | "customers"
  | "subscriptions"
  | "billing"
  | "invoices"
  | "paymentProviders"
  | "installations"
  | "metrics"
  | "stats"
  | "support"
  | "automations"
  | "system";

export type PlatformNavItem = {
  id: PlatformNavId;
  href: string;
  labelKey: string;
};

export const PLATFORM_ADMIN_NAV: PlatformNavItem[] = [
  { id: "overview", href: "/platform", labelKey: "platform.nav.overview" },
  {
    id: "customers",
    href: "/platform/customers",
    labelKey: "platform.nav.customers",
  },
  {
    id: "subscriptions",
    href: "/platform/subscriptions",
    labelKey: "platform.nav.subscriptions",
  },
  {
    id: "billing",
    href: "/platform/billing",
    labelKey: "platform.nav.billing",
  },
  {
    id: "invoices",
    href: "/platform/invoices",
    labelKey: "platform.nav.invoices",
  },
  {
    id: "installations",
    href: "/platform/installations",
    labelKey: "platform.nav.installations",
  },
  {
    id: "metrics",
    href: "/platform/metrics",
    labelKey: "platform.nav.metrics",
  },
  {
    id: "support",
    href: "/platform/support",
    labelKey: "platform.nav.support",
  },
  {
    id: "automations",
    href: "/platform/automations",
    labelKey: "platform.nav.automations",
  },
  {
    id: "system",
    href: "/platform/system",
    labelKey: "platform.nav.system",
  },
];

export const PLATFORM_MOBILE_NAV_IDS: PlatformNavId[] = [
  "overview",
  "customers",
  "invoices",
  "billing",
];

export function getPlatformActiveNavId(pathname: string): PlatformNavId {
  if (pathname.startsWith("/platform/customers")) return "customers";
  if (pathname.startsWith("/platform/subscriptions")) return "subscriptions";
  if (pathname.startsWith("/platform/billing")) return "billing";
  if (pathname.startsWith("/platform/invoices")) return "invoices";
  if (pathname.startsWith("/platform/payment-providers")) return "paymentProviders";
  if (pathname.startsWith("/platform/installations")) return "installations";
  if (pathname.startsWith("/platform/metrics")) return "metrics";
  if (pathname.startsWith("/platform/stats")) return "metrics";
  if (pathname.startsWith("/platform/support")) return "support";
  if (pathname.startsWith("/platform/automations")) return "automations";
  if (pathname.startsWith("/platform/system")) return "system";
  return "overview";
}
