import { AipifyEmbedShell } from "./AipifyEmbedShell";

/** Layer 3 compact presence indicator scaffold. */
export function EmbeddedPresence() {
  return (
    <AipifyEmbedShell title="Aipify Presence">
      <p className="text-sm text-muted-foreground">
        Embedded presence state will sync with the customer installation heartbeat.
      </p>
    </AipifyEmbedShell>
  );
}
