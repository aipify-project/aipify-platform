"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { AipifyStatusBadge } from "@/components/ui/aipify-status-badge";
import { CertifiedSellersMessageDesk } from "@/components/platform/sellers/CertifiedSellersMessageDesk";
import { CertifiedSellersSectionPanel } from "@/components/platform/sellers/CertifiedSellersSectionPanel";
import {
  isCspMessageRecipientEligible,
  parseCspMessageRecipients,
  type CspMessageRecipient,
} from "@/lib/certified-sales-partner/message-recipient-picker";
import { classifyCspApiResponse } from "@/lib/certified-sales-partner/ui-support";
import { formatPlatformDateTimeShort } from "@/lib/platform-presentation-quality/date-time";
import { toBcp47Locale } from "@/lib/platform-presentation-quality/bcp47";
import { invalidateCspUnreadBadges } from "@/lib/certified-sales-partner/unread-invalidate";
import { usePollingTask } from "@/lib/polling/use-polling-task";

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
  materialUploadPending: string;
  registerMaterialCta: string;
  publishCta: string;
  withdrawCta: string;
  materialWriteOk: string;
  materialWriteError: string;
  navLabel: string;
  navLabels: Record<string, string>;
  folderInbox: string;
  folderSent: string;
  folderArchive: string;
  archiveBlocked: string;
  directionAdminToPartner: string;
  directionPartnerToAdmin: string;
  deliveryStatus: Record<string, string>;
  auditFallback: string;
  auditActions: Record<string, string>;
  materialFilterAll: string;
  materialFilterDraft: string;
  materialFilterPublished: string;
  materialGroupBanners: string;
  materialGroupCopy: string;
  materialGroupEmail: string;
  materialGroupOther: string;
  materialGroupEmpty: string;
  materialTechnical: string;
  settingsCurrentTitle: string;
  settingsApprovalTitle: string;
  settingsApprovalPercent: string;
  settingsApprovalMessages: string;
  ratesReadOnly: string;
  newMessage: string;
  closeCompose: string;
  fromAdmin: string;
  fromPartner: string;
  allConversations: string;
  sentByAdmin: string;
  threadEmpty: string;
  unread: string;
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
type MaterialGroup = "all" | "banners" | "copy" | "email" | "other";

function materialGroupLabelKey(group: Exclude<MaterialGroup, "all">): "materialGroupBanners" | "materialGroupCopy" | "materialGroupEmail" | "materialGroupOther" {
  if (group === "banners") return "materialGroupBanners";
  if (group === "copy") return "materialGroupCopy";
  if (group === "email") return "materialGroupEmail";
  return "materialGroupOther";
}

