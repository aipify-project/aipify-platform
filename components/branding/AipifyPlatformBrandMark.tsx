"use client";

import { useState } from "react";
import { AIPIFY_BRAND } from "@/lib/branding/tokens";
import AipifyPulse from "./AipifyPulse";

type AipifyPlatformBrandMarkProps = {
  appName: string;
  poweredBy: string;
  tooltipTitle: string;
  tooltipTagline: string;
  versionLabel: string;
  pulseLabel: string;
};

export default function AipifyPlatformBrandMark({
  appName,
  poweredBy,
  tooltipTitle,
  tooltipTagline,
  versionLabel,
  pulseLabel,
}: AipifyPlatformBrandMarkProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative mx-3 mb-3 rounded-2xl border border-violet-100/80 bg-gradient-to-br from-violet-50/50 to-white px-4 py-3.5"
      tabIndex={0}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      <div
        className="flex items-center gap-3 text-violet-700 transition-all duration-200"
        style={{
          opacity: hovered
            ? AIPIFY_BRAND.pulse.hoverOpacity
            : AIPIFY_BRAND.pulse.defaultOpacity,
        }}
        aria-hidden={false}
      >
        <AipifyPulse
          size="md"
          variant="gradient"
          title={pulseLabel}
          aria-label={pulseLabel}
          className="text-violet-600"
        />
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-violet-500/80">
            {poweredBy}
          </p>
          <p className="text-sm font-semibold tracking-tight text-gray-800">{appName}</p>
        </div>
      </div>

      {hovered && (
        <div
          role="tooltip"
          className="absolute bottom-full left-5 z-20 mb-2 w-52 rounded-xl border border-violet-100 bg-white px-3 py-2.5 text-left shadow-lg"
        >
          <p className="text-xs font-semibold text-gray-900">{tooltipTitle}</p>
          <p className="mt-1 text-xs leading-relaxed text-gray-500">{tooltipTagline}</p>
          <p className="mt-2 text-[10px] font-medium uppercase tracking-wide text-gray-400">
            {versionLabel}
          </p>
        </div>
      )}
    </div>
  );
}
