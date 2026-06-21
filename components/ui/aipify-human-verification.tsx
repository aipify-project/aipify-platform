"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { shapeGlyph, type VerificationShape } from "@/lib/public-forms/human-verification";
import type { HumanVerificationLabels } from "@/lib/system-notice/types";
import { AipifyShellClasses } from "@/lib/design/light-enterprise-theme";

type ChallengeResponse = {
  targetShape: VerificationShape;
  options: { id: string; shape: VerificationShape; rotation: number }[];
  token: string;
};

type Props = {
  labels: HumanVerificationLabels;
  onVerified: (payload: { token: string; answer: number }) => void;
  onReset?: () => void;
  variant?: "light" | "dark";
  compact?: boolean;
  className?: string;
};

function optionButtonClass({
  variant,
  selected,
  verified,
  compact,
}: {
  variant: "light" | "dark";
  selected: boolean;
  verified: boolean;
  compact: boolean;
}) {
  const optionSizeClass = compact
    ? "h-[48px] w-[58px] text-base sm:h-[52px] sm:w-[64px]"
    : "h-[60px] w-[72px] sm:h-[64px] sm:w-[84px] sm:text-xl";
  const base =
    `flex shrink-0 items-center justify-center rounded-[13px] border text-lg transition focus:outline-none focus:ring-2 focus:ring-aipify-focus focus:ring-offset-2 disabled:cursor-not-allowed ${optionSizeClass}`;

  if (variant === "dark") {
    if (selected && verified) {
      return `${base} border-emerald-400/70 bg-emerald-500/15 text-white`;
    }
    if (selected) {
      return `${base} border-aipify-companion bg-violet-500/20 text-white`;
    }
    return `${base} border-white/15 bg-white/5 text-white hover:border-cyan-400/50 hover:bg-white/10`;
  }

  if (selected && verified) {
    return `${base} border-emerald-500 bg-emerald-50 text-aipify-text`;
  }
  if (selected) {
    return `${base} border-aipify-companion bg-aipify-accent-soft text-aipify-text`;
  }
  return `${base} border-aipify-border bg-aipify-surface-muted text-aipify-text hover:border-aipify-accent hover:bg-aipify-accent-soft/50`;
}

export function AipifyHumanVerification({
  labels,
  onVerified,
  onReset,
  variant = "light",
  compact = false,
  className = "",
}: Props) {
  const [challenge, setChallenge] = useState<ChallengeResponse | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [state, setState] = useState<"idle" | "verified" | "failed">("idle");
  const [loading, setLoading] = useState(true);

  const loadChallenge = useCallback(async () => {
    setLoading(true);
    setSelected(null);
    setState("idle");
    try {
      const res = await fetch("/api/public/verification/challenge");
      if (!res.ok) throw new Error("challenge failed");
      const data = (await res.json()) as ChallengeResponse;
      setChallenge(data);
    } catch {
      setChallenge(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadChallenge();
  }, [loadChallenge]);

  const cardClass =
    variant === "dark"
      ? `rounded-2xl border border-white/10 bg-white/[0.04] ${compact ? "px-4 py-4" : "px-5 py-5 sm:px-7 sm:py-6"}`
      : `${AipifyShellClasses.surfaceCard} ${compact ? "px-4 py-4" : "px-5 py-5 sm:px-7 sm:py-6"}`;

  const targetLabel = useMemo(() => {
    if (!challenge) return "";
    return shapeGlyph(challenge.targetShape);
  }, [challenge]);

  function handleSelect(index: number) {
    if (!challenge || state === "verified") return;
    setSelected(index);
    onVerified({ token: challenge.token, answer: index });
    setState("verified");
  }

  function handleRefresh() {
    onReset?.();
    void loadChallenge();
  }

  if (loading) {
    return <div className={`${cardClass} ${className} text-sm text-aipify-text-muted`}>{labels.prompt}</div>;
  }

  if (!challenge) {
    return (
      <div className={`${cardClass} ${className}`}>
        <p className="text-sm text-red-600">{labels.failed}</p>
        <button type="button" onClick={() => void loadChallenge()} className={`mt-2 ${AipifyShellClasses.secondaryButton}`}>
          {labels.refresh}
        </button>
      </div>
    );
  }

  return (
    <div className={`${cardClass} ${className}`} aria-live="polite">
      <p className={`font-medium text-aipify-text ${compact ? "text-xs" : "text-sm"}`}>{labels.title}</p>
      {!compact ? (
        <p className="mt-1.5 text-xs leading-relaxed text-aipify-text-secondary">{labels.description}</p>
      ) : null}

      <div className={`flex flex-col items-center text-center ${compact ? "mt-3" : "mt-5"}`}>
        <p id="verification-match-instruction" className="text-xs font-medium uppercase tracking-wide text-aipify-text-secondary">
          {labels.selectMatching}
        </p>
        <div
          className={`mt-3 flex items-center justify-center rounded-[13px] bg-aipify-companion text-white ${
            compact ? "h-11 w-11 text-base" : "mt-3.5 h-[52px] w-[52px] text-lg sm:h-14 sm:w-14 sm:text-xl"
          }`}
          aria-hidden="true"
        >
          {targetLabel}
        </div>
      </div>

      <div
        className={`grid grid-cols-2 justify-items-center gap-2 sm:flex sm:flex-row sm:flex-wrap sm:justify-center ${
          compact ? "mt-3 gap-2" : "mt-4 gap-2.5 sm:gap-3 md:gap-4"
        }`}
        role="group"
        aria-labelledby="verification-match-instruction"
      >
        {challenge.options.map((opt, index) => {
          const isSelected = selected === index;
          return (
            <button
              key={opt.id}
              type="button"
              aria-label={labels.shapes[opt.shape]}
              aria-pressed={isSelected}
              disabled={state === "verified" && !isSelected}
              onClick={() => handleSelect(index)}
              className={optionButtonClass({ variant, selected: isSelected, verified: state === "verified", compact })}
            >
              <span style={{ transform: `rotate(${opt.rotation}deg)` }} aria-hidden="true">
                {shapeGlyph(opt.shape)}
              </span>
              {isSelected && state === "verified" ? (
                <span className="sr-only">{labels.verified}</span>
              ) : null}
            </button>
          );
        })}
      </div>

      {state === "verified" ? (
        <p className="mt-3 text-center text-xs font-medium text-emerald-700" role="status">
          <span aria-hidden="true">✅ </span>
          {labels.verified}
        </p>
      ) : null}
      {state === "failed" ? (
        <p className="mt-3 text-center text-xs font-medium text-red-700" role="alert">
          <span aria-hidden="true">❌ </span>
          {labels.failed}
        </p>
      ) : null}

      <div className="mt-3 flex justify-center sm:mt-4">
        <button
          type="button"
          onClick={handleRefresh}
          className={`inline-flex items-center gap-1.5 rounded px-2 py-1 text-xs font-medium ${AipifyShellClasses.link} focus:outline-none focus:ring-2 focus:ring-aipify-focus`}
        >
          <span aria-hidden="true">↻</span>
          {labels.refresh}
        </button>
      </div>
    </div>
  );
}

export function PublicFormHoneypot() {
  return (
    <input
      type="text"
      name="_honeypot"
      tabIndex={-1}
      autoComplete="off"
      aria-hidden="true"
      className="pointer-events-none absolute left-[-9999px] h-0 w-0 opacity-0"
    />
  );
}
