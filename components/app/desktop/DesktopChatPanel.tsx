"use client";

import { CompanionUnifiedSurface } from "@/components/app/companion-experience/CompanionUnifiedSurface";
import type { CompanionExperienceLabels } from "@/lib/app/companion/types";

type DesktopChatPanelProps = {
  labels: CompanionExperienceLabels;
  locale: string;
  pathname?: string;
  initialConversationId?: string;
  enabled?: boolean;
};

/** Desktop workspace chat — same persistent queue as drawer and full-page Companion. */
export function DesktopChatPanel({
  labels,
  locale,
  pathname = "/app/desktop/companion",
  initialConversationId,
  enabled = true,
}: DesktopChatPanelProps) {
  if (!enabled) {
    return (
      <section className="rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-500">
        {labels.sessionConversationUnavailable}
      </section>
    );
  }

  return (
    <section className="flex min-h-[420px] flex-col overflow-hidden rounded-lg border border-gray-200 bg-white">
      <CompanionUnifiedSurface
        labels={labels}
        locale={locale}
        pathname={pathname}
        mode="fullpage"
        initialConversationId={initialConversationId}
        panelVisible={enabled}
        className="min-h-[420px]"
      />
    </section>
  );
}
