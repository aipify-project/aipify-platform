"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AipifyEmptyState } from "@/components/branding";
import {
  DEVELOPER_SETTINGS_ROUTE,
  INSTALL_PLATFORM_OPTIONS,
  MODERN_INSTALL_FLOW,
  type InstallPlatformOption,
} from "@/lib/install/experience";
import { getInstallGuide } from "@/lib/install/knowledge-base";
import type { ModernInstallState } from "@/lib/install/modern-state";
import { createClient } from "@/lib/supabase/client";

type ModernInstallAssistantPanelProps = {
  labels: {
    title: string;
    subtitle: string;
    principle: string;
    loading: string;
    empty: string;
    pulseLabel: string;
    assistantPrompt: string;
    platforms: Record<InstallPlatformOption, string>;
    flow: Record<string, string>;
    heartbeat: Record<string, string>;
    planLimits: string;
    beginConnect: string;
    viewGuide: string;
    escalate: string;
    escalateTitle: string;
    escalateHint: string;
    escalateSubmit: string;
    escalateSuccess: string;
    escalateError: string;
    developerLink: string;
    detecting: string;
    detectionUncertain: string;
    working: string;
    error: string;
    licensePaused: string;
    licenseGrace: string;
  };
};

export function ModernInstallAssistantPanel({ labels }: ModernInstallAssistantPanelProps) {
  const [state, setState] = useState<ModernInstallState | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState<InstallPlatformOption | null>(null);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [escalationOpen, setEscalationOpen] = useState(false);
  const [escalationSummary, setEscalationSummary] = useState("");
  const [escalationDone, setEscalationDone] = useState(false);

  const refresh = useCallback(async () => {
    const supabase = createClient();
    const { data, error: rpcError } = await supabase.rpc("get_customer_modern_install_state");
    if (!rpcError && data) {
      const next = data as ModernInstallState;
      setState(next);
      if (next.selected_platform) {
        setSelectedPlatform(next.selected_platform);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const guide = useMemo(
    () => (selectedPlatform ? getInstallGuide(selectedPlatform) : undefined),
    [selectedPlatform]
  );

  async function handleSelectPlatform(platform: InstallPlatformOption) {
    setSelectedPlatform(platform);
    setWorking(true);
    setError(null);

    const supabase = createClient();
    const { error: saveError } = await supabase.rpc("save_modern_install_platform", {
      p_platform: platform,
    });

    if (saveError) {
      setError(labels.error);
      setWorking(false);
      return;
    }

    if (platform !== "not_sure" && platform !== "developer_setup") {
      const beginRes = await fetch("/api/install/begin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform }),
      });
      if (!beginRes.ok) {
        const payload = (await beginRes.json()) as { error?: string };
        setError(payload.error ?? labels.error);
      }
    }

    await refresh();
    setWorking(false);
  }

  async function handleEscalate() {
    if (!escalationSummary.trim() || !selectedPlatform) return;
    setWorking(true);
    setError(null);

    const res = await fetch("/api/install/escalate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        platform_type: selectedPlatform,
        error_summary: escalationSummary.trim(),
        domain: state?.installations?.[0]?.domain,
        installation_status: state?.installations?.[0]?.status,
        installation_id: state?.installations?.[0]?.id,
      }),
    });

    setWorking(false);
    if (!res.ok) {
      setError(labels.escalateError);
      return;
    }
    setEscalationDone(true);
    setEscalationOpen(false);
  }

  if (loading) {
    return <div className="p-6 text-sm text-gray-600">{labels.loading}</div>;
  }

  if (!state?.has_customer) {
    return (
      <div className="p-6">
        <AipifyEmptyState message={labels.empty} pulseLabel={labels.pulseLabel} />
      </div>
    );
  }

  const licenseBanner =
    state.license?.service_status === "paused"
      ? labels.licensePaused
      : state.license?.service_status === "grace_period"
        ? labels.licenseGrace
        : null;

  return (
    <div className="mx-auto max-w-3xl space-y-8 p-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-sm text-gray-600">{labels.subtitle}</p>
        <p className="mt-3 rounded-lg border border-indigo-100 bg-indigo-50/60 px-3 py-2 text-sm text-indigo-900">
          {state.principle ?? labels.principle}
        </p>
        {licenseBanner && (
          <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
            {licenseBanner}
          </p>
        )}
      </div>

      <section className="rounded-lg border border-gray-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-gray-900">{labels.assistantPrompt}</h2>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {INSTALL_PLATFORM_OPTIONS.map((platform) => (
            <button
              key={platform}
              type="button"
              disabled={working}
              onClick={() => void handleSelectPlatform(platform)}
              className={`rounded-lg border px-4 py-3 text-left text-sm transition ${
                selectedPlatform === platform
                  ? "border-indigo-500 bg-indigo-50 text-indigo-900"
                  : "border-gray-200 hover:border-indigo-200 hover:bg-gray-50"
              }`}
            >
              {labels.platforms[platform]}
            </button>
          ))}
        </div>
        {working && <p className="mt-3 text-sm text-gray-500">{labels.working}</p>}
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        {escalationDone && (
          <p className="mt-3 text-sm text-emerald-700">{labels.escalateSuccess}</p>
        )}
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-5">
        <ol className="space-y-3">
          {MODERN_INSTALL_FLOW.map((step) => {
            const flowItem = state.flow?.find((f) => f.id === step.id);
            const complete = flowItem?.complete ?? false;
            return (
              <li key={step.id} className="flex items-start gap-3 text-sm">
                <span
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-medium ${
                    complete
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {complete ? "✓" : step.order}
                </span>
                <span className={complete ? "text-gray-900" : "text-gray-600"}>
                  {labels.flow[step.id]}
                </span>
              </li>
            );
          })}
        </ol>
      </section>

      {state.plan_limits && (
        <p className="text-sm text-gray-600">
          {labels.planLimits
            .replace("{used}", String(state.plan_limits.used_installations))
            .replace("{max}", String(state.plan_limits.max_installations ?? "∞"))
            .replace("{plan}", String(state.plan_limits.plan))}
        </p>
      )}

      {guide && (
        <section className="rounded-lg border border-gray-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-gray-900">{labels.viewGuide}</h2>
          <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm text-gray-700">
            {guide.steps.map((step) => (
              <li key={step.order}>
                <span className="font-medium text-gray-900">
                  Step {step.order}
                </span>
              </li>
            ))}
          </ol>
        </section>
      )}

      {state.installations && state.installations.length > 0 && (
        <section className="rounded-lg border border-gray-200 bg-white p-5">
          <ul className="divide-y divide-gray-100">
            {state.installations.map((install) => (
              <li key={install.id} className="py-3 text-sm">
                <div className="font-medium text-gray-900">{install.name}</div>
                <div className="mt-1 text-gray-600">
                  {install.domain ?? "—"} · {install.status} ·{" "}
                  {labels.heartbeat[install.heartbeat_customer_label] ??
                    install.heartbeat_customer_label}
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setEscalationOpen((v) => !v)}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
        >
          {labels.escalate}
        </button>
        <Link
          href={DEVELOPER_SETTINGS_ROUTE}
          className="rounded-lg border border-indigo-200 px-4 py-2 text-sm text-indigo-700 hover:bg-indigo-50"
        >
          {labels.developerLink}
        </Link>
      </div>

      {escalationOpen && (
        <section className="rounded-lg border border-gray-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-gray-900">{labels.escalateTitle}</h2>
          <p className="mt-1 text-sm text-gray-600">{labels.escalateHint}</p>
          <textarea
            value={escalationSummary}
            onChange={(e) => setEscalationSummary(e.target.value)}
            rows={4}
            className="mt-4 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            placeholder={labels.escalateHint}
          />
          <button
            type="button"
            disabled={working || !escalationSummary.trim()}
            onClick={() => void handleEscalate()}
            className="mt-3 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {labels.escalateSubmit}
          </button>
        </section>
      )}
    </div>
  );
}
