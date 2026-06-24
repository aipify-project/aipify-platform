"use client";

import type { VocWidgetLabels } from "@/lib/voice-of-the-customer";
import { TopbarShareFeedbackButton } from "./TopbarShareFeedbackButton";

/** @deprecated Floating widget removed — use TopbarShareFeedbackButton in APP header. */
export function ShareFeedbackWidget({ labels }: { labels: VocWidgetLabels }) {
  return <TopbarShareFeedbackButton labels={labels} />;
}
