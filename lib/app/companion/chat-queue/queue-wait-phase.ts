import type { CompanionQueueStatus } from "./types";
import {
  COMPANION_QUEUE_UI_LONG_WAIT_MS,
  COMPANION_QUEUE_UI_TIMEOUT_MS,
  COMPANION_QUEUE_UI_WORKING_MS,
} from "./worker-config";

export type CompanionQueueWaitPhase = "initial" | "working" | "long_wait" | "timeout";

export function resolveCompanionQueueWaitPhase(input: {
  status: CompanionQueueStatus;
  createdAt: string | null;
  startedAt?: string | null;
  now?: number;
}): CompanionQueueWaitPhase {
  if (input.status !== "waiting" && input.status !== "processing") {
    return "initial";
  }

  const now = input.now ?? Date.now();
  const anchorMs =
    input.status === "processing" && input.startedAt
      ? new Date(input.startedAt).getTime()
      : input.createdAt
        ? new Date(input.createdAt).getTime()
        : now;

  const elapsed = Math.max(0, now - anchorMs);
  if (elapsed >= COMPANION_QUEUE_UI_TIMEOUT_MS) return "timeout";
  if (elapsed >= COMPANION_QUEUE_UI_LONG_WAIT_MS) return "long_wait";
  if (elapsed >= COMPANION_QUEUE_UI_WORKING_MS) return "working";
  return "initial";
}
