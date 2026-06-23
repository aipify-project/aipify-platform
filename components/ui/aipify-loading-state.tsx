"use client";

import AipifyPulse from "@/components/branding/AipifyPulse";
import {
  AIPIFY_LOADER_ANIMATION_SIZE,
} from "@/lib/loading/aipify-loader-assets";
import {
  getAipifyVisualStatus,
  resolveAipifyLoadingMessage,
  type AipifyLoadingPreset,
  type AipifyVisualStatus,
} from "@/lib/loading/aipify-visual-status";

type LoaderSize = keyof typeof AIPIFY_LOADER_ANIMATION_SIZE;

export type AipifyLoadingStateProps = {
  /** Visible message below the Companion icon */
  message?: string;
  /** Default copy when message is omitted */
  preset?: AipifyLoadingPreset;
  status?: AipifyVisualStatus;
  /** Soft green verification flash while work is in progress */
  showActivePulse?: boolean;
  /** Show emoji status row above the message */
  showStatusIndicator?: boolean;
  /** Override localized status caption (emoji row) */
  statusLabel?: string;
  size?: LoaderSize;
  centered?: boolean;
  fullPage?: boolean;
  className?: string;
};

export function AipifyLoadingState({
  message,
  preset = "workspace",
  status = "waiting",
  showActivePulse = true,
  showStatusIndicator = false,
  statusLabel,
  size = "md",
  centered = true,
  fullPage = false,
  className = "",
}: AipifyLoadingStateProps) {
  const dimension = AIPIFY_LOADER_ANIMATION_SIZE[size];
  const resolvedMessage = resolveAipifyLoadingMessage(message, preset);
  const statusVisual = getAipifyVisualStatus(status);

  const containerClasses = [
    "w-full bg-aipify-surface/90",
    fullPage ? "min-h-[calc(100vh-10rem)]" : "min-h-[240px]",
    centered ? "flex flex-col items-center justify-center text-center" : "",
    "py-12",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={containerClasses} role="status" aria-live="polite" aria-busy="true">
      <div
        className="relative flex shrink-0 items-center justify-center motion-reduce:animate-none"
        style={{ width: dimension + 32, height: dimension + 32 }}
        aria-hidden="true"
      >
        <span
          className="pointer-events-none absolute inset-0 rounded-full border border-violet-300/45 motion-safe:animate-[aipify-presence-ring_2.8s_ease-in-out_infinite]"
          aria-hidden="true"
        />
        <span
          className="pointer-events-none absolute inset-3 rounded-full bg-violet-400/15 motion-safe:animate-[aipify-loader-glow_2.4s_ease-in-out_infinite]"
          aria-hidden="true"
        />
        {showActivePulse ? (
          <span
            className="pointer-events-none absolute inset-1 rounded-full motion-safe:animate-[aipify-verify-flash_3.2s_ease-in-out_infinite]"
            aria-hidden="true"
          />
        ) : null}
        <AipifyPulse
          size={dimension}
          variant="gradient"
          opacity={0.96}
          title={resolvedMessage}
          aria-label={resolvedMessage}
          className="relative z-10 text-violet-600 motion-safe:animate-[aipify-loader-pulse_2.4s_ease-in-out_infinite]"
        />
      </div>

      {showStatusIndicator ? (
        <p className="mt-6 flex items-center justify-center gap-2 text-xs font-medium tracking-wide text-aipify-text-secondary">
          <span aria-hidden="true">{statusVisual.symbol}</span>
          <span>{statusLabel ?? statusVisual.label}</span>
        </p>
      ) : null}

      <p className="mt-5 max-w-xs text-xs font-normal tracking-wide text-aipify-text-secondary">
        {resolvedMessage}
      </p>
    </div>
  );
}
