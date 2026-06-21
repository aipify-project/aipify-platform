"use client";

import type { ButtonHTMLAttributes } from "react";
import AipifyPulse from "@/components/branding/AipifyPulse";
import { AIPIFY_BRAND } from "@/lib/branding/tokens";

type CompanionIconProps = {
  size?: number;
  className?: string;
  withRing?: boolean;
  title?: string;
  ariaLabel?: string;
};

/** Companion icon V1 — Aipify pulse mark with optional subtle ring. */
export function CompanionIcon({
  size = 40,
  className = "",
  withRing = false,
  title = "Aipify",
  ariaLabel = "Aipify Companion",
}: CompanionIconProps) {
  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      {withRing ? (
        <>
          <span
            className="pointer-events-none absolute inset-0 rounded-full border border-violet-300/50 motion-safe:animate-[aipify-presence-ring_2.8s_ease-in-out_infinite]"
            aria-hidden="true"
          />
          <span
            className="pointer-events-none absolute inset-1 rounded-full bg-violet-400/10"
            aria-hidden="true"
          />
        </>
      ) : null}
      <AipifyPulse
        size={size - (withRing ? 8 : 0)}
        variant="gradient"
        title={title}
        aria-label={ariaLabel}
        className="relative z-10 text-aipify-companion"
      />
    </span>
  );
}

export function CompanionIconButton({
  size = 44,
  className = "",
  ...props
}: CompanionIconProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center rounded-full transition hover:bg-violet-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-aipify-companion focus-visible:ring-offset-2 ${className}`}
      {...props}
    >
      <CompanionIcon size={size} withRing ariaLabel={props["aria-label"] ?? "Aipify Companion"} />
    </button>
  );
}

export const COMPANION_BRAND_COLOR = AIPIFY_BRAND.pulse.colors.gradientFrom;
