import type { SupabaseClient } from "@supabase/supabase-js";
import { executeCompanionTurnToPayload } from "./execute-turn";
import { notifyCompanionReplyReady } from "./notify-complete";

export type ProcessCompanionQueueOptions = {
  maxItems?: number;
  companionActive?: boolean;
  cookieHeader?: string | null;
  origin?: string;
};

type QueueRow = {
  id: string;
  conversation_id: string;
  question_text: string;
  attachment_ids: string[];
  active_artifact_id: string | null;
  locale: string | null;
  pathname: string | null;
  platform_active_modules: string | null;
};

function parseAttachmentIds(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.map(String).filter(Boolean);
}

export async function processCompanionQueueForConversation(
  supabase: SupabaseClient,
  conversationId: string,
  options: ProcessCompanionQueueOptions = {},
): Promise<{ processed: number; hasMore: boolean }> {
  const maxItems = options.maxItems ?? 5;
  let processed = 0;

  for (let i = 0; i < maxItems; i += 1) {
    const { data: claimRaw, error: claimError } = await supabase.rpc("claim_companion_queue_item", {
      p_conversation_id: conversationId,
    });

    if (claimError || !claimRaw?.ok) {
      break;
    }

    const queue = claimRaw.queue as QueueRow | undefined;
    if (!queue?.id) break;

    processed += 1;

    try {
      const platformModules = queue.platform_active_modules
        ? queue.platform_active_modules.split(",").map((entry) => entry.trim()).filter(Boolean)
        : undefined;

      const turn = await executeCompanionTurnToPayload(supabase, {
        query: queue.question_text,
        locale: queue.locale ?? "en",
        conversationId: queue.conversation_id,
        activeArtifactId: queue.active_artifact_id,
        attachmentIds: parseAttachmentIds(queue.attachment_ids),
        platformActiveModules: platformModules,
      });

      if (!turn.ok) {
        await supabase.rpc("fail_companion_queue_item", {
          p_queue_id: queue.id,
          p_error_message: turn.error,
          p_error_code: turn.code ?? "turn_failed",
        });
        continue;
      }

      const { data: completeRaw, error: completeError } = await supabase.rpc(
        "complete_companion_queue_item",
        {
          p_queue_id: queue.id,
          p_assistant_content: turn.assistantContent,
          p_assistant_payload: turn.assistantPayload,
        },
      );

      if (completeError || !completeRaw?.ok) {
        await supabase.rpc("fail_companion_queue_item", {
          p_queue_id: queue.id,
          p_error_message: completeError?.message ?? "complete_failed",
          p_error_code: "complete_failed",
        });
        continue;
      }

      if (options.companionActive !== true) {
        await notifyCompanionReplyReady(supabase, {
          conversationId: queue.conversation_id,
          question: queue.question_text,
          locale: queue.locale ?? "en",
        });
      }
    } catch (error) {
      await supabase.rpc("fail_companion_queue_item", {
        p_queue_id: queue.id,
        p_error_message: error instanceof Error ? error.message : "unexpected_error",
        p_error_code: "unexpected_error",
      });
    }
  }

  const { data: stateRaw } = await supabase.rpc("get_companion_chat_state", {
    p_conversation_id: conversationId,
  });

  const queue = Array.isArray(stateRaw?.queue) ? stateRaw.queue : [];
  const hasMore = queue.some(
    (item: { status?: string }) => item.status === "waiting" || item.status === "processing",
  );

  return { processed, hasMore };
}

export function scheduleCompanionQueueProcessing(
  conversationId: string,
  options: ProcessCompanionQueueOptions = {},
): void {
  const origin = options.origin ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const url = new URL("/api/aipify/companion/chat/process", origin);
  url.searchParams.set("conversation_id", conversationId);
  if (options.companionActive === true) {
    url.searchParams.set("companion_active", "true");
  }

  void fetch(url.toString(), {
    method: "POST",
    headers: {
      ...(options.cookieHeader ? { cookie: options.cookieHeader } : {}),
      "content-type": "application/json",
    },
    body: JSON.stringify({ conversation_id: conversationId }),
  }).catch(() => {
    /* client poll is fallback */
  });
}
