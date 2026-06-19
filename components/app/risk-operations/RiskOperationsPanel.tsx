"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import { AipifyModuleAccessDenied } from "@/components/ui/aipify-module-access-denied";
import { AipifyShellClasses } from "@/lib/design/light-enterprise-theme";
import type {
  Assessment,
  ContinuityPlan,
  Dependency,
  MitigationPlan,
  RiskIncident,
  RiskItem,
  RiskOperationsCenter,
  RiskOperationsLabels,
  RiskOperationsTab,
  VendorDependency,
} from "@/lib/risk-operations";
import { parseRiskOperationsCenter } from "@/lib/risk-operations/parse";

type Tab = RiskOperationsTab;

const STATUS_STYLE: Record<string, string> = {
  controlled: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  monitored: "bg-sky-50 text-sky-900 ring-sky-200",
  elevated: "bg-amber-50 text-amber-900 ring-amber-200",
  critical: "bg-red-50 text-red-900 ring-red-200",
  uncontrolled: "bg-red-100 text-red-950 ring-red-300",
  open: "bg-amber-50 text-amber-900 ring-amber-200",
  draft: "bg-aipify-surface-muted text-aipify-text-secondary ring-aipify-border",
  active: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  declared: "bg-orange-50 text-orange-900 ring-orange-200",
  closed: "bg-gray-100 text-gray-600 ring-gray-200",
};

type Props = {
  labels: RiskOperationsLabels;
  initialTab?: Tab;
  titleOverride?: string;
  visibleTabs?: Tab[];
};

