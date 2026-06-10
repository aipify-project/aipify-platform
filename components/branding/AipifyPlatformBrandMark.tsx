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
  pulseLabel,
}: AipifyPlatformBrandMarkProps) {
  const [hovered, setHovered] = useState(false);
  const { sidebarMark } = AIPIFY_BRAND;

  return (
    <div
      className="relative shrink-0 px-5 pb-5 pt-3"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-hidden="true"
    >
      <div
        className="flex items-center gap-2.5 transition-opacity duration-300 ease-out"
        style={{
          opacity: hovered ? sidebarMark.textHoverOpacity : sidebarMark.textOpacity,
        }}
      >
        <AipifyPulse
          size={sidebarMark.pulseSize}
          variant="mono"
          opacity={hovered ? sidebarMark.pulseHoverOpacity : sidebarMark.pulseOpacity}
          title={pulseLabel}
          aria-label={pulseLabel}
          className="shrink-0 text-violet-600/80"
        />
        <div className="min-w-0 leading-tight">
          <p className="text-[11px] font-normal text-gray-500">{poweredBy}</p>
          <p className="text-xs font-medium tracking-tight text-gray-600">{appName}</p>
        </div>
      </div>

      {hovered && (
        <div
          role="tooltip"
          className="pointer-events-none absolute bottom-full left-5 z-20 mb-2 w-48 rounded-lg border border-gray-100 bg-white/95 px-3 py-2 text-left shadow-sm backdrop-blur-sm"
        >
          <p className="text-xs font-medium text-gray-800">{tooltipTitle}</p>
          <p className="mt-0.5 text-xs leading-relaxed text-gray-500">{tooltipTagline}</p>
        </div>
      )}
    </div>
  );
}