function materialGroupOf(category: string): Exclude<MaterialGroup, "all"> {
  const value = category.toLowerCase();
  if (/(banner|image|poster|creative)/.test(value)) return "banners";
  if (/(email|mail)/.test(value)) return "email";
  if (/(copy|text|script)/.test(value)) return "copy";
  return "other";
}

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
  const [recipients, setRecipients] = useState<CspMessageRecipient[]>([]);
  const [recipientsPhase, setRecipientsPhase] = useState<Phase>("loading");
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [matKey, setMatKey] = useState("");
  const [matTitle, setMatTitle] = useState("");
  const [matCategory, setMatCategory] = useState("pdf_sheets");
  const [matPath, setMatPath] = useState("");
  const [materialStatus, setMaterialStatus] = useState<"all" | "draft" | "published">("all");
  const [materialGroup, setMaterialGroup] = useState<MaterialGroup>("all");
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

  const loadSeqRef = useRef(0);
  const abortRef = useRef<AbortController | null>(null);
  const pollPrimedRef = useRef(false);

  const load = useCallback(async (opts?: { silent?: boolean }) => {
    if (!endpoint) {
      setPhase("ready");
      setRows([]);
      return true;
    }
    if (!opts?.silent) setPhase("loading");
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    const seq = ++loadSeqRef.current;
    try {
      const res = await fetch(endpoint, { cache: "no-store", signal: controller.signal });
      const body = await res.json().catch(() => null);
      if (seq !== loadSeqRef.current) return false;
      const outcome = classifyCspApiResponse(res.status, body);
      if (outcome.kind === "unauthorized" || outcome.kind === "forbidden") {
        setPhase("forbidden");
        setRows([]);
        return false;
      }
      if (outcome.kind !== "ready" && res.status >= 400) {
        if (!opts?.silent) {
          setPhase("error");
          setRows([]);
        }
        return false;
      }
      setRows(rowsFrom(body));
      setPhase("ready");
      return true;
    } catch {
      if (controller.signal.aborted || seq !== loadSeqRef.current) return false;
      if (!opts?.silent) {
        setPhase("error");
        setRows([]);
      }
      return false;
    }
  }, [endpoint]);

  useEffect(() => {
    pollPrimedRef.current = false;
    void load();
  }, [load]);

  const pollMessages = useCallback(async () => {
    pollPrimedRef.current = true;
    return load({ silent: true });
  }, [load]);

  usePollingTask({
    taskKey: "platform-seller-messages",
    intervalMs: 15_000,
    hiddenIntervalMs: 60_000,
    enabled: section === "messages",
    runImmediately: false,
    execute: pollMessages,
  });

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      loadSeqRef.current += 1;
    };
  }, []);

  const markMessagesRead = useCallback(async (messageIds: string[]) => {
    const ids = messageIds.filter(Boolean);
    if (ids.length === 0) return;
    const now = new Date().toISOString();
    const results = await Promise.all(
      ids.map(async (messageId) => {
        try {
          const res = await fetch("/api/platform/sellers/messages/read", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message_id: messageId }),
          });
          if (res.ok) {
            setRows((prev) =>
              prev.map((row) =>
                str(row.id) === messageId ? { ...row, read_at: str(row.read_at) || now } : row,
              ),
            );
            return true;
          }
          return false;
        } catch {
          return false;
        }
      }),
    );
    if (results.some(Boolean)) {
      invalidateCspUnreadBadges({ partner: false, platform: true });
    }
    if (results.some((ok) => !ok)) {
      throw new Error("mark_read_partial_failure");
    }
  }, []);

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

  const visibleMaterials = materials.filter((item) => {
    if (materialStatus === "published" && !item.published) return false;
    if (materialStatus === "draft" && item.published) return false;
    if (materialGroup !== "all" && materialGroupOf(item.category) !== materialGroup) return false;
    return true;
  });
  const backendReady = true;

  async function sendAdminMessage(partnerId: string, subject: string, text: string): Promise<boolean> {
    const cleanPartner = partnerId.trim();
    const cleanText = text.trim();
    if (!cleanPartner || !cleanText || busy) return false;
    const recipient = recipients.find((item) => item.id === cleanPartner);
    if (recipient && !isCspMessageRecipientEligible(recipient.status)) {
      setActionNotice(l.sendMessageBlocked);
      return false;
    }
    setBusy(true);
    setActionNotice(null);
    try {
      const res = await fetch("/api/platform/sellers/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          partner_id: cleanPartner,
          subject: subject.trim() || null,
          body: cleanText,
          idempotency_key: `admin-msg-${cleanPartner}-${Date.now()}`,
        }),
      });
      const body = await res.json().catch(() => null);
      if (res.status === 403 && body && (body as { error?: string }).error === "partner_not_active") {
        setActionNotice(l.sendMessageBlocked);
        return false;
      }
      if (!res.ok) {
        setActionNotice(l.sendMessageError);
        return false;
      }
      setActionNotice(l.sendMessageOk);
      await load();
      return true;
    } catch {
      setActionNotice(l.sendMessageError);
      return false;
    } finally {
      setBusy(false);
    }
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
      <div className="w-full space-y-6 px-6 pb-8 lg:px-8">
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
                          <Link className="text-sm font-semibold text-[color:var(--aipify-companion-purple)]" href={`/platform/sellers/partners/${str(r.partnerId)}`}>
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
                          <Link className="text-sm font-semibold text-[color:var(--aipify-companion-purple)]" href={`/platform/sellers/partners/${str(r.partnerId)}`}>
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
                        <td className="px-3 py-2">
                          <p>{l.auditActions[str(r.action)] || l.auditFallback}</p>
                          <details className="text-xs text-[color:var(--aipify-text-secondary)]">
                            <summary>{l.colAction}</summary>
                            <p className="mt-1 font-mono">{str(r.action) || l.notReported}</p>
                          </details>
                        </td>
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
                  <>
                  <p className="mb-3 text-sm text-[color:var(--aipify-text-secondary)]">{l.ratesReadOnly}</p>
                  <Table caption={title} headers={[l.colProduct, l.colAmount, l.colEffectiveFrom]}>
                    {filtered.map((r) => (
                      <tr key={str(r.id)} className="border-t border-[color:var(--aipify-border)]">
                        <td className="px-3 py-2">
                          <p className="font-medium">{str(r.productTitle) || l.notReported}</p>
                          {str(r.productKey) ? (
                            <details className="text-xs text-[color:var(--aipify-text-secondary)]">
                              <summary>{l.colProduct}</summary>
                              <p className="mt-1 font-mono">{str(r.productKey)}</p>
                            </details>
                          ) : null}
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
                  </>
                ) : null}
              </div>
            )}
          </>
        ) : null}

        {section === "materials" && phase === "ready" ? (
          <div className="space-y-4">
            <article className="rounded-2xl border border-[color:var(--aipify-border)] bg-white p-5 shadow-sm space-y-3">
              <h2 className="text-base font-semibold text-[color:var(--aipify-text-primary)]">{l.registerMaterialTitle}</h2>
              <p className="text-sm text-[color:var(--aipify-text-secondary)]">{l.materialUploadPending}</p>
              <input type="file" disabled aria-disabled="true" className="text-sm" />
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
            <div className="flex flex-wrap gap-2" role="tablist" aria-label={l.colCategory}>
              {(
                [
                  ["all", l.materialFilterAll],
                  ["banners", l.materialGroupBanners],
                  ["copy", l.materialGroupCopy],
                  ["email", l.materialGroupEmail],
                  ["other", l.materialGroupOther],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={materialGroup === id}
                  onClick={() => setMaterialGroup(id)}
                  className={`rounded-xl px-3 py-1.5 text-sm font-semibold ${
                    materialGroup === id
                      ? "bg-[color:var(--aipify-companion-purple)] text-white"
                      : "border border-[color:var(--aipify-border)]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2" role="tablist" aria-label={l.materialFilterAll}>
              {(
                [
                  ["all", l.materialFilterAll],
                  ["draft", l.materialFilterDraft],
                  ["published", l.materialFilterPublished],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={materialStatus === id}
                  onClick={() => setMaterialStatus(id)}
                  className={`rounded-xl px-3 py-1.5 text-sm font-semibold ${
                    materialStatus === id
                      ? "bg-[color:var(--aipify-companion-purple)] text-white"
                      : "border border-[color:var(--aipify-border)]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            {visibleMaterials.length === 0 ? <Empty title={l.emptyTitle} body={materials.length === 0 ? l.emptyBody : l.materialGroupEmpty} /> : null}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {visibleMaterials.map((item) => (
                <article
                  key={item.id || item.materialKey}
                  className="rounded-2xl border border-[color:var(--aipify-border)] bg-white p-4 shadow-sm"
                >
                  <p className="text-xs uppercase tracking-wide text-[color:var(--aipify-text-muted)]">
                    {l[materialGroupLabelKey(materialGroupOf(item.category))]}
                  </p>
                  <p className="mt-1 font-semibold text-[color:var(--aipify-text-primary)]">{item.title || l.unnamedRecipient}</p>
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
                  <details className="mt-3 text-xs text-[color:var(--aipify-text-secondary)]">
                    <summary>{l.materialTechnical}</summary>
                    <p className="mt-1">{l.materialKey}: {item.materialKey}</p>
                    {item.assetPath ? <p className="mt-1 break-all">{l.materialAssetPath}: {item.assetPath}</p> : null}
                  </details>
                  {item.mimeHint.startsWith("image/") && item.assetPath.startsWith("/") ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.assetPath} alt="" className="mt-3 max-h-28 w-auto rounded-lg border border-[color:var(--aipify-border)]" />
                  ) : null}
                </article>
              ))}
            </div>
          </div>
        ) : null}

        {section === "settings" ? (
          <div className="grid gap-4 lg:grid-cols-2">
            <article className="rounded-2xl border border-[color:var(--aipify-border)] bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-[color:var(--aipify-text-primary)]">{l.settingsCurrentTitle}</h2>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-[color:var(--aipify-text-secondary)]">
                {l.settingsPolicies.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </article>
            <article className="rounded-2xl border border-[color:var(--aipify-border)] bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-[color:var(--aipify-text-primary)]">{l.settingsApprovalTitle}</h2>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-[color:var(--aipify-text-secondary)]">
                <li>{l.settingsApprovalPercent}</li>
                <li>{l.settingsApprovalMessages}</li>
              </ul>
            </article>
          </div>
        ) : null}

        {section === "messages" && (phase === "ready" || phase === "loading") ? (
          <CertifiedSellersMessageDesk
            rows={rows}
            recipients={recipients}
            recipientsPhase={recipientsPhase}
            labels={l}
            locale={locale}
            busy={busy}
            notice={actionNotice}
            phase={phase}
            onSend={sendAdminMessage}
            onRetryRecipients={() => void loadRecipients()}
            onMarkRead={markMessagesRead}
          />
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
