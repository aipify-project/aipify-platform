import { randomUUID } from "node:crypto";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import type { P1LiveE2eEnvConfig } from "./p1-01-live-app-e2e-env";
import {
  createP1IsolationSession,
  redactSecretsFromMessage,
  type P1LiveE2eAuthenticatedSession,
} from "./p1-01-live-app-e2e-session";
import type {
  PostP1AuditCheck,
  PostP1FlowResult,
} from "./post-p1-companion-production-readiness-types";

const SURFACE_PATHS = {
  drawer: "/app/command-center",
  fullpage: "/app/companion",
  desktop: "/app/desktop/companion",
  mobile: "/app/command-center",
} as const;

function flow(
  flow_id: string,
  capability: string,
  status: PostP1FlowResult["status"],
  options: {
    surface?: PostP1FlowResult["surface"];
    failure_reason?: string | null;
  } = {},
): PostP1FlowResult {
  return {
    flow_id,
    capability,
    surface: options.surface,
    status,
    failure_reason: options.failure_reason
      ? redactSecretsFromMessage(options.failure_reason)
      : null,
  };
}

function isolation(
  check_id: string,
  status: PostP1AuditCheck["status"],
  failure_reason: string | null = null,
): PostP1AuditCheck {
  return {
    check_id,
    status,
    failure_reason: failure_reason ? redactSecretsFromMessage(failure_reason) : null,
  };
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function triggerConversationProcess(
  config: P1LiveE2eEnvConfig,
  session: P1LiveE2eAuthenticatedSession,
  conversationId: string,
): Promise<void> {
  const baseUrl = config.baseUrl?.trim() ?? process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (!baseUrl) return;

  const projectRef = new URL(config.supabaseUrl).hostname.split(".")[0];
  const cookieName = `sb-${projectRef}-auth-token`;
  const cookieValue = encodeURIComponent(
    JSON.stringify({
      access_token: session.session.access_token,
      refresh_token: session.session.refresh_token,
      expires_at: session.session.expires_at,
      expires_in: session.session.expires_in,
      token_type: session.session.token_type,
    }),
  );

  await fetch(`${baseUrl.replace(/\/$/, "")}/api/aipify/companion/chat/process`, {
    method: "POST",
    headers: {
      Cookie: `${cookieName}=${cookieValue}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ conversation_id: conversationId }),
  }).catch(() => {
    /* process trigger is best-effort */
  });
}

async function triggerCronWorker(baseUrl: string): Promise<{ ok: boolean; reason: string | null }> {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) {
    return { ok: false, reason: "CRON_SECRET not configured" };
  }

  try {
    const response = await fetch(`${baseUrl.replace(/\/$/, "")}/api/cron/companion-queue-worker`, {
      method: "GET",
      headers: { authorization: `Bearer ${secret}` },
    });
    if (!response.ok) {
      return { ok: false, reason: `Cron worker returned ${response.status}` };
    }
    return { ok: true, reason: null };
  } catch (error) {
    return {
      ok: false,
      reason: redactSecretsFromMessage(
        error instanceof Error ? error.message : "Cron worker request failed",
      ),
    };
  }
}

async function enqueueQuestion(
  session: P1LiveE2eAuthenticatedSession,
  input: {
    conversationId: string;
    idempotencyKey: string;
    question: string;
    pathname: string;
    companionActive: boolean;
  },
): Promise<{ ok: boolean; reason: string | null }> {
  const { data, error } = await session.supabase.rpc("enqueue_companion_chat_message", {
    p_conversation_id: input.conversationId,
    p_idempotency_key: input.idempotencyKey,
    p_question_text: input.question,
    p_attachment_ids: [],
    p_active_artifact_id: null,
    p_attachment_summaries: [],
    p_locale: "en",
    p_pathname: input.pathname,
    p_platform_active_modules: null,
    p_user_client_message_id: input.idempotencyKey.split(":").pop() ?? null,
    p_title: input.question.slice(0, 120),
    p_companion_active: input.companionActive,
  });

  if (error) {
    return { ok: false, reason: redactSecretsFromMessage(error.message) };
  }
  if (data?.ok === false) {
    return { ok: false, reason: String(data.error ?? "enqueue_failed") };
  }
  return { ok: true, reason: null };
}

async function fetchChatState(session: P1LiveE2eAuthenticatedSession, conversationId: string) {
  const { data, error } = await session.supabase.rpc("get_companion_chat_state", {
    p_conversation_id: conversationId,
  });
  if (error) {
    return { ok: false as const, reason: redactSecretsFromMessage(error.message), data: null };
  }
  return { ok: true as const, reason: null, data: data as Record<string, unknown> };
}

async function pollUntilAssistantReply(
  session: P1LiveE2eAuthenticatedSession,
  config: P1LiveE2eEnvConfig,
  conversationId: string,
  maxMs = 120_000,
): Promise<{ ok: boolean; reason: string | null }> {
  const started = Date.now();
  const baseUrl = config.baseUrl?.trim() ?? process.env.NEXT_PUBLIC_APP_URL?.trim() ?? null;

  while (Date.now() - started < maxMs) {
    if (baseUrl) {
      await triggerCronWorker(baseUrl);
    }
    await triggerConversationProcess(config, session, conversationId);

    const state = await fetchChatState(session, conversationId);
    if (!state.ok || !state.data) {
      return { ok: false, reason: state.reason ?? "state_fetch_failed" };
    }

    const queue = Array.isArray(state.data.queue) ? state.data.queue : [];
    const messages = Array.isArray(state.data.messages) ? state.data.messages : [];
    const active = queue.some((item) => {
      const row = item as Record<string, unknown>;
      return row.status === "waiting" || row.status === "processing";
    });
    const hasAssistant = messages.some((item) => {
      const row = item as Record<string, unknown>;
      return row.role === "assistant" || row.role === "aipify";
    });

    if (!active && hasAssistant) {
      return { ok: true, reason: null };
    }

    await sleep(2500);
  }

  return { ok: false, reason: "Timed out waiting for assistant reply" };
}

export async function runPostP1CompanionLiveE2eFlows(input: {
  config: P1LiveE2eEnvConfig;
  session: P1LiveE2eAuthenticatedSession;
}): Promise<{ flows: PostP1FlowResult[]; tenantIsolation: PostP1AuditCheck[] }> {
  const flows: PostP1FlowResult[] = [];
  const tenantIsolation: PostP1AuditCheck[] = [];
  const { config, session } = input;
  const baseUrl = config.baseUrl?.trim() ?? null;
  const conversationId = `post-p1-e2e-${randomUUID().slice(0, 8)}`;
  const clientMessageId = randomUUID().slice(0, 8);
  const idempotencyKey = `${conversationId}:${clientMessageId}`;

  const enqueue = await enqueueQuestion(session, {
    conversationId,
    idempotencyKey,
    question: "What can Aipify help me with in the command center?",
    pathname: SURFACE_PATHS.drawer,
    companionActive: false,
  });

  flows.push(
    flow(
      "conversation_enqueue",
      "companion.chat.enqueue",
      enqueue.ok ? "pass" : "fail",
      { surface: "drawer", failure_reason: enqueue.reason },
    ),
  );

  if (!enqueue.ok) {
    return { flows, tenantIsolation };
  }

  for (const [surface, pathname] of Object.entries(SURFACE_PATHS) as [
    PostP1FlowResult["surface"],
    string,
  ][]) {
    const state = await fetchChatState(session, conversationId);
    const messages = state.ok && Array.isArray(state.data?.messages) ? state.data.messages : [];
    flows.push(
      flow(
        `shared_history_${surface}`,
        "companion.chat.shared_state",
        state.ok && messages.length > 0 ? "pass" : "fail",
        {
          surface,
          failure_reason: state.ok
            ? messages.length > 0
              ? null
              : `No messages visible for ${pathname}`
            : state.reason,
        },
      ),
    );
  }

  const duplicate = await enqueueQuestion(session, {
    conversationId,
    idempotencyKey,
    question: "What can Aipify help me with in the command center?",
    pathname: SURFACE_PATHS.fullpage,
    companionActive: false,
  });
  flows.push(
    flow(
      "idempotency_duplicate_enqueue",
      "companion.chat.idempotency",
      duplicate.ok ? "pass" : "fail",
      { failure_reason: duplicate.reason },
    ),
  );

  const completion = await pollUntilAssistantReply(session, config, conversationId);
  flows.push(
    flow(
      "queue_worker_reply",
      "companion.queue.worker_completion",
      completion.ok ? "pass" : "fail",
      { failure_reason: completion.reason },
    ),
  );

  if (baseUrl && process.env.CRON_SECRET?.trim()) {
    const cron = await triggerCronWorker(baseUrl);
    flows.push(
      flow(
        "cron_worker_closed_browser",
        "companion.queue.cron_worker",
        cron.ok ? "pass" : "fail",
        { failure_reason: cron.reason },
      ),
    );
  } else {
    flows.push(
      flow(
        "cron_worker_closed_browser",
        "companion.queue.cron_worker",
        "skipped",
        { failure_reason: "CRON_SECRET or APP_LIVE_E2E_BASE_URL not configured" },
      ),
    );
  }

  try {
    const supabase = createServiceRoleClient();
    await supabase.rpc("companion_queue_worker_recover_stale", {
      p_lease_seconds: 300,
    });
    flows.push(
      flow(
        "worker_stale_recovery",
        "companion.queue.lease_recovery",
        "pass",
      ),
    );
  } catch (error) {
    flows.push(
      flow(
        "worker_stale_recovery",
        "companion.queue.lease_recovery",
        "fail",
        {
          failure_reason: redactSecretsFromMessage(
            error instanceof Error ? error.message : "recover_stale unavailable",
          ),
        },
      ),
    );
  }

  const { data: notificationsRaw } = await session.supabase.rpc("list_presence_notifications", {
    p_limit: 20,
    p_unread_only: true,
  });
  const notifications = (notificationsRaw as { notifications?: unknown[] })?.notifications ?? [];
  const replyReady = notifications.some((item) => {
    const row = item as Record<string, unknown>;
    return row.event_type === "companion_reply_ready";
  });
  const deepLink = notifications.some((item) => {
    const row = item as Record<string, unknown>;
    const href = String(row.action_href ?? "");
    return href.includes(`conversation=${encodeURIComponent(conversationId)}`);
  });

  flows.push(
    flow(
      "companion_reply_ready_notification",
      "companion.notification.reply_ready",
      replyReady ? "pass" : completion.ok ? "fail" : "skipped",
      {
        failure_reason: replyReady ? null : "No companion_reply_ready notification found",
      },
    ),
  );
  flows.push(
    flow(
      "deep_link_conversation",
      "companion.notification.deep_link",
      deepLink ? "pass" : completion.ok ? "fail" : "skipped",
      {
        failure_reason: deepLink
          ? null
          : "Notification action_href missing conversation deep link",
      },
    ),
  );

  const { error: readError } = await session.supabase.rpc("mark_companion_conversation_read", {
    p_conversation_id: conversationId,
  });
  flows.push(
    flow(
      "mark_read_on_open",
      "companion.conversation.mark_read",
      readError ? "fail" : "pass",
      { failure_reason: readError ? redactSecretsFromMessage(readError.message) : null },
    ),
  );

  const archiveId = `post-p1-archive-${randomUUID().slice(0, 8)}`;
  await enqueueQuestion(session, {
    conversationId: archiveId,
    idempotencyKey: `${archiveId}:seed`,
    question: "Archive certification seed",
    pathname: SURFACE_PATHS.fullpage,
    companionActive: true,
  });
  const { data: archiveRaw, error: archiveError } = await session.supabase.rpc(
    "archive_companion_conversation",
    { p_conversation_id: archiveId },
  );
  flows.push(
    flow(
      "archive_conversation",
      "companion.conversation.archive",
      !archiveError && archiveRaw?.ok === true ? "pass" : "fail",
      {
        failure_reason: archiveError
          ? redactSecretsFromMessage(archiveError.message)
          : archiveRaw?.ok === true
            ? null
            : String(archiveRaw?.error ?? "archive_failed"),
      },
    ),
  );

  const { data: deleteRaw, error: deleteError } = await session.supabase.rpc(
    "delete_companion_conversation",
    { p_conversation_id: archiveId },
  );
  flows.push(
    flow(
      "delete_conversation",
      "companion.conversation.delete",
      !deleteError && deleteRaw?.ok === true ? "pass" : "fail",
      {
        failure_reason: deleteError
          ? redactSecretsFromMessage(deleteError.message)
          : deleteRaw?.ok === true
            ? null
            : String(deleteRaw?.error ?? "delete_failed"),
      },
    ),
  );

  const isolationSession = await createP1IsolationSession(config);
  if (!isolationSession) {
    tenantIsolation.push(
      isolation(
        "cross_tenant_conversation_denied",
        "skipped",
        "Isolation credentials not configured",
      ),
    );
  } else {
    const foreignState = await fetchChatState(isolationSession, conversationId);
    const denied =
      !foreignState.ok ||
      foreignState.data?.ok === false ||
      (Array.isArray(foreignState.data?.messages) &&
        foreignState.data.messages.length === 0 &&
        foreignState.data?.error === "not_found");
    tenantIsolation.push(
      isolation(
        "cross_tenant_conversation_denied",
        denied ? "pass" : "fail",
        denied ? null : "Isolation session could read primary tenant conversation",
      ),
    );
  }

  return { flows, tenantIsolation };
}
