"use client";

import type { ButtonHTMLAttributes } from "react";
import AipifyPulse from "@/components/branding/AipifyPulse";
import { COMPANION_LAUNCHER_ICON } from "@/lib/branding/companion-launcher-icon";
import { AIPIFY_BRAND } from "@/lib/branding/tokens";

export type AipifyCompanionLauncherIconProps = {
  size?: number;
  className?: string;
  withRing?: boolean;
  /** Mint availability ring — Companion is reachable, not integration online status. */
  availabilityRing?: boolean;
  title?: string;
  ariaLabel?: string;
};

/** Canonical Companion launcher icon — purple connected-node mark with optional mint presence ring. */
export function AipifyCompanionLauncherIcon({
  size = 40,
  className = "",
  withRing = false,
  availabilityRing = false,
  title = "Aipify",
  ariaLabel = COMPANION_LAUNCHER_ICON.ariaLabel,
}: AipifyCompanionLauncherIconProps) {
  const showRing = availabilityRing || withRing;
  const symbolSize = Math.max(showRing ? size - 8 : size, 16);

  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      {showRing ? (
        <>
          <span
            className={`pointer-events-none absolute inset-0 rounded-full border-2 ${
              availabilityRing
                ? "border-emerald-400/80"
                : "border-violet-300/50 motion-safe:animate-[aipify-presence-ring_2.8s_ease-in-out_infinite]"
            }`}
            aria-hidden="true"
          />
          <span
            className={`pointer-events-none absolute inset-1 rounded-full ${
              availabilityRing ? "bg-emerald-400/12" : "bg-violet-400/10"
            }`}
            aria-hidden="true"
          />
        </>
      ) : null}
      <AipifyPulse
        size={symbolSize}
        variant="gradient"
        title={title}
        aria-label={ariaLabel}
        className="relative z-10 block shrink-0 text-aipify-companion"
      />
    </span>
  );
}

export function AipifyCompanionLauncherIconButton({
  size = 44,
  className = "",
  availabilityRing = true,
  ...props
}: AipifyCompanionLauncherIconProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center rounded-full transition hover:bg-violet-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-aipify-companion focus-visible:ring-offset-2 ${className}`}
      {...props}
    >
      <AipifyCompanionLauncherIcon
        size={size}
        availabilityRing={availabilityRing}
        ariaLabel={props["aria-label"] ?? COMPANION_LAUNCHER_ICON.ariaLabel}
      />
    </button>
  );
}

export const COMPANION_LAUNCHER_BRAND_COLOR = AIPIFY_BRAND.pulse.colors.gradientFrom;
