import type { LucideIcon } from "lucide-react";
import {
  Building2,
  Calculator,
  ChartColumn,
  CreditCard,
  FileCheck,
  FileOutput,
  Globe,
  KeyRound,
  Landmark,
  Link2,
  Package,
  Percent,
  Receipt,
  RotateCcw,
  Users,
  Wallet,
} from "lucide-react";
import type { BillingCommerceNavItem } from "@/lib/platform/billing-commerce-center/config";

const ICON_MAP: Record<BillingCommerceNavItem["icon"], LucideIcon> = {
  receipt: Receipt,
  "credit-card": CreditCard,
  "file-check": FileCheck,
  wallet: Wallet,
  calculator: Calculator,
  landmark: Landmark,
  "rotate-ccw": RotateCcw,
  "chart-column": ChartColumn,
  "file-output": FileOutput,
  link: Link2,
  building: Building2,
  package: Package,
  key: KeyRound,
  globe: Globe,
  users: Users,
  percent: Percent,
};

export function BillingCommerceModuleIcon({
  icon,
  className = "h-5 w-5",
}: {
  icon: BillingCommerceNavItem["icon"];
  className?: string;
}) {
  const Icon = ICON_MAP[icon];
  return <Icon className={className} aria-hidden="true" strokeWidth={1.75} />;
}
