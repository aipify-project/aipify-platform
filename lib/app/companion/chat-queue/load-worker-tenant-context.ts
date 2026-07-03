import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import {
  formatBootstrapErrorMessage,
  sanitizeBootstrapErrorMessage,
  type WorkerBootstrapFailure,
} from "@/lib/companion-runtime/companion-worker-bootstrap-errors";
import { AsyncTimeoutError, withAsyncTimeout } from "@/lib/core/async-with-timeout";
import { loadCompanionTenantContextFromWorkerBootstrap } from "@/lib/companion-runtime/load-companion-worker-foundation-context";
import { isPlatformFoundationQuery } from "@/lib/companion-runtime/platform-foundation-intent";
import {
  isCapabilityHelpQuery,
  resolveLightweightConversationalIntent,
} from "@/lib/companion-runtime/companion-turn-route";
import {
  loadCompanionTenantContext,
  type CompanionTenantContext,
} from "@/lib/companion-runtime/tenant-context";
import {
  createWorkerScopedCompanionSupabase,
  fetchCompanionWorkerRuntimeBootstrap,
} from "@/lib/companion-runtime/companion-worker-scoped-supabase";
import type { CompanionWorkerRuntimeScope } from "@/lib/companion-runtime/companion-worker-runtime-scope";
import { coerceToCustomerActiveLocale } from "@/lib/i18n/customer-active-locale-registry";
import type { WorkerExecutionProfile } from "./load-worker-profile";
import { COMPANION_QUEUE_BOOTSTRAP_TIMEOUT_MS } from "./worker-config";
import { logCompanionWorkerEvent } from "./worker-log";

export type CompanionWorkerTenantRuntime = {
  tenantContext: CompanionTenantContext;
  scopedSupabase: SupabaseClient;
  scope: CompanionWorkerRuntimeScope;
};

export type BootstrapCompanionWorkerTenantRuntimeResult =
  | { ok: true; runtime: CompanionWorkerTenantRuntime }
  | { ok: false; failure: WorkerBootstrapFailure };

function logWorkerBootstrapFailure(failure: WorkerBootstrapFailure): void {
  logCompanionWorkerEvent("bootstrap_failed", {
    step: failure.step,
    rpc: failure.rpc,
    sqlState: failure.sqlState,
    errorMessage: failure.message,
    durationMs: failure.durationMs,
    tenantId: failure.tenantId,
    userId: failure.userId,
    queueId: failure.queueId,
  });
}

export async function bootstrapCompanionWorkerTenantRuntime(
  supabase: SupabaseClient,
  profile: WorkerExecutionProfile,
  locale?: string | null,
  context: { queueId?: string; query?: string } = {},
): Promise<BootstrapCompanionWorkerTenantRuntimeResult> {
  const started = Date.now();
  const activeLocale = coerceToCustomerActiveLocale(locale ?? undefined);
  const baseContext = {
    tenantId: profile.customerId,
    userId: profile.user.id,
    queueId: context.queueId,
  };

  const bootstrapResult = await withAsyncTimeout(
    fetchCompanionWorkerRuntimeBootstrap(
      supabase,
      profile.customerId,
      profile.user.id,
      activeLocale,
      context,
    ),
    COMPANION_QUEUE_BOOTSTRAP_TIMEOUT_MS,
    "worker_bootstrap",
  ).catch((error) => {
    if (error instanceof AsyncTimeoutError) {
      return {
        ok: false as const,
        failure: {
          step: "rpc_call" as const,
          rpc: "companion_worker_get_runtime_bootstrap",
          message: "worker_bootstrap_timeout",
          durationMs: Date.now() - started,
          tenantId: profile.customerId,
          userId: profile.user.id,
          queueId: context.queueId,
        },
      };
    }
    throw error;
  });

  if (!bootstrapResult.ok) {
    logWorkerBootstrapFailure(bootstrapResult.failure);
    return bootstrapResult;
  }

  const bootstrap = bootstrapResult.bootstrap;

  if (
    bootstrap.scope.tenantId !== profile.customerId ||
    bootstrap.scope.userId !== profile.user.id ||
    bootstrap.scope.companyId !== profile.company.id
  ) {
    const failure: WorkerBootstrapFailure = {
      step: "scope_mismatch",
      rpc: "companion_worker_get_runtime_bootstrap",
      message: "bootstrap_scope_mismatch",
      durationMs: Date.now() - started,
      ...baseContext,
    };
    logWorkerBootstrapFailure(failure);
    return { ok: false, failure };
  }

  const scopedSupabase = createWorkerScopedCompanionSupabase(
    supabase,
    bootstrap.scope,
    bootstrap,
  );

  try {
    const bootstrapStarted = Date.now();
    const useFoundationFastPath = Boolean(context.query && isPlatformFoundationQuery(context.query));
    const useLightweightFastPath = Boolean(
      context.query && resolveLightweightConversationalIntent(context.query),
    );
    const useCapabilityHelpFastPath = Boolean(
      context.query && isCapabilityHelpQuery(context.query),
    );
    const useFastPath =
      useFoundationFastPath || useLightweightFastPath || useCapabilityHelpFastPath;
    const tenantContext = useFastPath
      ? loadCompanionTenantContextFromWorkerBootstrap(bootstrap, activeLocale)
      : await loadCompanionTenantContext(scopedSupabase, {
          locale: activeLocale,
        });

    logCompanionWorkerEvent("bootstrap_complete", {
      queueId: context.queueId,
      tenantId: profile.customerId,
      durationMs: Date.now() - started,
      foundationFastPath: useFoundationFastPath,
      lightweightFastPath: useLightweightFastPath,
      capabilityHelpFastPath: useCapabilityHelpFastPath,
      tenantContextMs: Date.now() - bootstrapStarted,
    });

    return {
      ok: true,
      runtime: {
        tenantContext,
        scopedSupabase,
        scope: bootstrap.scope,
      },
    };
  } catch (error) {
    const failure: WorkerBootstrapFailure = {
      step: "tenant_context",
      message: sanitizeBootstrapErrorMessage(
        error instanceof Error ? error.message : "tenant_context_load_failed",
      ),
      durationMs: Date.now() - started,
      ...baseContext,
    };
    logWorkerBootstrapFailure(failure);
    return { ok: false, failure };
  }
}

/** @deprecated Use bootstrapCompanionWorkerTenantRuntime — kept for call-site compatibility. */
export async function loadCompanionTenantContextForWorker(
  supabase: SupabaseClient,
  profile: WorkerExecutionProfile,
  locale?: string | null,
): Promise<CompanionTenantContext> {
  const runtime = await bootstrapCompanionWorkerTenantRuntime(supabase, profile, locale);
  if (!runtime.ok) {
    throw new Error(formatBootstrapErrorMessage(runtime.failure));
  }
  return runtime.runtime.tenantContext;
}
