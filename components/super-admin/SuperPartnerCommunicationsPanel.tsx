"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  deliveryStatusLabel,
  parseSuperPartnerCommunications,
  parseSuperPartnerEmailLogs,
  parseSuperPartnerEmailTemplates,
  templateCategoryLabel,
  type SuperPartnerCommunicationsOverview,
  type SuperPartnerEmailLog,
  type SuperPartnerEmailTemplate,
} from "@/lib/partner-communications-email";

type Props = {
  labels: Record<string, string>;
};

type Tab = "templates" | "recognition" | "settlement" | "compliance" | "logs";

const RECOGNITION_CATEGORIES = new Set([
  "first_sale_celebration",
  "sale_confirmation",
  "milestone_celebration",
  "commission_update",
]);
const SETTLEMENT_CATEGORIES = new Set(["settlement_ready", "invoice_approved", "payment_sent"]);
const COMPLIANCE_CATEGORIES = new Set(["compliance_reminder", "business_verification", "partner_onboarding"]);

export function SuperPartnerCommunicationsPanel({ labels }: Props) {
  const [overview, setOverview] = useState<SuperPartnerCommunicationsOverview | null>(null);
  const [templates, setTemplates] = useState<SuperPartnerEmailTemplate[]>([]);
  const [logs, setLogs] = useState<SuperPartnerEmailLog[]>([]);
  const [tab, setTab] = useState<Tab>("templates");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [testEmail, setTestEmail] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const [mainRes, logsRes] = await Promise.all([
        fetch("/api/super/partner-communications"),
        fetch("/api/super/partner-communications/logs?limit=50"),
      ]);
      if (!mainRes.ok) {
        setError(true);
        setLoading(false);
        return;
      }
      const mainJson = await mainRes.json();
      setOverview(parseSuperPartnerCommunications(mainJson.overview));
      setTemplates(parseSuperPartnerEmailTemplates({ templates: mainJson.templates }));
      if (logsRes.ok) {
        setLogs(parseSuperPartnerEmailLogs(await logsRes.json()));
      }
    } catch {
      setError(true);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filteredTemplates = templates.filter((template) => {
    if (tab === "recognition") return RECOGNITION_CATEGORIES.has(template.template_category);
    if (tab === "settlement") return SETTLEMENT_CATEGORIES.has(template.template_category);
    if (tab === "compliance") return COMPLIANCE_CATEGORIES.has(template.template_category);
    if (tab === "logs") return false;
    return true;
  });

  const toggleTemplateStatus = async (template: SuperPartnerEmailTemplate) => {
    setBusy(true);
    setMessage(null);
    const next = template.template_status === "active" ? "paused" : "active";
    const res = await fetch("/api/super/partner-communications/templates", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        template_id: template.id,
        patch: { template_status: next },
      }),
    });
    if (res.ok) {
      setTemplates(parseSuperPartnerEmailTemplates(await res.json()));
      setMessage(labels.saved);
    } else {
      setMessage(labels.actionFailed);
    }
    setBusy(false);
  };

  const sendTest = async () => {
    if (!selectedTemplate || !testEmail.trim()) return;
    setBusy(true);
    setMessage(null);
    const res = await fetch("/api/super/partner-communications/templates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        template_key: selectedTemplate,
        recipient_email: testEmail.trim(),
      }),
    });
    if (res.ok) {
      setMessage(labels.testSent);
      await load();
    } else {
      setMessage(labels.actionFailed);
    }
    setBusy(false);
  };

  const resendFailed = async (logId: string) => {
    setBusy(true);
    const res = await fetch("/api/super/partner-communications/logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "resend", log_id: logId }),
    });
    if (res.ok) {
      setMessage(labels.resent);
      await load();
    } else {
      setMessage(labels.actionFailed);
    }
    setBusy(false);
  };

  if (loading) return <AipifyLoader centered fullPage />;

  if (error || !overview) {
    return (
      <div className="p-6">
        <p className="text-sm text-red-600">{labels.actionFailed}</p>
        <button type="button" onClick={() => void load()} className="mt-3 text-sm text-indigo-600">
          {labels.loading}
        </button>
      </div>
    );
  }

  const tabs: Array<{ id: Tab; label: string }> = [
    { id: "templates", label: labels.templates },
    { id: "recognition", label: labels.recognition },
    { id: "settlement", label: labels.settlement },
    { id: "compliance", label: labels.compliance },
    { id: "logs", label: labels.logs },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      <div>
        <Link href="/super" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
          ← {labels.back}
        </Link>
        <h1 className="mt-3 text-2xl font-semibold text-zinc-900">{labels.title}</h1>
        <p className="mt-2 max-w-3xl text-zinc-600">{labels.subtitle}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label={labels.activeTemplates} value={overview.stats.active_templates} />
        <MetricCard label={labels.queuedEmails} value={overview.stats.queued_emails} />
        <MetricCard label={labels.sentEmails} value={overview.stats.sent_emails} />
        <MetricCard label={labels.failedEmails} value={overview.stats.failed_emails} />
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={`rounded-full px-4 py-2 text-sm font-medium ${
              tab === item.id ? "bg-indigo-600 text-white" : "bg-zinc-100 text-zinc-700"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab !== "logs" ? (
        <section className="space-y-4">
          <div className="flex flex-wrap items-end gap-3 rounded-2xl border border-zinc-200 bg-white p-4">
            <div className="min-w-[220px] flex-1">
              <label className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                {labels.templateKey}
              </label>
              <select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
              >
                <option value="">—</option>
                {templates.map((t) => (
                  <option key={t.template_key} value={t.template_key}>
                    {t.template_key}
                  </option>
                ))}
              </select>
            </div>
            <div className="min-w-[220px] flex-1">
              <label className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                {labels.recipient}
              </label>
              <input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
              />
            </div>
            <button
              type="button"
              disabled={busy}
              onClick={() => void sendTest()}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              {labels.sendTest}
            </button>
          </div>

          {filteredTemplates.length === 0 ? (
            <p className="text-sm text-zinc-500">{labels.emptyTemplates}</p>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white shadow-sm">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-zinc-100 text-xs uppercase tracking-wide text-zinc-500">
                  <tr>
                    <th className="px-4 py-3">{labels.templateKey}</th>
                    <th className="px-4 py-3">{labels.category}</th>
                    <th className="px-4 py-3">{labels.trigger}</th>
                    <th className="px-4 py-3">{labels.sender}</th>
                    <th className="px-4 py-3">{labels.status}</th>
                    <th className="px-4 py-3">{labels.preview}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {filteredTemplates.map((template) => {
                    const en = template.translations.find((t) => t.language_code === "en");
                    return (
                      <tr key={template.id}>
                        <td className="px-4 py-3 font-medium text-zinc-900">{template.template_key}</td>
                        <td className="px-4 py-3 text-zinc-600">
                          {templateCategoryLabel(template.template_category)}
                        </td>
                        <td className="px-4 py-3 text-zinc-600">{template.trigger_event ?? "—"}</td>
                        <td className="px-4 py-3 text-zinc-600">{template.sender_key}</td>
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => void toggleTemplateStatus(template)}
                            className="text-indigo-600 hover:text-indigo-700"
                          >
                            {template.template_status === "active" ? labels.pause : labels.activate}
                          </button>
                        </td>
                        <td className="max-w-xs truncate px-4 py-3 text-zinc-600">
                          {en?.subject_template ?? "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      ) : (
        <section>
          {logs.length === 0 ? (
            <p className="text-sm text-zinc-500">{labels.emptyLogs}</p>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white shadow-sm">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-zinc-100 text-xs uppercase tracking-wide text-zinc-500">
                  <tr>
                    <th className="px-4 py-3">{labels.recipient}</th>
                    <th className="px-4 py-3">{labels.templateKey}</th>
                    <th className="px-4 py-3">{labels.status}</th>
                    <th className="px-4 py-3">{labels.language}</th>
                    <th className="px-4 py-3">{labels.trigger}</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {logs.map((log) => (
                    <tr key={log.id}>
                      <td className="px-4 py-3 text-zinc-900">{log.recipient_email}</td>
                      <td className="px-4 py-3 text-zinc-600">{log.template_key}</td>
                      <td className="px-4 py-3 text-zinc-600">{deliveryStatusLabel(log.delivery_status)}</td>
                      <td className="px-4 py-3 text-zinc-600">{log.language_code}</td>
                      <td className="px-4 py-3 text-zinc-600">{log.trigger_event}</td>
                      <td className="px-4 py-3">
                        {log.delivery_status === "failed" || log.delivery_status === "bounced" ? (
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => void resendFailed(log.id)}
                            className="text-indigo-600 hover:text-indigo-700"
                          >
                            {labels.resend}
                          </button>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {message ? <p className="text-sm text-zinc-600">{message}</p> : null}
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
      <dt className="text-sm text-zinc-500">{label}</dt>
      <dd className="mt-1 text-2xl font-semibold text-zinc-900">{value}</dd>
    </div>
  );
}
