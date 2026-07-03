"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyEmptyState } from "@/components/branding";
import { HumanApprovalReceipt } from "@/components/app/approvals/HumanApprovalReceipt";
import {
  buildHumanApprovalReceiptModel,
  buildCoreHumanApprovalRequestFromTrustRow,
} from "@/lib/core/human-approval";
import type { HumanApprovalReceiptLabels, HumanApprovalReceiptModel } from "@/lib/core/human-approval/types";
import type { CustomerApproval } from "@/lib/app/customer-app";
import {
  buildCompanionPendingDisplayFields,
  resolveApprovalPostRequest,
  resolveCompanionActionsLoadOutcome,
  resolveTrustApprovalsLoadOutcome,
  runIndependentApprovalLoads,
  shouldShowApprovalsEmptyState,
  type CompanionActionRequest,
} from "@/lib/companion-action-approval";
import { RISK_LEVEL_STYLES, type ActionLevel } from "@/lib/trust-action";
import { formatDate } from "@/lib/i18n/format-date";

type TrustApprovalItem = CustomerApproval & {
  core_approval_id?: string | null;
  correlation_id?: string | null;
  latest_audit_id?: string | null;
  scope_summary?: string | null;
  access_mode?: string | null;
  target_environment?: string | null;
  execution_result?: string | null;
  unchanged_summary?: string | null;
  approved_by_display?: string | null;
  approver_role_snapshot?: string | null;
  approved_at?: string | null;
  expires_at?: string | null;
  action_name?: string;
};

type ApprovalsCenterMeta = {
  philosophy?: string;
  mission?: string;
  abos_principle?: string;
  vision?: string;
  action_categories?: {
    key?: string;
    label?: string;
    approval?: string;
    examples?: string[];
  }[];
  success_criteria?: { key?: string; label?: string; met?: boolean; note?: string | null }[];
  transparency_requirements?: string[];
  integration_links?: { label?: string; route?: string }[];
  self_love_note?: string;
};

type ApprovalsCenterPanelProps = {
  locale: string;
  labels: {
    title: string;
    subtitle: string;
    loading: string;
    empty: string;
    pulseLabel: string;
    openActionCenter: string;
    approve: string;
    reject: string;
    executing: string;
    emergencyStop: string;
    emergencyActive: string;
    actionCategories?: string;
    successCriteria?: string;
    transparencyRequirements?: string;
    integrationLinks?: string;
    trustSection: string;
    trustLoadError: string;
    retry: string;
    riskLevels: Record<string, string>;
    statusLabels: Record<string, string>;
    categoryLabels: Record<string, string>;
    fields: {
      skill: string;
      confidence: string;
      approver: string;
      reasoning: string;
    };
    companion: {
      section: string;
      empty: string;
      loadError: string;
      openCenter: string;
      reason: string;
      expires: string;
      category: string;
      statusLabels: Record<string, string>;
    };
    confirmed: string;
    receipt: HumanApprovalReceiptLabels;
  };
};

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-100 text-amber-900",
  approved: "bg-emerald-100 text-emerald-900",
  rejected: "bg-rose-100 text-rose-900",
  completed: "bg-gray-100 text-gray-700",
  executing: "bg-indigo-100 text-indigo-900",
  awaiting_approval: "bg-amber-100 text-amber-900",
};

function riskStyle(level: string): string {
  const numeric = Number(level);
  if (!Number.isNaN(numeric) && numeric in RISK_LEVEL_STYLES) {
    return RISK_LEVEL_STYLES[numeric as ActionLevel];
  }
  return "bg-gray-100 text-gray-700";
}

function companionStatusLabel(
  status: string,
  labels: ApprovalsCenterPanelProps["labels"]["companion"]["statusLabels"],
): string {
  const normalized = status.trim().toLowerCase();
  return labels[`status_${normalized}`] ?? labels[normalized] ?? status;
}

