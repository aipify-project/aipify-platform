"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AipifyPulse from "@/components/branding/AipifyPulse";
import {
  WEBSITE_COMPANION_PRESENCE_STYLES,
  websiteCompanionPresenceLabel,
  type WebsiteCompanionPresenceState,
} from "@/lib/marketing/website-companion-presence";

type CompanionAction = {
  id: string;
  label: string;
  href: string;
  description: string;
};

type WebsiteCompanionAssistantProps = {
  title: string;
  prompt: string;
  presenceLabel: string;
  states: Record<WebsiteCompanionPresenceState, string>;
  actions: CompanionAction[];
};

export default function WebsiteCompanionAssistant({
  title,
  prompt,
  presenceLabel,
  states,
  actions,
}: WebsiteCompanionAssistantProps) {
  const [open, setOpen] = useState(false);
  const [presence, setPresence] = useState<WebsiteCompanionPresenceState>("READY");
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (open) {
      setPresence("WORKING");
      const timer = window.setTimeout(() => setPresence("READY"), 2400);
      return () => window.clearTimeout(timer);
    }
    setPresence("READY");
    return undefined;
  }, [open]);

  const style = WEBSITE_COMPANION_PRESENCE_STYLES[presence];
  const stateLabel = websiteCompanionPresenceLabel(states, presence);
  const ringAnimation = reducedMotion ? "" : style.ringAnimation;

  return (
    <div className="fixed bottom-6 right-6 z-40 pb-[env(safe-area-inset-bottom)] pr-[env(safe-area-inset-right)]">
      {open ? (
        <div className="mb-3 w-80 max-w-[calc(100vw-3rem)] rounded-2xl border border-aipify-border bg-aipify-surface shadow-lg">
          <div className="border-b border-aipify-border px-4 py-3">
            <p className="text-sm font-semibold text-aipify-text">{title}</p>
            <p className="mt-1 text-xs text-aipify-text-secondary">{prompt}</p>
            <p className="mt-2 text-[11px] font-medium uppercase tracking-wide text-aipify-text-muted">
              {presenceLabel}: <span className="text-aipify-companion">{stateLabel}</span>
            </p>
          </div>
          <ul className="max-h-72 overflow-y-auto p-2">
            {actions.map((action) => (
              <li key={action.id}>
                <Link
                  href={action.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2.5 hover:bg-aipify-surface-muted"
                >
                  <span className="text-sm font-medium text-aipify-companion">{action.label}</span>
                  <span className="mt-0.5 block text-xs text-aipify-text-secondary">{action.description}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`relative flex h-12 w-12 items-center justify-center rounded-full border bg-aipify-surface shadow-lg transition hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-aipify-focus ${style.buttonRing}`}
        aria-expanded={open}
        aria-label={`${open ? "Close" : "Open"} ${title} — ${stateLabel}`}
        title={`${title} — ${stateLabel}`}
      >
        <span
          className={`pointer-events-none absolute inset-0 rounded-full bg-gradient-to-br ${style.ring} blur-md ${ringAnimation}`}
          aria-hidden="true"
        />
        <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-aipify-surface">
          <AipifyPulse size={28} variant="gradient" title={title} aria-label={title} />
        </span>
        <span className="sr-only">{`${presenceLabel}: ${stateLabel}`}</span>
      </button>
    </div>
  );
}
