/**
 * Discrete Aipify decorative accent for hub/dashboard headers (job 63).
 * Never overlays interactive text — parent must be relative with content z-indexed above.
 */
export function AppDecorativeOrb({ className = "" }: { className?: string }) {
  return (
    <div
      className={`aipify-app-decorative-orb ${className}`.trim()}
      aria-hidden="true"
      data-app-visual-layer="decorative-orb"
    />
  );
}
