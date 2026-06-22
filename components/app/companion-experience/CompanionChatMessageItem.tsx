"use client";

import type { CompanionChatMessage, CompanionExperienceLabels } from "@/lib/app/companion/types";
import { isCompanionUserMessageCardV1Enabled } from "@/lib/app/companion/companion-user-message-policy";
import { CompanionAssistantMessageCard } from "./CompanionAssistantMessageCard";
import { CompanionUserMessageCard } from "./CompanionUserMessageCard";

type CompanionChatMessageItemProps = {
  msg: CompanionChatMessage;
  labels: CompanionExperienceLabels;
  spacious?: boolean;
  conversationId: string;
  locale: string;
  pathname: string;
  canConfirmOrg: boolean;
  userMessageCardV1?: boolean;
  onMessageFeedback?: (
    messageId: string,
    feedback: Exclude<CompanionChatMessage["feedback"], null | undefined>,
  ) => void;
  onEscalate?: () => void;
};

function LegacyCompanionUserMessage({ content }: { content: string }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[85%] rounded-2xl rounded-br-md bg-slate-100 px-4 py-3 text-sm text-aipify-text">
        {content}
      </div>
    </div>
  );
}

/** Lowest shared Companion message renderer — user, assistant (aipify), and optional system variants. */
export function CompanionChatMessageItem({
  msg,
  labels,
  spacious,
  conversationId,
  locale,
  pathname,
  canConfirmOrg,
  userMessageCardV1,
  onMessageFeedback,
  onEscalate,
}: CompanionChatMessageItemProps) {
  const useUserCard =
    userMessageCardV1 ?? isCompanionUserMessageCardV1Enabled();

  if (msg.role === "user") {
    if (useUserCard) {
      return (
        <CompanionUserMessageCard
          messageId={msg.id}
          content={msg.content}
          labels={labels}
          spacious={spacious}
        />
      );
    }
    return <LegacyCompanionUserMessage content={msg.content} />;
  }

  return (
    <CompanionAssistantMessageCard
      msg={msg}
      labels={labels}
      spacious={spacious}
      conversationId={conversationId}
      locale={locale}
      pathname={pathname}
      canConfirmOrg={canConfirmOrg}
      onMessageFeedback={onMessageFeedback}
      onEscalate={onEscalate}
    />
  );
}
