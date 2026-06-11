"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyEmptyState } from "@/components/branding";
import type { CustomerApproval } from "@/lib/app/customer-app";
import { RISK_LEVEL_STYLES, type ActionLevel } from "@/lib/trust-action";
import { formatDate } from "@/lib/i18n/format-date";
import { createClient } from "@/lib/supabase/client";

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
    riskLevels: Record<string, string>;
    statusLabels: Record<string, string>;
    categoryLabels: Record<string, string>;
    fields: {
      skill: string;
      confidence: string;
      approver: string;
      reasoning: string;
    };
  };
};

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-100 text-amber-900",
  approved: "bg-emerald-100 text-emerald-900",
  rejected: "bg-rose-100 text-rose-900",
  completed: "bg-gray-100 text-gray-700",
  executing: "bg-indigo-100 text-indigo-900",
};

function riskStyle(level: string): string {
  const numeric = Number(level);
  if (!Number.isNaN(numeric) && numeric in RISK_LEVEL_STYLES) {
    return RISK_LEVEL_STYLES[numeric as ActionLevel];
  }
  return "bg-gray-100 text-gray-700";
}

export function ApprovalsCenterPanel({ locale, labels }: ApprovalsCenterPanelProps) {
  const [items, setItems] = useState<CustomerApproval[]>([]);
  const [emergencyState, setEmergencyState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const supabase = createClient();
    const { data, error } = await supabase.rpc("get_customer_approvals_center");
    if (!error && data?.has_customer) {
      setItems((data.approvals as CustomerApproval[]) ?? []);
      setEmergencyState(
        typeof data.emergency_state === "string" ? data.emergency_state : null
      );
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function approveAction(id: string) {
    setActingId(id);
    await fetch(`/api/actions/${id}/approve`, { method: "POST" });
    await refresh();
    setActingId(null);
  }

  async function rejectAction(id: string) {
    setActingId(id);
    await fetch(`/api/actions/${id}/reject`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    await refresh();
    setActingId(null);
  }

  async function emergencyStop() {
    await fetch("/api/actions/emergency-stop", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ state: "emergency_shutdown", reason: "Manual stop" }),
    });
    await refresh();
  }

  if (loading) return <div className="p-6 text-sm text-gray-600">{labels.loading}</div>;

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

      {items.length === 0 ? (
        <AipifyEmptyState message={labels.empty} pulseLabel={labels.pulseLabel} />
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li
              key={`${item.category}-${item.id}`}
              className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
            >
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-semibold text-gray-900">{item.title}</h2>
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
                    onClick={() => void approveAction(item.id)}
                    className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {actingId === item.id ? labels.executing : labels.approve}
                  </button>
                  <button
                    type="button"
                    disabled={actingId === item.id}
                    onClick={() => void rejectAction(item.id)}
                    className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    {labels.reject}
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      <p className="text-sm text-gray-500">
        <Link href="/app/command-center" className="text-indigo-600 hover:underline">
          {labels.openActionCenter}
        </Link>
      </p>
    </div>
  );
}
