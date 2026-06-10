import type { ReactNode } from "react";

type AipifyEmbedShellProps = {
  children: ReactNode;
  title?: string;
};

/** Minimal chrome for Layer 3 embedded Aipify (customer admin / website). */
export function AipifyEmbedShell({
  children,
  title = "Aipify",
}: AipifyEmbedShellProps) {
  return (
    <div className="flex min-h-0 flex-col rounded-lg border border-border bg-background text-foreground shadow-sm">
      <header className="border-b border-border px-3 py-2 text-sm font-medium">
        {title}
      </header>
      <div className="flex-1 overflow-auto p-3">{children}</div>
    </div>
  );
}
