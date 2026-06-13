"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { DevicesIntegrationsSubnav } from "@/components/app/settings/devices/DevicesIntegrationsSubnav";
import {
  parsePrintOutputCenter,
  type PrintJob,
  type PrintOutputCenter,
  type PrintPrinter,
} from "@/lib/print-output";

type PrintOutputCenterPanelLabels = {
  title: string;
  subtitle: string;
  loading: string;
  printersTitle: string;
  addPrinter: string;
  noPrinters: string;
  jobsTitle: string;
  noJobs: string;
  policyTitle: string;
  printingEnabled: string;
  requireApproval: string;
  savePolicy: string;
  saved: string;
  auditTitle: string;
  noAudit: string;
  status: Record<string, string>;
  connectionType: Record<string, string>;
  devicesHub: string;
  printersNav: string;
  settings: string;
  historyLink: string;
  defaultBadge: string;
  location: string;
  department: string;
};

type PrintOutputCenterPanelProps = {
  labels: PrintOutputCenterPanelLabels;
};

export function PrintOutputCenterPanel({ labels }: PrintOutputCenterPanelProps) {
  const [center, setCenter] = useState<PrintOutputCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [policyForm, setPolicyForm] = useState({
    enabled: true,
    printing_disabled: false,
    require_approval_sensitive: true,
    restrict_office_network: false,
    approved_printers_only: false,
    force_watermark_confidential: true,
  });

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/print/center");
    if (res.ok) {
      const data = parsePrintOutputCenter(await res.json());
      setCenter(data);
      setPolicyForm({
        enabled: data.policy.enabled,
        printing_disabled: data.policy.printing_disabled,
        require_approval_sensitive: data.policy.require_approval_sensitive,
        restrict_office_network: data.policy.restrict_office_network,
        approved_printers_only: data.policy.approved_printers_only,
        force_watermark_confidential: data.policy.force_watermark_confidential,
      });
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function seedDefaultPrinter() {
    await fetch("/api/print/printers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Office Printer",
        location: "Main office",
        department: "Operations",
        connection_type: "network",
        default_paper_size: "A4",
        supports_color: true,
        supports_duplex: true,
        is_default: true,
      }),
    });
    await load();
  }

  async function savePolicy() {
    setSaving(true);
    await fetch("/api/print/policies", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(policyForm),
    });
    setSaving(false);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
    await load();
  }

  if (loading) {
    return <p className="p-6 text-sm text-gray-500">{labels.loading}</p>;
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      <DevicesIntegrationsSubnav
        active="printers"
        labels={{
          hub: labels.devicesHub,
          printers: labels.printersNav,
          settings: labels.settings,
        }}
      />
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
          <p className="mt-2 text-gray-600">{labels.subtitle}</p>
        </div>
        <Link href="/app/settings/devices/printers/history" className="text-sm text-indigo-600 hover:underline">
          {labels.historyLink}
        </Link>
      </div>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-gray-900">{labels.printersTitle}</h2>
          <button
            type="button"
            onClick={() => void seedDefaultPrinter()}
            className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm text-white hover:bg-indigo-700"
          >
            {labels.addPrinter}
          </button>
        </div>
        {center?.printers.length ? (
          <ul className="mt-4 space-y-3">
            {center.printers.map((printer: PrintPrinter) => (
              <li key={printer.id} className="rounded-xl border border-gray-100 p-4 text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-gray-900">{printer.name}</span>
                  {printer.is_default ? (
                    <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs text-indigo-700">
                      {labels.defaultBadge}
                    </span>
                  ) : null}
                  <span className="text-gray-500">{labels.status[printer.status] ?? printer.status}</span>
                </div>
                <p className="mt-1 text-gray-600">
                  {labels.connectionType[printer.connection_type] ?? printer.connection_type}
                  {printer.location ? ` · ${labels.location}: ${printer.location}` : ""}
                  {printer.department ? ` · ${labels.department}: ${printer.department}` : ""}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-gray-500">{labels.noPrinters}</p>
        )}
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900">{labels.policyTitle}</h2>
        <div className="mt-4 space-y-3 text-sm">
          {(
            [
              ["enabled", labels.printingEnabled],
              ["require_approval_sensitive", labels.requireApproval],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={policyForm[key]}
                onChange={(e) => setPolicyForm((prev) => ({ ...prev, [key]: e.target.checked }))}
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
        <button
          type="button"
          disabled={saving}
          onClick={() => void savePolicy()}
          className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {saved ? labels.saved : labels.savePolicy}
        </button>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900">{labels.jobsTitle}</h2>
        {center?.recent_jobs.length ? (
          <ul className="mt-4 space-y-2 text-sm">
            {center.recent_jobs.map((job: PrintJob) => (
              <li key={job.id} className="flex flex-wrap justify-between gap-2 rounded-lg border border-gray-100 px-3 py-2">
                <span className="font-medium text-gray-900">{job.document_title}</span>
                <span className="text-gray-500">{labels.status[job.status] ?? job.status}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-gray-500">{labels.noJobs}</p>
        )}
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900">{labels.auditTitle}</h2>
        {center?.recent_audit.length ? (
          <ul className="mt-4 space-y-2 text-sm text-gray-600">
            {center.recent_audit.map((entry) => (
              <li key={entry.id}>
                {entry.summary ?? entry.action_type} · {new Date(entry.created_at).toLocaleString()}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-gray-500">{labels.noAudit}</p>
        )}
      </section>
    </div>
  );
}
