"use client";

import type { ReactNode } from "react";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import { AipifyModuleAccessDenied } from "@/components/ui/aipify-module-access-denied";
import { AipifyShellClasses } from "@/lib/design/light-enterprise-theme";
import {
  parseMarketingBrandOperationsCenter,
  type AssetItem,
  type AudienceItem,
  type CalendarEventItem,
  type CampaignItem,
  type ChannelItem,
  type ContentItem,
  type MarketingBrandOperationsCenter,
  type MarketingBrandOperationsLabels,
  type PartnerMaterialItem,
} from "@/lib/marketing-brand-operations";

type Tab =
  | "overview"
  | "campaigns"
  | "content"
  | "audiences"
  | "channels"
  | "assets"
  | "performance"
  | "reports";

const STATUS_STYLE: Record<string, string> = {
  draft: "bg-aipify-surface-muted text-aipify-text-secondary ring-aipify-border",
  review: "bg-sky-50 text-sky-900 ring-sky-200",
  active: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  approved: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  needs_attention: "bg-amber-50 text-amber-900 ring-amber-200",
  revision_required: "bg-amber-50 text-amber-900 ring-amber-200",
  paused: "bg-aipify-surface-muted text-aipify-text-secondary ring-aipify-border",
  completed: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  cancelled: "bg-red-50 text-red-900 ring-red-200",
  archived: "bg-red-50 text-red-900 ring-red-200",
  distributed: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  expired: "bg-amber-50 text-amber-900 ring-amber-200",
};

type Props = {
  labels: MarketingBrandOperationsLabels;
  initialTab?: Tab;
};

