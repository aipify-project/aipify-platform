"use client";

import { MessageCircle } from "lucide-react";

type CompanionUserMessageIdentityIconProps = {
  size?: number;
  className?: string;
  ariaLabel: string;
};

/** Neutral speech-bubble identity marker — not Aipify branding, not feedback/thumb. */
export function CompanionUserMessageIdentityIcon({
  size = 28,
  className = "",
  ariaLabel,
}: CompanionUserMessageIdentityIconProps) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full border border-aipify-border bg-aipify-surface-muted text-aipify-text-secondary ${className}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label={ariaLabel}
    >
      <MessageCircle size={Math.max(size - 12, 14)} strokeWidth={2} aria-hidden="true" />
    </span>
  );
}
