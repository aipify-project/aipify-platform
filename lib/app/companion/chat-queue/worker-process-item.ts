import type { SupabaseClient } from "@supabase/supabase-js";
import { classifyCompanionTurnRoute } from "@/lib/companion-runtime/companion-turn-route";
import { coerceToCustomerActiveLocale } from "@/lib/i18n/customer-active-locale-registry";
import { executeCompanionTurnToPayload } from "./execute-turn";
import { resolveAppCompanionSubmitPageContextFromPathname } from "@/lib/companion-runtime/app-companion-page-context";
import {
  COMPANION_QUEUE_HEARTBEAT_INTERVAL_MS,
  COMPANION_QUEUE_LEASE_SECONDS,
  resolveCompanionQueueRetry,
  shouldNotifyCompanionReply,
} from "./worker-config";
import { resolveCompanionTurnTimeoutMs } from "./worker-route-timeout";
import { logCompanionWorkerEvent } from "./worker-log";
import { logCompanionWorkerStepTimings } from "./worker-step-timing";
import { loadWorkerExecutionProfile } from "./load-worker-profile";
import { validateCompanionWorkerJobBeforeComplete } from "./companion-worker-complete-guard";

export type WorkerQueueJob = {
  id: string;
  conversation_id: string;
  tenant_id: string;
  user_id: string;
  question_text: string;
  attachment_ids: unknown;
  active_artifact_id: string | null;
  locale: string | null;
  pathname: string | null;
  platform_active_modules: string | null;
  attempt_count: number;
  max_attempts: number;
  companion_active_at_enqueue: boolean;
};

type TurnPayloadResult = Awaited<ReturnType<typeof executeCompanionTurnToPayload>>;

function parseAttachmentIds(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.map(String).filter(Boolean);
}

async function isCompanionQueueCancelRequested(
  supabase: SupabaseClient,
  queueId: string,
): Promise<boolean> {
  const { data } = await supabase.rpc("companion_queue_is_cancel_requested", {
    p_queue_id: queueId,
  });
  return data === true;
}

async function runTurnWithDeadline(input: {
  supabase: SupabaseClient;
  job: WorkerQueueJob;
  profile: NonNullable<Awaited<ReturnType<typeof loadWorkerExecutionProfile>>>;
  turnRoute: ReturnType<typeof classifyCompanionTurnRoute>;
  turnTimeoutMs: number;
  workerId: string;
  platformModules?: string[];
}): Promise<{ turn: TurnPayloadResult; timedOut: boolean }> {
  const abortController = new AbortController();
  let timedOut = false;
  let timeoutHandle: ReturnType<typeof setTimeout> | undefined;

  const attachmentIds = parseAttachmentIds(input.job.attachment_ids);
  const pageContext = resolveAppCompanionSubmitPageContextFromPathname(input.job.pathname);
  const turnPromise = executeCompanionTurnToPayload(input.supabase, {
    query: input.job.question_text,
    locale: input.job.locale ?? "en",
    conversationId: input.job.conversation_id,
    activeArtifactId: input.job.active_artifact_id,
    attachmentIds,
    platformActiveModules: input.platformModules,
    workerProfile: input.profile,
    workerQueueId: input.job.id,
    abortSignal: abortController.signal,
    turnRoute: input.turnRoute,
    pageContext,
  });

  const turn = await new Promise<TurnPayloadResult>((resolve) => {
    timeoutHandle = setTimeout(() => {
      timedOut = true;
      abortController.abort();
      resolve({ ok: false, error: "turn_timeout", code: "turn_timeout" });
    }, input.turnTimeoutMs);

    void turnPromise
      .then((result) => {
        if (!timedOut) resolve(result);
      })
      .catch((error) => {
        if (timedOut) return;
        resolve({
          ok: false,
          error: error instanceof Error ? error.message : "unexpected_error",
          code: "unexpected_error",
        });
      });
  }).finally(() => {
    if (timeoutHandle) clearTimeout(timeoutHandle);
  });

  return { turn, timedOut };
}

