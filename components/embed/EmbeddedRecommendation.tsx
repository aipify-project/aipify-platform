import { AipifyEmbedShell } from "./AipifyEmbedShell";

/** Layer 3 embedded recommendations panel scaffold. */
export function EmbeddedRecommendation() {
  return (
    <AipifyEmbedShell title="Recommendations">
      <p className="text-sm text-muted-foreground">
        Safe, approved recommendations for this installation will appear here.
      </p>
    </AipifyEmbedShell>
  );
}
