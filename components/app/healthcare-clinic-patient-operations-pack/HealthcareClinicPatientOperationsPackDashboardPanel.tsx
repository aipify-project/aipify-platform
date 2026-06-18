"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/shared/AipifyLoader";
import {
  parseHealthcareClinicPatientOperationsCenter,
  type HealthcareClinicPatientOperationsCenter,
} from "@/lib/aipify/healthcare-clinic-patient-operations-pack";

type Props = { labels: Record<string, string> };

export function HealthcareClinicPatientOperationsPackDashboardPanel({ labels }: Props) {
  const [center, setCenter] = useState<HealthcareClinicPatientOperationsCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [patientStatus, setPatientStatus] = useState("new");

  const load = useCallback(async () => {
    setLoading(true);
    setActionError(null);
    const res = await fetch("/api/aipify/healthcare-clinic-patient-operations-pack/dashboard");
    if (res.ok) {
      setCenter(parseHealthcareClinicPatientOperationsCenter(await res.json()));
    } else {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.loadFailed);
    }
    setLoading(false);
  }, [labels.loadFailed]);

  useEffect(() => {
    void load();
  }, [load]);

  const createPatient = async () => {
    if (!displayName.trim()) return;
    setCreating(true);
    setActionError(null);
    const res = await fetch("/api/aipify/healthcare-clinic-patient-operations-pack/actions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "create_patient",
        display_name: displayName.trim(),
        patient_status: patientStatus,
      }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.createFailed);
    } else {
      setDisplayName("");
      await load();
    }
    setCreating(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-[240px] items-center justify-center">
        <AipifyLoader centered />
        <span className="sr-only">{labels.loading}</span>
      </div>
    );
  }

  if (!center?.found || !center.has_access) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-amber-900">
        <p className="font-medium">{labels.accessRequiredTitle}</p>
        <p className="mt-2 text-sm">{center?.error ?? labels.accessRequiredBody}</p>
      </div>
    );
  }

  const overview = center.overview ?? {};
  const ops = center.operations ?? {};

  return (
    <div className="space-y-6">
      {center.governance_note ? (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
          {center.governance_note}
        </div>
      ) : null}

      {actionError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{actionError}</div>
      ) : null}

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.overviewTitle}</h2>
        <p className="mt-1 text-sm text-gray-600">{center.philosophy}</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [labels.metricPatients, overview.patients ?? 0],
            [labels.metricAppointments, overview.appointments ?? 0],
            [labels.metricProviders, overview.providers ?? 0],
            [labels.metricCarePlans, overview.care_plans ?? 0],
            [labels.metricCapacity, overview.operational_capacity ?? 0],
            [labels.metricCompliance, overview.compliance_status ?? "—"],
            [labels.metricSatisfaction, overview.patient_satisfaction ?? 0],
            [labels.metricHealth, overview.healthcare_health_score ?? 0],
          ].map(([label, value]) => (
            <div key={String(label)} className="rounded-lg bg-gray-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.operationsTitle}</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {[
            [labels.openPatients, ops.patients_route],
            [labels.openAppointments, ops.appointments_route],
            [labels.openProviders, ops.providers_route],
            [labels.openCare, ops.care_route],
            [labels.openDocumentation, ops.documentation_route],
            [labels.openCompliance, ops.compliance_route],
            [labels.openExecutive, center.executive_dashboard?.executive_route as string],
          ].map(([label, href]) =>
            href ? (
              <Link
                key={String(label)}
                href={href}
                className="rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-700 hover:border-gray-400"
              >
                {label}
              </Link>
            ) : null
          )}
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.patientsTitle}</h2>
        {(center.patients ?? []).length === 0 ? (
          <p className="mt-3 text-sm text-gray-500">{labels.noPatients}</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {(center.patients ?? []).map((p) => (
              <li key={p.id} className="flex justify-between rounded-lg bg-gray-50 px-4 py-3 text-sm">
                <span className="font-medium text-gray-900">{p.display_name}</span>
                <span className="text-gray-600">
                  {p.patient_status}
                  {p.consent_on_file ? ` · ${labels.consentOnFile}` : ""}
                </span>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
          <input
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            placeholder={labels.patientNamePlaceholder}
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
          <select
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            value={patientStatus}
            onChange={(e) => setPatientStatus(e.target.value)}
          >
            <option value="new">{labels.statusNew}</option>
            <option value="active">{labels.statusActive}</option>
            <option value="under_care">{labels.statusUnderCare}</option>
          </select>
          <button
            type="button"
            disabled={creating}
            onClick={() => void createPatient()}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {creating ? labels.creating : labels.addPatient}
          </button>
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.appointmentsTitle}</h2>
        {(center.appointments ?? []).length === 0 ? (
          <p className="mt-3 text-sm text-gray-500">{labels.noAppointments}</p>
        ) : (
          <ul className="mt-4 space-y-2 text-sm text-gray-700">
            {(center.appointments ?? []).slice(0, 10).map((a) => (
              <li key={a.id} className="flex justify-between rounded-lg bg-gray-50 px-3 py-2">
                <span>{a.appointment_type}</span>
                <span>{a.appointment_status}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.advisorTitle}</h2>
        <div className="mt-4 space-y-4">
          {(center.advisor_signals ?? []).map((sig) => (
            <article key={sig.id} className="rounded-lg bg-gray-50 p-4">
              <p className="font-medium text-gray-900">{sig.observation}</p>
              {sig.recommendation ? (
                <p className="mt-2 text-sm font-medium text-gray-800">
                  {labels.recommendation}: {sig.recommendation}
                </p>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <p className="text-sm text-gray-500">
        {center.privacy_note}{" "}
        <Link href={center.industry_packs_route ?? "/app/industry-packs"} className="underline">
          {labels.industryPacksLink}
        </Link>
      </p>
    </div>
  );
}
