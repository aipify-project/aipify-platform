/**
 * Explicit search classification for Platform.
 * Navigation search ≠ global entity search.
 */

export const PLATFORM_SEARCH_KINDS = ["navigation", "entity"] as const;
export type PlatformSearchKind = (typeof PLATFORM_SEARCH_KINDS)[number];

export type PlatformSearchSurface = {
  kind: PlatformSearchKind;
  labelKey: string;
  hintKey: string;
  delivered: boolean;
  gapKey?: string;
  implementation: string;
};

export const PLATFORM_SEARCH_SURFACES: PlatformSearchSurface[] = [
  {
    kind: "navigation",
    labelKey: "platform.controlPlane.search.navigationSearch",
    hintKey: "platform.controlPlane.search.navigationSearchHint",
    delivered: true,
    implementation: "lib/platform/nav-search.ts + shell command/nav index",
  },
  {
    kind: "entity",
    labelKey: "platform.controlPlane.search.entitySearch",
    hintKey: "platform.controlPlane.search.entitySearchPlanned",
    delivered: false,
    gapKey: "platform.controlPlane.search.entitySearchGap",
    implementation:
      "partial command-bar adapters only; not labeled as global entity search until permission-filtered coverage ships",
  },
];

export function isNavigationSearchLabel(label: string, navigationLabel: string): boolean {
  return label.trim().toLowerCase() === navigationLabel.trim().toLowerCase();
}
