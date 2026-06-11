"use client";

import { useCallback, useEffect, useState } from "react";
import {
  parseStakeholderCommunicationEngineDashboard,
  type CommunicationCampaign,
  type StakeholderCommunicationEngineDashboard,
} from "@/lib/aipify/stakeholder-communication-engine";

type Props = { labels: Record<string, string> };

export function StakeholderCommunicationEngineDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<StakeholderCommunicationEngineDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [publishing, setPublishing] = useState<string | null>(null);
  const [scheduling, setScheduling] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setActionError(null);
    const res = await fetch("/api/aipify/stakeholder-communication-engine/dashboard");
    if (res.ok) setDashboard(parseStakeholderCommunicationEngineDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const publishCampaign = async (campaign: CommunicationCampaign) => {
    if (!campaign.id) return;
    setPublishing(campaign.id);
    setActionError(null);
    const res = await fetch("/api/aipify/stakeholder-communication-engine/publish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ campaign_id: campaign.id }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.publishFailed);
    } else {
      await load();
    }
    setPublishing(null);
  };

  const scheduleCampaign = async (campaign: CommunicationCampaign) => {
    if (!campaign.id) return;
    setScheduling(campaign.id);
    setActionError(null);
    const scheduledAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    const res = await fetch("/api/aipify/stakeholder-communication-engine/campaigns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "schedule", campaign_id: campaign.id, scheduled_at: scheduledAt }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.scheduleFailed);
    } else {
      await load();
    }
    setScheduling(null);
  };

  const cancelCampaign = async (campaign: CommunicationCampaign) => {
    if (!campaign.id) return;
    setCancelling(campaign.id);
    setActionError(null);
    const res = await fetch("/api/aipify/stakeholder-communication-engine/campaigns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "cancel", campaign_id: campaign.id }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.cancelFailed);
    } else {
      await load();
    }
    setCancelling(null);
  };

  const exportCampaigns = async () => {
    setExporting(true);
    setActionError(null);
    const res = await fetch("/api/aipify/stakeholder-communication-engine/export");
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.exportFailed);
    }
    setExporting(false);
  };

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (!dashboard?.has_organization) return null;

  const summary = dashboard.summary ?? {};

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-sky-200 bg-sky-50/50 p-6">
        <h2 className="text-sm font-semibold">{labels.engineTitle}</h2>
        <p className="mt-2 text-sm">{dashboard.philosophy}</p>
      </section>

      {actionError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{actionError}</div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          className="rounded border border-gray-300 px-3 py-1.5 text-xs text-gray-700 disabled:opacity-50"
          disabled={exporting}
          onClick={() => void exportCampaigns()}
        >
          {exporting ? labels.exporting : labels.export}
        </button>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <p className="text-xs text-gray-500">{labels.summary}</p>
        <pre className="mt-2 overflow-auto text-xs text-gray-700">{JSON.stringify(summary, null, 2)}</pre>
      </div>

      {dashboard.executive_summary && (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.executiveSummary}</h3>
          <pre className="mt-2 overflow-auto text-xs text-gray-700">
            {JSON.stringify(dashboard.executive_summary, null, 2)}
          </pre>
        </section>
      )}

      {dashboard.principles && (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.principles}</h3>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-gray-600">
            {dashboard.principles.map((pr) => <li key={pr}>{pr}</li>)}
          </ul>
        </section>
      )}

      {dashboard.campaigns && dashboard.campaigns.length > 0 && (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.campaigns}</h3>
          <div className="mt-3 space-y-3">
            {dashboard.campaigns.map((campaign) => (
              <div key={campaign.id} className="rounded-lg border border-gray-200 p-3 text-sm">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <span className="font-medium text-gray-900">{campaign.campaign_name}</span>
                    <span className="ml-2 text-xs uppercase text-gray-500">{campaign.communication_type}</span>
                    <p className="mt-1 text-xs text-gray-600">
                      {labels.stakeholderType}: {campaign.stakeholder_type}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded bg-gray-100 px-2 py-0.5 text-xs">{campaign.status}</span>
                    {campaign.status === "draft" && (
                      <>
                        <button
                          type="button"
                          className="rounded border border-sky-300 px-2 py-0.5 text-xs text-sky-700 disabled:opacity-50"
                          disabled={scheduling === campaign.id}
                          onClick={() => void scheduleCampaign(campaign)}
                        >
                          {scheduling === campaign.id ? labels.scheduling : labels.schedule}
                        </button>
                        <button
                          type="button"
                          className="rounded border border-green-300 px-2 py-0.5 text-xs text-green-700 disabled:opacity-50"
                          disabled={publishing === campaign.id}
                          onClick={() => void publishCampaign(campaign)}
                        >
                          {publishing === campaign.id ? labels.publishing : labels.publish}
                        </button>
                      </>
                    )}
                    {(campaign.status === "draft" || campaign.status === "scheduled") && (
                      <button
                        type="button"
                        className="rounded border border-red-300 px-2 py-0.5 text-xs text-red-700 disabled:opacity-50"
                        disabled={cancelling === campaign.id}
                        onClick={() => void cancelCampaign(campaign)}
                      >
                        {cancelling === campaign.id ? labels.cancelling : labels.cancel}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {dashboard.deliveries && dashboard.deliveries.length > 0 && (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.deliveries}</h3>
          <div className="mt-3 space-y-2">
            {dashboard.deliveries.map((delivery) => (
              <div key={delivery.id} className="rounded-lg border border-gray-100 p-2 text-xs text-gray-600">
                <span className="font-medium">{delivery.channel}</span>
                <span className="ml-2">{delivery.status}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {dashboard.integration_summaries && (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.integrationSummaries}</h3>
          <pre className="mt-2 overflow-auto text-xs text-gray-700">
            {JSON.stringify(dashboard.integration_summaries, null, 2)}
          </pre>
        </section>
      )}
    </div>
  );
}
