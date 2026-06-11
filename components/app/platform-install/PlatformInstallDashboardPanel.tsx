"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parsePlatformInstallDashboard,
  type PlatformInstallDashboard,
} from "@/lib/aipify/platform-install";

type PlatformInstallDashboardPanelProps = {
  labels: Record<string, string>;
};

function statusClass(status?: string) {
  switch (status) {
    case "completed":
    case "live":
    case "trial_active":
    case "passed":
      return "bg-emerald-100 text-emerald-800";
    case "in_progress":
    case "connected":
    case "health_check_required":
      return "bg-amber-100 text-amber-800";
    case "pending":
    case "scheduled":
    case "payment_required":
      return "bg-blue-100 text-blue-800";
    case "failed":
    case "issue_detected":
      return "bg-rose-100 text-rose-800";
    default:
      return "bg-stone-100 text-stone-700";
  }
}

export function PlatformInstallDashboardPanel({ labels }: PlatformInstallDashboardPanelProps) {
  const [dashboard, setDashboard] = useState<PlatformInstallDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);
  const [domain, setDomain] = useState("");
  const [otherPlatform, setOtherPlatform] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/platform-install/dashboard");
    if (res.ok) setDashboard(parsePlatformInstallDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const startSession = async () => {
    setActing("start");
    await fetch("/api/install/start", { method: "POST" });
    setActing(null);
    await load();
  };

  const registerPayment = async () => {
    setActing("payment");
    const res = await fetch("/api/billing/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan_key: "starter" }),
    });
    const data = (await res.json()) as { checkout_url?: string; demo_mode?: boolean };
    if (data.checkout_url) window.location.href = data.checkout_url;
    else await load();
    setActing(null);
  };

  const selectPlatform = async (platform: string) => {
    setActing(`platform-${platform}`);
    await fetch("/api/install/select-platform", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ platform, other_platform: platform === "other" ? otherPlatform : null }),
    });
    setActing(null);
    await load();
  };

  const connectPlatform = async (installationId: string) => {
    setActing(`connect-${installationId}`);
    await fetch("/api/install/connect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ installation_id: installationId, connection: { domain } }),
    });
    setActing(null);
    await load();
  };

  const verifyInstallation = async (installationId: string) => {
    setActing(`verify-${installationId}`);
    await fetch("/api/install/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ installation_id: installationId }),
    });
    setActing(null);
    await load();
  };

  const runHealthCheck = async (installationId: string) => {
    setActing(`health-${installationId}`);
    await fetch("/api/install/health-check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ installation_id: installationId }),
    });
    setActing(null);
    await load();
  };

  const cancelTrial = async () => {
    setActing("cancel");
    await fetch("/api/aipify/platform-install/trial/cancel", { method: "POST" });
    setActing(null);
    await load();
  };

  const generateBriefing = async () => {
    await fetch("/api/aipify/platform-install/briefings/generate", { method: "POST" });
    await load();
  };

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (!dashboard?.has_customer) return null;

  const activeInstallation = dashboard.connector_installations[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Link href="/app/install" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.installAssistant}
        </Link>
        <Link href="/app/settings/billing" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.billing}
        </Link>
        <Link href="/app/knowledge-center" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.knowledgeCenter}
        </Link>
      </div>

      <section className="rounded-xl border border-teal-200 bg-teal-50/50 p-6">
        <h2 className="text-sm font-semibold text-teal-900">{labels.installProgress}</h2>
        <p className="mt-2 text-4xl font-bold text-teal-800">
          {dashboard.install_score ?? 0}
          <span className="text-lg font-normal text-gray-500">/100</span>
        </p>
        <p className="mt-1 text-sm font-medium text-teal-700">
          {dashboard.steps_completed ?? 0}/{dashboard.steps_total ?? 0} {labels.stepsCompleted} ·{" "}
          {labels.trialStatus}: {dashboard.trial_status?.replace(/_/g, " ")}
        </p>
        <p className="mt-2 text-sm text-teal-800">{dashboard.philosophy}</p>
        <p className="mt-2 rounded-lg border border-teal-100 bg-white/60 px-3 py-2 text-xs text-teal-800">
          {dashboard.billing_copy_full}
        </p>
        <p className="mt-1 text-xs text-teal-700">{dashboard.safety_note}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void startSession()}
            disabled={acting === "start"}
            className="rounded-md bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800 disabled:opacity-50"
          >
            {labels.startWizard}
          </button>
          {!dashboard.payment_method_registered ? (
            <button
              type="button"
              onClick={() => void registerPayment()}
              disabled={acting === "payment"}
              className="rounded-md border border-teal-700 px-4 py-2 text-sm font-medium text-teal-800 hover:bg-teal-100 disabled:opacity-50"
            >
              {labels.registerPayment}
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => void generateBriefing()}
            className="rounded-md border border-teal-300 px-4 py-2 text-sm text-teal-800 hover:bg-teal-100"
          >
            {labels.generateBriefing}
          </button>
        </div>
      </section>

      {dashboard.assistant_messages.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.installAssistantMessages}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.assistant_messages.map((msg) => (
              <li
                key={msg.id}
                className={`rounded-lg border px-3 py-2 text-sm ${
                  msg.message_type === "error"
                    ? "border-rose-200 bg-rose-50 text-rose-900"
                    : msg.message_type === "billing"
                      ? "border-blue-200 bg-blue-50 text-blue-900"
                      : msg.message_type === "success"
                        ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                        : "border-gray-100 bg-gray-50 text-gray-700"
                }`}
              >
                {msg.content}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section>
        <h2 className="text-sm font-semibold text-gray-900">{labels.choosePlatform}</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {dashboard.platform_connectors.map((connector) => (
            <article key={connector.id} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <p className="font-medium text-gray-900">{connector.name}</p>
              <p className="mt-1 text-xs text-gray-600">{connector.description}</p>
              <p className="mt-2 text-xs capitalize text-teal-700">{connector.install_method}</p>
              <button
                type="button"
                disabled={acting === `platform-${connector.connector_key}` || !dashboard.payment_method_registered}
                onClick={() => void selectPlatform(connector.connector_key)}
                className="mt-3 rounded-md bg-teal-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-teal-800 disabled:opacity-50"
              >
                {labels.selectPlatform}
              </button>
            </article>
          ))}
        </div>
        <div className="mt-3">
          <input
            type="text"
            value={otherPlatform}
            onChange={(e) => setOtherPlatform(e.target.value)}
            placeholder={labels.otherPlatformPlaceholder}
            className="w-full max-w-md rounded-md border border-gray-200 px-3 py-2 text-sm"
          />
        </div>
      </section>

      {activeInstallation ? (
        <section className="rounded-lg border border-gray-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-gray-900">{labels.connectPlatform}</h2>
          <p className="mt-1 text-xs capitalize text-gray-500">
            {activeInstallation.platform} · {activeInstallation.install_status?.replace(/_/g, " ")}
          </p>
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder={labels.domainPlaceholder}
            className="mt-3 w-full max-w-md rounded-md border border-gray-200 px-3 py-2 text-sm"
          />
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              disabled={acting === `connect-${activeInstallation.id}`}
              onClick={() => void connectPlatform(activeInstallation.id)}
              className="rounded-md bg-teal-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-teal-800 disabled:opacity-50"
            >
              {labels.connect}
            </button>
            <button
              type="button"
              disabled={acting === `verify-${activeInstallation.id}`}
              onClick={() => void verifyInstallation(activeInstallation.id)}
              className="rounded-md border border-teal-700 px-3 py-1.5 text-xs font-medium text-teal-800 disabled:opacity-50"
            >
              {labels.verifyPermissions}
            </button>
            <button
              type="button"
              disabled={acting === `health-${activeInstallation.id}`}
              onClick={() => void runHealthCheck(activeInstallation.id)}
              className="rounded-md border border-emerald-700 px-3 py-1.5 text-xs font-medium text-emerald-800 disabled:opacity-50"
            >
              {labels.runHealthCheck}
            </button>
          </div>
        </section>
      ) : null}

      {dashboard.installation_errors.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.installationErrors}</h2>
          <div className="mt-3 space-y-2">
            {dashboard.installation_errors.map((err) => (
              <article key={err.id} className="rounded-lg border border-rose-200 bg-rose-50/50 p-4">
                <p className="font-medium text-rose-900">{err.title}</p>
                <p className="mt-1 text-xs text-rose-800">{err.explanation}</p>
                <p className="mt-2 text-xs font-medium text-rose-900">{labels.fixRecommendation}: {err.fix_recommendation}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.wizard_steps.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.wizardSteps}</h2>
          <ol className="mt-3 space-y-2">
            {dashboard.wizard_steps.map((step) => (
              <li key={step.id} className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
                <span className="text-xs font-semibold text-gray-500">{step.step_order}</span>
                <span className="flex-1 text-gray-900">{step.title}</span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusClass(step.status)}`}>
                  {step.status?.replace(/_/g, " ")}
                </span>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {dashboard.health_checks.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.healthChecks}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.health_checks.map((check) => (
              <li key={check.id} className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
                <span>{check.summary}</span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusClass(check.status)}`}>
                  {check.status}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.trial_reminders.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.trialReminders}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.trial_reminders.map((reminder) => (
              <li key={reminder.id} className="rounded-lg border border-blue-100 bg-blue-50/40 px-3 py-2 text-xs text-blue-900">
                <span className="font-medium">Day {reminder.reminder_day}:</span> {reminder.message}
              </li>
            ))}
          </ul>
          {dashboard.trial_status === "trial_active" ? (
            <button
              type="button"
              disabled={acting === "cancel"}
              onClick={() => void cancelTrial()}
              className="mt-3 text-xs text-rose-700 underline hover:text-rose-900 disabled:opacity-50"
            >
              {labels.cancelTrial}
            </button>
          ) : null}
        </section>
      ) : null}

      {dashboard.briefings.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.recentBriefings}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.briefings.map((b) => (
              <li key={b.id} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-700">
                {b.summary}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
