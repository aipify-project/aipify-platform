import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { createKompisOperatorIdempotencyKey } from "./ids";
import type { KompisOperatorPlan, KompisOperatorPlanStep } from "./planner";
import { getKompisOperatorTool } from "./tools-registry";

type ToolResult = {
  ok: boolean;
  summary: string;
  verified: boolean;
  data?: Record<string, unknown>;
  errorCode?: string;
  changed?: boolean;
};

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

async function loadWorkspace(supabase: SupabaseClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_app_kompis_operator_workspace");
  if (error) return {};
  return asRecord(data);
}

async function verifyDraft(
  supabase: SupabaseClient,
  draftId: string,
  organizationId: unknown,
): Promise<boolean> {
  const { data, error } = await supabase.rpc("get_app_kompis_operator_draft", {
    p_draft_id: draftId,
  });
  if (error) return false;
  const row = asRecord(data);
  return row.id === draftId && row.organization_id === organizationId && row.published !== true;
}

async function executeTool(
  supabase: SupabaseClient,
  step: KompisOperatorPlanStep,
  workspace: Record<string, unknown>,
  runId: string,
): Promise<ToolResult> {
  const organization = asRecord(workspace.organization);
  const organizationId = organization.id ?? null;
  const safeInput = step.safeInput ?? {};

  switch (step.toolKey) {
    case "customer_profile_read":
      return {
        ok: true,
        verified: Boolean(organizationId),
        summary: "Organization profile loaded.",
        data: { organization },
      };
    case "agreement_status_read":
      return {
        ok: true,
        verified: true,
        summary: "Agreement status loaded.",
        data: { agreement: asRecord(workspace.agreement) },
      };
    case "license_status_read":
      return {
        ok: true,
        verified: true,
        summary: "APP license status loaded.",
        data: { parentLicense: asRecord(workspace.parent_license) },
      };
    case "domain_installation_status_read":
      return {
        ok: true,
        verified: true,
        summary: "Domain and installation status loaded.",
        data: {
          domain: asRecord(workspace.website_kompis).domain ?? null,
          installationId: asRecord(workspace.website_kompis).installation_id ?? null,
        },
      };
    case "website_kompis_status_read":
      return {
        ok: true,
        verified: true,
        summary: "Website Kompis delivery status loaded.",
        data: { websiteKompis: asRecord(workspace.website_kompis) },
      };
    case "app_access_status_read":
      return {
        ok: true,
        verified: workspace.available === true,
        summary: "APP panel access status loaded.",
        data: { available: workspace.available === true, organization },
      };
    case "support_cases_read": {
      const { data, error } = await supabase.rpc("get_support_ai_engine_dashboard");
      if (error) {
        return {
          ok: false,
          verified: false,
          summary: "Support cases could not be loaded.",
          errorCode: "support_read_failed",
        };
      }
      const dashboard = asRecord(data);
      const cases = asArray(dashboard.cases ?? dashboard.queue ?? dashboard.items).slice(0, 20);
      return {
        ok: true,
        verified: true,
        summary: `Loaded ${cases.length} support case summaries.`,
        data: { count: cases.length, cases },
      };
    }
    case "support_case_read": {
      const caseId = typeof safeInput.caseId === "string" ? safeInput.caseId : "";
      const { data, error } = await supabase.rpc("get_support_ai_engine_dashboard");
      if (error) {
        return { ok: false, verified: false, summary: "Support case could not be loaded.", errorCode: "support_read_failed" };
      }
      const cases = asArray(asRecord(data).cases ?? asRecord(data).queue ?? asRecord(data).items);
      const match = cases
        .map((item) => asRecord(item))
        .find((item) => item.id === caseId || item.case_id === caseId);
      if (!match) {
        return { ok: false, verified: false, summary: "Support case was not found.", errorCode: "support_case_not_found" };
      }
      return {
        ok: true,
        verified: true,
        summary: "Support case loaded.",
        data: {
          case: {
            id: match.id ?? match.case_id ?? null,
            subject: match.subject ?? match.title ?? null,
            status: match.status ?? null,
            priority: match.priority ?? null,
          },
        },
      };
    }
    case "notifications_read": {
      const { data, error } = await supabase.rpc("list_presence_notifications", {
        p_limit: 20,
        p_unread_only: false,
      });
      if (error) {
        return { ok: false, verified: false, summary: "Notifications could not be loaded.", errorCode: "notifications_read_failed" };
      }
      const items = asArray(data).slice(0, 20).map((item) => {
        const row = asRecord(item);
        return {
          id: row.id ?? null,
          title: row.title ?? row.headline ?? null,
          status: row.status ?? null,
          read: row.read === true || row.is_read === true || row.reviewed_at != null,
        };
      });
      return {
        ok: true,
        verified: true,
        summary: `Loaded ${items.length} notifications.`,
        data: { count: items.length, notifications: items },
      };
    }
    case "organization_members_read": {
      const { data, error } = await supabase.rpc("get_employee_directory", {
        p_search: null,
        p_department_id: null,
        p_role: null,
        p_status: "active",
        p_manager_user_id: null,
      });
      if (error) {
        return { ok: false, verified: false, summary: "Members could not be loaded.", errorCode: "members_read_failed" };
      }
      const payload = asRecord(data);
      const members = asArray(payload.employees ?? payload.members ?? payload.items)
        .slice(0, 50)
        .map((item) => {
          const row = asRecord(item);
          return {
            id: row.id ?? row.user_id ?? null,
            displayName: row.display_name ?? row.full_name ?? row.name ?? null,
            role: row.role ?? row.organization_role ?? null,
            status: row.status ?? null,
          };
        });
      return {
        ok: true,
        verified: true,
        summary: `Loaded ${members.length} members.`,
        data: { count: members.length, members },
      };
    }
    case "activity_summary_read": {
      const { data, error } = await supabase.rpc("get_my_activity_operations_summary");
      if (error) {
        return { ok: false, verified: false, summary: "Activity could not be loaded.", errorCode: "activity_read_failed" };
      }
      return {
        ok: true,
        verified: true,
        summary: "Activity summary loaded.",
        data: { summary: asRecord(data) },
      };
    }
    case "knowledge_search": {
      const query =
        typeof safeInput.query === "string" && safeInput.query.trim()
          ? safeInput.query.trim().slice(0, 200)
          : "overview";
      const { data, error } = await supabase.rpc("search_organization_knowledge", {
        p_filters: { query, limit: 5, status: "published" },
      });
      if (error) {
        return { ok: false, verified: false, summary: "Knowledge search failed.", errorCode: "knowledge_search_failed" };
      }
      const hits = asArray(data)
        .slice(0, 5)
        .map((item) => {
          const row = asRecord(item);
          return {
            id: row.id ?? row.article_id ?? null,
            title: row.title ?? row.question ?? null,
            status: row.status ?? "published",
            locale: row.language ?? row.locale ?? null,
          };
        });
      return {
        ok: true,
        verified: true,
        summary: hits.length ? `Found ${hits.length} authorized sources.` : "No authorized sources were found.",
        data: { count: hits.length, sources: hits, query },
      };
    }
    case "content_inventory_read": {
      const { data, error } = await supabase.rpc("list_app_kompis_operator_drafts", { p_limit: 20 });
      if (error) {
        return { ok: false, verified: false, summary: "Content inventory could not be loaded.", errorCode: "content_inventory_failed" };
      }
      const drafts = asArray(asRecord(data).drafts);
      return {
        ok: true,
        verified: true,
        summary: `Loaded ${drafts.length} drafts.`,
        data: { count: drafts.length, drafts },
      };
    }
    case "operator_history_read": {
      const { data, error } = await supabase.rpc("list_app_kompis_operator_conversations", {
        p_limit: 20,
      });
      if (error) {
        return { ok: false, verified: false, summary: "Operator history could not be loaded.", errorCode: "history_read_failed" };
      }
      const conversations = asArray(asRecord(data).conversations ?? data);
      return {
        ok: true,
        verified: true,
        summary: `Loaded ${conversations.length} conversations.`,
        data: { count: conversations.length, conversations },
      };
    }
    case "support_case_create": {
      const subject =
        typeof safeInput.subject === "string" && safeInput.subject.trim()
          ? safeInput.subject.trim().slice(0, 500)
          : "Kompis support request";
      const message =
        typeof safeInput.message === "string" && safeInput.message.trim()
          ? safeInput.message.trim().slice(0, 8000)
          : "Created via Kompis after operator approval.";
      const idempotencyKey =
        typeof safeInput.idempotencyKey === "string" && safeInput.idempotencyKey
          ? safeInput.idempotencyKey
          : createKompisOperatorIdempotencyKey();
      const { data, error } = await supabase.rpc("create_organization_support_case", {
        p_subject: subject,
        p_customer_identifier: null,
        p_channel: "admin_inbox",
        p_priority: "medium",
        p_initial_message: message,
        p_idempotency_key: idempotencyKey,
        p_priority_explicit: false,
      });
      if (error) {
        return { ok: false, verified: false, summary: "Support case could not be created.", errorCode: "support_create_failed" };
      }
      const created = asRecord(data);
      return {
        ok: true,
        verified: Boolean(created.id || created.case_id),
        changed: true,
        summary: "Support case created and verified.",
        data: { caseId: created.id ?? created.case_id ?? null, subject },
      };
    }
    case "notification_mark_read": {
      const notificationId =
        typeof safeInput.notificationId === "string" ? safeInput.notificationId : "";
      if (!notificationId) {
        return { ok: false, verified: false, summary: "Notification id is required.", errorCode: "invalid_input" };
      }
      const { data, error } = await supabase.rpc("perform_presence_notification_action", {
        p_notification_id: notificationId,
        p_action_type: "mark_as_reviewed",
      });
      if (error) {
        return { ok: false, verified: false, summary: "Notification could not be updated.", errorCode: "notification_write_failed" };
      }
      return {
        ok: true,
        verified: true,
        changed: true,
        summary: "Notification marked as read.",
        data: { notificationId, result: asRecord(data) },
      };
    }
    case "organization_profile_draft":
    case "content_draft_create":
    case "knowledge_draft_create": {
      const kind =
        step.toolKey === "organization_profile_draft"
          ? "organization_profile"
          : step.toolKey === "knowledge_draft_create"
            ? "knowledge"
            : "content";
      const title =
        typeof safeInput.title === "string" && safeInput.title.trim()
          ? safeInput.title.trim().slice(0, 200)
          : kind === "organization_profile"
            ? "Organization profile draft"
            : kind === "knowledge"
              ? "Knowledge draft"
              : "Content draft";
      const locale =
        typeof safeInput.locale === "string" && safeInput.locale.trim()
          ? safeInput.locale.trim().slice(0, 16)
          : "en";
      const idempotencyKey =
        typeof safeInput.idempotencyKey === "string" && safeInput.idempotencyKey
          ? safeInput.idempotencyKey
          : createKompisOperatorIdempotencyKey();
      const { data, error } = await supabase.rpc("create_app_kompis_operator_draft", {
        p_draft_kind: kind,
        p_title: title,
        p_locale: locale,
        p_body: {
          text: typeof safeInput.text === "string" ? safeInput.text.slice(0, 4000) : "",
          source: "kompis_operator_v2",
        },
        p_idempotency_key: idempotencyKey,
        p_run_id: runId,
      });
      if (error) {
        return { ok: false, verified: false, summary: "Draft could not be created.", errorCode: "draft_create_failed" };
      }
      const draft = asRecord(data);
      const verified = await verifyDraft(supabase, String(draft.id ?? ""), organizationId);
      return {
        ok: verified,
        verified,
        changed: draft.idempotent_replay !== true,
        summary: verified
          ? "Draft created. Nothing was published."
          : "Draft write needs follow-up verification.",
        data: draft,
        errorCode: verified ? undefined : "draft_verify_uncertain",
      };
    }
    case "content_draft_update": {
      const draftId = typeof safeInput.draftId === "string" ? safeInput.draftId : "";
      const expectedVersion =
        typeof safeInput.expectedVersion === "number" ? safeInput.expectedVersion : null;
      if (!draftId || expectedVersion == null) {
        return { ok: false, verified: false, summary: "Draft id and version are required.", errorCode: "invalid_input" };
      }
      const { data, error } = await supabase.rpc("update_app_kompis_operator_draft", {
        p_draft_id: draftId,
        p_title: typeof safeInput.title === "string" ? safeInput.title : null,
        p_body: {
          text: typeof safeInput.text === "string" ? safeInput.text.slice(0, 4000) : "",
        },
        p_expected_version: expectedVersion,
      });
      if (error) {
        const code = /VERSION_CONFLICT/i.test(error.message)
          ? "draft_version_conflict"
          : "draft_update_failed";
        return { ok: false, verified: false, summary: "Draft could not be updated.", errorCode: code };
      }
      const draft = asRecord(data);
      const verified = await verifyDraft(supabase, String(draft.id ?? draftId), organizationId);
      return {
        ok: verified,
        verified,
        changed: true,
        summary: verified
          ? "Draft updated. Nothing was published."
          : "Draft update needs follow-up verification.",
        data: draft,
        errorCode: verified ? undefined : "draft_verify_uncertain",
      };
    }
    default: {
      const tool = getKompisOperatorTool(step.toolKey);
      return {
        ok: false,
        verified: false,
        summary: "Tool is unavailable.",
        errorCode: tool?.unavailableReason ?? "tool_unavailable",
      };
    }
  }
}

