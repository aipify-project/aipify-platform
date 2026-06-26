import type { CompanionChatMessage } from "@/lib/app/companion/types";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const NIL_UUID = "00000000-0000-0000-0000-000000000000";

function normalizeActionRequestId(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed || !UUID_REGEX.test(trimmed) || trimmed.toLowerCase() === NIL_UUID) {
    return null;
  }

  return trimmed;
}

/**
 * Resolves the pending booking write pointer from the current conversation.
 * Inspects only the newest assistant message — never older assistants or message text.
 */
export function resolvePendingBookingWritePointer(
  messages: readonly CompanionChatMessage[],
): { actionRequestId: string } | null {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const message = messages[index];
    if (message.role !== "aipify") {
      continue;
    }

    const actionRequestId = normalizeActionRequestId(message.pendingBookingWrite?.actionRequestId);
    return actionRequestId ? { actionRequestId } : null;
  }

  return null;
}
