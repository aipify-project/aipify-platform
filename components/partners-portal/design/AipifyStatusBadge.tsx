import type { ReactNode } from "react";
import { SELLER_PORTAL_TONES, type SellerPortalTone } from "@/lib/partners-portal/design-tokens";

type AipifyStatusBadgeProps = {
  label: string;
  tone?: SellerPortalTone;
  icon?: ReactNode;
};

/** Status = icon + text. Never color alone. */
export function AipifyStatusBadge({ label, tone = "neutral", icon }: AipifyStatusBadgeProps) {
  const classes = SELLER_PORTAL_TONES[tone].soft;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${classes}`}>
      {icon ? <span className="shrink-0" aria-hidden>{icon}</span> : <span className="size-1.5 rounded-full bg-current" aria-hidden />}
      {label}
    </span>
  );
}
