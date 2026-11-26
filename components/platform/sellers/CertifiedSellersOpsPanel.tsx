"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { AipifyStatusBadge } from "@/components/ui/aipify-status-badge";
import { CertifiedSellersSectionPanel } from "@/components/platform/sellers/CertifiedSellersSectionPanel";
import {
  filterCspMessageRecipients,
  isCspMessageRecipientEligible,
  parseCspMessageRecipients,
  recipientDisplayLabel,
  type CspMessageRecipient,
} from "@/lib/certified-sales-partner/message-recipient-picker";
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
  sendMessageTitle: string;
  sendMessagePartnerId: string;
  recipientSearchPlaceholder: string;
  recipientEmpty: string;
  recipientNotEligible: string;
  selectedRecipient: string;
  clearRecipient: string;
  unnamedRecipient: string;
  sendMessageSubject: string;
  sendMessageBody: string;
  sendMessageCta: string;
  sendMessageOk: string;
  sendMessageError: string;
  sendMessageBlocked: string;
  conversationTitle: string;
  partnerStatusLabels: Record<string, string>;
  registerMaterialTitle: string;
  materialKey: string;
  materialTitle: string;
  materialCategory: string;
  materialAssetPath: string;
  registerMaterialCta: string;
  publishCta: string;
  withdrawCta: string;
  materialWriteOk: string;
  materialWriteError: string;
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
  const [partnerFilter, setPartnerFilter] = useState("");
  const [recipientQuery, setRecipientQuery] = useState("");
  const [recipients, setRecipients] = useState<CspMessageRecipient[]>([]);
  const [recipientsPhase, setRecipientsPhase] = useState<Phase>("loading");
  const [sendSubject, setSendSubject] = useState("");
  const [sendBody, setSendBody] = useState("");
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [matKey, setMatKey] = useState("");
  const [matTitle, setMatTitle] = useState("");
  const [matCategory, setMatCategory] = useState("pdf_sheets");
  const [matPath, setMatPath] = useState("");
  const bcp47 = toBcp47Locale(locale);
  const dateOptions = { locale, emptyFallback: l.dateEmpty, invalidFallback: l.dateInvalid };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const partner = new URLSearchParams(window.location.search).get("partner");
    if (partner) setPartnerFilter(partner);
  }, []);

  const loadRecipients = useCallback(async () => {
    if (section !== "messages") return;
    setRecipientsPhase("loading");
    try {
      const res = await fetch("/api/platform/sellers/partners", { cache: "no-store" });
      const body = await res.json().catch(() => null);
      const outcome = classifyCspApiResponse(res.status, body);
      if (outcome.kind === "unauthorized" || outcome.kind === "forbidden") {
        setRecipients([]);
        setRecipientsPhase("forbidden");
        return;
      }
      if (outcome.kind !== "ready" && res.status >= 400) {
        setRecipients([]);
        setRecipientsPhase("error");
        return;
      }
      setRecipients(parseCspMessageRecipients(body));
      setRecipientsPhase("ready");
    } catch {
      setRecipients([]);
      setRecipientsPhase("error");
    }
  }, [section]);

  useEffect(() => {
    void loadRecipients();
  }, [loadRecipients]);

  const selectedRecipient = useMemo((): CspMessageRecipient | null => {
    const id = partnerFilter.trim();
    if (!id) return null;
    const found = recipients.find((r) => r.id === id);
    if (found) return found;
    // Preselected via ?partner= before directory resolves, or partner outside page limit.
    return { id, displayName: null, status: "unknown", country: null };
  }, [recipients, partnerFilter]);

  const hasConcreteRecipient = partnerFilter.trim().length > 0;

  const filteredRecipients = useMemo(
    () => filterCspMessageRecipients(recipients, recipientQuery).slice(0, 40),
    [recipients, recipientQuery],
  );

  const recipientEligible = selectedRecipient
    ? isCspMessageRecipientEligible(selectedRecipient.status)
    : false;

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
      case "messages":
        return partnerFilter.trim()
          ? `/api/platform/sellers/messages?partner_id=${encodeURIComponent(partnerFilter.trim())}`
          : "/api/platform/sellers/messages";
      case "materials":
        return "/api/platform/sellers/materials";
      default:
        return null;
    }
  }, [section, partnerFilter]);

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

  // Core-only when materials section is live — never invent catalog rows as published Core assets.
  const materials = useMemo(() => {
    if (section !== "materials") return [];
    return rows.map((r) => ({
      id: str(r.id),
      materialKey: str(r.material_key) || str(r.id),
      category: str(r.category) || "materials",
      assetPath: str(r.asset_path),
      version: str(r.version) || "1",
      mimeHint: str(r.mime_hint),
      published: Boolean(r.published),
      title: str(r.title),
    }));
  }, [section, rows]);

  const backendReady = true;

  async function sendAdminMessage() {
    const partnerId = partnerFilter.trim();
    const text = sendBody.trim();
    if (!partnerId || !text || busy) return;
    if (selectedRecipient && !isCspMessageRecipientEligible(selectedRecipient.status)) {
      setActionNotice(l.sendMessageBlocked);
      return;
    }
    setBusy(true);
    setActionNotice(null);
    try {
      const res = await fetch("/api/platform/sellers/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          partner_id: partnerId,
          subject: sendSubject.trim() || null,
          body: text,
          idempotency_key: `admin-msg-${partnerId}-${Date.now()}`,
        }),
      });
      const body = await res.json().catch(() => null);
      if (res.status === 403 && body && (body as { error?: string }).error === "partner_not_active") {
        setActionNotice(l.sendMessageBlocked);
        return;
      }
      if (!res.ok) {
        setActionNotice(l.sendMessageError);
        return;
      }
      setSendBody("");
      setActionNotice(l.sendMessageOk);
      await load();
    } catch {
      setActionNotice(l.sendMessageError);
    } finally {
      setBusy(false);
    }
  }

  function selectRecipient(r: CspMessageRecipient) {
    setPartnerFilter(r.id);
    setRecipientQuery("");
    setActionNotice(null);
  }

  function clearRecipient() {
    setPartnerFilter("");
    setRecipientQuery("");
    setActionNotice(null);
  }

  function statusLabel(status: string): string {
    return l.partnerStatusLabels[status] ?? l.partnerStatusLabels.unknown ?? status;
  }

  async function registerMaterial() {
    if (!matKey.trim() || !matTitle.trim() || !matPath.trim().startsWith("/") || busy) return;
    setBusy(true);
    setActionNotice(null);
    try {
      const res = await fetch("/api/platform/sellers/materials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "upsert",
          material_key: matKey.trim(),
          category: matCategory.trim() || "pdf_sheets",
          title: matTitle.trim(),
          asset_path: matPath.trim(),
        }),
      });
      if (!res.ok) {
        setActionNotice(l.materialWriteError);
        return;
      }
      setActionNotice(l.materialWriteOk);
      await load();
    } catch {
      setActionNotice(l.materialWriteError);
    } finally {
      setBusy(false);
    }
  }

  async function setMaterialPublished(materialId: string, publish: boolean) {
    if (!materialId || busy) return;
    setBusy(true);
    setActionNotice(null);
    try {
      const res = await fetch("/api/platform/sellers/materials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: publish ? "publish" : "withdraw",
          material_id: materialId,
        }),
      });
      if (!res.ok) {
        setActionNotice(l.materialWriteError);
        return;
      }
      setActionNotice(l.materialWriteOk);
      await load();
    } catch {
      setActionNotice(l.materialWriteError);
    } finally {
      setBusy(false);
    }
  }

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

        {phase === "ready" && endpoint && section !== "materials" && section !== "messages" ? (
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

        {section === "materials" && phase === "ready" ? (
          <div className="space-y-4">
            <article className="rounded-2xl border border-[color:var(--aipify-border)] bg-white p-5 shadow-sm space-y-3">
              <h2 className="text-base font-semibold text-[color:var(--aipify-text-primary)]">{l.registerMaterialTitle}</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <input value={matKey} onChange={(e) => setMatKey(e.target.value)} placeholder={l.materialKey} className="rounded-xl border border-[color:var(--aipify-border)] px-3 py-2 text-sm" />
                <input value={matTitle} onChange={(e) => setMatTitle(e.target.value)} placeholder={l.materialTitle} className="rounded-xl border border-[color:var(--aipify-border)] px-3 py-2 text-sm" />
                <input value={matCategory} onChange={(e) => setMatCategory(e.target.value)} placeholder={l.materialCategory} className="rounded-xl border border-[color:var(--aipify-border)] px-3 py-2 text-sm" />
                <input value={matPath} onChange={(e) => setMatPath(e.target.value)} placeholder={l.materialAssetPath} className="rounded-xl border border-[color:var(--aipify-border)] px-3 py-2 text-sm" />
              </div>
              <button type="button" disabled={busy} onClick={() => void registerMaterial()} className="rounded-xl bg-[color:var(--aipify-companion-purple)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
                {l.registerMaterialCta}
              </button>
              {actionNotice ? <p className="text-sm text-[color:var(--aipify-text-secondary)]">{actionNotice}</p> : null}
            </article>
            {materials.length === 0 ? <Empty title={l.emptyTitle} body={l.emptyBody} /> : null}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {materials.map((item) => (
                <article
                  key={item.id || item.materialKey}
                  className="rounded-2xl border border-[color:var(--aipify-border)] bg-white p-4 shadow-sm"
                >
                  <p className="text-xs uppercase tracking-wide text-[color:var(--aipify-text-muted)]">{item.category}</p>
                  <p className="mt-1 font-semibold text-[color:var(--aipify-text-primary)]">{item.title || item.materialKey}</p>
                  <p className="mt-1 text-sm text-[color:var(--aipify-text-secondary)]">{item.assetPath}</p>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                    <AipifyStatusBadge
                      kind={item.published ? "completed" : "waiting"}
                      label={item.published ? l.published : l.draft}
                    />
                    <span className="text-xs text-[color:var(--aipify-text-secondary)]">v{item.version}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {!item.published ? (
                      <button type="button" disabled={busy} onClick={() => void setMaterialPublished(item.id, true)} className="rounded-lg border border-[color:var(--aipify-border)] px-3 py-1.5 text-xs font-semibold disabled:opacity-50">
                        {l.publishCta}
                      </button>
                    ) : (
                      <button type="button" disabled={busy} onClick={() => void setMaterialPublished(item.id, false)} className="rounded-lg border border-[color:var(--aipify-border)] px-3 py-1.5 text-xs font-semibold disabled:opacity-50">
                        {l.withdrawCta}
                      </button>
                    )}
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

        {section === "messages" && (phase === "ready" || phase === "loading") ? (
          <div className="space-y-4">
            <article className="rounded-2xl border border-[color:var(--aipify-border)] bg-white p-5 shadow-sm space-y-3">
              <h2 className="text-base font-semibold text-[color:var(--aipify-text-primary)]">{l.sendMessageTitle}</h2>
              <p className="text-sm text-[color:var(--aipify-text-secondary)]">{l.messagesGateBody}</p>

              {hasConcreteRecipient && selectedRecipient ? (
                <div className="flex max-w-xl flex-wrap items-center gap-2 rounded-xl border border-[color:var(--aipify-border)] bg-[color:var(--aipify-canvas)] px-3 py-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-[color:var(--aipify-text-secondary)]">{l.selectedRecipient}</p>
                    <p className="truncate font-medium text-[color:var(--aipify-text-primary)]">
                      {recipientDisplayLabel(selectedRecipient, l.unnamedRecipient)}
                    </p>
                    <p className="truncate text-xs text-[color:var(--aipify-text-secondary)]">
                      {statusLabel(selectedRecipient.status)}
                      {selectedRecipient.country ? ` · ${selectedRecipient.country}` : ""}
                      {" · "}
                      <span className="font-mono">{selectedRecipient.id.slice(0, 8)}</span>
                    </p>
                  </div>
                  {selectedRecipient.status !== "unknown" && !recipientEligible ? (
                    <AipifyStatusBadge kind="attention" label={l.recipientNotEligible} />
                  ) : null}
                  <button
                    type="button"
                    onClick={clearRecipient}
                    className="rounded-lg border border-[color:var(--aipify-border)] px-2.5 py-1 text-xs font-semibold"
                  >
                    {l.clearRecipient}
                  </button>
                </div>
              ) : (
                <div className="max-w-xl space-y-2">
                  <label className="block text-sm">
                    <span className="sr-only">{l.recipientSearchPlaceholder}</span>
                    <input
                      value={recipientQuery}
                      onChange={(e) => setRecipientQuery(e.target.value)}
                      placeholder={l.recipientSearchPlaceholder}
                      autoComplete="off"
                      className="w-full rounded-xl border border-[color:var(--aipify-border)] px-3 py-2 text-sm"
                    />
                  </label>
                  {recipientsPhase === "loading" ? (
                    <AipifyLoader centered size="sm" label={l.loading} />
                  ) : null}
                  {recipientsPhase === "error" || recipientsPhase === "forbidden" ? (
                    <Notice
                      title={recipientsPhase === "forbidden" ? l.forbiddenTitle : l.errorTitle}
                      body={recipientsPhase === "forbidden" ? l.forbiddenBody : l.errorBody}
                      retry={l.retry}
                      onRetry={() => void loadRecipients()}
                    />
                  ) : null}
                  {recipientsPhase === "ready" && filteredRecipients.length === 0 ? (
                    <p className="text-sm text-[color:var(--aipify-text-secondary)]">{l.recipientEmpty}</p>
                  ) : null}
                  {recipientsPhase === "ready" && filteredRecipients.length > 0 ? (
                    <ul
                      className="max-h-56 overflow-y-auto rounded-xl border border-[color:var(--aipify-border)] bg-white"
                      role="listbox"
                      aria-label={l.recipientSearchPlaceholder}
                    >
                      {filteredRecipients.map((r) => {
                        const eligible = isCspMessageRecipientEligible(r.status);
                        return (
                          <li key={r.id}>
                            <button
                              type="button"
                              role="option"
                              aria-selected={false}
                              onClick={() => selectRecipient(r)}
                              className="flex w-full items-start justify-between gap-3 border-b border-[color:var(--aipify-border)] px-3 py-2 text-left last:border-b-0 hover:bg-[color:var(--aipify-canvas)]"
                            >
                              <span className="min-w-0">
                                <span className="block truncate font-medium text-[color:var(--aipify-text-primary)]">
                                  {recipientDisplayLabel(r, l.unnamedRecipient)}
                                </span>
                                <span className="block truncate text-xs text-[color:var(--aipify-text-secondary)]">
                                  {statusLabel(r.status)}
                                  {r.country ? ` · ${r.country}` : ""}
                                  {" · "}
                                  <span className="font-mono">{r.id.slice(0, 8)}</span>
                                </span>
                              </span>
                              {!eligible ? (
                                <span className="shrink-0 text-xs text-[color:var(--aipify-text-secondary)]">
                                  {l.recipientNotEligible}
                                </span>
                              ) : null}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  ) : null}
                </div>
              )}

              <input
                value={sendSubject}
                onChange={(e) => setSendSubject(e.target.value)}
                placeholder={l.sendMessageSubject}
                className="w-full max-w-xl rounded-xl border border-[color:var(--aipify-border)] px-3 py-2 text-sm"
              />
              <textarea
                value={sendBody}
                onChange={(e) => setSendBody(e.target.value)}
                placeholder={l.sendMessageBody}
                rows={4}
                className="w-full max-w-xl rounded-xl border border-[color:var(--aipify-border)] px-3 py-2 text-sm"
              />
              <button
                type="button"
                disabled={
                  busy ||
                  !hasConcreteRecipient ||
                  !sendBody.trim() ||
                  (selectedRecipient != null &&
                    selectedRecipient.status !== "unknown" &&
                    !recipientEligible)
                }
                onClick={() => void sendAdminMessage()}
                className="rounded-xl bg-[color:var(--aipify-companion-purple)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
              >
                {l.sendMessageCta}
              </button>
              {actionNotice ? <p className="text-sm text-[color:var(--aipify-text-secondary)]">{actionNotice}</p> : null}
            </article>

            <h3 className="text-sm font-semibold text-[color:var(--aipify-text-primary)]">{l.conversationTitle}</h3>
            {phase === "loading" ? <AipifyLoader centered size="sm" label={l.loading} /> : null}
            {phase === "ready" && filtered.length === 0 ? <Empty title={l.emptyTitle} body={l.emptyBody} /> : null}
            {phase === "ready" && filtered.length > 0 ? (
              <div className="overflow-x-auto rounded-2xl border border-[color:var(--aipify-border)] bg-white">
                <Table caption={title} headers={[l.colPartner, l.colAction, l.colStatus, l.colDate]}>
                  {filtered.map((r) => {
                    const pid = str(r.partner_id);
                    const partner = recipients.find((x) => x.id === pid);
                    return (
                      <tr key={str(r.id)} className="border-t border-[color:var(--aipify-border)]">
                        <td className="px-3 py-2">
                          <p className="font-medium">
                            {partner
                              ? recipientDisplayLabel(partner, l.unnamedRecipient)
                              : pid.slice(0, 8) || l.notReported}
                          </p>
                          <p className="font-mono text-xs text-[color:var(--aipify-text-secondary)]">
                            {pid.slice(0, 8) || l.notReported}
                          </p>
                        </td>
                        <td className="px-3 py-2">
                          <p className="font-medium">{str(r.subject) || str(r.direction) || l.notReported}</p>
                          <p className="mt-1 line-clamp-2 text-sm text-[color:var(--aipify-text-secondary)]">
                            {str(r.body)}
                          </p>
                        </td>
                        <td className="px-3 py-2">{str(r.delivery_status) || l.notReported}</td>
                        <td className="px-3 py-2">
                          {formatPlatformDateTimeShort(str(r.created_at) || null, dateOptions)}
                        </td>
                      </tr>
                    );
                  })}
                </Table>
              </div>
            ) : null}
          </div>
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
