"use client";

import AipifyPulse from "@/components/branding/AipifyPulse";
import {
  getPresenceAnimationClass,
  getPresenceGlowClass,
  type PresenceState,
} from "@/lib/presence/presence-engine";
import type { BrainPresence, SelfHealingLivePresence } from "@/lib/platform/intelligence-engine";

type IntelligencePresenceStripProps = {
  title: string;
  variant?: "brain" | "selfHealing";
  presence: BrainPresence | SelfHealingLivePresence;
  labels: {
    currentState: string;
    activeSignals: string;
    healingToday: string;
    pendingReviews: string;
    systemConfidence: string;
    currentAction: string;
    estimatedCompletion: string;
    riskLevel: string;
    approvalRequired: string;
    lastResult: string;
    yes: string;
    no: string;
    confidenceHigh: string;
    confidenceMedium: string;
    confidenceLow: string;
    seconds: string;
    pulseLabel: string;
    learningEventsDetected: string;
    recommendationsAwaiting: string;
    completedToday: string;
  };
};

function resolvePresenceState(
  state: string
): PresenceState {
  const map: Record<string, PresenceState> = {
    standby: "standby",
    monitoring: "standby",
    analysing: "analysing",
    working: "working",
    learning: "learning",
    self_healing: "self_healing",
    human_approval_required: "human_approval_required",
    critical_attention: "critical_attention",
    critical: "critical_attention",
  };
  return map[state] ?? "standby";
}

function confidenceLabel(
  level: string,
  labels: IntelligencePresenceStripProps["labels"]
): string {
  if (level === "high") return labels.confidenceHigh;
  if (level === "medium") return labels.confidenceMedium;
  return labels.confidenceLow;
}

export default function IntelligencePresenceStrip({
  title,
  variant = "brain",
  presence,
  labels,
}: IntelligencePresenceStripProps) {
  const presenceState = resolvePresenceState(presence.state);
  const animationClass = getPresenceAnimationClass(presenceState);
  const glowClass = getPresenceGlowClass(presenceState);

  const isBrain = variant === "brain";
  const brainPresence = isBrain ? (presence as BrainPresence) : null;
  const healingPresence = !isBrain ? (presence as SelfHealingLivePresence) : null;

  return (
    <section className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50/50 via-white to-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start gap-6">
        <div className={`relative shrink-0 rounded-2xl border border-violet-100 bg-white p-4 ${animationClass}`}>
          <span
            className={`pointer-events-none absolute inset-2 rounded-xl bg-gradient-to-br ${glowClass} blur-md`}
            aria-hidden="true"
          />
          <AipifyPulse
            size="lg"
            variant="gradient"
            title={labels.pulseLabel}
            aria-label={labels.pulseLabel}
            className="relative"
          />
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <p className="mt-1 text-sm text-violet-700">
            {labels.currentState}:{" "}
            <span className="font-semibold text-gray-900">
              {"activity_title" in presence && presence.activity_title
                ? presence.activity_title
                : presence.state}
            </span>
          </p>

          {isBrain && brainPresence ? (
            <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <PresenceStat
                label={labels.activeSignals}
                value={labels.learningEventsDetected.replace(
                  "{count}",
                  String(brainPresence.active_signals)
                )}
              />
              <PresenceStat
                label={labels.healingToday}
                value={labels.completedToday.replace(
                  "{count}",
                  String(brainPresence.healing_today)
                )}
              />
              <PresenceStat
                label={labels.pendingReviews}
                value={labels.recommendationsAwaiting.replace(
                  "{count}",
                  String(brainPresence.pending_reviews)
                )}
              />
              <PresenceStat
                label={labels.systemConfidence}
                value={confidenceLabel(brainPresence.system_confidence, labels)}
              />
            </dl>
          ) : null}

          {!isBrain && healingPresence ? (
            <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <PresenceStat
                label={labels.currentAction}
                value={healingPresence.current_action}
              />
              <PresenceStat
                label={labels.estimatedCompletion}
                value={
                  healingPresence.eta_seconds != null
                    ? `${healingPresence.eta_seconds} ${labels.seconds}`
                    : "—"
                }
              />
              <PresenceStat
                label={labels.riskLevel}
                value={healingPresence.risk_level}
              />
              <PresenceStat
                label={labels.approvalRequired}
                value={healingPresence.approval_required ? labels.yes : labels.no}
              />
              <PresenceStat
                label={labels.lastResult}
                value={healingPresence.last_result ?? "—"}
                className="sm:col-span-2"
              />
            </dl>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function PresenceStat({
  label,
  value,
  className = "",
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={`rounded-xl border border-gray-100 bg-white/80 px-4 py-3 ${className}`}>
      <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</dt>
      <dd className="mt-1 text-sm font-semibold text-gray-900">{value}</dd>
    </div>
  );
}
