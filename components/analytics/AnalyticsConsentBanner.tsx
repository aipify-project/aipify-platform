"use client";

import Link from "next/link";
import { useEffect } from "react";
import type { AnalyticsConsentLabels } from "@/lib/product-analytics/consent";

type Props = {
  labels: AnalyticsConsentLabels;
  privacyHref: string;
  mode: "initial" | "manage";
  onAccept: () => void;
  onDecline: () => void;
  onClose?: () => void;
};

export default function AnalyticsConsentBanner({
  labels,
  privacyHref,
  mode,
  onAccept,
  onDecline,
  onClose,
}: Props) {
  const title = mode === "manage" ? labels.privacySettingsManageTitle : labels.bannerTitle;

  useEffect(() => {
    if (mode !== "manage" || !onClose) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mode, onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="aipify-analytics-consent-title"
      aria-describedby="aipify-analytics-consent-description"
      className="fixed inset-x-0 bottom-0 z-[100] border-t border-zinc-200 bg-white/95 p-4 shadow-lg backdrop-blur-sm sm:p-6"
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-4">
        <div className="space-y-2">
          <h2 id="aipify-analytics-consent-title" className="text-base font-semibold text-zinc-900">
            {title}
          </h2>
          <div id="aipify-analytics-consent-description" className="space-y-2 text-sm text-zinc-600">
            <p>{labels.necessaryCookies}</p>
            <p>{labels.analyticsCookies}</p>
          </div>
          <Link
            href={privacyHref}
            className="inline-flex text-sm font-medium text-[#7C3AED] hover:text-[#6D28D9]"
          >
            {labels.privacyLink}
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onAccept}
            className="rounded-lg bg-[#7C3AED] px-4 py-2 text-sm font-medium text-white hover:bg-[#6D28D9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-2"
          >
            {labels.acceptAnalytics}
          </button>
          <button
            type="button"
            onClick={onDecline}
            className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-2"
          >
            {labels.declineAnalytics}
          </button>
          {mode === "manage" && onClose ? (
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-2"
            >
              {labels.privacySettingsClose}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
