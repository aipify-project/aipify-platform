"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { AipifyStatusBadge } from "@/components/ui/aipify-status-badge";
import { CertifiedSellersSectionPanel } from "@/components/platform/sellers/CertifiedSellersSectionPanel";
import { listPublishedSalesMaterials } from "@/lib/certified-sales-partner/sales-materials-catalog";
import { classifyCspApiResponse } from "@/lib/certified-sales-partner/ui-support";
import { formatPlatformDateTimeShort } from "@/lib/platform-presentation-quality/date-time";
import { toBcp47Locale } from "@/lib/platform-presentation-quality/bcp47";

export type SellersOpsSection =
  | "attribution"
  | "leadsSales"
  | "audit"
  | "commissionRates"
  | "materials"
  | "settings"
  | "messages";

export type SellersOpsLabels = {
  loading: string;
  retry: string;
  errorTitle: string;
  errorBody: string;
  forbiddenTitle: string;
  forbiddenBody: string;
  searchPlaceholder: string;
  emptyTitle: string;
  emptyBody: string;
  colPartner: string;
  colCode: string;
  colClicks: string;
  colVisits: string;
  colRegistrations: string;
  colStatus: string;
  colKind: string;
  colProduct: string;
  colAmount: string;
  colDate: string;
  colAction: string;
  colActor: string;
  colSubject: string;
  colEffectiveFrom: string;
  colCategory: string;
  colVersion: string;
  openPartner: string;
  kindRegistration: string;
  kindSale: string;
  active: string;
  inactive: string;
  published: string;
  draft: string;
  materialsGateTitle: string;
  materialsGateBody: string;
  messagesGateTitle: string;
  messagesGateBody: string;
  settingsPolicyTitle: string;
  settingsPolicies: string[];
  notReported: string;
  dateEmpty: string;
  dateInvalid: string;
};

type Props = {
  section: SellersOpsSection;
  locale: string;
  title: string;
  subtitle: string;
  notReadyTitle: string;
  notReadyBody: string;
  labels: SellersOpsLabels;
};

type Phase = "loading" | "ready" | "forbidden" | "error";

function rowsFrom(body: unknown): Array<Record<string, unknown>> {
  if (!body || typeof body !== "object") return [];
  const rows = (body as { rows?: unknown }).rows;
  if (!Array.isArray(rows)) return [];
  return rows.filter((r): r is Record<string, unknown> => !!r && typeof r === "object" && !Array.isArray(r));
}

function str(v: unknown): string {
  return typeof v === "string" ? v : "";
}

function num(v: unknown): number {
  return typeof v === "number" && Number.isFinite(v) ? v : Number(v) || 0;
}

