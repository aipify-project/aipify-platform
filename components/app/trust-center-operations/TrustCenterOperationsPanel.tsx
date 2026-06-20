"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  DEVICE_STATUS_BADGES,
  TRUST_STATUS_BADGES,
  VERIFICATION_STATUS_BADGES,
  parseTrustCenterOperations,
  type TrustCenterOperations,
  type TrustCenterOperationsLabels,
  type TrustCenterTab,
  type TrustDevice,
  type TrustIdentity,
  type TrustSession,
} from "@/lib/trust-center-operations";

type Props = {
  labels: TrustCenterOperationsLabels;
  backHref: string;
  initialTab?: TrustCenterTab;
  visibleTabs?: TrustCenterTab[];
  titleOverride?: string;
  subtitleOverride?: string;
};

function OverviewCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white px-5 py-4 shadow-sm">
      <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</dt>
      <dd className="mt-2 text-2xl font-semibold text-zinc-900">{value}</dd>
    </div>
  );
}

function StatusBadge({
  status,
  labels,
  map,
}: {
  status: string;
  labels: Record<string, string>;
  map: Record<string, string>;
}) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${
        map[status] ?? map.trusted ?? "bg-zinc-50 text-zinc-600 ring-zinc-200"
      }`}
    >
      {labels[status] ?? status.replace(/_/g, " ")}
    </span>
  );
}

const ALL_TABS: TrustCenterTab[] = [
  "overview",
  "identity",
  "verification",
  "security",
  "devices",
  "sessions",
  "audit",
  "permissions",
  "compliance",
  "executive",
  "reports",
];

export function TrustCenterOperationsPanel({
  labels,
  backHref,
  initialTab = "overview",
  visibleTabs,
  titleOverride,
  subtitleOverride,
}: Props) {
  const tabs = visibleTabs ?? ALL_TABS;
  const [center, setCenter] = useState<TrustCenterOperations | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [tab, setTab] = useState<TrustCenterTab>(initialTab);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/app/trust-center-operations");
    if (res.ok) {
      setLoadError(null);
      setCenter(parseTrustCenterOperations(await res.json()));
    } else {
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      setLoadError(body.error ?? "Failed to load Trust Center");
      setCenter(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  const runAction = useCallback(
    async (action_type: string, payload: Record<string, unknown> = {}) => {
      setBusy(true);
      try {
        const res = await fetch("/api/app/trust-center-operations/action", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action_type, payload }),
        });
        if (res.ok) await load();
      } finally {
        setBusy(false);
      }
    },
    [load]
  );

  if (loading && !center) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <AipifyLoader centered />
        <span className="sr-only">{labels.loading}</span>
      </div>
    );
  }

  if (loadError) {
    return <p className="p-6 text-sm text-red-600">{loadError}</p>;
  }

  if (!center?.found) {
    return <p className="p-6 text-sm text-red-600">{labels.emptyState}</p>;
  }

  const overview = center.overview ?? {};
  const identities = center.identity_engine?.identities ?? [];
  const verifications = center.verification_engine?.verifications ?? [];
  const orgVerifications = center.verification_engine?.organization_verifications ?? [];
  const devices = center.device_trust_center?.devices ?? [];
  const sessions = center.session_management?.sessions ?? [];
  const events = center.security_events ?? [];
  const audit = center.audit_history ?? [];
  const permissions = center.permission_explorer?.snapshots ?? [];
  const compliance = center.compliance_integration ?? [];
  const advisorPrompts = (center.companion_trust_advisor?.advisor_prompts as string[]) ?? [];
  const trustStatus = String(overview.trust_status ?? "trusted");
  const twoFactor = center.two_factor_center ?? {};
  const protection = center.identity_protection ?? [];

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      <div>
        <Link href={backHref} className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
          ← {labels.back}
        </Link>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
            {titleOverride ?? labels.title}
          </h1>
          <StatusBadge
            status={trustStatus}
            labels={labels.trustStatuses}
            map={TRUST_STATUS_BADGES}
          />
        </div>
        <p className="mt-2 max-w-3xl text-zinc-600">{subtitleOverride ?? labels.subtitle}</p>
        <p className="mt-4 rounded-2xl border border-zinc-100 bg-zinc-50 px-5 py-4 text-sm text-zinc-800">
          {center.principle}
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/app/trust/devices"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          {labels.actions.openDevices}
        </Link>
        <Link
          href="/app/trust/2fa"
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
        >
          {labels.actions.open2fa}
        </Link>
        <Link
          href="/app/trust/audit"
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
        >
          {labels.actions.openAudit}
        </Link>
        <Link
          href="/app/trust-action-engine"
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
        >
          {labels.actions.openActionEngine}
        </Link>
        <button
          type="button"
          disabled={busy}
          onClick={() => void runAction("refresh_security_score", { trust_score: 84, security_score: 80 })}
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50 disabled:opacity-50"
        >
          {labels.actions.refreshScore}
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium ${
              tab === key ? "bg-indigo-600 text-white" : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
            }`}
          >
            {labels.tabs[key]}
          </button>
        ))}
      </div>

      {tab === "overview" ? (
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <OverviewCard label={labels.overview.trustScore} value={overview.trust_score ?? 0} />
          <OverviewCard label={labels.overview.securityStatus} value={String(overview.security_status ?? "—")} />
          <OverviewCard label={labels.overview.verificationStatus} value={String(overview.verification_status ?? "—")} />
          <OverviewCard label={labels.overview.twoFactorAdoption} value={`${overview.two_factor_adoption_pct ?? 0}%`} />
          <OverviewCard label={labels.overview.deviceHealth} value={`${overview.device_health_pct ?? 0}%`} />
          <OverviewCard label={labels.overview.activeSessions} value={overview.active_sessions ?? 0} />
          <OverviewCard label={labels.overview.registeredIdentities} value={overview.registered_identities ?? 0} />
          <OverviewCard label={labels.overview.recentSecurityEvents} value={overview.recent_security_events ?? 0} />
        </dl>
      ) : null}

      {tab === "identity" ? (
        <section className="grid gap-4 md:grid-cols-2">
          {identities.map((identity: TrustIdentity) => (
            <div key={identity.id} className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium text-zinc-900">{identity.display_name}</p>
                <StatusBadge
                  status={identity.verification_status ?? "pending"}
                  labels={labels.verificationStatuses}
                  map={VERIFICATION_STATUS_BADGES}
                />
              </div>
              <p className="mt-1 text-xs text-zinc-500">
                {identity.identity_type} · {identity.role_label} · {identity.department_label}
              </p>
              <p className="mt-2 text-sm text-zinc-600">
                2FA: {identity.two_factor_enabled ? "Enabled" : "Disabled"} · Devices: {identity.device_count ?? 0}
              </p>
              {!identity.two_factor_enabled && identity.identity_key ? (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void runAction("enable_2fa", { identity_key: identity.identity_key })}
                  className="mt-3 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50"
                >
                  {labels.actions.enable2fa}
                </button>
              ) : null}
            </div>
          ))}
        </section>
      ) : null}

      {tab === "verification" ? (
        <section className="space-y-4">
          {verifications.map((v) => (
            <div key={String(v.id)} className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium text-zinc-900">{String(v.title)}</p>
                <StatusBadge
                  status={String(v.status ?? "pending")}
                  labels={labels.verificationStatuses}
                  map={VERIFICATION_STATUS_BADGES}
                />
              </div>
              <p className="mt-1 text-sm text-zinc-600">{String(v.summary ?? "")}</p>
              {v.status !== "verified" ? (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() =>
                    void runAction("complete_verification", { verification_type: String(v.verification_type) })
                  }
                  className="mt-3 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50"
                >
                  {labels.actions.completeVerification}
                </button>
              ) : null}
            </div>
          ))}
          <div className="rounded-2xl border border-zinc-200 bg-white p-4">
            <h2 className="font-semibold text-zinc-900">{labels.tabs.verification} — Organization</h2>
            <ul className="mt-3 space-y-2 text-sm text-zinc-600">
              {orgVerifications.map((o) => (
                <li key={String(o.id)}>
                  {String(o.title)} · {String(o.status)}
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {tab === "security" ? (
        <section className="space-y-3">
          {events.map((e) => (
            <div key={String(e.id)} className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm">
              <p className="font-medium text-zinc-900">{String(e.title)}</p>
              <p className="text-zinc-500">{String(e.event_type)} · {String(e.severity)}</p>
              <p className="mt-1 text-zinc-600">{String(e.summary ?? "")}</p>
            </div>
          ))}
          {protection.length ? (
            <div className="rounded-2xl border border-zinc-200 bg-white p-4">
              <h2 className="font-semibold text-zinc-900">Identity Protection</h2>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-600">
                {protection.map((item) => (
                  <li key={item}>{item.replace(/_/g, " ")}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>
      ) : null}

      {tab === "devices" ? (
        <section className="space-y-4">
          {devices.map((device: TrustDevice) => (
            <div key={device.id} className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium text-zinc-900">{device.device_name}</p>
                <StatusBadge
                  status={device.approval_status ?? "unrecognized"}
                  labels={labels.deviceStatuses}
                  map={DEVICE_STATUS_BADGES}
                />
              </div>
              <p className="mt-1 text-xs text-zinc-500">
                {device.platform_label} · {device.browser_label} · {device.location_label}
              </p>
              <p className="mt-1 text-sm text-zinc-600">Risk score: {device.risk_score ?? 0}</p>
              <div className="mt-3 flex gap-2">
                {device.approval_status !== "trusted" && device.device_key ? (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void runAction("approve_device", { device_key: device.device_key })}
                    className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50"
                  >
                    {labels.actions.approveDevice}
                  </button>
                ) : null}
                {device.approval_status !== "blocked" && device.device_key ? (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void runAction("block_device", { device_key: device.device_key })}
                    className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium disabled:opacity-50"
                  >
                    {labels.actions.blockDevice}
                  </button>
                ) : null}
              </div>
            </div>
          ))}
        </section>
      ) : null}

      {tab === "sessions" ? (
        <section className="space-y-4">
          {sessions.map((session: TrustSession) => (
            <div key={session.id} className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm">
              <p className="font-medium text-zinc-900">{session.device_label}</p>
              <p className="text-zinc-500">
                {session.status} · {session.location_label} · {session.ip_label}
              </p>
              <p className="mt-1 text-zinc-600">
                {session.auth_method} · {session.duration_minutes ?? 0} min
              </p>
              {session.status === "active" && session.session_key ? (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void runAction("terminate_session", { session_key: session.session_key })}
                  className="mt-3 rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium disabled:opacity-50"
                >
                  {labels.actions.terminateSession}
                </button>
              ) : null}
            </div>
          ))}
        </section>
      ) : null}

      {tab === "audit" ? (
        <section className="space-y-2">
          {audit.map((entry, i) => (
            <div key={`${entry.event_type}-${i}`} className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm">
              <p className="font-medium text-zinc-900">{entry.summary}</p>
              <p className="text-zinc-500">{entry.event_type} · {entry.event_category}</p>
            </div>
          ))}
        </section>
      ) : null}

      {tab === "permissions" ? (
        <section className="space-y-3">
          {permissions.map((p, i) => (
            <div key={i} className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm">
              <p className="font-medium text-zinc-900">{String(p.permission_scope)}</p>
              <p className="text-zinc-600">{String(p.access_label)}</p>
              <p className="text-zinc-500">{String(p.access_detail ?? "")}</p>
            </div>
          ))}
        </section>
      ) : null}

      {tab === "compliance" ? (
        <section className="space-y-3">
          {compliance.map((c) => (
            <div key={String(c.engine_key)} className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm">
              <p className="font-medium text-zinc-900">{String(c.title)}</p>
              <p className="text-zinc-500">{String(c.engine_key)} · {String(c.readiness_status)}</p>
              <p className="mt-1 text-zinc-600">{String(c.summary ?? "")}</p>
            </div>
          ))}
        </section>
      ) : null}

      {tab === "executive" ? (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(center.executive_dashboard ?? {}).map(([key, value]) => (
            <OverviewCard key={key} label={key.replace(/_/g, " ")} value={String(value)} />
          ))}
          <div className="col-span-full rounded-2xl border border-zinc-200 bg-white p-4">
            <h2 className="font-semibold text-zinc-900">Companion Trust Advisor</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-600">
              {advisorPrompts.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {tab === "reports" ? (
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <pre className="overflow-x-auto whitespace-pre-wrap text-sm text-zinc-600">
            {JSON.stringify(center.reports ?? {}, null, 2)}
          </pre>
          {twoFactor ? (
            <div className="mt-4 text-sm text-zinc-600">
              <p className="font-medium text-zinc-900">2FA Center</p>
              <p>Adoption: {String(twoFactor.adoption_pct ?? 0)}%</p>
            </div>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}
