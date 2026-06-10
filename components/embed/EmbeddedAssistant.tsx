"use client";

import { AipifyEmbedShell } from "./AipifyEmbedShell";

type EmbeddedAssistantProps = {
  installationToken?: string;
};

/** Layer 3 embedded assistant widget scaffold. */
export function EmbeddedAssistant({ installationToken }: EmbeddedAssistantProps) {
  return (
    <AipifyEmbedShell title="Ask Aipify">
      <p className="text-sm text-muted-foreground">
        Embedded assistant will connect to{" "}
        <code className="text-xs">/api/embed/assistant</code> once installation
        auth is wired.
      </p>
      {installationToken ? (
        <p className="mt-2 text-xs text-muted-foreground">Installation linked.</p>
      ) : null}
    </AipifyEmbedShell>
  );
}
