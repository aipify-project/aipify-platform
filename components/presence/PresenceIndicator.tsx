"use client";

import { AipifyPulse } from "@/components/branding";
import {
  getPresenceAnimationClass,
  getPresenceGlowClass,
} from "@/lib/presence/presence-engine";
import { usePresence } from "./PresenceProvider";

export default function PresenceIndicator() {
  const { bundle, loading, setOpen, labels } = usePresence();

  if (!bundle.settings.presence_visible) {
    return null;
  }

  const animationClass = getPresenceAnimationClass(bundle.state);
  const glowClass = getPresenceGlowClass(bundle.state);
  const intensityOpacity =
    bundle.settings.animation_intensity === "subtle"
      ? 0.75
      : bundle.settings.animation_intensity === "enhanced"
        ? 1
        : 0.9;

  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className={`relative inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white p-2 text-violet-600 transition hover:border-violet-200 hover:bg-violet-50/40 ${animationClass}`}
      aria-label={labels.indicatorAria}
      title={labels.indicatorTitle}
    >
      <span
        className={`pointer-events-none absolute inset-1 rounded-lg bg-gradient-to-br ${glowClass} blur-sm`}
        aria-hidden="true"
      />
      <AipifyPulse
        size="sm"
        variant="gradient"
        opacity={loading ? 0.5 : intensityOpacity}
        title={labels.states[bundle.state] ?? bundle.state}
        aria-label={labels.stateMessages[bundle.state] ?? labels.indicatorAria}
      />
      {bundle.metrics.pending_approvals > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-bold text-white ring-2 ring-white">
          {bundle.metrics.pending_approvals > 9 ? "9+" : bundle.metrics.pending_approvals}
        </span>
      )}
    </button>
  );
}
