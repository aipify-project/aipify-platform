import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { resolveDirectDateTimeKind } from "@/lib/companion-runtime/direct-datetime-kind";
import { sanitizeCompanionSubmitPageContext } from "@/lib/companion-runtime/companion-submit-page-context";
import {
  createCompanionSubmitRequestId,
  logCompanionSubmitTrace,
  type CompanionSubmitStageTimings,
} from "@/lib/app/companion/chat-queue/companion-submit-trace";

export const maxDuration = 300;

function resolveRequestTimeZone(request: Request, bodyTimeZone?: string | null): string {
  const fromBody = bodyTimeZone?.trim();
  if (fromBody) return fromBody;

  const headerTz =
    request.headers.get("x-timezone") ??
    request.headers.get("x-vercel-ip-timezone") ??
    request.headers.get("sec-ch-timezone");
  if (headerTz?.trim()) return headerTz.trim();

  return "UTC";
}

export async function POST(request: Request) {
  const requestStarted = Date.now();
  const requestId = createCompanionSubmitRequestId();
  const stageTimings: CompanionSubmitStageTimings = {
    auth_ms: 0,
    body_parse_ms: 0,
    classification_ms: 0,
    organization_context_ms: 0,
    direct_turn_ms: 0,
    response_ms: 0,
    total_ms: 0,
  };

  try {
    const supabase = await createClient();

    const bodyParseStarted = Date.now();
    const body = (await request.json()) as {
      conversation_id?: string;
      idempotency_key?: string;
      question?: string;
      attachment_ids?: string[];
      active_artifact_id?: string | null;
      attachment_summaries?: unknown[];
      locale?: string;
      pathname?: string;
      page_context?: unknown;
      platform_active_modules?: string | null;
      title?: string;
      companion_active?: boolean;
      timezone?: string | null;
    };
    stageTimings.body_parse_ms = Date.now() - bodyParseStarted;

    const conversationId = String(body.conversation_id ?? "").trim();
    const idempotencyKey = String(body.idempotency_key ?? "").trim();
    const question = String(body.question ?? "").trim();
    const companionActive = body.companion_active !== false;
    const locale = body.locale ?? "en";
    const timeZone = resolveRequestTimeZone(request, body.timezone);
    const userClientMessageId = idempotencyKey.split(":").pop() ?? null;

    let pageContext;
    try {
      pageContext =
        body.page_context != null
          ? sanitizeCompanionSubmitPageContext(body.page_context)
          : body.pathname?.trim()
            ? sanitizeCompanionSubmitPageContext({
                pathname: body.pathname.trim(),
                surface: "app",
              })
            : undefined;
    } catch {
      return NextResponse.json({ ok: false, error: "invalid_page_context" }, { status: 400 });
    }

    if (!conversationId || !idempotencyKey) {
      return NextResponse.json({ ok: false, error: "invalid_request" }, { status: 400 });
    }

    const hasAttachments = Array.isArray(body.attachment_ids) && body.attachment_ids.length > 0;
    const hasActiveArtifact = Boolean(body.active_artifact_id);
    if (!question && !hasAttachments) {
      return NextResponse.json({ ok: false, error: "empty_question" }, { status: 400 });
    }

    const datetimeKind = resolveDirectDateTimeKind(question);
    const authStarted = Date.now();
    const user = datetimeKind && !hasAttachments && !hasActiveArtifact
      ? (await supabase.auth.getSession()).data.session?.user ?? null
      : (await supabase.auth.getUser()).data.user ?? null;
    stageTimings.auth_ms = Date.now() - authStarted;
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (datetimeKind && !hasAttachments && !hasActiveArtifact) {
      stageTimings.classification_ms = 0;
      stageTimings.organization_context_ms = 0;

      const directStarted = Date.now();
      const { executeDirectDateTimeTurn } = await import(
        "@/lib/app/companion/chat-queue/direct-datetime-turn"
      );
      const direct = await executeDirectDateTimeTurn(supabase, {
        conversationId,
        idempotencyKey,
        question,
        locale,
        timeZone,
        requestId,
      });
      stageTimings.direct_turn_ms = Date.now() - directStarted;
      stageTimings.direct_stages = direct.stage_timings;
      stageTimings.total_ms = Date.now() - requestStarted;

      if (!direct.ok) {
        logCompanionSubmitTrace({
          request_id: requestId,
          conversation_id: conversationId,
          user_client_message_id: userClientMessageId,
          normalized_intent: `direct:datetime`,
          execution: "direct",
          route: "datetime",
          submit_path: "direct",
          classification_ms: 0,
          direct_reason: direct.error,
          queue_inserted: false,
          duration_ms: stageTimings.total_ms,
          locale,
          timezone: timeZone,
          stage_timings: stageTimings,
        });

        return NextResponse.json(
          {
            ok: false,
            error: direct.error,
            execution: "direct_failed",
            submit_path: "direct",
            route: "datetime",
            request_id: requestId,
            duration_ms: stageTimings.total_ms,
            queue_inserted: false,
            stage_timings: stageTimings,
          },
          { status: 500 },
        );
      }

      logCompanionSubmitTrace({
        request_id: requestId,
        conversation_id: conversationId,
        user_client_message_id: userClientMessageId,
        normalized_intent: `direct:datetime:${datetimeKind}`,
        execution: "direct",
        route: "datetime",
        submit_path: "direct",
        classification_ms: 0,
        direct_reason: `direct:datetime:${datetimeKind}`,
        queue_inserted: false,
        duration_ms: stageTimings.total_ms,
        locale,
        timezone: timeZone,
        stage_timings: stageTimings,
      });

      const responseStarted = Date.now();
      const response = NextResponse.json({
        ok: true,
        execution: "direct",
        submit_path: "direct",
        route: "datetime",
        request_id: requestId,
        user_message_id: direct.user_message_id,
        assistant_message_id: direct.assistant_message_id,
        response_to_message_id: direct.response_to_message_id,
        deduplicated: direct.deduplicated === true,
        duration_ms: stageTimings.total_ms,
        queue_inserted: false,
        worker_dispatch: "not_applicable",
        stage_timings: stageTimings,
      });
      stageTimings.response_ms = Date.now() - responseStarted;
      return response;
    }

    const {
      classifyCompanionSubmitPath,
      resolveDirectTurnRoute,
      isSimpleDirectExactSourceQuery,
    } = await import("@/lib/companion-runtime/companion-submit-path");
    const { coerceToCustomerActiveLocale } = await import(
      "@/lib/i18n/customer-active-locale-registry"
    );
    const { resolveCompanionExplicitIntent } = await import(
      "@/lib/companion-runtime/companion-explicit-intent"
    );
    const { resolveAppOrganizationContext } = await import(
      "@/lib/tenant/resolve-app-organization-context"
    );
    const {
      executeDirectCompanionTurn,
      resolveDirectReason,
      shouldExecuteDirectCompanionTurn,
    } = await import("@/lib/app/companion/chat-queue/direct-turn");
    const { isCompanionWorkerConfigured } = await import(
      "@/lib/app/companion/chat-queue/dispatch-worker"
    );
    const { awaitCompanionQueueProcessing } = await import(
      "@/lib/app/companion/chat-queue/process-queue"
    );

    const localeActive = coerceToCustomerActiveLocale(locale);
    const classifyStarted = Date.now();
    const submitPath = classifyCompanionSubmitPath(question, localeActive, {
      hasAttachments,
      hasActiveArtifact,
    });
    const route = resolveDirectTurnRoute(question, localeActive, {
      hasAttachments,
      hasActiveArtifact,
    });
    stageTimings.classification_ms = Date.now() - classifyStarted;

    const routeOptions = {
      hasAttachments,
      hasActiveArtifact,
    };

    const skipOrgBootstrapForDirect =
      (submitPath === "direct" &&
        (Boolean(resolveDirectDateTimeKind(question)) ||
          Boolean(resolveCompanionExplicitIntent(question)))) ||
      (submitPath === "direct_exact_source_or_queue" &&
        isSimpleDirectExactSourceQuery(question, localeActive));

    const orgStarted = Date.now();
    const orgContext = skipOrgBootstrapForDirect
      ? null
      : await resolveAppOrganizationContext(supabase).catch(() => null);
    stageTimings.organization_context_ms = skipOrgBootstrapForDirect
      ? 0
      : Date.now() - orgStarted;
    const organizationId = orgContext?.organization_id ?? null;

    if (shouldExecuteDirectCompanionTurn(question, locale, routeOptions)) {
      const directStarted = Date.now();
      const direct = await executeDirectCompanionTurn(supabase, {
        conversationId,
        idempotencyKey,
        question,
        locale,
        pathname: body.pathname ?? null,
        pageContext,
        title: body.title ?? null,
        timeZone,
        platformActiveModules: body.platform_active_modules
          ? body.platform_active_modules.split(",").map((entry) => entry.trim()).filter(Boolean)
          : undefined,
        attachmentIds: body.attachment_ids ?? [],
        activeArtifactId: body.active_artifact_id ?? null,
        attachmentSummaries: body.attachment_summaries ?? [],
        requestId,
      });
      stageTimings.direct_turn_ms = Date.now() - directStarted;
      stageTimings.total_ms = Date.now() - requestStarted;

      if (direct.ok) {
        logCompanionSubmitTrace({
          request_id: requestId,
          conversation_id: conversationId,
          user_client_message_id: userClientMessageId,
          normalized_intent: resolveDirectReason(question, locale, routeOptions),
          execution: "direct",
          route: direct.route,
          submit_path: submitPath,
          classification_ms: stageTimings.classification_ms,
          direct_reason: resolveDirectReason(question, locale, routeOptions),
          queue_inserted: false,
          duration_ms: direct.duration_ms,
          organization_id: organizationId,
          locale,
          timezone: timeZone,
          stage_timings: stageTimings,
        });

        return NextResponse.json({
          ok: true,
          execution: "direct",
          submit_path: submitPath,
          route: direct.route,
          request_id: requestId,
          user_message_id: direct.user_message_id,
          assistant_message_id: direct.assistant_message_id,
          response_to_message_id: direct.response_to_message_id,
          deduplicated: direct.deduplicated === true,
          duration_ms: direct.duration_ms,
          queue_inserted: false,
          worker_dispatch: "not_applicable",
          stage_timings: stageTimings,
        });
      }

      if (!direct.should_queue) {
        logCompanionSubmitTrace({
          request_id: requestId,
          conversation_id: conversationId,
          user_client_message_id: userClientMessageId,
          normalized_intent: resolveDirectReason(question, locale, routeOptions),
          execution: "direct",
          route: direct.route ?? route,
          submit_path: submitPath,
          classification_ms: stageTimings.classification_ms,
          direct_reason: direct.error,
          queue_inserted: false,
          duration_ms: direct.duration_ms,
          organization_id: organizationId,
          locale,
          timezone: timeZone,
          stage_timings: stageTimings,
        });

        return NextResponse.json(
          {
            ok: false,
            error: direct.error,
            execution: "direct_failed",
            submit_path: submitPath,
            route: direct.route,
            request_id: requestId,
            duration_ms: direct.duration_ms,
            queue_inserted: false,
            stage_timings: stageTimings,
          },
          { status: 500 },
        );
      }

      logCompanionSubmitTrace({
        request_id: requestId,
        conversation_id: conversationId,
        user_client_message_id: userClientMessageId,
        normalized_intent: resolveDirectReason(question, locale, routeOptions),
        execution: "queued",
        route: direct.route ?? route,
        submit_path: submitPath,
        classification_ms: stageTimings.classification_ms,
        direct_reason: direct.error,
        queue_reason: "direct_exact_source_timeout_or_failure",
        queue_inserted: true,
        organization_id: organizationId,
        locale,
        timezone: timeZone,
        stage_timings: stageTimings,
      });
    }

    const { data, error } = await supabase.rpc("enqueue_companion_chat_message", {
      p_conversation_id: conversationId,
      p_idempotency_key: idempotencyKey,
      p_question_text: question,
      p_attachment_ids: body.attachment_ids ?? [],
      p_active_artifact_id: body.active_artifact_id ?? null,
      p_attachment_summaries: body.attachment_summaries ?? [],
      p_locale: body.locale ?? null,
      p_pathname: body.pathname ?? null,
      p_platform_active_modules: body.platform_active_modules ?? null,
      p_user_client_message_id: userClientMessageId,
      p_title: body.title ?? null,
      p_companion_active: companionActive,
    });

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    const origin = new URL(request.url).origin;

    let workerDispatch: string = isCompanionWorkerConfigured() ? "scheduled" : "unavailable";
    if (isCompanionWorkerConfigured()) {
      const inline = await awaitCompanionQueueProcessing(conversationId, { origin });
      workerDispatch = inline.ok ? "completed" : inline.error_code ?? "worker_dispatch_failed";
    }

    const payload =
      data && typeof data === "object" && !Array.isArray(data)
        ? { ...(data as Record<string, unknown>) }
        : { ok: true };

    stageTimings.total_ms = Date.now() - requestStarted;

    logCompanionSubmitTrace({
      request_id: requestId,
      conversation_id: conversationId,
      user_client_message_id: userClientMessageId,
      normalized_intent: `${submitPath}:${route}`,
      execution: "queued",
      route,
      submit_path: submitPath,
      classification_ms: stageTimings.classification_ms,
      queue_reason: shouldExecuteDirectCompanionTurn(question, locale, routeOptions)
        ? "controlled_escalation_after_direct_attempt"
        : "queued_by_classification",
      queue_inserted: true,
      duration_ms: stageTimings.total_ms,
      organization_id: organizationId,
      locale,
      timezone: timeZone,
      stage_timings: stageTimings,
    });

    return NextResponse.json({
      ...payload,
      execution: "queued",
      submit_path: submitPath,
      route,
      request_id: requestId,
      queue_inserted: true,
      worker_dispatch: workerDispatch,
      stage_timings: stageTimings,
    });
  } catch {
    stageTimings.total_ms = Date.now() - requestStarted;
    return NextResponse.json(
      { ok: false, error: "enqueue_failed", request_id: requestId, stage_timings: stageTimings },
      { status: 500 },
    );
  }
}
