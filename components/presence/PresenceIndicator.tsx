"use client";

import { AipifyPulse } from "@/components/branding";
import {
  getPresenceAnimationClass,
  getPresenceGlowClass,
  getPresenceMode,
} from "@/lib/presence/presence-engine";
import { usePresence } from "./PresenceProvider";

export default function PresenceIndicator() {
  const { bundle, loading, setOpen, labels } = usePresence();

  if (!bundle.settings.presence_visible) {
    return null;
  }

  const animationClass = getPresenceAnimationClass(bundle.state);
  const glowClass = getPresenceGlowClass(bundle.state);
  const mode = getPresenceMode(bundle.state);
  const intensityOpacity =
    bundle.settings.animation_intensity === "subtle"
      ? 0.75
      : bundle.settings.animation_intensity === "enhanced"
        ? 1
        : 0.9;

  return (
    <div className="group relative">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`relative inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white p-2 text-violet-600 transition hover:border-violet-200 hover:bg-violet-50/40 ${animationClass}`}
        aria-label={labels.indicatorAria}
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

      <div
        role="tooltip"
        className="pointer-events-none absolute right-0 top-full z-50 mt-2 hidden w-56 rounded-xl border border-gray-200 bg-white p-3 text-left shadow-lg group-hover:block group-focus-within:block"
      >
        <p className="text-xs font-semibold text-gray-900">{labels.indicatorTooltip.title}</p>
        <dl className="mt-2 space-y-1 text-xs text-gray-600">
          <div className="flex justify-between gap-2">
            <dt>{labels.indicatorTooltip.status}</dt>
            <dd className="font-semibold text-gray-800">{labels.modes[mode]}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt>{labels.indicatorTooltip.learning}</dt>
            <dd className="font-semibold text-gray-800">{bundle.metrics.learning_events_today}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt>{labels.indicatorTooltip.approvals}</dt>
            <dd className="font-semibold text-gray-800">{bundle.metrics.pending_approvals}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt>{labels.indicatorTooltip.healing}</dt>
            <dd className="font-semibold text-gray-800">{bundle.metrics.healing_events_today}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt>{labels.indicatorTooltip.health}</dt>
            <dd className="font-semibold text-gray-800">{bundle.metrics.system_health_score}%</dd>
          </div>
        </dl>
        <p className="mt-2 text-[10px] text-violet-600">{labels.indicatorTooltip.open}</p>
      </div>
    </div>
  );
}