export function CertifiedSellersOpsPanel({
  section,
  locale,
  title,
  subtitle,
  notReadyTitle,
  notReadyBody,
  labels: l,
}: Props) {
  const [phase, setPhase] = useState<Phase>("loading");
  const [rows, setRows] = useState<Array<Record<string, unknown>>>([]);
  const [query, setQuery] = useState("");
  const bcp47 = toBcp47Locale(locale);
  const dateOptions = { locale, emptyFallback: l.dateEmpty, invalidFallback: l.dateInvalid };

  const endpoint = useMemo(() => {
    switch (section) {
      case "attribution":
        return "/api/platform/sellers/attribution";
      case "leadsSales":
        return "/api/platform/sellers/leads-sales";
      case "audit":
        return "/api/platform/sellers/audit";
      case "commissionRates":
        return "/api/platform/sellers/commission-rates";
      default:
        return null;
    }
  }, [section]);

  const load = useCallback(async () => {
    if (!endpoint) {
      setPhase("ready");
      setRows([]);
      return;
    }
    setPhase("loading");
    try {
      const res = await fetch(endpoint, { cache: "no-store" });
      const body = await res.json().catch(() => null);
      const outcome = classifyCspApiResponse(res.status, body);
      if (outcome.kind === "unauthorized" || outcome.kind === "forbidden") {
        setPhase("forbidden");
        setRows([]);
        return;
      }
      if (outcome.kind !== "ready" && res.status >= 400) {
        setPhase("error");
        setRows([]);
        return;
      }
      setRows(rowsFrom(body));
      setPhase("ready");
    } catch {
      setPhase("error");
      setRows([]);
    }
  }, [endpoint]);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => JSON.stringify(r).toLowerCase().includes(q));
  }, [rows, query]);

  const materials = useMemo(
    () => listPublishedSalesMaterials({ locale }),
    [locale],
  );

  const backendReady = section === "messages" ? false : true;

  return (
    <>
      <CertifiedSellersSectionPanel
        title={title}
        subtitle={subtitle}
        backendReady={backendReady}
        notReadyTitle={section === "messages" ? l.messagesGateTitle : notReadyTitle}
        notReadyBody={section === "messages" ? l.messagesGateBody : notReadyBody}
      />
      <div className="mx-auto w-full max-w-[1600px] space-y-6 px-6 pb-8 lg:px-8">
        {phase === "loading" && endpoint ? <AipifyLoader centered size="sm" label={l.loading} /> : null}
        {phase === "forbidden" ? (
          <Notice title={l.forbiddenTitle} body={l.forbiddenBody} retry={l.retry} onRetry={load} />
        ) : null}
        {phase === "error" ? (
          <Notice title={l.errorTitle} body={l.errorBody} retry={l.retry} onRetry={load} />
        ) : null}

        {phase === "ready" && endpoint ? (
          <>
            <label className="block max-w-md text-sm">
              <span className="sr-only">{l.searchPlaceholder}</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={l.searchPlaceholder}
                className="w-full rounded-xl border border-[color:var(--aipify-border)] bg-white px-3 py-2"
              />
            </label>
            {filtered.length === 0 ? (
              <Empty title={l.emptyTitle} body={l.emptyBody} />
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-[color:var(--aipify-border)] bg-white">
                {section === "attribution" ? (
                  <Table
                    caption={title}
                    headers={[l.colPartner, l.colCode, l.colClicks, l.colVisits, l.colRegistrations, l.colStatus, l.colAction]}
                  >
                    {filtered.map((r) => (
                      <tr key={str(r.id)} className="border-t border-[color:var(--aipify-border)]">
                        <td className="px-3 py-2">{str(r.partnerName) || l.notReported}</td>
                        <td className="px-3 py-2 font-mono text-sm">{str(r.code)}</td>
                        <td className="px-3 py-2">{num(r.clickCount).toLocaleString(bcp47)}</td>
                        <td className="px-3 py-2">{num(r.uniqueVisits).toLocaleString(bcp47)}</td>
                        <td className="px-3 py-2">{num(r.registrationCount).toLocaleString(bcp47)}</td>
                        <td className="px-3 py-2">
                          <AipifyStatusBadge
                            kind={r.active === true ? "completed" : "waiting"}
                            label={r.active === true ? l.active : l.inactive}
                          />
                        </td>
                        <td className="px-3 py-2">
                          <Link className="text-sm font-semibold text-[color:var(--aipify-companion-purple)]" href={`/platform/sellers/partners?partner=${str(r.partnerId)}`}>
                            {l.openPartner}
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </Table>
                ) : null}

                {section === "leadsSales" ? (
                  <Table
                    caption={title}
                    headers={[l.colKind, l.colPartner, l.colProduct, l.colStatus, l.colAmount, l.colDate, l.colAction]}
                  >
                    {filtered.map((r) => (
                      <tr key={str(r.id)} className="border-t border-[color:var(--aipify-border)]">
                        <td className="px-3 py-2">
                          {str(r.kind) === "qualified_sale" ? l.kindSale : l.kindRegistration}
                        </td>
                        <td className="px-3 py-2">{str(r.partnerName) || l.notReported}</td>
                        <td className="px-3 py-2">{str(r.productKey) || l.notReported}</td>
                        <td className="px-3 py-2">{str(r.status) || l.notReported}</td>
                        <td className="px-3 py-2">
                          {r.amount == null
                            ? l.notReported
                            : `${num(r.amount).toLocaleString(bcp47)} ${str(r.currency)}`}
                        </td>
                        <td className="px-3 py-2">{formatPlatformDateTimeShort(str(r.attributedAt) || null, dateOptions)}</td>
                        <td className="px-3 py-2">
                          <Link className="text-sm font-semibold text-[color:var(--aipify-companion-purple)]" href={`/platform/sellers/partners?partner=${str(r.partnerId)}`}>
                            {l.openPartner}
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </Table>
                ) : null}

                {section === "audit" ? (
                  <Table caption={title} headers={[l.colAction, l.colActor, l.colSubject, l.colDate]}>
                    {filtered.map((r) => (
                      <tr key={str(r.id)} className="border-t border-[color:var(--aipify-border)]">
                        <td className="px-3 py-2">{str(r.action)}</td>
                        <td className="px-3 py-2">{str(r.actorKind) || l.notReported}</td>
                        <td className="px-3 py-2 text-sm text-[color:var(--aipify-text-secondary)]">
                          {[str(r.subjectTable), str(r.subjectId).slice(0, 8)].filter(Boolean).join(" · ") || l.notReported}
                        </td>
                        <td className="px-3 py-2">{formatPlatformDateTimeShort(str(r.createdAt) || null, dateOptions)}</td>
                      </tr>
                    ))}
                  </Table>
                ) : null}

                {section === "commissionRates" ? (
                  <Table caption={title} headers={[l.colProduct, l.colAmount, l.colEffectiveFrom]}>
                    {filtered.map((r) => (
                      <tr key={str(r.id)} className="border-t border-[color:var(--aipify-border)]">
                        <td className="px-3 py-2">
                          <p className="font-medium">{str(r.productTitle) || str(r.productKey) || l.notReported}</p>
                          <p className="text-xs text-[color:var(--aipify-text-secondary)]">{str(r.productKey)}</p>
                        </td>
                        <td className="px-3 py-2">
                          {r.amount == null
                            ? l.notReported
                            : `${num(r.amount).toLocaleString(bcp47)} ${str(r.currency)}`}
                        </td>
                        <td className="px-3 py-2">{formatPlatformDateTimeShort(str(r.effectiveFrom) || null, dateOptions)}</td>
                      </tr>
                    ))}
                  </Table>
                ) : null}
              </div>
            )}
          </>
        ) : null}

        {section === "materials" ? (
          <div className="space-y-4">
            <Empty title={l.materialsGateTitle} body={l.materialsGateBody} />
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {materials.map((item) => (
                <article
                  key={item.id}
                  className="rounded-2xl border border-[color:var(--aipify-border)] bg-white p-4 shadow-sm"
                >
                  <p className="text-xs uppercase tracking-wide text-[color:var(--aipify-text-muted)]">{item.category}</p>
                  <p className="mt-1 font-semibold text-[color:var(--aipify-text-primary)]">{item.id}</p>
                  <p className="mt-1 text-sm text-[color:var(--aipify-text-secondary)]">{item.assetPath}</p>
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <AipifyStatusBadge kind="completed" label={l.published} />
                    <span className="text-xs text-[color:var(--aipify-text-secondary)]">v{item.version}</span>
                  </div>
                  {item.mimeHint.startsWith("image/") ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.assetPath} alt="" className="mt-3 max-h-28 w-auto rounded-lg border border-[color:var(--aipify-border)]" />
                  ) : null}
                </article>
              ))}
            </div>
          </div>
        ) : null}

        {section === "settings" ? (
          <article className="rounded-2xl border border-[color:var(--aipify-border)] bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[color:var(--aipify-text-primary)]">{l.settingsPolicyTitle}</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-[color:var(--aipify-text-secondary)]">
              {l.settingsPolicies.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </article>
        ) : null}

        {section === "messages" && phase === "ready" ? (
          <Empty title={l.messagesGateTitle} body={l.messagesGateBody} />
        ) : null}
      </div>
    </>
  );
}

function Notice({
  title,
  body,
  retry,
  onRetry,
}: {
  title: string;
  body: string;
  retry: string;
  onRetry: () => void;
}) {
  return (
    <div className="rounded-2xl border border-[color:var(--aipify-border)] bg-white p-5" role="alert">
      <p className="font-semibold text-[color:var(--aipify-text-primary)]">{title}</p>
      <p className="mt-1 text-sm text-[color:var(--aipify-text-secondary)]">{body}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-3 rounded-xl border border-[color:var(--aipify-border)] px-3 py-1.5 text-sm font-semibold"
      >
        {retry}
      </button>
    </div>
  );
}

function Empty({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-[color:var(--aipify-border)] bg-white p-5" role="status">
      <p className="font-semibold text-[color:var(--aipify-text-primary)]">{title}</p>
      <p className="mt-1 text-sm text-[color:var(--aipify-text-secondary)]">{body}</p>
    </div>
  );
}

function Table({
  caption,
  headers,
  children,
}: {
  caption: string;
  headers: string[];
  children: React.ReactNode;
}) {
  return (
    <table className="min-w-full text-left text-sm">
      <caption className="sr-only">{caption}</caption>
      <thead className="bg-[color:var(--aipify-canvas,#F7F6F3)] text-[color:var(--aipify-text-secondary)]">
        <tr>
          {headers.map((h) => (
            <th key={h} className="px-3 py-2 font-medium">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  );
}
