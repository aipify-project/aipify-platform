import type { CompanionChatMessage } from "@/lib/app/companion/types";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const NIL_UUID = "00000000-0000-0000-0000-000000000000";

export type PendingSupportWriteState = {
  actionRequestId: string;
};

export type PendingSupportWriteWire = {
  action_request_id: string;
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

/**
 * Resolves the pending support write pointer from the current conversation.
 * Inspects only the newest assistant message — never older assistants or message text.
 */
export function resolvePendingSupportWritePointer(
  messages: readonly CompanionChatMessage[],
): { actionRequestId: string } | null {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const message = messages[index];
    if (message.role !== "aipify") {
      continue;
    }

    const pendingSupportWrite = (message as CompanionChatMessageWithPendingSupport)
      .pendingSupportWrite;
    const actionRequestId = normalizeActionRequestId(pendingSupportWrite?.actionRequestId);
    return actionRequestId ? { actionRequestId } : null;
  }

  return null;
}
