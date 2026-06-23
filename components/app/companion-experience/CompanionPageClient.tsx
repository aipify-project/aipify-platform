"use client";

import { useSearchParams } from "next/navigation";
import { CompanionUnifiedSurface } from "./CompanionUnifiedSurface";
import type { CompanionExperienceLabels } from "@/lib/app/companion/types";

type CompanionPageClientProps = {
  labels: CompanionExperienceLabels;
  locale: string;
};

export function CompanionPageClient({ labels, locale }: CompanionPageClientProps) {
  const searchParams = useSearchParams();
  const conversationId = searchParams.get("conversation")?.trim() || undefined;

  return (
    <CompanionUnifiedSurface
      labels={labels}
      locale={locale}
      pathname="/app/companion"
      mode="fullpage"
      initialConversationId={conversationId}
      className="min-h-[calc(100vh-4rem)]"
    />
  );
}
