"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  NETWORK_TABS,
  ORGANIZATION_STATUS_BADGES,
  REPUTATION_BADGES,
  TRUST_LEVEL_BADGES,
  parseEnterpriseNetworkCenter,
  type EnterpriseNetworkCenter,
  type EnterpriseNetworkLabels,
  type EnterpriseNetworkTab,
  type NetworkConnection,
  type NetworkInvitation,
  type NetworkWorkspace,
} from "@/lib/customer-enterprise-network-operations";

type Props = {
  labels: EnterpriseNetworkLabels;
  backHref: string;
  initialTab?: EnterpriseNetworkTab;
  visibleTabs?: EnterpriseNetworkTab[];
  titleOverride?: string;
};

function OverviewCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white px-5 py-4 shadow-sm">
      <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</dt>
      <dd className="mt-2 text-2xl font-semibold text-zinc-900">{value}</dd>
    </div>
  );
}

function JsonList({ items }: { items: Record<string, unknown>[] }) {
  if (!items.length) return <p className="text-sm text-zinc-500">—</p>;
  return (
    <>
      {items.map((item, i) => (
        <div key={i} className="rounded-xl border border-zinc-100 bg-zinc-50 p-3 text-sm">
          <p className="font-medium text-zinc-900">
            {String(
              item.partner_org_name ?? item.target_org_name ?? item.collaboration_title
                ?? item.workspace_title ?? item.document_title ?? item.subject ?? i
            )}
          </p>
          {(item.summary ?? item.subject) ? (
            <p className="mt-1 text-zinc-600">{String(item.summary ?? item.subject)}</p>
          ) : null}
          <div className="mt-2 flex flex-wrap gap-1">
            {item.relationship_type ? (
              <span className="inline-flex rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600">{String(item.relationship_type)}</span>
            ) : null}
            {item.relationship_status ? (
              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ring-1 ${ORGANIZATION_STATUS_BADGES[String(item.relationship_status)] ?? ORGANIZATION_STATUS_BADGES.connected}`}>
                {String(item.relationship_status)}
              </span>
            ) : null}
            {item.trust_status ? (
              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ring-1 ${TRUST_LEVEL_BADGES[String(item.trust_status)] ?? TRUST_LEVEL_BADGES.verified}`}>
                {String(item.trust_status)}
              </span>
            ) : null}
            {item.reputation_label ? (
              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ring-1 ${REPUTATION_BADGES[String(item.reputation_label)] ?? REPUTATION_BADGES.trusted_supplier}`}>
                {String(item.reputation_label)}
              </span>
            ) : null}
          </div>
          {item.trust_score != null ? <p className="mt-1 text-xs text-zinc-500">Trust score: {String(item.trust_score)}</p> : null}
        </div>
      ))}
    </>
  );
}

function InvitationCard({ item, labels, busy, onApprove }: {
  item: NetworkInvitation; labels: EnterpriseNetworkLabels; busy: boolean; onApprove: (key: string) => void;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <p className="font-medium text-zinc-900">{item.target_org_name}</p>
      {item.summary ? <p className="mt-1 text-sm text-zinc-600">{item.summary}</p> : null}
      <p className="mt-2 text-xs text-zinc-500">{item.relationship_type} · {item.invitation_status}</p>
      {item.invitation_status === "pending" ? (
        <button type="button" disabled={busy} onClick={() => onApprove(item.invitation_key)}
          className="mt-3 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50">
          {labels.actions.approveInvitation}
        </button>
      ) : null}
    </div>
  );
}

function ConnectionCard({ item, labels, busy, onRemove }: {
  item: NetworkConnection; labels: EnterpriseNetworkLabels; busy: boolean; onRemove: (key: string) => void;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <p className="font-medium text-zinc-900">{item.partner_org_name}</p>
      <p className="mt-1 text-xs text-zinc-500">{item.relationship_type} · {item.connection_status} · {item.trust_level}</p>
      <button type="button" disabled={busy} onClick={() => onRemove(item.connection_key)}
        className="mt-3 rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium disabled:opacity-50">
        {labels.actions.removeConnection}
      </button>
    </div>
  );
}

function WorkspaceCard({ item, labels, busy, onApprove }: {
  item: NetworkWorkspace; labels: EnterpriseNetworkLabels; busy: boolean; onApprove: (key: string) => void;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <p className="font-medium text-zinc-900">{item.workspace_title}</p>
      {item.summary ? <p className="mt-1 text-sm text-zinc-600">{item.summary}</p> : null}
      <p className="mt-2 text-xs text-zinc-500">{item.partner_org_name} · {item.workspace_status}</p>
      {item.workspace_status === "review_required" || item.workspace_status === "pending" ? (
        <button type="button" disabled={busy} onClick={() => onApprove(item.workspace_key)}
          className="mt-3 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50">
          {labels.actions.approveDataSharing}
        </button>
      ) : null}
    </div>
  );
}

export function EnterpriseNetworkPanel({ labels, backHref, initialTab = "overview", visibleTabs, titleOverride }: Props) {
  const tabs = visibleTabs ?? NETWORK_TABS;
  const [center, setCenter] = useState<EnterpriseNetworkCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<EnterpriseNetworkTab>(initialTab);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/app/enterprise-network-operations");
    if (res.ok) setCenter(parseEnterpriseNetworkCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);
  useEffect(() => { setTab(initialTab); }, [initialTab]);

  const runAction = useCallback(async (action_type: string, payload: Record<string, unknown> = {}) => {
    setBusy(true);
    try {
      const res = await fetch("/api/app/enterprise-network-operations/action", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action_type, ...payload }),
      });
      if (res.ok) await load();
    } finally { setBusy(false); }
  }, [load]);

  if (loading && !center) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <AipifyLoader centered /><span className="sr-only">{labels.loading}</span>
      </div>
    );
  }

  if (!center?.found) return <p className="p-6 text-sm text-red-600">{labels.emptyState}</p>;

  const overview = center.overview ?? {};
  const workflow = (center.integrations?.connection_workflow as string[]) ?? [];
  const advisorPrompts = (center.integrations?.network_advisor_prompts as string[]) ?? [];
  const documents = (center.integrations?.document_exchange as Record<string, unknown>[]) ?? [];
  const recommendations = (center.reports?.companion_recommendations as Record<string, unknown>[]) ?? [];
  const trustRecords = (center.trust?.trust_records as Record<string, unknown>[]) ?? [];
  const reputation = (center.trust?.reputation as Record<string, unknown>[]) ?? [];
  const dataSharing = center.integrations?.data_sharing_framework as Record<string, unknown> | undefined;

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      <div>
        <Link href={backHref} className="text-sm font-medium text-indigo-600 hover:text-indigo-700">← {labels.back}</Link>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900">{titleOverride ?? labels.title}</h1>
        <p className="mt-2 max-w-3xl text-zinc-600">{labels.subtitle}</p>
        <p className="mt-4 rounded-2xl border border-zinc-100 bg-zinc-50 px-5 py-4 text-sm text-zinc-800">{center.principle}</p>
        {center.philosophy ? <p className="mt-3 text-sm text-zinc-600">{center.philosophy}</p> : null}
      </div>

      <div className="flex flex-wrap gap-3">
        <button type="button" disabled={busy} onClick={() => void runAction("refresh_network")}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50">
          {labels.actions.refreshNetwork}
        </button>
        <Link href="/app/network/workspaces" className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50">{labels.actions.openWorkspaces}</Link>
        <Link href="/app/companion/ecosystem" className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50">{labels.actions.openEcosystem}</Link>
        <Link href="/app/companion/marketplace" className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50">{labels.actions.openMarketplace}</Link>
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((key) => (
          <button key={key} type="button" onClick={() => setTab(key)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium ${tab === key ? "bg-indigo-600 text-white" : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"}`}>
            {labels.tabs[key]}
          </button>
        ))}
      </div>

      {tab === "overview" ? (
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <OverviewCard label={labels.overview.connectedOrganizations} value={Number(overview.connected_organizations ?? 0)} />
          <OverviewCard label={labels.overview.pendingInvitations} value={Number(overview.pending_invitations ?? 0)} />
          <OverviewCard label={labels.overview.activeCollaborations} value={Number(overview.active_collaborations ?? 0)} />
          <OverviewCard label={labels.overview.sharedWorkspaces} value={Number(overview.shared_workspaces ?? 0)} />
          <OverviewCard label={labels.overview.trustReviewsRequired} value={Number(overview.trust_reviews_required ?? 0)} />
          <OverviewCard label={labels.overview.averageTrustScore} value={Number(overview.average_trust_score ?? 0)} />
        </dl>
      ) : null}

      {tab === "organizations" ? <section className="space-y-3"><JsonList items={center.organizations ?? []} /></section> : null}

      {tab === "connections" ? (
        <section className="space-y-3">
          {(center.connections ?? []).map((item) => (
            <ConnectionCard key={item.connection_key} item={item} labels={labels} busy={busy}
              onRemove={(key) => void runAction("remove_connection", { connection_key: key })} />
          ))}
        </section>
      ) : null}

      {tab === "invitations" ? (
        <section className="space-y-3">
          {(center.invitations ?? []).map((item) => (
            <InvitationCard key={item.invitation_key} item={item} labels={labels} busy={busy}
              onApprove={(key) => void runAction("approve_invitation", { invitation_key: key })} />
          ))}
        </section>
      ) : null}

      {tab === "collaborations" ? <section className="space-y-3"><JsonList items={center.collaborations ?? []} /></section> : null}

      {tab === "workspaces" ? (
        <section className="space-y-3">
          <button type="button" disabled={busy} onClick={() => void runAction("create_workspace", { workspace_title: "New Shared Workspace" })}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">
            {labels.actions.createWorkspace}
          </button>
          {(center.workspaces ?? []).map((item) => (
            <WorkspaceCard key={item.workspace_key} item={item} labels={labels} busy={busy}
              onApprove={(key) => void runAction("approve_data_sharing", { workspace_key: key })} />
          ))}
        </section>
      ) : null}

      {tab === "trust" ? (
        <section className="space-y-6">
          <div>
            <h2 className="font-semibold text-zinc-900">{labels.sections.dataSharingFramework}</h2>
            <p className="mt-2 text-sm text-zinc-600">{String(dataSharing?.rule ?? center.trust?.data_sharing_rule ?? "")}</p>
          </div>
          <div className="space-y-3">
            <h2 className="font-semibold text-zinc-900">Trust records</h2>
            <JsonList items={trustRecords} />
          </div>
          <div className="space-y-3">
            <h2 className="font-semibold text-zinc-900">Reputation</h2>
            <JsonList items={reputation} />
          </div>
        </section>
      ) : null}

      {tab === "reports" ? (
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm space-y-6">
          <JsonList items={recommendations} />
          <div>
            <h2 className="font-semibold text-zinc-900">{labels.sections.documentExchange}</h2>
            <div className="mt-4 space-y-3">
              {documents.map((doc) => (
                <div key={String(doc.document_key)} className="rounded-xl border border-zinc-100 bg-zinc-50 p-3 text-sm">
                  <JsonList items={[doc]} />
                  {doc.document_status === "pending_approval" ? (
                    <button type="button" disabled={busy}
                      onClick={() => void runAction("share_document", { document_key: doc.document_key })}
                      className="mt-3 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50">
                      {labels.actions.shareDocument}
                    </button>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {(tab === "overview" || tab === "reports") && center.executive_dashboard ? (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(center.executive_dashboard).map(([key, value]) => (
            <OverviewCard key={key} label={key.replace(/_/g, " ")} value={String(value)} />
          ))}
        </section>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-zinc-900">{labels.sections.connectionWorkflow}</h2>
          <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-zinc-600">
            {workflow.map((step) => <li key={step}>{step}</li>)}
          </ol>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-zinc-900">{labels.sections.networkAdvisor}</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-zinc-600">
            {advisorPrompts.map((p) => <li key={p}>{p}</li>)}
          </ul>
        </div>
      </div>

      {(center.audit_recent ?? []).length ? (
        <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-zinc-900">{labels.sections.audit}</h2>
          <ul className="mt-4 space-y-2 text-sm text-zinc-600">
            {(center.audit_recent ?? []).map((entry, i) => (
              <li key={i}>{entry.summary || entry.event_type}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