export function ApprovalsCenterPanel({ locale, labels }: ApprovalsCenterPanelProps) {
  const [items, setItems] = useState<TrustApprovalItem[]>([]);
  const [centerMeta, setCenterMeta] = useState<ApprovalsCenterMeta | null>(null);
  const [emergencyState, setEmergencyState] = useState<string | null>(null);
  const [companionActions, setCompanionActions] = useState<CompanionActionRequest[]>([]);
  const [companionEmergencyStop, setCompanionEmergencyStop] = useState(false);
  const [trustLoading, setTrustLoading] = useState(true);
  const [companionLoading, setCompanionLoading] = useState(true);
  const [trustLoadError, setTrustLoadError] = useState<string | null>(null);
  const [companionLoadError, setCompanionLoadError] = useState<string | null>(null);
  const [actingId, setActingId] = useState<string | null>(null);
  const [receiptModels, setReceiptModels] = useState<Record<string, HumanApprovalReceiptModel>>({});

  const receiptHeading = labels.receipt.title || labels.confirmed;

  const rebuildReceipts = useCallback(
    (approvals: TrustApprovalItem[]) => {
      const next: Record<string, HumanApprovalReceiptModel> = {};
      for (const item of approvals) {
        if (item.category !== "action" || !item.core_approval_id) continue;
        if (!["approved", "completed", "executing"].includes(item.status)) continue;
        const coreRequest = buildCoreHumanApprovalRequestFromTrustRow(item);
        if (!coreRequest) continue;
        next[item.id] = buildHumanApprovalReceiptModel(coreRequest, receiptHeading, labels.receipt);
      }
      setReceiptModels(next);
    },
    [labels.receipt, receiptHeading],
  );

  const refreshTrust = useCallback(async () => {
    setTrustLoadError(null);
    try {
      const response = await fetch("/api/app/approvals");
      const payload = (await response.json()) as Record<string, unknown> & { error?: string };
      const outcome = resolveTrustApprovalsLoadOutcome({
        responseOk: response.ok,
        payload,
        fallbackError: labels.trustLoadError,
      });
      if (outcome.kind === "error") {
        setTrustLoadError(outcome.error);
        return;
      }
      if (payload?.has_customer) {
        setCenterMeta({
          philosophy: typeof payload.philosophy === "string" ? payload.philosophy : undefined,
          mission: typeof payload.mission === "string" ? payload.mission : undefined,
          abos_principle: typeof payload.abos_principle === "string" ? payload.abos_principle : undefined,
          vision: typeof payload.vision === "string" ? payload.vision : undefined,
          action_categories: Array.isArray(payload.action_categories)
            ? (payload.action_categories as ApprovalsCenterMeta["action_categories"])
            : undefined,
          success_criteria: Array.isArray(payload.success_criteria)
            ? (payload.success_criteria as ApprovalsCenterMeta["success_criteria"])
            : undefined,
          transparency_requirements: Array.isArray(payload.transparency_requirements)
            ? (payload.transparency_requirements as string[])
            : undefined,
          integration_links: Array.isArray(payload.integration_links)
            ? (payload.integration_links as ApprovalsCenterMeta["integration_links"])
            : undefined,
          self_love_note: typeof payload.self_love_note === "string" ? payload.self_love_note : undefined,
        });
        setItems((payload.approvals as TrustApprovalItem[]) ?? []);
        rebuildReceipts((payload.approvals as TrustApprovalItem[]) ?? []);
        setEmergencyState(
          typeof payload.emergency_state === "string" ? payload.emergency_state : null,
        );
      }
    } catch {
      setTrustLoadError(labels.trustLoadError);
    } finally {
      setTrustLoading(false);
    }
  }, [labels.trustLoadError, rebuildReceipts]);

  const refreshCompanion = useCallback(async () => {
    setCompanionLoadError(null);
    try {
      const response = await fetch("/api/companion/actions");
      const payload = await response.json();
      const outcome = resolveCompanionActionsLoadOutcome({
        responseOk: response.ok,
        payload,
        fallbackError: labels.companion.loadError,
      });
      if (outcome.kind === "error") {
        setCompanionLoadError(outcome.error);
        setCompanionActions([]);
        setCompanionEmergencyStop(false);
        return;
      }
      setCompanionActions(outcome.actions);
      setCompanionEmergencyStop(outcome.emergencyStop);
    } catch {
      setCompanionLoadError(labels.companion.loadError);
      setCompanionActions([]);
      setCompanionEmergencyStop(false);
    } finally {
      setCompanionLoading(false);
    }
  }, [labels.companion.loadError]);

  const refreshAll = useCallback(async () => {
    await runIndependentApprovalLoads({
      trust: refreshTrust,
      companion: refreshCompanion,
    });
  }, [refreshTrust, refreshCompanion]);

  const retryAll = useCallback(async () => {
    setTrustLoading(true);
    setCompanionLoading(true);
    await refreshAll();
  }, [refreshAll]);

  useEffect(() => {
    void refreshAll();
  }, [refreshAll]);

  async function postApprovalAction(
    source: "trust" | "companion",
    actionId: string,
    decision: "approve" | "reject",
  ) {
    const actingKey = source === "companion" ? `companion:${actionId}` : actionId;
    setActingId(actingKey);
    const { url, init } = resolveApprovalPostRequest(source, actionId, decision);
    const response = await fetch(url, init);
    const payload = (await response.json().catch(() => ({}))) as Record<string, unknown> & {
      receipt?: HumanApprovalReceiptModel;
    };

    if (source === "trust" && response.ok && decision === "approve" && payload.receipt) {
      setReceiptModels((current) => ({ ...current, [actionId]: payload.receipt as HumanApprovalReceiptModel }));
    }

    if (source === "companion") {
      await refreshCompanion();
    } else {
      await refreshTrust();
    }
    setActingId(null);
  }

  async function emergencyStop() {
    await fetch("/api/actions/emergency-stop", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ state: "emergency_shutdown", reason: "Manual stop" }),
    });
    await refreshTrust();
  }

  if (trustLoading && companionLoading) {
    return <AipifyLoadingState message={labels.loading} centered />;
  }

  const emergencyActive =
    emergencyState === "paused" || emergencyState === "emergency_shutdown";

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
          <p className="mt-2 text-gray-600">{labels.subtitle}</p>
        </div>
        <button
          type="button"
          onClick={() => void emergencyStop()}
          className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-800 hover:bg-rose-100"
        >
          {labels.emergencyStop}
        </button>
      </div>

      {emergencyActive && (
        <p className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          {labels.emergencyActive}
        </p>
      )}

      {centerMeta?.mission && (
        <section className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-4 text-sm">
          <p className="font-medium text-indigo-900">{centerMeta.mission}</p>
          {centerMeta.philosophy && <p className="mt-2 text-indigo-900">{centerMeta.philosophy}</p>}
          {centerMeta.abos_principle && (
            <p className="mt-2 text-xs text-indigo-800">{centerMeta.abos_principle}</p>
          )}
        </section>
      )}

      {centerMeta?.action_categories && centerMeta.action_categories.length > 0 && labels.actionCategories && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h2 className="text-sm font-semibold">{labels.actionCategories}</h2>
          <ul className="mt-2 grid gap-2 sm:grid-cols-3">
            {centerMeta.action_categories.map((cat) => (
              <li key={cat.key ?? cat.label} className="rounded border border-gray-100 px-2 py-2 text-xs">
                <span className="font-medium">{cat.label}</span>
                {cat.examples?.map((ex) => (
                  <p key={ex} className="text-gray-500">{ex}</p>
                ))}
              </li>
            ))}
          </ul>
        </section>
      )}

      {centerMeta?.success_criteria && centerMeta.success_criteria.length > 0 && labels.successCriteria && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h2 className="text-sm font-semibold">{labels.successCriteria}</h2>
          <ul className="mt-2 space-y-1 text-sm">
            {centerMeta.success_criteria.map((item) => (
              <li key={item.key ?? item.label}>
                <span className={item.met ? "text-green-800" : "text-gray-700"}>
                  {item.met ? "✓" : "○"} {item.label}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {centerMeta?.self_love_note && (
        <section className="rounded-lg border border-amber-100 bg-amber-50/50 px-4 py-3 text-sm text-amber-900">
          {centerMeta.self_love_note}
        </section>
      )}

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-900">{labels.trustSection}</h2>
        {trustLoadError && (
          <div className="space-y-2">
            <p className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
              {trustLoadError}
            </p>
            <button
              type="button"
              onClick={() => void retryAll()}
              className="rounded-lg border border-rose-200 px-3 py-1.5 text-sm text-rose-800 hover:bg-rose-50"
            >
              {labels.retry}
            </button>
          </div>
        )}
        {trustLoading ? (
          <AipifyLoadingState message={labels.loading} centered />
        ) : shouldShowApprovalsEmptyState({
            loading: trustLoading,
            error: trustLoadError,
            itemCount: items.length,
          }) ? (
          <AipifyEmptyState message={labels.empty} pulseLabel={labels.pulseLabel} />
        ) : trustLoadError ? null : (
          <ul className="space-y-3">
            {items.map((item) => (
              <li
                key={`${item.category}-${item.id}`}
                className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  <span
                    className={`rounded px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[item.status] ?? STATUS_STYLES.pending}`}
                  >
                    {labels.statusLabels[item.status] ?? item.status}
                  </span>
                  <span
                    className={`rounded px-2 py-0.5 text-xs font-medium ${riskStyle(item.risk_level)}`}
                  >
                    {labels.riskLevels[item.risk_level] ?? item.risk_level}
                  </span>
                  <span className="text-xs text-gray-500">
                    {labels.categoryLabels[item.category] ?? item.category}
                  </span>
                </div>

                {item.skill_name && (
                  <p className="mt-2 text-xs text-gray-500">
                    {labels.fields.skill}: {item.skill_name}
                  </p>
                )}

                {item.description && (
                  <p className="mt-2 text-sm text-gray-600">
                    <span className="font-medium text-gray-700">{labels.fields.reasoning}: </span>
                    {item.description}
                  </p>
                )}

                {typeof item.confidence_score === "number" && (
                  <p className="mt-1 text-xs text-gray-500">
                    {labels.fields.confidence}: {item.confidence_score}%
                  </p>
                )}

                {item.approver_role_required && (
                  <p className="mt-1 text-xs text-gray-500">
                    {labels.fields.approver}: {item.approver_role_required}
                  </p>
                )}

                <p className="mt-2 text-xs text-gray-400">{formatDate(item.created_at, locale)}</p>

                {item.category === "action" && item.status === "pending" && !emergencyActive && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={actingId === item.id}
                      onClick={() => void postApprovalAction("trust", item.id, "approve")}
                      className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700 disabled:opacity-50"
                    >
                      {actingId === item.id ? labels.executing : labels.approve}
                    </button>
                    <button
                      type="button"
                      disabled={actingId === item.id}
                      onClick={() => void postApprovalAction("trust", item.id, "reject")}
                      className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                      {labels.reject}
                    </button>
                  </div>
                )}

                {item.category === "action" && receiptModels[item.id] && (
                  <div className="mt-4">
                    <HumanApprovalReceipt model={receiptModels[item.id]} labels={labels.receipt} />
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-semibold text-gray-900">{labels.companion.section}</h2>
          <Link href="/app/companion/actions" className="text-sm text-indigo-600 hover:underline">
            {labels.companion.openCenter}
          </Link>
        </div>
        {companionLoadError && (
          <div className="space-y-2">
            <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              {companionLoadError}
            </p>
            <button
              type="button"
              onClick={() => void retryAll()}
              className="rounded-lg border border-amber-200 px-3 py-1.5 text-sm text-amber-900 hover:bg-amber-50"
            >
              {labels.retry}
            </button>
          </div>
        )}
        {companionLoading ? (
          <AipifyLoadingState message={labels.loading} centered />
        ) : shouldShowApprovalsEmptyState({
            loading: companionLoading,
            error: companionLoadError,
            itemCount: companionActions.length,
          }) ? (
          <p className="text-sm text-gray-500">{labels.companion.empty}</p>
        ) : companionLoadError ? null : (
          <ul className="space-y-3">
            {companionActions.map((action) => {
              const display = buildCompanionPendingDisplayFields(action);
              const actingKey = `companion:${display.id}`;
              const isPending =
                display.status === "pending" || display.status === "awaiting_approval";

              return (
                <li
                  key={display.id}
                  className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-gray-900">{display.title}</h3>
                    <span
                      className={`rounded px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[display.status] ?? STATUS_STYLES.pending}`}
                    >
                      {companionStatusLabel(display.status, labels.companion.statusLabels)}
                    </span>
                  </div>

                  {display.description && (
                    <p className="mt-2 text-sm text-gray-600">
                      <span className="font-medium text-gray-700">{labels.companion.reason}: </span>
                      {display.description}
                    </p>
                  )}

                  {display.category && (
                    <p className="mt-1 text-xs text-gray-500">
                      {labels.companion.category}: {display.category}
                    </p>
                  )}

                  {display.expiresAt && (
                    <p className="mt-2 text-xs text-gray-400">
                      {labels.companion.expires}: {formatDate(display.expiresAt, locale)}
                    </p>
                  )}

                  {isPending && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled={actingId === actingKey || companionEmergencyStop}
                        onClick={() => void postApprovalAction("companion", display.id, "approve")}
                        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700 disabled:opacity-50"
                      >
                        {actingId === actingKey ? labels.executing : labels.approve}
                      </button>
                      <button
                        type="button"
                        disabled={actingId === actingKey}
                        onClick={() => void postApprovalAction("companion", display.id, "reject")}
                        className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                      >
                        {labels.reject}
                      </button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {centerMeta?.integration_links && centerMeta.integration_links.length > 0 && labels.integrationLinks && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h2 className="text-sm font-semibold">{labels.integrationLinks}</h2>
          <ul className="mt-2 space-y-1 text-sm">
            {centerMeta.integration_links.map((link) =>
              link.route ? (
                <li key={link.label}>
                  <Link href={link.route} className="text-indigo-600 hover:underline">
                    {link.label}
                  </Link>
                </li>
              ) : null
            )}
          </ul>
        </section>
      )}

      <p className="text-sm text-gray-500">
        <Link href="/app/command-center" className="text-indigo-600 hover:underline">
          {labels.openActionCenter}
        </Link>
      </p>
    </div>
  );
}
