/**
 * Layer 1 — viewport canvas decoration for Customer APP shell (job 63).
 * Pure CSS / SVG; no layout shift; pointer-events none.
 */
export function AppCanvasBackground() {
  return (
    <div className="aipify-app-canvas-layer" aria-hidden="true" data-app-visual-layer="canvas" />
  );
}
