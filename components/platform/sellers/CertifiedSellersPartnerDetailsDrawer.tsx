"use client";

import Link from "next/link";
import { useEffect, useId, type KeyboardEvent } from "react";
import {
  CertifiedSellerProfile,
  type CertifiedSellerProfileLabels,
} from "@/components/platform/sellers/CertifiedSellerProfile";
import type { SellersActionLabels } from "@/components/platform/sellers/CertifiedSellersActionPanel";

/** The drawer shares one label contract with the canonical seller profile. */
export type PartnerDetailsDrawerLabels = CertifiedSellerProfileLabels;

type Props = {
  partnerId: string;
  locale: string;
  labels: PartnerDetailsDrawerLabels;
  actionLabels: SellersActionLabels;
  onClose: () => void;
  onDecisionSuccess: () => void;
};

/**
 * Thin slide-over around the canonical `CertifiedSellerProfile`.
 * Every entry point (partners table, top 5, search, leads deep links) opens this same profile.
 */
export function CertifiedSellersPartnerDetailsDrawer({
  partnerId,
  locale,
  labels,
  actionLabels,
  onClose,
  onDecisionSuccess,
}: Props) {
  const titleId = useId();

  useEffect(() => {
    function onKey(e: globalThis.KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40" role="presentation" onClick={onClose}>
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="flex h-full w-full max-w-[1040px] flex-col border-l border-[color:var(--aipify-border)] bg-[color:var(--aipify-canvas,#F7F6F3)] shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between gap-4 border-b border-[color:var(--aipify-border)] bg-[color:var(--aipify-surface,#fff)] px-6 py-3">
          <h2 id={titleId} className="text-base font-semibold text-[#1F2937]">
            {labels.profile.title}
          </h2>
          <div className="flex items-center gap-2">
            <Link
              href={`/platform/sellers/partners/${encodeURIComponent(partnerId)}`}
              className="rounded-xl border border-[color:var(--aipify-border)] px-3 py-1.5 text-sm font-semibold text-[#7253EA] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7253EA]"
            >
              {labels.profile.openFullProfile}
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[color:var(--aipify-border)] px-3 py-1.5 text-sm font-semibold text-[#1F2937] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7253EA]"
            >
              {labels.close}
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <CertifiedSellerProfile
            partnerId={partnerId}
            locale={locale}
            labels={labels}
            actionLabels={actionLabels}
            variant="drawer"
            onDecisionSuccess={onDecisionSuccess}
          />
        </div>
      </aside>
    </div>
  );
}

/** Keyboard activation for a table row that opens the profile. */
export function partnerRowKeyDown(e: KeyboardEvent, open: () => void) {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    open();
  }
}
