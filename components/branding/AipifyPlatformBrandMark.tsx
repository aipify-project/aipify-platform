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
  const { sidebarMark } = AIPIFY_BRAND;
  const tooltipId = "aipify-sidebar-brand-tooltip";

  return (
    <div
      className="relative shrink-0 cursor-default overflow-visible px-5 pb-2 pt-2 mb-6"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-describedby={hovered ? tooltipId : undefined}
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

      <div
        id={tooltipId}
        role="tooltip"
        aria-hidden={!hovered}
        className={`pointer-events-none absolute bottom-full left-5 z-50 mb-2 w-52 rounded-lg border border-gray-100 bg-white/95 px-3 py-2.5 text-left shadow-md backdrop-blur-sm transition-all duration-200 ease-out ${
          hovered
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-1 opacity-0"
        }`}
      >
        <p className="text-xs font-medium text-gray-800">{tooltipTitle}</p>
        <p className="mt-0.5 text-xs leading-relaxed text-gray-500">{tooltipTagline}</p>
        <p className="mt-1.5 text-[11px] text-gray-400">{versionLabel}</p>
      </div>
    </div>
  );
}
