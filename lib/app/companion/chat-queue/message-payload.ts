import type { CompanionAssistantPayload } from "./types";
import type { CompanionChatMessage } from "../types";

export function serializeAssistantPayload(message: CompanionChatMessage): CompanionAssistantPayload {
  return {
    kind: "assistant_reply",
    directAnswer: message.directAnswer ?? message.content,
    explanation: message.explanation,
    integrationStatusCard: message.integrationStatusCard,
    platformSnapshotCard: message.platformSnapshotCard,
    steps: message.steps,
    ctas: message.ctas,
    sources: message.sources,
    question: message.question,
    sourceId: message.sourceId,
    confidence: message.confidence,
    showSupportEscalation: message.showSupportEscalation,
    orgConfirmEligible: message.orgConfirmEligible,
    orgConfirmBlockedReason: message.orgConfirmBlockedReason,
    liveIntegrationToolUsed: message.liveIntegrationToolUsed,
    requestedLiveIntegration: message.requestedLiveIntegration,
    attachments: message.attachments,
    activeArtifactId: message.activeArtifactId,
  };
}

export function deserializeAssistantMessage(
  serverId: string,
  clientId: string,
  content: string,
  payload: Record<string, unknown> | undefined,
  timestamp: number,
): CompanionChatMessage {
  if (payload?.kind === "assistant_reply") {
    const p = payload as CompanionAssistantPayload;
    return {
      id: clientId,
      role: "aipify",
      content: p.directAnswer ?? content,
      directAnswer: p.directAnswer ?? content,
      explanation: p.explanation,
      integrationStatusCard: p.integrationStatusCard,
      platformSnapshotCard: p.platformSnapshotCard,
      steps: p.steps,
      ctas: p.ctas,
      sources: p.sources,
      question: p.question,
      sourceId: p.sourceId,
      confidence: p.confidence,
      showSupportEscalation: p.showSupportEscalation,
      orgConfirmEligible: p.orgConfirmEligible,
      orgConfirmBlockedReason: p.orgConfirmBlockedReason,
      liveIntegrationToolUsed: p.liveIntegrationToolUsed,
      requestedLiveIntegration: p.requestedLiveIntegration,
      responseToMessageId:
        typeof p.response_to_message_id === "string" ? p.response_to_message_id : null,
      queueId: typeof p.queue_id === "string" ? p.queue_id : null,
      requestId: typeof p.request_id === "string" ? p.request_id : null,
      timestamp,
    };
  }

  return {
    id: clientId,
    role: "aipify",
    content,
    directAnswer: content,
    timestamp,
  };
}

export function deserializeUserMessage(
  clientId: string,
  content: string,
  payload: Record<string, unknown> | undefined,
  timestamp: number,
): CompanionChatMessage {
  const attachments = Array.isArray(payload?.attachments)
    ? (payload.attachments as CompanionChatMessage["attachments"])
    : undefined;
  const activeArtifactId =
    typeof payload?.activeArtifactId === "string" ? payload.activeArtifactId : null;

  return {
    id: clientId,
    role: "user",
    content,
    attachments,
    activeArtifactId,
    timestamp,
  };
}

export function mapServerMessagesToChat(messages: Array<{
  id: string;
  server_id?: string;
  role: string;
  content: string;
  payload?: Record<string, unknown>;
  timestamp?: number;
  feedback_type?: "helpful" | "not_helpful" | "org_confirm" | null;
}>): CompanionChatMessage[] {
  return messages.map((message) => {
    const timestamp = message.timestamp ?? Date.now();
    const feedback =
      message.feedback_type === "helpful" ||
      message.feedback_type === "not_helpful" ||
      message.feedback_type === "org_confirm"
        ? message.feedback_type
        : undefined;

    if (message.role === "user") {
      return deserializeUserMessage(message.id, message.content, message.payload, timestamp);
    }

    const chatMessage = deserializeAssistantMessage(
      message.server_id ?? message.id,
      message.id,
      message.content,
      message.payload,
      timestamp,
    );
    const withServerId = { ...chatMessage, serverId: message.server_id ?? null };
    return feedback ? { ...withServerId, feedback } : withServerId;
  });
}
