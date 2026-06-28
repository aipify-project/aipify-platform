import type { CompanionChatMessage } from "@/lib/app/companion/types";
import { detectBookingResumeContinuationIntent } from "@/lib/companion-runtime/booking-resume-intent";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const NIL_UUID = "00000000-0000-0000-0000-000000000000";

export const SUPPORT_RESUME_SOURCE_ID = "support-resume" as const;
export const SUPPORT_PROPOSAL_SOURCE_ID = "support-proposal" as const;
/** Structured terminal marker on successful support-resume answers — never infer from text. */
export const SUPPORT_RESUME_TERMINAL_CONSUMED_SOURCE_META = "terminal_consumed" as const;

const SUPPORT_BUSINESS_SOURCE_IDS = new Set<string>([
  SUPPORT_PROPOSAL_SOURCE_ID,
  SUPPORT_RESUME_SOURCE_ID,
  "booking-proposal",
  "booking-resume",
]);

export type PendingSupportWriteState = {
  actionRequestId: string;
};

export type PendingSupportWriteWire = {
  action_request_id: string;
};

export type ResolvePendingSupportWritePointerOptions = {
  resumeContinuationQuery?: string | null;
};

type CompanionChatMessageWithPendingSupport = CompanionChatMessage & {
  pendingSupportWrite?: PendingSupportWriteState | null;
};

function normalizeActionRequestId(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed || !UUID_REGEX.test(trimmed) || trimmed.toLowerCase() === NIL_UUID) {
    return null;
  }
  return trimmed;
}

export function normalizePendingSupportWrite(value: unknown): PendingSupportWriteWire | null {
  if (value == null) {
    return null;
  }
  if (typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const actionRequestId = normalizeActionRequestId(
    (value as Record<string, unknown>).action_request_id,
  );
  if (!actionRequestId) {
    return null;
  }

  return { action_request_id: actionRequestId };
}

export function serializePendingSupportWrite(
  state: PendingSupportWriteState,
): PendingSupportWriteWire {
  const actionRequestId = normalizeActionRequestId(state.actionRequestId);
  if (!actionRequestId) {
    throw new Error("Invalid pending support write state");
  }

  return { action_request_id: actionRequestId };
}

/** Accepts wire (snake_case) or platform answer (camelCase) shapes; fail-closed on invalid input. */
export function coercePendingSupportWrite(value: unknown): PendingSupportWriteState | null {
  const wire = normalizePendingSupportWrite(value);
  if (wire) {
    return { actionRequestId: wire.action_request_id };
  }

  if (value == null || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const actionRequestId = normalizeActionRequestId(
    (value as Record<string, unknown>).actionRequestId,
  );
  return actionRequestId ? { actionRequestId } : null;
}

function extractPendingSupportWritePointer(
  message: CompanionChatMessage,
): { actionRequestId: string } | null {
  const pendingSupportWrite = (message as CompanionChatMessageWithPendingSupport)
    .pendingSupportWrite;
  const actionRequestId = normalizeActionRequestId(pendingSupportWrite?.actionRequestId);
  return actionRequestId ? { actionRequestId } : null;
}

function findNewestAssistantIndex(messages: readonly CompanionChatMessage[]): number {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    if (messages[index]?.role === "aipify") {
      return index;
    }
  }
  return -1;
}

function isSupportBusinessAssistantTurn(message: CompanionChatMessage): boolean {
  const sourceId = message.sourceId?.trim();
  if (sourceId && SUPPORT_BUSINESS_SOURCE_IDS.has(sourceId)) {
    return true;
  }

  return extractPendingSupportWritePointer(message) !== null;
}

export function isReplayEligibleTerminalSupportResume(message: CompanionChatMessage): boolean {
  if (message.role !== "aipify") {
    return false;
  }

  if (message.sourceId !== SUPPORT_RESUME_SOURCE_ID) {
    return false;
  }

  if (extractPendingSupportWritePointer(message)) {
    return false;
  }

  const source = message.sources?.find((entry) => entry.id === SUPPORT_RESUME_SOURCE_ID);
  return source?.meta === SUPPORT_RESUME_TERMINAL_CONSUMED_SOURCE_META;
}

function findImmediateSupportResumeReplayPointer(
  messages: readonly CompanionChatMessage[],
  terminalIndex: number,
): { actionRequestId: string } | null {
  for (let index = terminalIndex + 1; index < messages.length; index += 1) {
    const message = messages[index];
    if (message.role === "user") {
      continue;
    }
    if (message.role === "aipify" && isSupportBusinessAssistantTurn(message)) {
      return null;
    }
  }

  for (let index = terminalIndex - 1; index >= 0; index -= 1) {
    const message = messages[index];
    if (message.role === "user") {
      continue;
    }
    if (message.role !== "aipify") {
      return null;
    }

    return extractPendingSupportWritePointer(message);
  }

  return null;
}

/**
 * Resolves the pending support write pointer from the current conversation.
 * Inspects the newest assistant message for a live pointer, then — only for
 * explicit resume continuation queries — one immediate terminal support-resume replay.
 */
export function resolvePendingSupportWritePointer(
  messages: readonly CompanionChatMessage[],
  options?: ResolvePendingSupportWritePointerOptions,
): { actionRequestId: string } | null {
  const newestAssistantIndex = findNewestAssistantIndex(messages);
  if (newestAssistantIndex === -1) {
    return null;
  }

  const newestAssistant = messages[newestAssistantIndex];
  const directPointer = extractPendingSupportWritePointer(newestAssistant);
  if (directPointer) {
    return directPointer;
  }

  const resumeQuery = options?.resumeContinuationQuery?.trim();
  if (!resumeQuery || !detectBookingResumeContinuationIntent(resumeQuery)) {
    return null;
  }

  if (!isReplayEligibleTerminalSupportResume(newestAssistant)) {
    return null;
  }

  return findImmediateSupportResumeReplayPointer(messages, newestAssistantIndex);
}
