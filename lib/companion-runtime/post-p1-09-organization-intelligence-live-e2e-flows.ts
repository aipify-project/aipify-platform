import { randomUUID } from "node:crypto";
import { createCommunityMemberDirectoryReadProviderBridge } from "./community-member-directory-read-provider-bridge";
import type { P1LiveE2eEnvConfig } from "./p1-01-live-app-e2e-env";
import {
  redactSecretsFromMessage,
  type P1LiveE2eAuthenticatedSession,
} from "./p1-01-live-app-e2e-session";
import { resolveOrganizationCapabilityRoute } from "./organization-capability-resolution";

export type PostP109OrganizationLiveFlowResult = {
  flow_id: string;
  question: string;
  expected_capability: string;
  expected_execution_kind: string;
  status: "pass" | "fail" | "skipped";
  failure_reason: string | null;
  capability_resolved: boolean;
  reply_excerpt: string | null;
};

function flowResult(input: Omit<PostP109OrganizationLiveFlowResult, "failure_reason"> & {
  failure_reason?: string | null;
}): PostP109OrganizationLiveFlowResult {
  return {
    ...input,
    failure_reason: input.failure_reason
      ? redactSecretsFromMessage(input.failure_reason)
      : null,
  };
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function triggerCronWorker(baseUrl: string): Promise<void> {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return;
  await fetch(`${baseUrl.replace(/\/$/, "")}/api/cron/companion-queue-worker`, {
    method: "GET",
    headers: { authorization: `Bearer ${secret}` },
  }).catch(() => undefined);
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
  }).catch(() => undefined);
}

async function enqueueQuestion(
  session: P1LiveE2eAuthenticatedSession,
  input: {
    conversationId: string;
    question: string;
  },
): Promise<{ ok: boolean; reason: string | null }> {
  const idempotencyKey = `${input.conversationId}:${randomUUID().slice(0, 8)}`;
  const { data, error } = await session.supabase.rpc("enqueue_companion_chat_message", {
    p_conversation_id: input.conversationId,
    p_idempotency_key: idempotencyKey,
    p_question_text: input.question,
    p_attachment_ids: [],
    p_active_artifact_id: null,
    p_attachment_summaries: [],
    p_locale: "no",
    p_pathname: "/app/companion",
    p_platform_active_modules: null,
    p_user_client_message_id: randomUUID().slice(0, 8),
    p_title: input.question.slice(0, 120),
    p_companion_active: true,
  });

  if (error) return { ok: false, reason: redactSecretsFromMessage(error.message) };
  if (data?.ok === false) return { ok: false, reason: String(data.error ?? "enqueue_failed") };
  return { ok: true, reason: null };
}

function extractAssistantReply(messages: unknown[]): {
  text: string;
  sourcesCount: number;
} | null {
  for (const item of messages) {
    const row = item as Record<string, unknown>;
    if (row.role !== "assistant" && row.role !== "aipify") continue;

    const payload =
      row.payload && typeof row.payload === "object"
        ? (row.payload as Record<string, unknown>)
        : null;
    const directAnswer = String(payload?.directAnswer ?? row.content ?? "").trim();
    const sources = Array.isArray(payload?.sources) ? payload.sources : [];
    if (directAnswer) {
      return { text: directAnswer, sourcesCount: sources.length };
    }
  }
  return null;
}

function isGenericFallbackReply(text: string): string | null {
  const normalized = text.toLowerCase();
  if (normalized.includes("unmatched capability")) return "unmatched capability";
  if (normalized.includes("åpne aipify companion") || normalized.includes("open aipify companion")) {
    return "companion self-navigation";
  }
  if (
    normalized.includes("prøv å spørre") ||
    normalized.includes("try asking about members") ||
    normalized.includes("knowledge center guide")
  ) {
    return "generic app help";
  }
  return null;
}

function hasGroundedSourceSignal(text: string, sourcesCount: number): boolean {
  if (sourcesCount > 0) return true;
  return /\b(kilde|source)\s*:/i.test(text);
}

async function pollAssistantReply(
  session: P1LiveE2eAuthenticatedSession,
  config: P1LiveE2eEnvConfig,
  conversationId: string,
  maxMs = 120_000,
): Promise<{ ok: boolean; reason: string | null; reply: { text: string; sourcesCount: number } | null }> {
  const started = Date.now();
  const baseUrl = config.baseUrl?.trim() ?? process.env.NEXT_PUBLIC_APP_URL?.trim() ?? null;

  while (Date.now() - started < maxMs) {
    if (baseUrl) {
      await triggerCronWorker(baseUrl);
      await triggerConversationProcess(config, session, conversationId);
    }

    const { data, error } = await session.supabase.rpc("get_companion_chat_state", {
      p_conversation_id: conversationId,
    });
    if (error) {
      return { ok: false, reason: redactSecretsFromMessage(error.message), reply: null };
    }

    const queue = Array.isArray((data as Record<string, unknown>)?.queue)
      ? ((data as Record<string, unknown>).queue as unknown[])
      : [];
    const messages = Array.isArray((data as Record<string, unknown>)?.messages)
      ? ((data as Record<string, unknown>).messages as unknown[])
      : [];
    const active = queue.some((item) => {
      const row = item as Record<string, unknown>;
      return row.status === "waiting" || row.status === "processing";
    });

    const reply = extractAssistantReply(messages);
    if (!active && reply) {
      return { ok: true, reason: null, reply };
    }

    await sleep(2500);
  }

  return { ok: false, reason: "Timed out waiting for assistant reply", reply: null };
}

