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
  className?: string;
};

export function AipifyHumanVerification({
  labels,
  onVerified,
  onReset,
  variant = "light",
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
      ? "rounded-2xl border border-white/10 bg-white/[0.04] p-4"
      : `${AipifyShellClasses.surfaceCard} p-4`;

  const optionClass = (active: boolean) =>
    variant === "dark"
      ? `flex h-16 items-center justify-center rounded-xl border text-2xl transition ${
          active ? "border-cyan-400 bg-cyan-500/20" : "border-white/10 bg-white/5 hover:border-cyan-500/40"
        }`
      : `flex h-16 items-center justify-center rounded-xl border text-2xl transition ${
          active ? "border-aipify-companion bg-aipify-accent-soft" : "border-aipify-border bg-aipify-surface-muted hover:border-aipify-accent"
        }`;

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
      <p className="text-sm font-medium text-aipify-text">{labels.title}</p>
      <p className="mt-1 text-xs text-aipify-text-secondary">{labels.description}</p>
      <div className="mt-4 flex items-center justify-center gap-3">
        <span className="text-xs uppercase tracking-wide text-aipify-text-muted">{labels.selectMatching}</span>
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-aipify-companion text-2xl text-white" aria-hidden="true">
          {targetLabel}
        </span>
      </div>
      <div className="mt-4 grid grid-cols-4 gap-2">
        {challenge.options.map((opt, index) => (
          <button
            key={opt.id}
            type="button"
            aria-label={`Option ${index + 1}`}
            disabled={state === "verified" && selected !== index}
            onClick={() => handleSelect(index)}
            className={optionClass(selected === index)}
            style={{ transform: `rotate(${opt.rotation}deg)` }}
          >
            {shapeGlyph(opt.shape)}
          </button>
        ))}
      </div>
      {state === "verified" ? (
        <p className="mt-3 text-xs font-medium text-emerald-700">{labels.verified}</p>
      ) : null}
      {state === "failed" ? (
        <p className="mt-3 text-xs font-medium text-red-700">{labels.failed}</p>
      ) : null}
      <button type="button" onClick={handleRefresh} className={`mt-3 text-xs ${AipifyShellClasses.link}`}>
        {labels.refresh}
      </button>
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