export async function processWorkerQueueJob(
  supabase: SupabaseClient,
  workerId: string,
  job: WorkerQueueJob,
): Promise<"completed" | "failed" | "retried"> {
  const started = Date.now();

  const profile = await loadWorkerExecutionProfile(supabase, job.tenant_id, job.user_id);
  if (!profile) {
    await supabase.rpc("companion_queue_worker_fail", {
      p_queue_id: job.id,
      p_worker_id: workerId,
      p_error_code: "tenant_mismatch",
      p_error_message: "tenant_mismatch",
      p_retryable: false,
    });
    await supabase.rpc("companion_queue_worker_audit_event", {
      p_queue_id: job.id,
      p_tenant_id: job.tenant_id,
      p_worker_id: workerId,
      p_event: "failed",
      p_error_code: "tenant_mismatch",
      p_duration_ms: Date.now() - started,
      p_attempt_count: job.attempt_count,
    });
    return "failed";
  }

  const attachmentIds = parseAttachmentIds(job.attachment_ids);
  const turnRoute = classifyCompanionTurnRoute(
    job.question_text,
    coerceToCustomerActiveLocale(job.locale ?? undefined),
    {
      hasAttachments: attachmentIds.length > 0,
      hasActiveArtifact: Boolean(job.active_artifact_id),
    },
  );
  const turnTimeoutMs = resolveCompanionTurnTimeoutMs(turnRoute);

  logCompanionWorkerEvent("job_start", {
    queueId: job.id,
    tenantId: job.tenant_id,
    workerId,
    attempt: job.attempt_count,
    route: turnRoute,
  });

  await supabase.rpc("companion_queue_worker_heartbeat", {
    p_queue_id: job.id,
    p_worker_id: workerId,
    p_lease_seconds: COMPANION_QUEUE_LEASE_SECONDS,
  });

  const { data: armRaw } = await supabase.rpc("companion_queue_worker_arm_deadline", {
    p_queue_id: job.id,
    p_worker_id: workerId,
    p_route_type: turnRoute,
    p_deadline_seconds: Math.ceil(turnTimeoutMs / 1000),
  });

  if (armRaw?.ok !== true) {
    logCompanionWorkerEvent("arm_deadline_failed", {
      queueId: job.id,
      workerId,
      route: turnRoute,
    });
  }

  const useHeartbeat = turnRoute !== "lightweight";
  let heartbeatTimer: ReturnType<typeof setInterval> | undefined;

  if (useHeartbeat) {
    heartbeatTimer = setInterval(() => {
      void (async () => {
        if (await isCompanionQueueCancelRequested(supabase, job.id)) {
          return;
        }
        await supabase.rpc("companion_queue_worker_heartbeat", {
          p_queue_id: job.id,
          p_worker_id: workerId,
          p_lease_seconds: COMPANION_QUEUE_LEASE_SECONDS,
        });
      })();
    }, COMPANION_QUEUE_HEARTBEAT_INTERVAL_MS);
  }

  const stopHeartbeat = () => {
    if (heartbeatTimer) {
      clearInterval(heartbeatTimer);
      heartbeatTimer = undefined;
    }
  };

  const platformModules = job.platform_active_modules
    ? job.platform_active_modules.split(",").map((entry) => entry.trim()).filter(Boolean)
    : undefined;

  try {
    if (await isCompanionQueueCancelRequested(supabase, job.id)) {
      stopHeartbeat();
      await supabase.rpc("companion_queue_worker_cancel_ack", {
        p_queue_id: job.id,
        p_worker_id: workerId,
      });
      return "failed";
    }

    const turnStarted = Date.now();
    const { turn, timedOut } = await runTurnWithDeadline({
      supabase,
      job,
      profile,
      turnRoute,
      turnTimeoutMs,
      workerId,
      platformModules,
    });
    stopHeartbeat();

    const routingMs = Date.now() - turnStarted;

    if (!turn.ok) {
      const retry = resolveCompanionQueueRetry(turn.code ?? "turn_failed");
      await supabase.rpc("companion_queue_worker_fail", {
        p_queue_id: job.id,
        p_worker_id: workerId,
        p_error_code: turn.code ?? "turn_failed",
        p_error_message: turn.code ?? "turn_failed",
        p_retryable: timedOut ? false : retry.retryable,
      });
      await supabase.rpc("companion_queue_worker_audit_event", {
        p_queue_id: job.id,
        p_tenant_id: job.tenant_id,
        p_worker_id: workerId,
        p_event: timedOut || !retry.retryable ? "failed" : "retry_scheduled",
        p_error_code: turn.code ?? "turn_failed",
        p_duration_ms: Date.now() - started,
        p_attempt_count: job.attempt_count,
      });
      logCompanionWorkerStepTimings(job.id, job.tenant_id, {
        routingMs,
        route: turnRoute,
        turnTimeoutMs,
        totalMs: Date.now() - started,
      });
      return timedOut || !retry.retryable ? "failed" : "retried";
    }

    const completeStarted = Date.now();

    const guard = await validateCompanionWorkerJobBeforeComplete(supabase, job.id, workerId);
    if (!guard.ok) {
      await supabase.rpc("companion_queue_worker_fail", {
        p_queue_id: job.id,
        p_worker_id: workerId,
        p_error_code: guard.reason,
        p_error_message: guard.reason,
        p_retryable: false,
      });
      logCompanionWorkerEvent("complete_guard_blocked", {
        queueId: job.id,
        workerId,
        reason: guard.reason,
      });
      return "failed";
    }

    const correlatedPayload = {
      ...(turn.assistantPayload as Record<string, unknown>),
      response_to_message_id: guard.user_message_id,
      queue_id: job.id,
      execution: "queued",
    };

    const { data: completeRaw, error: completeError } = await supabase.rpc(
      "companion_queue_worker_complete",
      {
        p_queue_id: job.id,
        p_worker_id: workerId,
        p_assistant_content: turn.assistantContent,
        p_assistant_payload: correlatedPayload,
      },
    );

    if (completeError || !completeRaw?.ok) {
      const retry = resolveCompanionQueueRetry("complete_failed");
      await supabase.rpc("companion_queue_worker_fail", {
        p_queue_id: job.id,
        p_worker_id: workerId,
        p_error_code: "complete_failed",
        p_error_message: "complete_failed",
        p_retryable: retry.retryable,
      });
      return retry.retryable ? "retried" : "failed";
    }

    const messageWriteMs = Date.now() - completeStarted;

    if (
      completeRaw.deduplicated !== true &&
      shouldNotifyCompanionReply(job.companion_active_at_enqueue)
    ) {
      void (async () => {
        try {
          await supabase.rpc("companion_queue_worker_notify_reply_ready", {
            p_queue_id: job.id,
          });
        } catch {
          // Notification must not block queue completion.
        }
      })();
    }

    logCompanionWorkerStepTimings(job.id, job.tenant_id, {
      routingMs,
      route: turnRoute,
      turnTimeoutMs,
      messageWriteMs,
      totalMs: Date.now() - started,
    });

    await supabase.rpc("companion_queue_worker_audit_event", {
      p_queue_id: job.id,
      p_tenant_id: job.tenant_id,
      p_worker_id: workerId,
      p_event: "completed",
      p_duration_ms: Date.now() - started,
      p_attempt_count: job.attempt_count,
    });

    logCompanionWorkerEvent("job_complete", {
      queueId: job.id,
      tenantId: job.tenant_id,
      workerId,
      durationMs: Date.now() - started,
      route: turnRoute,
    });

    return "completed";
  } catch (error) {
    stopHeartbeat();
    const retry = resolveCompanionQueueRetry("unexpected_error");
    await supabase.rpc("companion_queue_worker_fail", {
      p_queue_id: job.id,
      p_worker_id: workerId,
      p_error_code: "unexpected_error",
      p_error_message: "unexpected_error",
      p_retryable: retry.retryable,
    });
    await supabase.rpc("companion_queue_worker_audit_event", {
      p_queue_id: job.id,
      p_tenant_id: job.tenant_id,
      p_worker_id: workerId,
      p_event: "failed",
      p_error_code: "unexpected_error",
      p_duration_ms: Date.now() - started,
      p_attempt_count: job.attempt_count,
    });
    return retry.retryable ? "retried" : "failed";
  } finally {
    stopHeartbeat();
  }
}
