"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import type { PartnerLinkInfo } from "@/lib/growth-partner-operations-center";

export type PartnerLinkCardLabels = {
  title: string;
  subtitle: string;
  copyLink: string;
  copied: string;
  downloadQr: string;
  previewLanding: string;
  shareEmail: string;
  openMarketing: string;
  partnerId: string;
};

type Props = {
  partnerLink?: PartnerLinkInfo;
  labels: PartnerLinkCardLabels;
};

export function GrowthPartnerLinkCard({ partnerLink, labels }: Props) {
  const [copied, setCopied] = useState(false);

  const copyLink = useCallback(async () => {
    if (!partnerLink?.partnerUrl) return;
    await navigator.clipboard.writeText(partnerLink.partnerUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }, [partnerLink?.partnerUrl]);

  if (!partnerLink?.partnerUrl) return null;

  const mailto = `mailto:?subject=${encodeURIComponent("Aipify overview")}&body=${encodeURIComponent(
    `Learn more about Aipify:\n${partnerLink.partnerUrl}\n\nBook a demo:\n${partnerLink.partnerUrl}?to=book-demo`
  )}`;

  return (
    <section className="rounded-2xl border border-cyan-200 bg-gradient-to-br from-cyan-50/80 to-violet-50/60 p-6 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-cyan-900">{labels.title}</p>
      <p className="mt-1 text-sm text-zinc-600">{labels.subtitle}</p>
      <p className="mt-4 break-all rounded-xl border border-white/80 bg-white/90 px-4 py-3 font-mono text-sm text-violet-900">
        {partnerLink.partnerUrl}
      </p>
      {partnerLink.partnerPublicId ? (
        <p className="mt-2 text-xs text-zinc-500">{labels.partnerId}: {partnerLink.partnerPublicId}</p>
      ) : null}
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={() => void copyLink()} className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700">
          {copied ? labels.copied : labels.copyLink}
        </button>
        <a href="/api/growth-partner/qr" download="aipify-partner-qr.png" className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50">
          {labels.downloadQr}
        </a>
        <a href={partnerLink.partnerUrl} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50">
          {labels.previewLanding}
        </a>
        <a href={mailto} className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50">
          {labels.shareEmail}
        </a>
        {partnerLink.marketingRoute ? (
          <Link href={partnerLink.marketingRoute} className="rounded-lg border border-cyan-300 bg-white px-4 py-2 text-sm font-medium text-cyan-900 hover:bg-cyan-50">
            {labels.openMarketing}
          </Link>
        ) : null}
      </div>
    </section>
  );
}

export type MarketingAttributionCenter = {
  found: boolean;
  error?: string;
  partnerPublicId?: string;
  partnerSlug?: string;
  partnerUrl?: string;
  partnerName?: string;
  partnerCompany?: string;
  principle?: string;
  privacyNote?: string;
  marketingTemplates: Array<{
    templateKey: string;
    templateName: string;
    templateCategory: string;
    subjectLine: string;
    bodyRendered: string;
  }>;
  campaignLinks: Array<{
    campaignKey: string;
    title: string;
    partnerUrl: string;
  }>;
};

export type GrowthPartnerAutoMarketingLabels = {
  title: string;
  subtitle: string;
  principle: string;
  privacyNote: string;
  refresh: string;
  accessDenied: string;
  templates: string;
  campaignLinks: string;
  copyTemplate: string;
  copied: string;
  partnerLinkCard: PartnerLinkCardLabels;
};

function parseMarketingCenter(raw: unknown): MarketingAttributionCenter {
  const d = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  if (!d.found) return { found: false, error: typeof d.error === "string" ? d.error : undefined, marketingTemplates: [], campaignLinks: [] };
  const templates = Array.isArray(d.marketing_templates)
    ? d.marketing_templates.map((item) => {
        const t = item as Record<string, unknown>;
        return {
          templateKey: String(t.template_key ?? ""),
          templateName: String(t.template_name ?? ""),
          templateCategory: String(t.template_category ?? ""),
          subjectLine: String(t.subject_line ?? ""),
          bodyRendered: String(t.body_rendered ?? ""),
        };
      })
    : [];
  const campaigns = Array.isArray(d.campaign_links)
    ? d.campaign_links.map((item) => {
        const c = item as Record<string, unknown>;
        return {
          campaignKey: String(c.campaign_key ?? ""),
          title: String(c.title ?? ""),
          partnerUrl: String(c.partner_url ?? ""),
        };
      })
    : [];
  return {
    found: true,
    partnerPublicId: typeof d.partner_public_id === "string" ? d.partner_public_id : undefined,
    partnerSlug: typeof d.partner_slug === "string" ? d.partner_slug : undefined,
    partnerUrl: typeof d.partner_url === "string" ? d.partner_url : undefined,
    partnerName: typeof d.partner_name === "string" ? d.partner_name : undefined,
    partnerCompany: typeof d.partner_company === "string" ? d.partner_company : undefined,
    principle: typeof d.principle === "string" ? d.principle : undefined,
    privacyNote: typeof d.privacy_note === "string" ? d.privacy_note : undefined,
    marketingTemplates: templates,
    campaignLinks: campaigns,
  };
}

export function GrowthPartnerAutoMarketingPanel({
  labels,
  focus = "all",
}: {
  labels: GrowthPartnerAutoMarketingLabels;
  focus?: "all" | "campaigns" | "templates";
}) {
  const [center, setCenter] = useState<MarketingAttributionCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/growth-partner/marketing-center");
    if (res.ok) setCenter(parseMarketingCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const copyText = async (key: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedKey(key);
    window.setTimeout(() => setCopiedKey(null), 2000);
  };

  if (loading && !center) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <AipifyLoader centered />
      </div>
    );
  }

  if (!center?.found) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-950">
        <p className="font-medium">{labels.accessDenied}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">{labels.title}</h2>
          <p className="mt-1 text-sm text-zinc-600">{labels.subtitle}</p>
        </div>
        <button type="button" onClick={() => void load()} className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50">
          {labels.refresh}
        </button>
      </div>

      {center.principle ? (
        <p className="rounded-xl border border-violet-100 bg-violet-50/40 p-4 text-sm text-violet-900">{center.principle}</p>
      ) : null}

      <GrowthPartnerLinkCard
        partnerLink={{
          partnerPublicId: center.partnerPublicId,
          slug: center.partnerSlug,
          partnerUrl: center.partnerUrl,
          linkStatus: "active",
        }}
        labels={labels.partnerLinkCard}
      />

      {center.campaignLinks.length > 0 && focus !== "templates" ? (
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h3 className="font-semibold text-zinc-900">{labels.campaignLinks}</h3>
          <ul className="mt-4 space-y-3">
            {center.campaignLinks.map((c) => (
              <li key={c.campaignKey} className="rounded-lg border border-zinc-100 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-zinc-900">{c.title}</p>
                    <p className="mt-1 break-all font-mono text-xs text-violet-800">{c.partnerUrl}</p>
                  </div>
                  <button type="button" onClick={() => void copyText(c.campaignKey, c.partnerUrl)} className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50">
                    {copiedKey === c.campaignKey ? labels.copied : labels.copyTemplate}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {center.marketingTemplates.length > 0 && focus !== "campaigns" ? (
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h3 className="font-semibold text-zinc-900">{labels.templates}</h3>
          <ul className="mt-4 space-y-4">
            {center.marketingTemplates.map((t) => (
              <li key={t.templateKey} className="rounded-xl border border-zinc-100 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-zinc-900">{t.templateName}</p>
                    <p className="mt-1 text-xs capitalize text-zinc-500">{t.templateCategory.replace(/_/g, " ")}</p>
                    {t.subjectLine ? <p className="mt-2 text-sm font-medium text-zinc-700">{t.subjectLine}</p> : null}
                  </div>
                  <button type="button" onClick={() => void copyText(t.templateKey, t.bodyRendered)} className="rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-violet-700">
                    {copiedKey === t.templateKey ? labels.copied : labels.copyTemplate}
                  </button>
                </div>
                <pre className="mt-3 whitespace-pre-wrap rounded-lg bg-zinc-50 p-3 text-sm text-zinc-700">{t.bodyRendered}</pre>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {center.privacyNote ? <p className="text-xs text-zinc-500">{center.privacyNote}</p> : null}
    </div>
  );
}
