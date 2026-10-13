"use client";

import { useState } from "react";
import type { VocWidgetLabels } from "@/lib/voice-of-the-customer";
import { ShareFeedbackDialog } from "./ShareFeedbackDialog";

type TopbarShareFeedbackButtonProps = {
  labels: VocWidgetLabels;
};

export function TopbarShareFeedbackButton({ labels }: TopbarShareFeedbackButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-amber-300/80 bg-gradient-to-b from-amber-50 to-amber-100/90 px-3 text-amber-950 shadow-sm transition hover:border-amber-400 hover:from-amber-100 hover:to-amber-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-aipify-focus sm:h-11 sm:px-3.5"
        aria-label={labels.trigger}
        title={labels.trigger}
      >
        <span aria-hidden className="text-base leading-none">
          💡
        </span>
        <span className="hidden text-[13px] font-semibold tracking-tight md:inline">{labels.triggerShort}</span>
      </button>
      <ShareFeedbackDialog labels={labels} open={open} onClose={() => setOpen(false)} />
    </>
  );
}
