/**
 * Job 61 — panels rendered inside AppHubShell should not repeat page chrome
 * (narrow max-width, duplicate H1, back-to-settings links used as nav).
 */
export type EmbeddedPanelProps = {
  /** When true, omit page title/subtitle/back links and use full hub width. */
  embedded?: boolean;
};

export function panelFrameClass(embedded: boolean | undefined, narrowClass: string): string {
  return embedded ? "w-full space-y-6" : narrowClass;
}
