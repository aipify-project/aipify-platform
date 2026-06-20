"use client";

import Link from "next/link";
import { useState } from "react";
import AipifyPulse from "@/components/branding/AipifyPulse";

type CompanionAction = {
  id: string;
  label: string;
  href: string;
  description: string;
};

type WebsiteCompanionAssistantProps = {
  title: string;
  prompt: string;
  actions: CompanionAction[];
};

export default function WebsiteCompanionAssistant({ title, prompt, actions }: WebsiteCompanionAssistantProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40 pb-[env(safe-area-inset-bottom)] pr-[env(safe-area-inset-right)]">
      {open ? (
        <div className="mb-3 w-80 max-w-[calc(100vw-3rem)] rounded-2xl border border-aipify-border bg-aipify-surface shadow-lg">
          <div className="border-b border-aipify-border px-4 py-3">
            <p className="text-sm font-semibold text-aipify-text">{title}</p>
            <p className="mt-1 text-xs text-aipify-text-secondary">{prompt}</p>
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
        className="flex h-12 w-12 items-center justify-center rounded-full border border-aipify-border bg-aipify-surface shadow-lg transition hover:border-aipify-companion/40 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-aipify-focus"
        aria-expanded={open}
        aria-label={open ? `Close ${title}` : `Open ${title}`}
        title={title}
      >
        <AipifyPulse size={28} variant="gradient" title={title} aria-label={title} />
      </button>
    </div>
  );
}
