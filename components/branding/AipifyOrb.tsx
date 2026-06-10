"use client";

import { AIPIFY_BRAND, type AipifyOrbSize, type AipifyOrbStatus } from "@/lib/branding/tokens";

type AipifyOrbProps = {
  size?: number | AipifyOrbSize;
  status?: AipifyOrbStatus;
  className?: string;
  title: string;
  "aria-label": string;
};

function resolveSize(size: number | AipifyOrbSize): number {
  return typeof size === "number" ? size : AIPIFY_BRAND.orb.sizes[size];
}

export default function AipifyOrb({
  size = "md",
  status = "online",
  className = "",
  title,
  "aria-label": ariaLabel,
}: AipifyOrbProps) {
  const dimension = resolveSize(size);
  const isThinking = status === "thinking";
  const isOffline = status === "offline";

  return (
    <div
      className={`relative inline-flex shrink-0 items-center justify-center ${className}`}
      style={{ width: dimension, height: dimension }}
      role="img"
      aria-label={ariaLabel}
    >
      <span
        className={`absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/50 to-violet-600/50 blur-md ${
          isThinking ? "animate-aipify-orb-glow" : ""
        }`}
        aria-hidden="true"
      />
      <span
        className={`relative block h-full w-full rounded-full bg-gradient-to-br from-blue-600 via-violet-600 to-violet-500 shadow-md ring-4 ring-white/80 ${
          isThinking ? "animate-aipify-orb-breathe" : isOffline ? "opacity-70" : ""
        }`}
        title={title}
        aria-hidden="true"
      />
      {status === "online" && (
        <span
          className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white"
          aria-hidden="true"
        />
      )}
      {status === "thinking" && (
        <span
          className="absolute inset-0 rounded-full ring-2 ring-violet-300/60 animate-aipify-orb-pulse-ring"
          aria-hidden="true"
        />
      )}
    </div>
  );
}
