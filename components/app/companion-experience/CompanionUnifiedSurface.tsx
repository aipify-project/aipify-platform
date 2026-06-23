"use client";

import { CompanionPanel } from "./CompanionPanel";
import type { CompanionExperienceLabels } from "@/lib/app/companion/types";

type CompanionUnifiedSurfaceProps = {
  labels: CompanionExperienceLabels;
  locale: string;
  pathname: string;
  mode: "drawer" | "fullpage";
  initialConversationId?: string;
  initialQuery?: string;
  onClose?: () => void;
  panelVisible?: boolean;
  className?: string;
};

/** Shared Companion composer + history for drawer, full page, desktop, and mobile. */
export function CompanionUnifiedSurface({
  className = "",
  panelVisible = true,
  ...panelProps
}: CompanionUnifiedSurfaceProps) {
  return (
    <div className={`flex min-h-0 flex-col ${className}`.trim()}>
      <CompanionPanel {...panelProps} panelVisible={panelVisible} />
    </div>
  );
}
