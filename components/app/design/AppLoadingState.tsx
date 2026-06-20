"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";

type AppLoadingStateProps = {
  message: string;
  className?: string;
};

export function AppLoadingState({ message, className = "" }: AppLoadingStateProps) {
  return (
    <AipifyLoadingState
      message={message}
      preset="workspace"
      centered
      fullPage={false}
      className={`min-h-[360px] rounded-2xl border border-aipify-border bg-aipify-surface/80 ${className}`}
    />
  );
}