export async function executeKompisOperatorPlan(input: {
  supabase: SupabaseClient;
  runId: string;
  idempotencyKey: string;
  plan: KompisOperatorPlan;
}): Promise<{
  status: "completed" | "partial" | "failed" | "blocked" | "attention";
  resultSummary: string;
  safeErrorCode: string | null;
  stepResults: Array<{ sequence: number; status: string; result: Record<string, unknown> }>;
}> {
  const { supabase, runId, idempotencyKey, plan } = input;

  const begin = await supabase.rpc("begin_app_kompis_operator_run_execution", {
    p_run_id: runId,
    p_idempotency_key: idempotencyKey,
  });
  if (begin.error) {
    return {
      status: "failed",
      resultSummary: "Execution could not start.",
      safeErrorCode: "execution_begin_failed",
      stepResults: [],
    };
  }

  if (plan.riskClass === 3) {
    await supabase.rpc("complete_app_kompis_operator_run", {
      p_run_id: runId,
      p_status: "blocked",
      p_result_summary: "Critical action blocked.",
      p_safe_error_code: "critical_blocked",
    });
    return {
      status: "blocked",
      resultSummary: "Critical action blocked.",
      safeErrorCode: "critical_blocked",
      stepResults: [],
    };
  }

  const workspace = await loadWorkspace(supabase);
  if (workspace.available !== true) {
    await supabase.rpc("complete_app_kompis_operator_run", {
      p_run_id: runId,
      p_status: "blocked",
      p_result_summary: "Kompis is not available for this organization.",
      p_safe_error_code: "kompis_unavailable",
    });
    return {
      status: "blocked",
      resultSummary: "Kompis is not available for this organization.",
      safeErrorCode: "kompis_unavailable",
      stepResults: [],
    };
  }

  const stepResults: Array<{ sequence: number; status: string; result: Record<string, unknown> }> = [];
  let failed = false;
  let uncertain = false;

  for (const step of plan.steps) {
    const tool = getKompisOperatorTool(step.toolKey);
    if (!tool?.available) {
      failed = true;
      stepResults.push({
        sequence: step.sequence,
        status: "blocked",
        result: { ok: false, errorCode: tool?.unavailableReason ?? "tool_unavailable" },
      });
      break;
    }

    const result = await executeTool(supabase, step, workspace, runId);
    const status = result.ok ? (result.verified ? "completed" : "attention") : "failed";
    if (!result.ok) failed = true;
    if (result.ok && !result.verified) uncertain = true;

    await supabase.rpc("record_app_kompis_operator_step_result", {
      p_run_id: runId,
      p_sequence: step.sequence,
      p_status: status === "attention" ? "completed" : status,
      p_result_summary: {
        ok: result.ok,
        verified: result.verified,
        summary: result.summary,
        errorCode: result.errorCode ?? null,
        changed: result.changed === true,
        data: result.data ?? {},
      },
    });

    stepResults.push({
      sequence: step.sequence,
      status,
      result: {
        ok: result.ok,
        verified: result.verified,
        summary: result.summary,
        errorCode: result.errorCode ?? null,
        data: result.data ?? {},
      },
    });

    if (!result.ok) break;
  }

  const finalStatus = failed
    ? stepResults.some((step) => step.status === "completed")
      ? "partial"
      : "failed"
    : uncertain
      ? "attention"
      : "completed";

  const resultSummary = failed
    ? "Task stopped before all steps completed."
    : uncertain
      ? "Task finished but result verification needs follow-up."
      : "Task completed and authoritatively verified.";

  await supabase.rpc("complete_app_kompis_operator_run", {
    p_run_id: runId,
    p_status: finalStatus === "attention" ? "attention" : finalStatus,
    p_result_summary: resultSummary,
    p_safe_error_code: failed
      ? "step_failed"
      : uncertain
        ? "verifier_uncertain"
        : null,
  });

  return {
    status: finalStatus,
    resultSummary,
    safeErrorCode: failed ? "step_failed" : uncertain ? "verifier_uncertain" : null,
    stepResults,
  };
}
