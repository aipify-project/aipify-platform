import type { SupabaseClient } from "@supabase/supabase-js";
import { executeCompanionTurnToPayload } from "./execute-turn";
import {
  COMPANION_QUEUE_HEARTBEAT_INTERVAL_MS,
  COMPANION_QUEUE_LEASE_SECONDS,
  resolveCompanionQueueRetry,
  shouldNotifyCompanionReply,
} from "./worker-config";
import { logCompanionWorkerEvent } from "./worker-log";
import { loadWorkerExecutionProfile } from "./load-worker-profile";

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

function parseAttachmentIds(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.map(String).filter(Boolean);
}

export async function processWorkerQueueJob(
  supabase: SupabaseClient,
  workerId: string,
  job: WorkerQueueJob,
): Promise<"completed" | "failed" | "retried"> {
  const started = Date.now();

  logCompanionWorkerEvent("job_start", {
    queueId: job.id,
    tenantId: job.tenant_id,
    workerId,
    attempt: job.attempt_count,
  });

  const profile = await loadWorkerExecutionProfile(supabase, job.tenant_id, job.user_id);
  if (!profile) {
    await supabase.rpc("companion_queue_worker_fail", {
      p_queue_id: job.id,
      p_worker_id: workerId,
      p_error_code: "tenant_mismatch",
      p_error_message: "Worker could not resolve tenant profile",
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

  await supabase.rpc("companion_queue_worker_heartbeat", {
    p_queue_id: job.id,
    p_worker_id: workerId,
    p_lease_seconds: COMPANION_QUEUE_LEASE_SECONDS,
  });

  const heartbeatTimer = setInterval(() => {
    void supabase.rpc("companion_queue_worker_heartbeat", {
      p_queue_id: job.id,
      p_worker_id: workerId,
      p_lease_seconds: COMPANION_QUEUE_LEASE_SECONDS,
    });
  }, COMPANION_QUEUE_HEARTBEAT_INTERVAL_MS);

  const platformModules = job.platform_active_modules
    ? job.platform_active_modules.split(",").map((entry) => entry.trim()).filter(Boolean)
    : undefined;

  try {
    const turn = await executeCompanionTurnToPayload(supabase, {
      query: job.question_text,
      locale: job.locale ?? "en",
      conversationId: job.conversation_id,
      activeArtifactId: job.active_artifact_id,
      attachmentIds: parseAttachmentIds(job.attachment_ids),
      platformActiveModules: platformModules,
      workerProfile: profile,
    });

    if (!turn.ok) {
      const retry = resolveCompanionQueueRetry(turn.code ?? "turn_failed");
      await supabase.rpc("companion_queue_worker_fail", {
        p_queue_id: job.id,
        p_worker_id: workerId,
        p_error_code: turn.code ?? "turn_failed",
        p_error_message: turn.error,
        p_retryable: retry.retryable,
      });
      await supabase.rpc("companion_queue_worker_audit_event", {
        p_queue_id: job.id,
        p_tenant_id: job.tenant_id,
        p_worker_id: workerId,
        p_event: retry.retryable ? "retry_scheduled" : "failed",
        p_error_code: turn.code ?? "turn_failed",
        p_duration_ms: Date.now() - started,
        p_attempt_count: job.attempt_count,
      });
      return retry.retryable ? "retried" : "failed";
    }

    const { data: completeRaw, error: completeError } = await supabase.rpc(
      "companion_queue_worker_complete",
      {
        p_queue_id: job.id,
        p_worker_id: workerId,
        p_assistant_content: turn.assistantContent,
        p_assistant_payload: turn.assistantPayload,
      },
    );

    if (completeError || !completeRaw?.ok) {
      const retry = resolveCompanionQueueRetry("complete_failed");
      await supabase.rpc("companion_queue_worker_fail", {
        p_queue_id: job.id,
        p_worker_id: workerId,
        p_error_code: "complete_failed",
        p_error_message: completeError?.message ?? "complete_failed",
        p_retryable: retry.retryable,
      });
      return retry.retryable ? "retried" : "failed";
    }

    if (
      completeRaw.deduplicated !== true &&
      shouldNotifyCompanionReply(job.companion_active_at_enqueue)
    ) {
      await supabase.rpc("companion_queue_worker_notify_reply_ready", {
        p_queue_id: job.id,
      });
    }

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
    });

    return "completed";
  } catch (error) {
    const retry = resolveCompanionQueueRetry("unexpected_error");
    await supabase.rpc("companion_queue_worker_fail", {
      p_queue_id: job.id,
      p_worker_id: workerId,
      p_error_code: "unexpected_error",
      p_error_message: error instanceof Error ? error.message : "unexpected_error",
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
    clearInterval(heartbeatTimer);
  }
}