async function resolveLiveMemberReference(session: P1LiveE2eAuthenticatedSession): Promise<string | null> {
  const envRef = process.env.APP_LIVE_E2E_MEMBER_REF?.trim();
  if (envRef) return envRef;

  const bridge = createCommunityMemberDirectoryReadProviderBridge(session.supabase);
  const bundle = await bridge.fetchDirectory();
  const first = bundle.members.find((member) => member.username || member.display_name);
  return first?.username ?? first?.display_name ?? null;
}

const BASE_QUESTIONS = [
  {
    flow_id: "active_members",
    question: "Vis aktive medlemmer.",
    expected_capability: "member.search",
    expected_execution_kind: "member_active_list",
  },
  {
    flow_id: "member_detail_list",
    question: "Vis medlemmer med brukernavn, medlems-ID og status.",
    expected_capability: "member.search",
    expected_execution_kind: "member_detail_list",
  },
  {
    flow_id: "pending_verification",
    question: "Hvilke medlemmer venter på verifisering?",
    expected_capability: "verification_queue.read",
    expected_execution_kind: "member_pending_verification",
  },
  {
    flow_id: "support_sla",
    question: "Hvilke supportsaker nærmer seg eller har brutt SLA?",
    expected_capability: "support_sla.read",
    expected_execution_kind: "support_sla",
  },
  {
    flow_id: "prioritize_today",
    question: "Hva bør jeg prioritere i dag?",
    expected_capability: "command_brief.prioritize",
    expected_execution_kind: "prioritize_today",
  },
] as const;

export async function runPostP109OrganizationIntelligenceLiveE2eFlows(input: {
  config: P1LiveE2eEnvConfig;
  session: P1LiveE2eAuthenticatedSession;
}): Promise<{ flows: PostP109OrganizationLiveFlowResult[] }> {
  const flows: PostP109OrganizationLiveFlowResult[] = [];
  const memberReference = await resolveLiveMemberReference(input.session);

  const questions = [
    ...BASE_QUESTIONS,
    memberReference
      ? {
          flow_id: "member_verification_status" as const,
          question: `Er medlem [${memberReference}] verifisert?`,
          expected_capability: "verification_queue.read",
          expected_execution_kind: "member_verification_status",
        }
      : null,
  ].filter(Boolean) as Array<(typeof BASE_QUESTIONS)[number] & { flow_id: string }>;

  for (const question of questions) {
    const route = resolveOrganizationCapabilityRoute(question.question, "no");
    if (!route) {
      flows.push(
        flowResult({
          flow_id: question.flow_id,
          question: question.question,
          expected_capability: question.expected_capability,
          expected_execution_kind: question.expected_execution_kind,
          status: "fail",
          capability_resolved: false,
          reply_excerpt: null,
          failure_reason: "Organization capability route did not resolve in Core",
        }),
      );
      continue;
    }

    if (
      route.capability_key !== question.expected_capability ||
      route.execution_kind !== question.expected_execution_kind
    ) {
      flows.push(
        flowResult({
          flow_id: question.flow_id,
          question: question.question,
          expected_capability: question.expected_capability,
          expected_execution_kind: question.expected_execution_kind,
          status: "fail",
          capability_resolved: true,
          reply_excerpt: null,
          failure_reason: `Resolved ${route.capability_key}/${route.execution_kind} instead of expected capability`,
        }),
      );
      continue;
    }

    const conversationId = `post-p109-org-${question.flow_id}-${randomUUID().slice(0, 8)}`;
    const enqueue = await enqueueQuestion(input.session, {
      conversationId,
      question: question.question,
    });
    if (!enqueue.ok) {
      flows.push(
        flowResult({
          flow_id: question.flow_id,
          question: question.question,
          expected_capability: question.expected_capability,
          expected_execution_kind: question.expected_execution_kind,
          status: "fail",
          capability_resolved: true,
          reply_excerpt: null,
          failure_reason: enqueue.reason,
        }),
      );
      continue;
    }

    const completion = await pollAssistantReply(input.session, input.config, conversationId);
    if (!completion.ok || !completion.reply) {
      flows.push(
        flowResult({
          flow_id: question.flow_id,
          question: question.question,
          expected_capability: question.expected_capability,
          expected_execution_kind: question.expected_execution_kind,
          status: "fail",
          capability_resolved: true,
          reply_excerpt: null,
          failure_reason: completion.reason,
        }),
      );
      continue;
    }

    const generic = isGenericFallbackReply(completion.reply.text);
    const grounded = hasGroundedSourceSignal(completion.reply.text, completion.reply.sourcesCount);
    const gapStatus =
      /adapter_missing|permission_required|source_unavailable|missing_data/i.test(
        completion.reply.text,
      );

    const pass =
      !generic &&
      (grounded || gapStatus) &&
      (question.flow_id === "prioritize_today" || !/ingen livedata|no live data/i.test(completion.reply.text));

    flows.push(
      flowResult({
        flow_id: question.flow_id,
        question: question.question,
        expected_capability: question.expected_capability,
        expected_execution_kind: question.expected_execution_kind,
        status: pass ? "pass" : "fail",
        capability_resolved: true,
        reply_excerpt: completion.reply.text.slice(0, 240),
        failure_reason: pass
          ? null
          : generic ??
            (!grounded ? "Reply missing grounded source signal" : "Reply did not meet live E2E criteria"),
      }),
    );
  }

  if (!memberReference) {
    flows.push(
      flowResult({
        flow_id: "member_verification_status",
        question: "Er medlem [MEMBER_REF] verifisert?",
        expected_capability: "verification_queue.read",
        expected_execution_kind: "member_verification_status",
        status: "skipped",
        capability_resolved: false,
        reply_excerpt: null,
        failure_reason: "No live member reference available (set APP_LIVE_E2E_MEMBER_REF or connect directory)",
      }),
    );
  }

  return { flows };
}
