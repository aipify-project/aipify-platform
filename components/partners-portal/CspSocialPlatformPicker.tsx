"use client";

import { AtSign, Briefcase, Camera, Check, Ghost, Music2, Users, type LucideIcon } from "lucide-react";
import { CSP_SOCIAL_PLATFORMS, type CspSocialPlatform } from "@/lib/certified-sales-partner/social-share";

export type CspSocialPickerLabels = {
  legend: string;
  hint: string;
  selected: string;
  notSelected: string;
  /** platform id -> display name (platform names are not translated, but kept in i18n for consistency). */
  platforms: Record<CspSocialPlatform, string>;
};

/**
 * lucide-react v1 no longer ships brand glyphs and the repo has no approved brand SVGs, so each
 * card pairs a neutral lucide symbol with the platform NAME (always visible). No logos are invented;
 * swap in approved brand assets here when Brand provides them.
 */
const PLATFORM_ICONS: Record<CspSocialPlatform, LucideIcon> = {
  instagram: Camera,
  facebook: Users,
  x: AtSign,
  linkedin: Briefcase,
  tiktok: Music2,
  snapchat: Ghost,
};

/**
 * Multi-select visual platform picker (replaces a dropdown). Each card is a toggle button:
 * keyboard-operable (Tab, Space/Enter), selected = green outline + check icon + "Selected" text.
 */
export function CspSocialPlatformPicker({
  labels,
  value,
  onChange,
  disabled = false,
}: {
  labels: CspSocialPickerLabels;
  value: readonly CspSocialPlatform[];
  onChange: (next: CspSocialPlatform[]) => void;
  disabled?: boolean;
}) {
  const selected = new Set(value);

  function toggle(platform: CspSocialPlatform) {
    const next = new Set(selected);
    if (next.has(platform)) next.delete(platform);
    else next.add(platform);
    // Keep a stable, catalog-defined order regardless of click order.
    onChange(CSP_SOCIAL_PLATFORMS.filter((p) => next.has(p)));
  }

  return (
    <fieldset className="min-w-0" disabled={disabled}>
      <legend className="text-sm font-medium text-[color:var(--aipify-text-primary)]">{labels.legend}</legend>
      <p className="mt-1 text-xs text-[color:var(--aipify-text-secondary)]">{labels.hint}</p>
      <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        {CSP_SOCIAL_PLATFORMS.map((platform) => {
          const isSelected = selected.has(platform);
          const Icon = PLATFORM_ICONS[platform];
          return (
            <li key={platform}>
              <button
                type="button"
                aria-pressed={isSelected}
                onClick={() => toggle(platform)}
                className={`relative flex h-full w-full flex-col items-center gap-2 rounded-xl border-2 px-3 py-4 text-center text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--aipify-focus-ring)] focus-visible:ring-offset-2 disabled:opacity-60 ${
                  isSelected
                    ? "border-emerald-600 bg-emerald-50 text-emerald-900"
                    : "border-[color:var(--aipify-border)] bg-[color:var(--aipify-surface)] text-[color:var(--aipify-text-primary)] hover:border-[color:var(--aipify-border-strong)] hover:bg-[color:var(--aipify-surface-muted)]"
                }`}
              >
                {isSelected ? (
                  <span className="absolute right-2 top-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white">
                    <Check className="h-3.5 w-3.5" aria-hidden />
                  </span>
                ) : null}
                <Icon className="h-6 w-6" aria-hidden />
                <span>{labels.platforms[platform]}</span>
                <span className="text-xs font-medium text-[color:var(--aipify-text-secondary)]">
                  {isSelected ? labels.selected : labels.notSelected}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </fieldset>
  );
}
