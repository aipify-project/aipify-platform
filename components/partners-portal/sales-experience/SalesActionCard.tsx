"use client";

import Link from "next/link";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import type { GuidanceAction } from "./types";

export function SalesActionCard({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: GuidanceAction;
}) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-[#E8E4F2] bg-white p-5 shadow-[0_1px_2px_rgba(30,24,60,0.04)]">
      <h3 className="text-base font-semibold text-[#1E293B]">{title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-[#64748B]">{body}</p>
      {action ? (
        <Link
          href={action.href}
          className="mt-4 inline-flex min-h-11 items-center self-start rounded-xl bg-[#7C3AED] px-4 text-sm font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DDD6FE] focus-visible:ring-offset-2"
        >
          {action.label}
        </Link>
      ) : null}
    </article>
  );
}

/** Copies approved wording only. The caller supplies the text and performs the copy. */
export function CopyableApprovedSnippet({
  label,
  text,
  copyLabel,
  copiedLabel,
  failedLabel,
  onCopy,
}: {
  label: string;
  text: string;
  copyLabel: string;
  copiedLabel: string;
  failedLabel: string;
  onCopy: (text: string) => Promise<boolean>;
}) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  return (
    <div className="mt-4 rounded-xl bg-[#F6F4FB] p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-[#64748B]">{label}</p>
      <p className="mt-1 text-sm leading-relaxed text-[#1E293B]">{text}</p>
      <button
        type="button"
        className="mt-3 inline-flex min-h-10 items-center gap-2 rounded-xl border border-[#E8E4F2] bg-white px-3 text-sm font-semibold text-[#1E293B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DDD6FE]"
        onClick={() => {
          void onCopy(text).then((ok) => setState(ok ? "copied" : "failed"));
        }}
      >
        {state === "copied" ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
        {state === "copied" ? copiedLabel : state === "failed" ? failedLabel : copyLabel}
      </button>
    </div>
  );
}
