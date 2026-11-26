"use client";

import type { ReactNode } from "react";
import { AlertCircle, AlertTriangle, CheckCircle2, Info, Lightbulb, X } from "lucide-react";
import { SELLER_PORTAL_LAYOUT, SELLER_PORTAL_TONES, type SellerPortalTone } from "@/lib/partners-portal/design-tokens";

type AipifyAlertProps = {
  tone?: SellerPortalTone;
  title?: string;
  children: ReactNode;
  actions?: ReactNode;
  onClose?: () => void;
  closeLabel?: string;
  list?: string[];
};

const ICONS: Record<SellerPortalTone, typeof Info> = {
  primary: Info,
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  danger: AlertCircle,
  neutral: Lightbulb,
};

export function AipifyAlert({
  tone = "info",
  title,
  children,
  actions,
  onClose,
  closeLabel = "Close",
  list,
}: AipifyAlertProps) {
  const Icon = ICONS[tone];
  const soft = SELLER_PORTAL_TONES[tone].soft;
  const role = tone === "danger" || tone === "warning" ? "alert" : "status";
  const live = tone === "danger" ? "assertive" : "polite";

  return (
    <div
      role={role}
      aria-live={live}
      className={`${SELLER_PORTAL_LAYOUT.radiusCard} ring-1 ${soft} px-4 py-3 sm:px-5 sm:py-4`}
    >
      <div className="flex gap-3">
        <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden strokeWidth={2} />
        <div className="min-w-0 flex-1 space-y-2">
          {title ? <p className="text-sm font-semibold">{title}</p> : null}
          <div className="text-sm leading-relaxed">{children}</div>
          {list && list.length > 0 ? (
            <ul className="list-disc space-y-1 pl-5 text-sm">
              {list.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
          {actions ? <div className="flex flex-wrap gap-2 pt-1">{actions}</div> : null}
        </div>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            aria-label={closeLabel}
            className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg hover:bg-black/5 ${SELLER_PORTAL_LAYOUT.focusRing}`}
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        ) : null}
      </div>
    </div>
  );
}