export function RiskOperationsPanel({ labels, initialTab = "overview", titleOverride, visibleTabs }: Props) {
  const [center, setCenter] = useState<RiskOperationsCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>(initialTab);
  const [busy, setBusy] = useState(false);
  const [riskTitle, setRiskTitle] = useState("");
  const [assessmentTitle, setAssessmentTitle] = useState("");
  const [continuityTitle, setContinuityTitle] = useState("");
  const [vendorName, setVendorName] = useState("");
  const [dependencyName, setDependencyName] = useState("");
  const [incidentTitle, setIncidentTitle] = useState("");
  const [mitigationTitle, setMitigationTitle] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/app/risk-operations");
    if (res.ok) setCenter(parseRiskOperationsCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  async function runAction(action_type: string, payload: Record<string, unknown> = {}) {
    setBusy(true);
    await fetch("/api/app/risk-operations/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action_type, payload }),
    });
    setBusy(false);
    await load();
  }

  if (loading && !center) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <AipifyLoader centered />
      </div>
    );
  }

  if (!center?.found) {
    return <AipifyModuleAccessDenied message={labels.accessDenied} />;
  }

  const overview = center.overview ?? {};
  const risks = center.risk_register ?? [];
  const assessments = center.assessments ?? [];
  const mitigations = center.mitigation_plans ?? [];
  const continuity = center.continuity_plans ?? [];
  const vendorDeps = center.vendor_dependencies ?? [];
  const deps = center.dependencies ?? [];
  const incidents = center.incidents ?? [];
  const heatMap = center.heat_map ?? [];
  const reports = center.reports ?? {};
  const executive = center.executive_risk ?? {};

  const allTabs: { id: Tab; label: string }[] = [
    { id: "overview", label: labels.overview },
    { id: "risk_register", label: labels.riskRegister },
    { id: "assessments", label: labels.assessments },
    { id: "mitigation_plans", label: labels.mitigationPlans },
    { id: "business_continuity", label: labels.businessContinuity },
    { id: "incidents", label: labels.incidents },
    { id: "dependencies", label: labels.dependencies },
    { id: "executive_risk", label: labels.executiveRisk },
    { id: "reports", label: labels.reports },
  ];
  const tabs = visibleTabs ? allTabs.filter((t) => visibleTabs.includes(t.id)) : allTabs;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
      <header>
        <h1 className="text-2xl font-semibold text-aipify-text">{titleOverride ?? labels.title}</h1>
        <p className="mt-1 text-sm text-aipify-text-secondary">{labels.subtitle}</p>
        {center.principle ? <p className="mt-2 text-xs text-aipify-text-muted">{center.principle}</p> : null}
      </header>

      <nav className="flex flex-wrap gap-2">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={
              tab === item.id
                ? `${AipifyShellClasses.primaryButton} text-sm`
                : `${AipifyShellClasses.secondaryButton} text-sm`
            }
          >
            {item.label}
          </button>
        ))}
      </nav>

      {tab === "overview" ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {(
              [
                [labels.overallRiskScore, overview.overall_risk_score],
                [labels.openRisks, overview.open_risks],
                [labels.criticalRisks, overview.critical_risks],
                [labels.openMitigations, overview.open_mitigations],
                [labels.overdueMitigations, overview.overdue_mitigations],
                [labels.activeContinuityPlans, overview.active_continuity_plans],
                [labels.criticalDependencies, overview.critical_dependencies],
                [labels.openIncidents, overview.open_incidents],
              ] as [string, string | number | undefined][]
            ).map(([label, value]) => (
              <div key={String(label)} className={`${AipifyShellClasses.surfaceCard} p-4`}>
                <p className="text-xs text-aipify-text-muted">{label}</p>
                <p className="mt-1 text-xl font-semibold text-aipify-text">{value ?? "—"}</p>
              </div>
            ))}
          </div>
          {center.companion_insights ? (
            <section className={`${AipifyShellClasses.surfaceCard} p-4`}>
              <h2 className="text-sm font-semibold text-aipify-text">{labels.companionInsights}</h2>
              <div className="mt-3 grid gap-4 sm:grid-cols-3 text-sm">
                {Array.isArray(center.companion_insights.critical_risks) &&
                (center.companion_insights.critical_risks as Record<string, unknown>[]).length > 0 ? (
                  <div>
                    <p className="font-medium text-aipify-text">{labels.criticalRisks}</p>
                    <ul className="mt-2 space-y-1 text-aipify-text-secondary">
                      {(center.companion_insights.critical_risks as Record<string, unknown>[]).map((row, i) => (
                        <li key={i}>{String(row.title ?? "")}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {Array.isArray(center.companion_insights.top_vendor_risks) &&
                (center.companion_insights.top_vendor_risks as Record<string, unknown>[]).length > 0 ? (
                  <div>
                    <p className="font-medium text-aipify-text">{labels.highVendorRisk}</p>
                    <ul className="mt-2 space-y-1 text-aipify-text-secondary">
                      {(center.companion_insights.top_vendor_risks as Record<string, unknown>[]).map((row, i) => (
                        <li key={i}>{String(row.vendor_name ?? "")}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            </section>
          ) : null}
          {center.governance_link ? (
            <p className="text-sm text-aipify-text-secondary">
              {labels.governanceLink}:{" "}
              <Link href={center.governance_link.governance_center ?? "/app/governance"} className="text-aipify-accent underline">
                /app/governance
              </Link>
            </p>
          ) : null}
        </>
      ) : null}

      {tab === "risk_register" ? (
        <div className="space-y-4">
          <div className={`${AipifyShellClasses.surfaceCard} grid gap-3 p-4 sm:grid-cols-2`}>
            <input value={riskTitle} onChange={(e) => setRiskTitle(e.target.value)} placeholder={labels.riskTitle} className={AipifyShellClasses.input} />
            <button type="button" disabled={busy || !riskTitle.trim()} onClick={() => void runAction("create_risk", { title: riskTitle.trim() }).then(() => setRiskTitle(""))} className={AipifyShellClasses.primaryButton}>
              {labels.createRisk}
            </button>
          </div>
          {risks.length === 0 ? (
            <PlatformEmptyState title={labels.noRisks} message={labels.emptyHint} />
          ) : (
            <div className="grid gap-3">
              {risks.map((r: RiskItem) => (
                <div key={r.id} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="text-xs text-aipify-text-muted">{r.risk_number ?? r.id.slice(0, 8)}</p>
                      <h3 className="font-semibold text-aipify-text">{r.title}</h3>
                      <p className="capitalize text-aipify-text-secondary">{r.category.replace(/_/g, " ")} · Score {r.risk_score ?? "—"} ({r.risk_level ?? "—"})</p>
                    </div>
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset capitalize ${STATUS_STYLE[r.risk_control_status ?? "monitored"] ?? STATUS_STYLE.monitored}`}>
                      {String(r.risk_control_status ?? "monitored").replace(/_/g, " ")}
                    </span>
                  </div>
                  <button type="button" disabled={busy} onClick={() => void runAction("escalate_risk", { risk_id: r.id })} className={`mt-3 ${AipifyShellClasses.secondaryButton}`}>
                    {labels.escalateRisk}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : null}

      {tab === "assessments" ? (
        <div className="space-y-4">
          <div className={`${AipifyShellClasses.surfaceCard} grid gap-3 p-4 sm:grid-cols-2`}>
            <input value={assessmentTitle} onChange={(e) => setAssessmentTitle(e.target.value)} placeholder={labels.assessmentTitle} className={AipifyShellClasses.input} />
            <button type="button" disabled={busy || !assessmentTitle.trim()} onClick={() => void runAction("create_assessment", { title: assessmentTitle.trim() }).then(() => setAssessmentTitle(""))} className={AipifyShellClasses.primaryButton}>
              {labels.createAssessment}
            </button>
          </div>
          <div className="grid gap-3">
            {assessments.map((a: Assessment) => (
              <div key={a.id} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
                <p className="text-xs text-aipify-text-muted">{a.assessment_number}</p>
                <h3 className="font-semibold text-aipify-text">{a.title}</h3>
                <p className="capitalize text-aipify-text-secondary">{a.assessment_type.replace(/_/g, " ")} · {a.status.replace(/_/g, " ")}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {tab === "mitigation_plans" ? (
        <div className="space-y-4">
          <div className={`${AipifyShellClasses.surfaceCard} grid gap-3 p-4 sm:grid-cols-2`}>
            <input value={mitigationTitle} onChange={(e) => setMitigationTitle(e.target.value)} placeholder={labels.mitigationTitle} className={AipifyShellClasses.input} />
            <button type="button" disabled={busy || !mitigationTitle.trim()} onClick={() => void runAction("create_mitigation_plan", { title: mitigationTitle.trim() }).then(() => setMitigationTitle(""))} className={AipifyShellClasses.primaryButton}>
              {labels.createMitigation}
            </button>
          </div>
          {mitigations.length === 0 ? (
            <PlatformEmptyState title={labels.noMitigations} message={labels.emptyHint} />
          ) : (
            mitigations.map((m: MitigationPlan) => (
              <div key={m.id} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
                <h3 className="font-semibold text-aipify-text">{m.title}</h3>
                {m.due_date ? <p className="text-aipify-text-muted">Due {m.due_date}</p> : null}
                {m.status !== "verified" ? (
                  <button type="button" disabled={busy} onClick={() => void runAction("complete_mitigation", { plan_id: m.id })} className={`mt-3 ${AipifyShellClasses.primaryButton}`}>
                    {labels.completeMitigation}
                  </button>
                ) : null}
              </div>
            ))
          )}
        </div>
      ) : null}

      {tab === "business_continuity" ? (
        <div className="space-y-4">
          <div className={`${AipifyShellClasses.surfaceCard} grid gap-3 p-4 sm:grid-cols-2`}>
            <input value={continuityTitle} onChange={(e) => setContinuityTitle(e.target.value)} placeholder={labels.continuityTitle} className={AipifyShellClasses.input} />
            <button type="button" disabled={busy || !continuityTitle.trim()} onClick={() => void runAction("create_continuity_plan", { title: continuityTitle.trim() }).then(() => setContinuityTitle(""))} className={AipifyShellClasses.primaryButton}>
              {labels.createContinuityPlan}
            </button>
          </div>
          {continuity.length === 0 ? (
            <PlatformEmptyState title={labels.noContinuityPlans} message={labels.emptyHint} />
          ) : (
            continuity.map((c: ContinuityPlan) => (
              <div key={c.id} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
                <h3 className="font-semibold text-aipify-text">{c.title}</h3>
                {c.recovery_time_objective ? <p className="text-aipify-text-secondary">RTO: {c.recovery_time_objective}</p> : null}
                {c.status === "draft" ? (
                  <button type="button" disabled={busy} onClick={() => void runAction("activate_continuity_plan", { plan_id: c.id })} className={`mt-3 ${AipifyShellClasses.primaryButton}`}>
                    {labels.activateContinuityPlan}
                  </button>
                ) : null}
              </div>
            ))
          )}
        </div>
      ) : null}

      {tab === "incidents" ? (
        <div className="space-y-4">
          <div className={`${AipifyShellClasses.surfaceCard} grid gap-3 p-4 sm:grid-cols-2`}>
            <input value={incidentTitle} onChange={(e) => setIncidentTitle(e.target.value)} placeholder={labels.incidentTitle} className={AipifyShellClasses.input} />
            <button type="button" disabled={busy || !incidentTitle.trim()} onClick={() => void runAction("declare_incident", { title: incidentTitle.trim() }).then(() => setIncidentTitle(""))} className={AipifyShellClasses.primaryButton}>
              {labels.declareIncident}
            </button>
          </div>
          {incidents.length === 0 ? (
            <PlatformEmptyState title={labels.noIncidents} message={labels.emptyHint} />
          ) : (
            incidents.map((i: RiskIncident) => (
              <div key={i.id} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
                <h3 className="font-semibold text-aipify-text">{i.title}</h3>
                <p className="capitalize text-aipify-text-secondary">{i.incident_type.replace(/_/g, " ")} · {i.status.replace(/_/g, " ")}</p>
                {i.status !== "closed" ? (
                  <button type="button" disabled={busy} onClick={() => void runAction("close_incident", { incident_id: i.id })} className={`mt-3 ${AipifyShellClasses.primaryButton}`}>
                    {labels.closeIncident}
                  </button>
                ) : null}
              </div>
            ))
          )}
        </div>
      ) : null}

      {tab === "dependencies" ? (
        <div className="space-y-4">
          <div className={`${AipifyShellClasses.surfaceCard} grid gap-3 p-4 sm:grid-cols-3`}>
            <input value={vendorName} onChange={(e) => setVendorName(e.target.value)} placeholder={labels.vendorName} className={AipifyShellClasses.input} />
            <input value={dependencyName} onChange={(e) => setDependencyName(e.target.value)} placeholder={labels.dependencyName} className={AipifyShellClasses.input} />
            <div className="flex gap-2">
              <button type="button" disabled={busy || !vendorName.trim()} onClick={() => void runAction("add_vendor_dependency", { vendor_name: vendorName.trim() }).then(() => setVendorName(""))} className={AipifyShellClasses.secondaryButton}>
                {labels.addVendorDependency}
              </button>
              <button type="button" disabled={busy || !dependencyName.trim()} onClick={() => void runAction("add_dependency", { dependency_name: dependencyName.trim() }).then(() => setDependencyName(""))} className={AipifyShellClasses.primaryButton}>
                {labels.addDependency}
              </button>
            </div>
          </div>
          {vendorDeps.length === 0 && deps.length === 0 ? (
            <PlatformEmptyState title={labels.noDependencies} message={labels.emptyHint} />
          ) : (
            <>
              {vendorDeps.map((v: VendorDependency) => (
                <div key={v.id} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
                  <h3 className="font-semibold text-aipify-text">{v.vendor_name}</h3>
                  <p className="text-aipify-text-secondary">Vendor · {v.dependency_level} dependency · Impact {v.business_impact}</p>
                </div>
              ))}
              {deps.map((d: Dependency) => (
                <div key={d.id} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
                  <h3 className="font-semibold text-aipify-text">{d.dependency_name}</h3>
                  <p className="capitalize text-aipify-text-secondary">{d.dependency_type.replace(/_/g, " ")} · {d.criticality}</p>
                </div>
              ))}
            </>
          )}
        </div>
      ) : null}

      {tab === "executive_risk" ? (
        <div className="space-y-4">
          <section className={`${AipifyShellClasses.surfaceCard} p-4`}>
            <h2 className="text-sm font-semibold text-aipify-text">{labels.topRisks}</h2>
            <ul className="mt-3 space-y-2 text-sm text-aipify-text-secondary">
              {Array.isArray(executive.top_risks) && (executive.top_risks as RiskItem[]).length > 0
                ? (executive.top_risks as RiskItem[]).map((r) => (
                    <li key={r.id}>{r.title} · Score {r.risk_score ?? "—"}</li>
                  ))
                : <li>{labels.noRisks}</li>}
            </ul>
          </section>
          <section className={`${AipifyShellClasses.surfaceCard} p-4`}>
            <h2 className="text-sm font-semibold text-aipify-text">{labels.heatMap}</h2>
            <ul className="mt-3 space-y-1 text-sm text-aipify-text-secondary">
              {heatMap.slice(0, 12).map((cell, i) => (
                <li key={i}>{String(cell.title ?? "")} · L:{String(cell.likelihood ?? "")} × I:{String(cell.impact ?? "")} = {String(cell.risk_score ?? "")}</li>
              ))}
            </ul>
          </section>
        </div>
      ) : null}

      {tab === "reports" ? (
        <div className={`${AipifyShellClasses.surfaceCard} space-y-3 p-4 text-sm`}>
          <p>Vendor exposure: {String(reports.vendor_exposure ?? 0)}</p>
          <p>Continuity readiness: {String(reports.continuity_readiness ?? 0)}%</p>
        </div>
      ) : null}

      {center.audit_recent && center.audit_recent.length > 0 ? (
        <section>
          <h2 className="mb-2 text-sm font-semibold text-aipify-text">{labels.auditLog}</h2>
          <ul className={`${AipifyShellClasses.surfaceCard} divide-y divide-aipify-border text-sm`}>
            {center.audit_recent.map((entry, i) => (
              <li key={`${entry.action}-${i}`} className="px-4 py-2 text-aipify-text-secondary">{entry.summary}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
