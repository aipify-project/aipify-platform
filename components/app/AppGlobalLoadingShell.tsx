"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";

type AppGlobalLoadingShellProps = {
  message: string;
};

/** Canonical APP global loading — Companion logo + one discreet localized line. */
export function AppGlobalLoadingShell({ message }: AppGlobalLoadingShellProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-aipify-canvas">
      <AipifyLoadingState
        message={message}
        showStatusIndicator={false}
        fullPage
        centered
      />
    </div>
  );
}
