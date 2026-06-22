"use client";

import { useId } from "react";
import { AIPIFY_BRAND, type AipifyPulseSize } from "@/lib/branding/tokens";

type AipifyPulseProps = {
  size?: number | AipifyPulseSize;
  variant?: "mono" | "gradient";
  className?: string;
  opacity?: number;
  title: string;
  "aria-label": string;
};

function resolveSize(size: number | AipifyPulseSize): number {
  return typeof size === "number" ? size : AIPIFY_BRAND.pulse.sizes[size];
}

export default function AipifyPulse({
  size = "md",
  variant = "mono",
  className = "",
  opacity = 1,
  title,
  "aria-label": ariaLabel,
}: AipifyPulseProps) {
  const instanceId = useId().replace(/:/g, "");
  const dimension = resolveSize(size);
  const gradientId = `aipify-pulse-gradient-${instanceId}-${dimension}-${variant}`;

  return (
    <svg
      width={dimension}
      height={dimension}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={ariaLabel}
      className={className}
      style={{ opacity }}
    >
      <title>{title}</title>
      {variant === "gradient" && (
        <defs>
          <linearGradient id={gradientId} x1="8" y1="6" x2="32" y2="34" gradientUnits="userSpaceOnUse">
            <stop stopColor={AIPIFY_BRAND.pulse.colors.gradientFrom} />
            <stop offset="1" stopColor={AIPIFY_BRAND.pulse.colors.gradientTo} />
          </linearGradient>
        </defs>
      )}
      <g
        stroke={variant === "gradient" ? `url(#${gradientId})` : "currentColor"}
        strokeWidth="1.6"
        strokeLinecap="round"
      >
        <path d="M20 11 L11.5 29.5" />
        <path d="M20 11 L28.5 29.5" />
      </g>
      <circle
        cx="20"
        cy="11"
        r="4.8"
        fill={variant === "gradient" ? `url(#${gradientId})` : "currentColor"}
      />
      <rect
        x="7.2"
        y="26.2"
        width="8.6"
        height="8.6"
        rx="2.2"
        transform="rotate(45 11.5 30.5)"
        fill={variant === "gradient" ? `url(#${gradientId})` : "currentColor"}
        fillOpacity={variant === "gradient" ? 1 : 0.88}
      />
      <rect
        x="24.2"
        y="26.2"
        width="8.6"
        height="8.6"
        rx="2.2"
        transform="rotate(45 28.5 30.5)"
        fill={variant === "gradient" ? `url(#${gradientId})` : "currentColor"}
        fillOpacity={variant === "gradient" ? 1 : 0.88}
      />
    </svg>
  );
}
