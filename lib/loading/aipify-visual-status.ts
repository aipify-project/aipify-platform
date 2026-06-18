/**
 * Aipify visual status standard — emoji indicators, not colored dots.
 */

export type AipifyVisualStatus = "waiting" | "complete" | "attention" | "info";

export type AipifyVisualStatusDefinition = {
  symbol: string;
  label: string;
  ariaLabel: string;
};

export const AIPIFY_VISUAL_STATUS: Record<AipifyVisualStatus, AipifyVisualStatusDefinition> = {
  waiting: {
    symbol: "⏳",
    label: "Waiting",
    ariaLabel: "Waiting",
  },
  complete: {
    symbol: "✅",
    label: "Complete",
    ariaLabel: "Complete",
  },
  attention: {
    symbol: "⚠️",
    label: "Requires attention",
    ariaLabel: "Requires attention",
  },
  info: {
    symbol: "ℹ️",
    label: "Information",
    ariaLabel: "Information",
  },
};

export const AIPIFY_LOADING_PRESETS = {
  workspace: "Aipify is preparing your workspace…",
  loading: "Loading Aipify…",
  working: "Aipify is working…",
} as const;

export type AipifyLoadingPreset = keyof typeof AIPIFY_LOADING_PRESETS;

export function getAipifyVisualStatus(status: AipifyVisualStatus): AipifyVisualStatusDefinition {
  return AIPIFY_VISUAL_STATUS[status];
}

export function resolveAipifyLoadingMessage(
  message?: string,
  preset: AipifyLoadingPreset = "workspace",
): string {
  const trimmed = message?.trim();
  if (trimmed) return trimmed;
  return AIPIFY_LOADING_PRESETS[preset];
}
