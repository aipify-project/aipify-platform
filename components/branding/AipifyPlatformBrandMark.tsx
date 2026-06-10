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
      className="relative border-t border-gray-100 px-5 py-4"
      tabIndex={0}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      <div
        className="flex items-center gap-3 text-violet-700 transition-opacity duration-200"
        style={{
          opacity: hovered
            ? AIPIFY_BRAND.pulse.hoverOpacity
            : AIPIFY_BRAND.pulse.defaultOpacity,
        }}
        aria-hidden={false}
      >
        <AipifyPulse
          size="sm"
          variant="mono"
          title={pulseLabel}
          aria-label={pulseLabel}
          className="text-violet-600"
        />
        <div className="min-w-0">
          <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-gray-400">
            {poweredBy}
          </p>
          <p className="text-sm font-semibold tracking-tight text-gray-700">{appName}</p>
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
