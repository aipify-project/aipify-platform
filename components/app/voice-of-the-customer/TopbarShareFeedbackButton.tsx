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
        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-2.5 text-amber-950 transition hover:border-amber-300 hover:bg-amber-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-aipify-focus sm:px-3"
        aria-label={labels.trigger}
        title={labels.trigger}
      >
        <span aria-hidden className="text-base leading-none">
          💡
        </span>
        <span className="hidden text-xs font-semibold md:inline">{labels.triggerShort}</span>
      </button>
      <ShareFeedbackDialog labels={labels} open={open} onClose={() => setOpen(false)} />
    </>
  );
}
