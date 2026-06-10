"use client";

import { useEffect, useState } from "react";
import {
  getBriefingSeverityStyle,
  getBriefingSeverityText,
} from "@/lib/presence/daily-briefing";
import { usePresence } from "./PresenceProvider";

const DISMISS_KEY = "aipify-daily-briefing-dismissed";

export default function DailyBriefingBanner() {
  const { bundle, setOpen, labels } = usePresence();
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    const key = `${DISMISS_KEY}-${new Date().toISOString().slice(0, 10)}`;
    setDismissed(localStorage.getItem(key) === "1");
  }, []);

  const briefing = bundle.daily_briefing;
  if (!briefing || dismissed || !bundle.settings.executive_summaries) {
    return null;
  }

  function dismiss() {
    const key = `${DISMISS_KEY}-${new Date().toISOString().slice(0, 10)}`;
    localStorage.setItem(key, "1");
    setDismissed(true);
  }

  const style = getBriefingSeverityStyle(briefing.primary.severity);
  const textStyle = getBriefingSeverityText(briefing.primary.severity);

  return (
    <div className={`border-b px-4 py-3 sm:px-6 ${style}`}>
      <div className="mx-auto flex max-w-6xl flex-wrap items-start justify-between gap-3">
        <div className={`min-w-0 flex-1 ${textStyle}`}>
          <p className="text-sm font-semibold">{briefing.primary.title}</p>
          <p className="mt-1 text-sm leading-relaxed opacity-90">{briefing.primary.body}</p>
          <p className="mt-2 text-xs opacity-75">{briefing.always_on}</p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded-lg bg-white/80 px-3 py-1.5 text-xs font-semibold text-violet-700 ring-1 ring-violet-200 hover:bg-white"
          >
            {labels.briefing.openPresence}
          </button>
          <button
            type="button"
            onClick={dismiss}
            className="rounded-lg px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-900"
          >
            {labels.briefing.dismiss}
          </button>
        </div>
      </div>
    </div>
  );
}