export function MarketingBrandOperationsPanel({ labels, initialTab = "overview" }: Props) {
  const [center, setCenter] = useState<MarketingBrandOperationsCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>(initialTab);
  const [busy, setBusy] = useState(false);
  const [campaignName, setCampaignName] = useState("");
  const [audienceName, setAudienceName] = useState("");
  const [contentTitle, setContentTitle] = useState("");
  const [assetTitle, setAssetTitle] = useState("");
  const [channelName, setChannelName] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/app/marketing-brand-operations");
    if (res.ok) setCenter(parseMarketingBrandOperationsCenter(await res.json()));
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
    await fetch("/api/app/marketing-brand-operations/action", {
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
  const reports = center.reports ?? {};
  const campaigns = center.campaigns ?? [];
  const audiences = center.audiences ?? [];
  const content = center.content ?? [];
  const assets = center.assets ?? [];
  const channels = center.channels ?? [];
  const calendarEvents = center.calendar_events ?? [];
  const partnerMaterials = center.partner_materials ?? [];
  const pendingContent = center.pending_content ?? [];

  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: labels.overview },
    { id: "campaigns", label: labels.campaigns },
    { id: "content", label: labels.content },
    { id: "audiences", label: labels.audiences },
    { id: "channels", label: labels.channels },
    { id: "assets", label: labels.assets },
    { id: "performance", label: labels.performance },
    { id: "reports", label: labels.reports },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
      <header>
        <h1 className="text-2xl font-semibold text-aipify-text">{labels.title}</h1>
        <p className="mt-1 text-sm text-aipify-text-secondary">{labels.subtitle}</p>
        <p className="mt-2 text-xs text-aipify-text-muted">{center.principle ?? labels.principle}</p>
        {center.philosophy ? <p className="mt-1 text-xs text-aipify-text-muted">{center.philosophy}</p> : null}
        <p className="mt-1 text-xs text-aipify-text-muted">{labels.mobileReady}</p>
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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {(
            [
              [labels.activeCampaigns, overview.active_campaigns],
              [labels.needsAttention, overview.needs_attention],
              [labels.audienceCount, overview.audiences],
              [labels.approvedContent, overview.approved_content],
              [labels.pendingContentReview, overview.pending_content_review],
              [labels.approvedAssets, overview.approved_assets],
              [labels.activeChannels, overview.active_channels],
              [labels.brandHealthScore, overview.brand_health_score],
            ] as [string, string | number][]
          ).map(([label, value]) => (
            <div key={String(label)} className={`${AipifyShellClasses.surfaceCard} p-4`}>
              <p className="text-xs text-aipify-text-muted">{label}</p>
              <p className="mt-1 text-xl font-semibold text-aipify-text">{value ?? "—"}</p>
            </div>
          ))}
        </div>
      ) : null}

      {tab === "overview" && calendarEvents.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-aipify-text">{labels.calendar}</h2>
          {calendarEvents.slice(0, 5).map((e: CalendarEventItem) => (
            <div key={e.id} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
              <p className="font-semibold text-aipify-text">{e.title}</p>
              <p className="text-aipify-text-secondary">
                {e.event_type.replace(/_/g, " ")} · {new Date(e.starts_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </section>
      ) : null}

      {tab === "campaigns" ? (
        <div className="space-y-4">
          <div className={`${AipifyShellClasses.surfaceCard} grid gap-3 p-4 sm:grid-cols-2`}>
            <input
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              placeholder={labels.campaignName}
              className={AipifyShellClasses.input}
            />
            <button
              type="button"
              disabled={busy || !campaignName.trim()}
              onClick={() =>
                void runAction("create_campaign", {
                  name: campaignName.trim(),
                  campaign_type: "brand",
                }).then(() => setCampaignName(""))
              }
              className={AipifyShellClasses.primaryButton}
            >
              {labels.createCampaign}
            </button>
          </div>
          <ItemList
            emptyTitle={labels.noCampaigns}
            emptyMessage={labels.emptyHint}
            items={campaigns}
            render={(c: CampaignItem) => (
              <div key={c.id} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
                <p className="text-xs text-aipify-text-muted">{c.campaign_number}</p>
                <h3 className="font-semibold text-aipify-text">{c.name}</h3>
                <p className="text-aipify-text-secondary">
                  {c.campaign_type.replace(/_/g, " ")}
                  {c.budget_amount != null ? ` · ${c.budget_amount} ${c.budget_currency ?? ""}` : ""}
                </p>
                <StatusBadge status={c.status} label={labels.status} />
                <div className="mt-3 flex flex-wrap gap-2">
                  {c.status === "draft" ? (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void runAction("activate_campaign", { campaign_id: c.id })}
                      className={AipifyShellClasses.primaryButton}
                    >
                      {labels.activateCampaign}
                    </button>
                  ) : null}
                  {c.status === "active" ? (
                    <>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => void runAction("pause_campaign", { campaign_id: c.id })}
                        className={AipifyShellClasses.secondaryButton}
                      >
                        {labels.pauseCampaign}
                      </button>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => void runAction("complete_campaign", { campaign_id: c.id })}
                        className={AipifyShellClasses.primaryButton}
                      >
                        {labels.completeCampaign}
                      </button>
                    </>
                  ) : null}
                </div>
              </div>
            )}
          />
        </div>
      ) : null}

      {tab === "audiences" ? (
        <div className="space-y-4">
          <div className={`${AipifyShellClasses.surfaceCard} grid gap-3 p-4 sm:grid-cols-2`}>
            <input
              value={audienceName}
              onChange={(e) => setAudienceName(e.target.value)}
              placeholder={labels.audienceName}
              className={AipifyShellClasses.input}
            />
            <button
              type="button"
              disabled={busy || !audienceName.trim()}
              onClick={() =>
                void runAction("create_audience", {
                  name: audienceName.trim(),
                  segment: "customers",
                }).then(() => setAudienceName(""))
              }
              className={AipifyShellClasses.primaryButton}
            >
              {labels.createAudience}
            </button>
          </div>
          <ItemList
            emptyTitle={labels.noAudiences}
            emptyMessage={labels.emptyHint}
            items={audiences}
            render={(a: AudienceItem) => (
              <div key={a.id} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
                <p className="text-xs text-aipify-text-muted">{a.audience_number}</p>
                <h3 className="font-semibold text-aipify-text">{a.name}</h3>
                <p className="text-aipify-text-secondary">
                  {a.segment.replace(/_/g, " ")} · {a.size_estimate ?? 0}
                </p>
              </div>
            )}
          />
        </div>
      ) : null}

      {tab === "content" ? (
        <div className="space-y-4">
          <div className={`${AipifyShellClasses.surfaceCard} grid gap-3 p-4 sm:grid-cols-2`}>
            <input
              value={contentTitle}
              onChange={(e) => setContentTitle(e.target.value)}
              placeholder={labels.contentTitle}
              className={AipifyShellClasses.input}
            />
            <button
              type="button"
              disabled={busy || !contentTitle.trim()}
              onClick={() =>
                void runAction("create_content", {
                  title: contentTitle.trim(),
                  content_type: "article",
                }).then(() => setContentTitle(""))
              }
              className={AipifyShellClasses.primaryButton}
            >
              {labels.createContent}
            </button>
          </div>
          {pendingContent.length > 0 ? (
            <section className="space-y-3">
              <h2 className="text-sm font-semibold text-aipify-text">{labels.pendingContentReview}</h2>
              {pendingContent.map((c: ContentItem) => (
                <div key={c.id} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
                  <p className="font-semibold text-aipify-text">{c.title}</p>
                  <p className="text-aipify-text-secondary">{c.content_type.replace(/_/g, " ")}</p>
                  <StatusBadge status={c.status} label={labels.status} />
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void runAction("approve_content", { content_id: c.id })}
                      className={AipifyShellClasses.primaryButton}
                    >
                      {labels.approveContent}
                    </button>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void runAction("reject_content", { content_id: c.id })}
                      className={AipifyShellClasses.secondaryButton}
                    >
                      {labels.rejectContent}
                    </button>
                  </div>
                </div>
              ))}
            </section>
          ) : null}
          <ItemList
            emptyTitle={labels.noContent}
            emptyMessage={labels.emptyHint}
            items={content}
            render={(c: ContentItem) => (
              <div key={c.id} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
                <p className="text-xs text-aipify-text-muted">{c.content_number}</p>
                <h3 className="font-semibold text-aipify-text">{c.title}</h3>
                <p className="text-aipify-text-secondary">
                  {c.content_type.replace(/_/g, " ")} · v{c.version ?? 1}
                </p>
                <StatusBadge status={c.status} label={labels.status} />
              </div>
            )}
          />
        </div>
      ) : null}

      {tab === "assets" ? (
        <div className="space-y-4">
          <div className={`${AipifyShellClasses.surfaceCard} grid gap-3 p-4 sm:grid-cols-2`}>
            <input
              value={assetTitle}
              onChange={(e) => setAssetTitle(e.target.value)}
              placeholder={labels.assetTitle}
              className={AipifyShellClasses.input}
            />
            <button
              type="button"
              disabled={busy || !assetTitle.trim()}
              onClick={() =>
                void runAction("create_asset", {
                  title: assetTitle.trim(),
                  asset_type: "logo",
                }).then(() => setAssetTitle(""))
              }
              className={AipifyShellClasses.primaryButton}
            >
              {labels.createAsset}
            </button>
          </div>
          <ItemList
            emptyTitle={labels.noAssets}
            emptyMessage={labels.emptyHint}
            items={assets}
            render={(a: AssetItem) => (
              <div key={a.id} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
                <p className="text-xs text-aipify-text-muted">{a.asset_number}</p>
                <h3 className="font-semibold text-aipify-text">{a.title}</h3>
                <p className="text-aipify-text-secondary">
                  {a.asset_type.replace(/_/g, " ")} · v{a.version ?? 1}
                </p>
                <StatusBadge status={a.status} label={labels.status} />
                {a.status === "draft" || a.status === "review" ? (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void runAction("approve_asset", { asset_id: a.id })}
                    className={`mt-3 ${AipifyShellClasses.primaryButton}`}
                  >
                    {labels.approveAsset}
                  </button>
                ) : null}
              </div>
            )}
          />
        </div>
      ) : null}

      {tab === "channels" ? (
        <div className="space-y-4">
          <div className={`${AipifyShellClasses.surfaceCard} grid gap-3 p-4 sm:grid-cols-2`}>
            <input
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              placeholder={labels.channelName}
              className={AipifyShellClasses.input}
            />
            <button
              type="button"
              disabled={busy || !channelName.trim()}
              onClick={() =>
                void runAction("create_channel", {
                  name: channelName.trim(),
                  channel_type: "social_media",
                  platform: "linkedin",
                }).then(() => setChannelName(""))
              }
              className={AipifyShellClasses.primaryButton}
            >
              {labels.createChannel}
            </button>
          </div>
          <ItemList
            emptyTitle={labels.noChannels}
            emptyMessage={labels.emptyHint}
            items={channels}
            render={(ch: ChannelItem) => (
              <div key={ch.id} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
                <h3 className="font-semibold text-aipify-text">{ch.name}</h3>
                <p className="text-aipify-text-secondary">
                  {ch.channel_type.replace(/_/g, " ")}
                  {ch.platform ? ` · ${ch.platform}` : ""}
                  {ch.is_active ? " · active" : " · inactive"}
                </p>
              </div>
            )}
          />
        </div>
      ) : null}

      {tab === "performance" ? (
        <div className="space-y-4">
          {campaigns
            .filter((c) => c.status === "active" || c.status === "completed")
            .map((c: CampaignItem) => {
              const m = c.performance_metrics ?? {};
              return (
                <div key={c.id} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
                  <h3 className="font-semibold text-aipify-text">{c.name}</h3>
                  <div className="mt-2 grid gap-2 sm:grid-cols-3">
                    <Metric label={labels.reach} value={m.reach} />
                    <Metric label={labels.leads} value={m.leads_generated} />
                    <Metric label={labels.roi} value={m.roi} />
                  </div>
                </div>
              );
            })}
          {campaigns.filter((c) => c.status === "active" || c.status === "completed").length === 0 ? (
            <PlatformEmptyState title={labels.noCampaigns} message={labels.emptyHint} />
          ) : null}
        </div>
      ) : null}

      {tab === "reports" ? (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <ReportMetric label={labels.audienceGrowth} value={reports.audience_growth} />
            <ReportMetric label={labels.approvedContent} value={reports.content_approved} />
            <ReportMetric label={labels.partnerDistributed} value={reports.partner_distributed} />
            <ReportMetric label={labels.marketingRoi} value={reports.marketing_roi_estimate} />
          </div>
          {partnerMaterials.length > 0 ? (
            <section className="space-y-3">
              <h2 className="text-sm font-semibold text-aipify-text">{labels.partnerMaterials}</h2>
              <p className="text-xs text-aipify-text-muted">{labels.partnerReferralNote}</p>
              {partnerMaterials.map((m: PartnerMaterialItem) => (
                <div key={m.id} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
                  <p className="font-semibold text-aipify-text">{m.title}</p>
                  <StatusBadge status={m.status} label={labels.status} />
                </div>
              ))}
            </section>
          ) : null}
          {center.audit_recent && center.audit_recent.length > 0 ? (
            <section className="space-y-3">
              <h2 className="text-sm font-semibold text-aipify-text">{labels.auditLog}</h2>
              {center.audit_recent.map((a, i) => (
                <div key={i} className={`${AipifyShellClasses.surfaceCard} p-3 text-sm`}>
                  <p className="text-aipify-text">{a.summary}</p>
                  <p className="text-xs text-aipify-text-muted">{a.action}</p>
                </div>
              ))}
            </section>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function StatusBadge({ status, label }: { status: string; label: string }) {
  const style = STATUS_STYLE[status] ?? STATUS_STYLE.draft;
  return (
    <span className={`mt-2 inline-flex rounded-full px-2 py-0.5 text-xs ring-1 ${style}`}>
      {label}: {status.replace(/_/g, " ")}
    </span>
  );
}

function Metric({ label, value }: { label: string; value: unknown }) {
  return (
    <div>
      <p className="text-xs text-aipify-text-muted">{label}</p>
      <p className="font-semibold text-aipify-text">{value != null ? String(value) : "—"}</p>
    </div>
  );
}

function ReportMetric({ label, value }: { label: string; value: unknown }) {
  return (
    <div className={`${AipifyShellClasses.surfaceCard} p-4`}>
      <p className="text-xs text-aipify-text-muted">{label}</p>
      <p className="mt-1 text-xl font-semibold text-aipify-text">{value != null ? String(value) : "—"}</p>
    </div>
  );
}

function ItemList<T>({
  items,
  render,
  emptyTitle,
  emptyMessage,
}: {
  items: T[];
  render: (item: T) => ReactNode;
  emptyTitle: string;
  emptyMessage: string;
}) {
  if (items.length === 0) {
    return <PlatformEmptyState title={emptyTitle} message={emptyMessage} />;
  }
  return <div className="grid gap-3 md:grid-cols-2">{items.map(render)}</div>;
}
