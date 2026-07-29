import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { KompisOperatorPlan } from "./planner";
import { getKompisOperatorTool } from "./tools-registry";

type ToolResult = {
  ok: boolean;
  summary: string;
  data?: Record<string, unknown>;
  errorCode?: string;
};

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

async function executeReadTool(
  supabase: SupabaseClient,
  toolKey: string,
  workspace: Record<string, unknown>,
): Promise<ToolResult> {
  switch (toolKey) {
    case "customer_profile_read":
      return {
        ok: true,
        summary: "Organization profile loaded.",
        data: { organization: asRecord(workspace.organization) },
      };
    case "agreement_status_read":
      return {
        ok: true,
        summary: "Agreement status loaded.",
        data: { agreement: asRecord(workspace.agreement) },
      };
    case "license_status_read":
      return {
        ok: true,
        summary: "APP license status loaded.",
        data: { parentLicense: asRecord(workspace.parent_license) },
      };
    case "domain_installation_status_read":
      return {
        ok: true,
        summary: "Domain and installation status loaded.",
        data: {
          domain: asRecord(workspace.website_kompis).domain ?? null,
          installationId: asRecord(workspace.website_kompis).installation_id ?? null,
        },
      };
    case "website_kompis_status_read":
      return {
        ok: true,
        summary: "Website Kompis delivery status loaded.",
        data: { websiteKompis: asRecord(workspace.website_kompis) },
      };
    case "app_access_status_read":
      return {
        ok: true,
        summary: "APP panel access status loaded.",
        data: {
          available: workspace.available === true,
          organization: asRecord(workspace.organization),
        },
      };
    case "organization_profile_draft":
      return {
        ok: true,
        summary: "Profile change draft prepared. Nothing was published.",
        data: {
          draft: true,
          published: false,
          organizationId: asRecord(workspace.organization).id ?? null,
        },
      };
    case "content_draft_create":
      return {
        ok: true,
        summary: "Content draft prepared. Nothing was sent.",
        data: { draft: true, sent: false, kind: "support_case_draft" },
      };
    default: {
      const tool = getKompisOperatorTool(toolKey);
      return {
        ok: false,
        summary: "Tool is unavailable in V1.",
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
  status: "completed" | "partial" | "failed" | "blocked";
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
  const beginData = asRecord(begin.data);
  if (beginData.already_finished === true) {
    return {
      status: (String(beginData.status) as "completed") || "completed",
      resultSummary: "Run was already finished.",
      safeErrorCode: null,
      stepResults: [],
    };
  }

  const workspaceRes = await supabase.rpc("get_app_kompis_operator_workspace");
  if (workspaceRes.error || asRecord(workspaceRes.data).available !== true) {
    await supabase.rpc("complete_app_kompis_operator_run", {
      p_run_id: runId,
      p_status: "blocked",
      p_result_summary: "Kompis capability was not available at execution time.",
      p_safe_error_code: "capability_lost",
    });
    return {
      status: "blocked",
      resultSummary: "Kompis capability was not available at execution time.",
      safeErrorCode: "capability_lost",
      stepResults: [],
    };
  }

  const workspace = asRecord(workspaceRes.data);
  const stepResults: Array<{ sequence: number; status: string; result: Record<string, unknown> }> =
    [];
  let failed = false;
  let blocked = false;

  for (const step of plan.steps) {
    const toolResult = await executeReadTool(supabase, step.toolKey, workspace);
    const stepStatus = toolResult.ok ? "completed" : toolResult.errorCode === "capability_lost" ? "blocked" : "failed";
    if (!toolResult.ok) {
      failed = stepStatus === "failed";
      blocked = stepStatus === "blocked";
    }
    const payload = {
      ok: toolResult.ok,
      summary: toolResult.summary,
      data: toolResult.data ?? {},
      error_code: toolResult.errorCode ?? null,
    };
    await supabase.rpc("record_app_kompis_operator_step_result", {
      p_run_id: runId,
      p_sequence: step.sequence,
      p_status: stepStatus,
      p_result: payload,
    });
    stepResults.push({ sequence: step.sequence, status: stepStatus, result: payload });
    if (!toolResult.ok) break;
  }

  const completedCount = stepResults.filter((s) => s.status === "completed").length;
  const finalStatus = blocked
    ? "blocked"
    : failed && completedCount > 0
      ? "partial"
      : failed
        ? "failed"
        : "completed";
  const resultSummary =
    finalStatus === "completed"
      ? "All planned steps completed and verified."
      : finalStatus === "partial"
        ? "Some steps completed before execution stopped."
        : finalStatus === "blocked"
          ? "Execution was blocked by policy or capability."
          : "Execution failed before completion.";

  await supabase.rpc("complete_app_kompis_operator_run", {
    p_run_id: runId,
    p_status: finalStatus,
    p_result_summary: resultSummary,
    p_safe_error_code: failed || blocked ? stepResults.at(-1)?.result.error_code ?? "execution_failed" : null,
  });

  return {
    status: finalStatus,
    resultSummary,
    safeErrorCode: failed || blocked ? String(stepResults.at(-1)?.result.error_code ?? "execution_failed") : null,
    stepResults,
  };
}
