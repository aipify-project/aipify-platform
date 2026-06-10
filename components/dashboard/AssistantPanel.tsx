"use client";

import { useEffect, useState } from "react";
import { AipifyOrb } from "@/components/branding";
import { CUSTOMER_ACCENT } from "@/lib/dashboard/customer-tokens";

type AssistantPanelProps = {
  title: string;
  greeting: string;
  subtitle: string;
  online: string;
  todayFound: string;
  items: string[];
  lastAnalyzedLabel: string;
  lastAnalyzedJustNow: string;
  lastAnalyzedMinutesAgo: string;
  askAipify: string;
  orbLabel: string;
};

const CRITICAL_SCAN_MS = 3 * 60 * 1000;
const DISPLAY_TICK_MS = 30 * 1000;

function formatLastAnalyzed(
  analyzedAt: number,
  justNow: string,
  minutesAgoTemplate: string
): string {
  const minutes = Math.floor((Date.now() - analyzedAt) / 60_000);
  if (minutes < 1) return justNow;
  return minutesAgoTemplate.replace("{count}", String(minutes));
}

export default function AssistantPanel({
  title,
  greeting,
  subtitle,
  online,
  todayFound,
  items,
  lastAnalyzedLabel,
  lastAnalyzedJustNow,
  lastAnalyzedMinutesAgo,
  askAipify,
  orbLabel,
}: AssistantPanelProps) {
  const [analyzedAt, setAnalyzedAt] = useState(
    () => Date.now() - 2 * 60 * 1000
  );
  const [lastAnalyzedText, setLastAnalyzedText] = useState("");

  useEffect(() => {
    function updateLabel() {
      setLastAnalyzedText(
        formatLastAnalyzed(
          analyzedAt,
          lastAnalyzedJustNow,
          lastAnalyzedMinutesAgo
        )
      );
    }

    updateLabel();
    const tick = window.setInterval(updateLabel, DISPLAY_TICK_MS);
    return () => window.clearInterval(tick);
  }, [analyzedAt, lastAnalyzedJustNow, lastAnalyzedMinutesAgo]);

  useEffect(() => {
    const scan = window.setInterval(() => {
      setAnalyzedAt(Date.now());
    }, CRITICAL_SCAN_MS);
    return () => window.clearInterval(scan);
  }, []);

  return (
    <section
      className={`relative overflow-hidden rounded-2xl border p-6 shadow-sm transition-all duration-200 hover:shadow-md sm:p-8 ${CUSTOMER_ACCENT.cardSurface}`}
    >
      <div
        className={`pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full blur-2xl ${CUSTOMER_ACCENT.cardGlow}`}
        aria-hidden="true"
      />

      <div className="relative flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <AipifyOrb
            size={48}
            status="online"
            title={orbLabel}
            aria-label={orbLabel}
          />
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            <span className="relative mt-0.5 inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
              </span>
              {online}
            </span>
          </div>
        </div>

        <p className="shrink-0 text-right text-xs text-gray-500">
          <span className="font-medium text-gray-600">{lastAnalyzedLabel}</span>
          <br />
          <span className="text-gray-500">{lastAnalyzedText}</span>
        </p>
      </div>

      <div className="relative mt-6 rounded-xl border border-white/80 bg-white/70 p-4 backdrop-blur-sm">
        <p className="text-base font-semibold text-gray-900">{greeting}</p>
        <p className="mt-1 text-sm text-gray-600">{subtitle}</p>
      </div>

      <p className="relative mt-5 text-sm font-semibold text-gray-900">
        {todayFound}
      </p>
      <ul className="relative mt-3 space-y-2.5">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-2.5 rounded-lg bg-white/60 px-3 py-2 text-sm leading-relaxed text-gray-600"
          >
            <span
              className="mt-0.5 shrink-0 text-emerald-600"
              aria-hidden="true"
            >
              ✓
            </span>
            {item}
          </li>
        ))}
      </ul>

      <div className="relative mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          className={`inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition ${CUSTOMER_ACCENT.gradientButton}`}
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
            />
          </svg>
          {askAipify}
        </button>
      </div>
    </section>
  );
}
