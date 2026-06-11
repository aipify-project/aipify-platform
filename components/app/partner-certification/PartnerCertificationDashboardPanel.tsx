"use client";

import { useCallback, useEffect, useState } from "react";
import {
  parsePartnerCredentialVerification,
  parsePartnerEcosystemDashboard,
  type PartnerEcosystemDashboard,
  type PartnerProfile,
} from "@/lib/aipify/partner-certification";

type PartnerCertificationDashboardPanelProps = {
  labels: Record<string, string>;
};

function tierClass(tier?: string) {
  switch (tier) {
    case "strategic":
      return "bg-violet-100 text-violet-800";
    case "premier":
      return "bg-indigo-100 text-indigo-800";
    case "advanced":
      return "bg-blue-100 text-blue-800";
    case "certified":
      return "bg-emerald-100 text-emerald-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export function PartnerCertificationDashboardPanel({ labels }: PartnerCertificationDashboardPanelProps) {
  const [dashboard, setDashboard] = useState<PartnerEcosystemDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);
  const [credentialCode, setCredentialCode] = useState("");
  const [verification, setVerification] = useState<ReturnType<typeof parsePartnerCredentialVerification> | null>(null);
  const [directoryFilter, setDirectoryFilter] = useState("all");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/partner-certification/dashboard");
    if (res.ok) setDashboard(parsePartnerEcosystemDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const generateBriefing = async () => {
    await fetch("/api/aipify/partner-certification/briefings/generate", { method: "POST" });
    await load();
  };

  const verifyCredential = async () => {
    if (!credentialCode.trim()) return;
    setActing("verify");
    const res = await fetch("/api/aipify/partner-certification/credentials/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ credential_code: credentialCode.trim() }),
    });
    if (res.ok) setVerification(parsePartnerCredentialVerification(await res.json()));
    setActing(null);
  };

  const acceptCompliance = async (partnerId: string, complianceType: string) => {
    setActing(`${partnerId}-${complianceType}`);
    await fetch(`/api/aipify/partner-certification/compliance/${partnerId}/accept`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ compliance_type: complianceType }),
    });
    setActing(null);
    await load();
  };

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (!dashboard?.has_customer) return null;

  const filteredPartners = dashboard.partners.filter((p: PartnerProfile) => {
    if (directoryFilter === "all") return true;
    return p.partner_tier === directoryFilter || p.partner_type === directoryFilter;
  });

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-violet-200 bg-violet-50/50 p-6">
        <h2 className="text-sm font-semibold text-violet-900">{labels.ecosystemScore}</h2>
        <p className="mt-2 text-4xl font-bold text-violet-800">
          {dashboard.ecosystem_score ?? 0}
          <span className="text-lg font-normal text-gray-500">/100</span>
        </p>
        <p className="mt-2 text-sm text-violet-800">{dashboard.philosophy}</p>
        <p className="mt-1 text-xs text-violet-700">{dashboard.safety_note}</p>
        <button
          type="button"
          onClick={() => void generateBriefing()}
          className="mt-4 rounded-md bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
        >
          {labels.generateBriefing}
        </button>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: labels.activePartners, value: dashboard.active_partners ?? 0 },
          { label: labels.certifiedPartners, value: dashboard.certified_partners ?? 0 },
          { label: labels.openLeads, value: dashboard.open_leads ?? 0 },
          { label: labels.compliancePct, value: `${dashboard.compliance_pct ?? 0}%` },
        ].map((m) => (
          <div key={m.label} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
            <p className="text-xs text-gray-500">{m.label}</p>
            <p className="text-lg font-semibold text-gray-900">{m.value}</p>
          </div>
        ))}
      </section>

      <section>
        <h2 className="text-sm font-semibold text-gray-900">{labels.partnerDirectory}</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {["all", "certified", "advanced", "premier", "strategic", "implementation", "development"].map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setDirectoryFilter(f)}
              className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                directoryFilter === f ? "bg-violet-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {f === "all" ? labels.filterAll : f.replace(/_/g, " ")}
            </button>
          ))}
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {filteredPartners.map((p) => (
            <article key={p.id} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${tierClass(p.partner_tier)}`}>
                  {p.partner_tier_label ?? p.partner_tier}
                </span>
                <span className="text-xs capitalize text-gray-500">{p.partner_type?.replace(/_/g, " ")}</span>
              </div>
              <p className="mt-2 font-medium text-gray-900">{p.partner_name}</p>
              {p.country ? <p className="text-xs text-gray-500">{p.country}</p> : null}
              {p.description ? <p className="mt-2 text-xs text-gray-600">{p.description}</p> : null}
              {p.languages && p.languages.length > 0 ? (
                <p className="mt-1 text-xs text-gray-500">{labels.languages}: {p.languages.join(", ")}</p>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-gray-900">{labels.certificationTracks}</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {dashboard.certification_tracks.map((t) => (
            <article key={t.id} className="rounded-lg border border-emerald-100 bg-emerald-50 p-4">
              <p className="font-medium text-emerald-900">{t.title}</p>
              <p className="mt-1 text-xs text-emerald-800">{t.description}</p>
              <p className="mt-2 text-xs text-emerald-700 capitalize">{t.certification_area?.replace(/_/g, " ")}</p>
            </article>
          ))}
        </div>
      </section>

      {dashboard.certification_progress.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.certificationProgress}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.certification_progress.map((cp) => (
              <li key={cp.id} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
                <span className="font-medium text-gray-900">{cp.partner_name}</span>
                <span className="ml-2 text-gray-600">— {cp.track_title}</span>
                <span className="ml-2 text-xs text-emerald-700">{cp.progress_pct}% · {cp.status}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section>
        <h2 className="text-sm font-semibold text-gray-900">{labels.credentialVerification}</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          <input
            type="text"
            value={credentialCode}
            onChange={(e) => setCredentialCode(e.target.value)}
            placeholder={labels.credentialCodePlaceholder}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
          <button
            type="button"
            disabled={acting === "verify"}
            onClick={() => void verifyCredential()}
            className="rounded-md bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-50"
          >
            {labels.verifyCredential}
          </button>
        </div>
        {verification ? (
          <div className={`mt-3 rounded-lg border p-4 text-sm ${verification.valid ? "border-emerald-200 bg-emerald-50 text-emerald-900" : "border-red-200 bg-red-50 text-red-900"}`}>
            {verification.valid ? (
              <>
                <p className="font-medium">{verification.title}</p>
                <p className="mt-1">{verification.partner_name} — {verification.partner_tier_label}</p>
                <p className="mt-1 text-xs">{labels.validUntil}: {verification.expires_at ?? labels.noExpiry}</p>
              </>
            ) : (
              <p>{verification.error ?? labels.invalidCredential}</p>
            )}
          </div>
        ) : null}
      </section>

      {dashboard.digital_credentials.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.digitalCredentials}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.digital_credentials.map((c) => (
              <li key={c.id} className="rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-2 text-sm">
                <span className="font-medium text-indigo-900">{c.title}</span>
                <span className="ml-2 text-xs text-indigo-700">{c.partner_name}</span>
                <span className="ml-2 font-mono text-xs text-indigo-600">{c.credential_code}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.scorecards.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.partnerScorecard}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.scorecards.map((s, idx) => (
              <li key={idx} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
                <span className="font-medium text-gray-900">{s.partner_name}</span>
                <span className="ml-2 text-xs text-violet-700">{s.overall_score}/100</span>
                <span className="ml-2 text-xs text-gray-500 capitalize">{s.partner_tier}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.lead_registrations.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.leadReferrals}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.lead_registrations.map((l) => (
              <li key={l.id} className="rounded-lg border border-amber-100 bg-amber-50 px-3 py-2 text-sm">
                <p className="font-medium text-amber-900">{l.opportunity_name}</p>
                <p className="text-xs text-amber-800">
                  {l.company_name} · {l.country} · {l.status}
                  {l.estimated_value ? ` · ${l.estimated_value.toLocaleString()}` : ""}
                </p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.resources.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.resourceCenter}</h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {dashboard.resources.map((r) => (
              <li key={r.id} className="rounded-lg border border-gray-100 px-3 py-2 text-sm text-gray-700">
                <span className="font-medium">{r.title}</span>
                <p className="mt-1 text-xs text-gray-500">{r.description}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.compliance_records.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.complianceRequirements}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.compliance_records.map((cr) => (
              <li key={cr.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-orange-100 bg-orange-50 px-3 py-2 text-sm">
                <span className="text-orange-900">
                  {cr.partner_name} — {cr.compliance_type?.replace(/_/g, " ")}
                </span>
                <button
                  type="button"
                  disabled={acting === `${cr.partner_id}-${cr.compliance_type}`}
                  onClick={() => acceptCompliance(cr.partner_id, cr.compliance_type)}
                  className="rounded-md border border-orange-300 px-2 py-1 text-xs font-medium text-orange-800 hover:bg-orange-100 disabled:opacity-50"
                >
                  {labels.acceptCompliance}
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.community_engagement && dashboard.community_engagement.length > 0 ? (
        <section className="rounded-xl border border-gray-100 bg-gray-50 p-4">
          <h2 className="text-sm font-semibold text-gray-900">{labels.communityEngagement}</h2>
          <ul className="mt-2 list-inside list-disc text-xs text-gray-600">
            {dashboard.community_engagement.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
