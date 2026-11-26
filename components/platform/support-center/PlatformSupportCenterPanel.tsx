"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AipifyEmptyState } from "@/components/branding";
import { formatPlatformDateTimeFull } from "@/lib/platform-presentation-quality";
import {
  createDefaultSupportSignature,
  getSupportCenterGateState,
  listSupportChannelActivations,
  listSupportReplyStarterTemplates,
  parseSupportCenterTab,
  renderSupportSignatureHtml,
  renderSupportSignatureText,
  renderSupportTemplateBody,
  type SupportCenterTabId,
  type SupportReplyTemplate,
  type SupportSignatureDraft,
} from "@/lib/platform-portal/support-center";
import type { PlatformSupportTicketsListItem } from "@/lib/platform-portal/support-tickets-read-adapter";
import type { SupportCenterLabels } from "./support-center-labels";

type PlatformSupportCenterPanelProps = {
  locale: string;
  labels: SupportCenterLabels;
};

type CountsState = {
  total: number;
  open: number;
  waiting: number;
  resolved_or_closed: number;
} | null;

type LoadState =
  | { kind: "loading" }
  | { kind: "blocked"; code: string; message: string }
  | { kind: "ready"; items: PlatformSupportTicketsListItem[]; counts: CountsState }
  | { kind: "error"; message: string };

function statusTone(status: string): string {
  const s = status.toLowerCase();
  if (s === "resolved" || s === "closed") {
    return "bg-emerald-50 text-emerald-800 border-emerald-200";
  }
  if (s === "waiting_for_customer" || s === "waiting_internal") {
    return "bg-amber-50 text-amber-900 border-amber-200";
  }
  if (s === "critical" || s === "urgent" || s === "new" || s === "reopened") {
    return "bg-rose-50 text-rose-800 border-rose-200";
  }
  if (s === "open" || s === "in_progress") {
    return "bg-sky-50 text-sky-900 border-sky-200";
  }
  return "bg-slate-50 text-slate-700 border-slate-200";
}

function priorityTone(priority: string): string {
  const p = priority.toLowerCase();
  if (p === "critical" || p === "urgent") {
    return "bg-rose-50 text-rose-800 border-rose-200";
  }
  if (p === "high") {
    return "bg-orange-50 text-orange-900 border-orange-200";
  }
  return "bg-slate-50 text-slate-700 border-slate-200";
}

function StatusChip({
  code,
  map,
  tone,
}: {
  code: string;
  map: Record<string, string>;
  tone: string;
}) {
  const label = map[code] ?? map[code.toLowerCase()] ?? "—";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium ${tone}`}
    >
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {label}
    </span>
  );
}

export default function PlatformSupportCenterPanel({
  locale,
  labels,
}: PlatformSupportCenterPanelProps) {
  const router = useRouter();
  const pathname = usePathname() || "/platform/support";
  const searchParams = useSearchParams();
  const tab = parseSupportCenterTab(searchParams.get("tab"));
  const selectedId = searchParams.get("ticket");

  const gates = useMemo(() => getSupportCenterGateState(), []);
  const [load, setLoad] = useState<LoadState>({ kind: "loading" });
  const [signature, setSignature] = useState<SupportSignatureDraft>(() =>
    createDefaultSupportSignature(),
  );
  const [draftBody, setDraftBody] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  const templates = useMemo(() => listSupportReplyStarterTemplates(), []);
  const channels = useMemo(() => listSupportChannelActivations(), []);

  const setTab = useCallback(
    (next: SupportCenterTabId) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("tab", next);
      if (next !== "all" && next !== "mine") {
        params.delete("ticket");
      }
      router.replace(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams],
  );

  const openTicket = useCallback(
    (id: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("tab", tab === "mine" ? "mine" : "all");
      params.set("ticket", id);
      router.replace(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams, tab],
  );

  const clearTicket = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("ticket");
    router.replace(`${pathname}?${params.toString()}`);
  }, [pathname, router, searchParams]);

  const loadTickets = useCallback(async () => {
    setLoad({ kind: "loading" });
    try {
      const [listRes, countsRes] = await Promise.all([
        fetch("/api/platform-portal/support-requests?page_size=50", {
          cache: "no-store",
        }),
        fetch("/api/platform-portal/support-requests/counts", {
          cache: "no-store",
        }),
      ]);

      if (listRes.status === 503) {
        const body = (await listRes.json().catch(() => ({}))) as {
          code?: string;
          error?: string;
        };
        setLoad({
          kind: "blocked",
          code: body.code ?? "rpc_not_applied",
          message: body.error ?? labels.coreBlockedBody,
        });
        return;
      }

      if (listRes.status === 401 || listRes.status === 403) {
        setLoad({
          kind: "error",
          message: labels.coreBlockedBody,
        });
        return;
      }

      if (!listRes.ok) {
        setLoad({ kind: "error", message: labels.emptyCoreBlocked });
        return;
      }

      const listJson = (await listRes.json()) as {
        items?: PlatformSupportTicketsListItem[];
      };
      let counts: CountsState = null;
      if (countsRes.ok) {
        const countsJson = (await countsRes.json()) as {
          counts?: CountsState;
        };
        counts = countsJson.counts ?? null;
      }

      setLoad({
        kind: "ready",
        items: Array.isArray(listJson.items) ? listJson.items : [],
        counts,
      });
    } catch {
      setLoad({ kind: "error", message: labels.emptyCoreBlocked });
    }
  }, [labels.coreBlockedBody, labels.emptyCoreBlocked]);

  useEffect(() => {
    void loadTickets();
  }, [loadTickets]);

  const labelFor = (map: Record<string, string>, code: string) =>
    map[code] ?? map[code.toLowerCase()] ?? "—";

  const applyTemplate = (template: SupportReplyTemplate) => {
    setSelectedTemplateId(template.id);
    const rendered = renderSupportTemplateBody(template.body, {
      customer_name: "",
      ticket_number: selectedId ? selectedId.slice(0, 8).toUpperCase() : "",
      product_name: "",
      agent_name: signature.agentName || signature.displayName,
    }, { escapeHtml: false });
    if (rendered.ok) {
      setDraftBody(rendered.text);
    } else {
      setDraftBody(template.body);
    }
    if (tab !== "all" && tab !== "mine") {
      setTab("all");
    }
  };

  const signatureHtml = useMemo(
    () => renderSupportSignatureHtml(signature),
    [signature],
  );
  const signatureText = useMemo(
    () => renderSupportSignatureText(signature),
    [signature],
  );

  const tabs: { id: SupportCenterTabId; label: string }[] = [
    { id: "all", label: labels.tabAll },
    { id: "mine", label: labels.tabMine },
    { id: "templates", label: labels.tabTemplates },
    { id: "signature", label: labels.tabSignature },
    { id: "channels", label: labels.tabChannels },
  ];

  const selectedItem =
    load.kind === "ready" && selectedId
      ? load.items.find((i) => i.id === selectedId) ?? null
      : null;

  return (
    <div className="w-full max-w-none">
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-[color:var(--aipify-text)] sm:text-3xl">
          {labels.title}
        </h1>
        <p className="mt-2 max-w-3xl text-base text-[color:var(--aipify-text-secondary)]">
          {labels.subtitle}
        </p>
        <p className="mt-2 text-xs text-[color:var(--aipify-text-secondary)]">
          {labels.legacyKpiRemoved}
        </p>
      </header>

      {!gates.ticketsLive && (
        <div
          role="status"
          className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950"
        >
          <p className="font-semibold">{labels.coreBlockedTitle}</p>
          <p className="mt-1">{labels.coreBlockedBody}</p>
        </div>
      )}

      <nav aria-label={labels.tabsAria} className="-mx-1 mb-6 overflow-x-auto px-1">
        <ul className="flex min-w-max flex-nowrap gap-1 rounded-xl border border-[color:var(--aipify-border)] bg-[color:var(--aipify-surface-muted)] p-0.5">
          {tabs.map((item) => {
            const active = item.id === tab;
            return (
              <li key={item.id} className="shrink-0">
                <button
                  type="button"
                  onClick={() => setTab(item.id)}
                  aria-current={active ? "page" : undefined}
                  className={`inline-flex min-h-10 items-center whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--aipify-focus-ring)] ${
                    active
                      ? "bg-[color:var(--aipify-companion-purple)] font-semibold text-white shadow-sm"
                      : "text-[color:var(--aipify-text-secondary)] hover:bg-[color:var(--aipify-surface)] hover:text-[color:var(--aipify-text)]"
                  }`}
                >
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {(tab === "all" || tab === "mine") && (
        <section className="space-y-6">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {[
              {
                label: labels.kpiNew,
                value:
                  load.kind === "ready" && load.counts
                    ? String(load.counts.open)
                    : labels.kpiUnavailable,
              },
              {
                label: labels.kpiInProgress,
                value: labels.kpiUnavailable,
              },
              {
                label: labels.kpiWaiting,
                value:
                  load.kind === "ready" && load.counts
                    ? String(load.counts.waiting)
                    : labels.kpiUnavailable,
              },
              {
                label: labels.kpiCritical,
                value: labels.kpiUnavailable,
              },
              {
                label: labels.kpiResolved,
                value:
                  load.kind === "ready" && load.counts
                    ? String(load.counts.resolved_or_closed)
                    : labels.kpiUnavailable,
              },
            ].map((card) => (
              <article
                key={card.label}
                className="flex min-h-[5.5rem] flex-col justify-between rounded-xl border border-[color:var(--aipify-border)] bg-[color:var(--aipify-surface)] p-4"
              >
                <p className="text-xs font-medium uppercase tracking-wide text-[color:var(--aipify-text-secondary)]">
                  {card.label}
                </p>
                <p className="mt-2 text-2xl font-semibold text-[color:var(--aipify-text)]">
                  {card.value}
                </p>
              </article>
            ))}
          </div>
          <p className="text-xs text-[color:var(--aipify-text-secondary)]">
            {labels.kpiSourceNote}
          </p>

          {load.kind === "loading" && (
            <p className="text-sm text-[color:var(--aipify-text-secondary)]">
              {labels.loading}
            </p>
          )}

          {load.kind === "blocked" && (
            <AipifyEmptyState
              message={labels.emptyCoreBlocked}
              pulseLabel={labels.pulseLabel}
            />
          )}

          {load.kind === "error" && (
            <AipifyEmptyState message={load.message} pulseLabel={labels.pulseLabel} />
          )}

          {load.kind === "ready" && load.items.length === 0 && (
            <AipifyEmptyState message={labels.empty} pulseLabel={labels.pulseLabel} />
          )}

          {load.kind === "ready" && load.items.length > 0 && (
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
              <div className="overflow-hidden rounded-xl border border-[color:var(--aipify-border)] bg-[color:var(--aipify-surface)]">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-[color:var(--aipify-border)]">
                    <thead className="bg-[color:var(--aipify-surface-muted)]">
                      <tr>
                        {[
                          labels.reference,
                          labels.customer,
                          labels.channel,
                          labels.subject,
                          labels.status,
                          labels.priority,
                          labels.lastUpdated,
                          "",
                        ].map((heading, index) => (
                          <th
                            key={`${heading}-${index}`}
                            className={`px-3 py-3 text-xs font-semibold uppercase tracking-wide text-[color:var(--aipify-text-secondary)] ${
                              index === 7 ? "text-right" : "text-left"
                            }`}
                          >
                            {heading}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[color:var(--aipify-border)]">
                      {load.items.map((row) => (
                        <tr
                          key={row.id}
                          className={
                            selectedId === row.id
                              ? "bg-[color:var(--aipify-surface-muted)]"
                              : undefined
                          }
                        >
                          <td className="whitespace-nowrap px-3 py-3 font-mono text-xs text-[color:var(--aipify-text)]">
                            {row.id.slice(0, 8).toUpperCase()}
                          </td>
                          <td className="px-3 py-3 text-sm text-[color:var(--aipify-text)]">
                            {row.company_name || "—"}
                          </td>
                          <td className="px-3 py-3 text-sm">
                            {labelFor(labels.channelLabels, row.channel)}
                          </td>
                          <td className="max-w-[14rem] truncate px-3 py-3 text-sm text-[color:var(--aipify-text)]">
                            {row.title}
                          </td>
                          <td className="px-3 py-3">
                            <StatusChip
                              code={row.status}
                              map={labels.statusLabels}
                              tone={statusTone(row.status)}
                            />
                          </td>
                          <td className="px-3 py-3">
                            <StatusChip
                              code={row.priority}
                              map={labels.priorityLabels}
                              tone={priorityTone(row.priority)}
                            />
                          </td>
                          <td className="whitespace-nowrap px-3 py-3 text-xs text-[color:var(--aipify-text-secondary)]">
                            {formatPlatformDateTimeFull(row.updated_at, {
                              locale,
                              emptyFallback: "—",
                              invalidFallback: "—",
                            })}
                          </td>
                          <td className="px-3 py-3 text-right">
                            <button
                              type="button"
                              onClick={() => openTicket(row.id)}
                              className="text-sm font-medium text-[color:var(--aipify-companion-purple)] hover:underline"
                            >
                              {labels.openTicket}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <aside className="rounded-xl border border-[color:var(--aipify-border)] bg-[color:var(--aipify-surface)] p-4">
                {selectedItem ? (
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="text-lg font-semibold text-[color:var(--aipify-text)]">
                          {selectedItem.title}
                        </h2>
                        <p className="mt-1 text-sm text-[color:var(--aipify-text-secondary)]">
                          {selectedItem.company_name || "—"} ·{" "}
                          {selectedItem.id.slice(0, 8).toUpperCase()}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={clearTicket}
                        className="text-sm text-[color:var(--aipify-text-secondary)] hover:underline"
                      >
                        {labels.detail.back}
                      </button>
                    </div>
                    <p className="text-sm text-[color:var(--aipify-text)]">
                      {selectedItem.description_preview}
                    </p>
                    <p className="text-xs text-[color:var(--aipify-text-secondary)]">
                      {labels.detail.messagesBlocked}
                    </p>
                    {selectedItem.company_id ? (
                      <Link
                        href={`/platform/customers/${selectedItem.company_id}`}
                        className="inline-flex text-sm font-medium text-[color:var(--aipify-companion-purple)] hover:underline"
                      >
                        {labels.viewCustomer}
                      </Link>
                    ) : null}

                    <div className="border-t border-[color:var(--aipify-border)] pt-4">
                      <label className="mb-2 block text-sm font-medium text-[color:var(--aipify-text)]">
                        {labels.reply.chooseTemplate}
                      </label>
                      <select
                        className="mb-3 w-full rounded-lg border border-[color:var(--aipify-border)] bg-white px-3 py-2 text-sm"
                        value={selectedTemplateId}
                        onChange={(e) => {
                          const tpl = templates.find((t) => t.id === e.target.value);
                          if (tpl) applyTemplate(tpl);
                        }}
                      >
                        <option value="">—</option>
                        {templates.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.name}
                          </option>
                        ))}
                      </select>
                      <label className="mb-2 block text-sm font-medium text-[color:var(--aipify-text)]">
                        {labels.reply.draft}
                      </label>
                      <textarea
                        className="min-h-[10rem] w-full rounded-lg border border-[color:var(--aipify-border)] bg-white px-3 py-2 text-sm"
                        value={draftBody}
                        onChange={(e) => setDraftBody(e.target.value)}
                      />
                      <p className="mt-2 text-xs text-[color:var(--aipify-text-secondary)]">
                        {labels.reply.sendBlocked}
                      </p>
                      <button
                        type="button"
                        disabled
                        className="mt-3 inline-flex min-h-10 cursor-not-allowed items-center rounded-lg bg-slate-300 px-4 text-sm font-medium text-slate-600"
                      >
                        {labels.reply.send}
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-[color:var(--aipify-text-secondary)]">
                    {labels.detail.title}
                  </p>
                )}
              </aside>
            </div>
          )}
        </section>
      )}

      {tab === "templates" && (
        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-[color:var(--aipify-text)]">
              {labels.templates.title}
            </h2>
            <p className="mt-1 text-sm text-[color:var(--aipify-text-secondary)]">
              {labels.templates.subtitle}
            </p>
            <p className="mt-2 text-xs text-amber-800">{labels.templates.persistBlocked}</p>
            <p className="mt-1 text-xs text-[color:var(--aipify-text-secondary)]">
              {labels.templates.localeNote}
            </p>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {templates.map((tpl) => (
              <article
                key={tpl.id}
                className="rounded-xl border border-[color:var(--aipify-border)] bg-[color:var(--aipify-surface)] p-4"
              >
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-semibold text-[color:var(--aipify-text)]">
                    {tpl.name}
                  </h3>
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-700">
                    {labels.templates.starterBadge}
                  </span>
                </div>
                <p className="text-xs text-[color:var(--aipify-text-secondary)]">
                  {labels.templates.subject}: {tpl.subject}
                </p>
                <pre className="mt-3 max-h-48 overflow-auto whitespace-pre-wrap rounded-lg bg-[color:var(--aipify-surface-muted)] p-3 text-xs text-[color:var(--aipify-text)]">
                  {tpl.body}
                </pre>
                <p className="mt-2 text-xs text-[color:var(--aipify-text-secondary)]">
                  {labels.templates.variables}: {tpl.variables.map((v) => `{{${v}}}`).join(", ")}
                </p>
                <button
                  type="button"
                  onClick={() => applyTemplate(tpl)}
                  className="mt-3 text-sm font-medium text-[color:var(--aipify-companion-purple)] hover:underline"
                >
                  {labels.templates.insertDraft}
                </button>
              </article>
            ))}
          </div>
        </section>
      )}

      {tab === "signature" && (
        <section className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-3 rounded-xl border border-[color:var(--aipify-border)] bg-[color:var(--aipify-surface)] p-4">
            <h2 className="text-lg font-semibold text-[color:var(--aipify-text)]">
              {labels.signature.title}
            </h2>
            <p className="text-sm text-[color:var(--aipify-text-secondary)]">
              {labels.signature.subtitle}
            </p>
            <p className="text-xs text-amber-800">{labels.signature.persistBlocked}</p>
            {(
              [
                ["displayName", labels.signature.displayName],
                ["agentName", labels.signature.agentName],
                ["agentTitle", labels.signature.agentTitle],
                ["companyName", labels.signature.companyName],
                ["websiteUrl", labels.signature.website],
                ["supportEmail", labels.signature.supportEmail],
                ["phone", labels.signature.phone],
                ["addressLine", labels.signature.address],
              ] as const
            ).map(([key, label]) => (
              <label key={key} className="block text-sm">
                <span className="mb-1 block font-medium text-[color:var(--aipify-text)]">
                  {label}
                </span>
                <input
                  className="w-full rounded-lg border border-[color:var(--aipify-border)] bg-white px-3 py-2"
                  value={signature[key]}
                  onChange={(e) =>
                    setSignature((prev) => ({ ...prev, [key]: e.target.value }))
                  }
                />
              </label>
            ))}
            <label className="flex items-center gap-2 text-sm text-[color:var(--aipify-text)]">
              <input
                type="checkbox"
                checked={signature.includeLogo}
                onChange={(e) =>
                  setSignature((prev) => ({
                    ...prev,
                    includeLogo: e.target.checked,
                  }))
                }
              />
              {labels.signature.includeLogo}
            </label>
            <button
              type="button"
              onClick={() => setSignature(createDefaultSupportSignature())}
              className="text-sm font-medium text-[color:var(--aipify-companion-purple)] hover:underline"
            >
              {labels.signature.resetDefaults}
            </button>
          </div>
          <div className="space-y-4">
            <div className="rounded-xl border border-[color:var(--aipify-border)] bg-white p-4">
              <h3 className="mb-3 text-sm font-semibold text-slate-800">
                {labels.signature.previewLight}
              </h3>
              <div
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: signatureHtml }}
              />
            </div>
            <div className="rounded-xl border border-slate-700 bg-slate-900 p-4 text-slate-100">
              <h3 className="mb-3 text-sm font-semibold text-slate-100">
                {labels.signature.previewDark}
              </h3>
              <div
                className="prose prose-sm prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: signatureHtml }}
              />
            </div>
            <div className="rounded-xl border border-[color:var(--aipify-border)] bg-[color:var(--aipify-surface-muted)] p-4">
              <h3 className="mb-2 text-sm font-semibold text-[color:var(--aipify-text)]">
                {labels.signature.previewText}
              </h3>
              <pre className="whitespace-pre-wrap text-xs text-[color:var(--aipify-text)]">
                {signatureText}
              </pre>
            </div>
          </div>
        </section>
      )}

      {tab === "channels" && (
        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-[color:var(--aipify-text)]">
              {labels.channels.title}
            </h2>
            <p className="mt-1 text-sm text-[color:var(--aipify-text-secondary)]">
              {labels.channels.subtitle}
            </p>
            <p className="mt-2 text-xs text-amber-800">
              {labels.channels.emailSendBlocked}
            </p>
          </div>
          <ul className="grid gap-3 md:grid-cols-2">
            {channels.map((ch) => {
              const statusLabel =
                ch.status === "active"
                  ? labels.channels.active
                  : ch.status === "prepared_only"
                    ? labels.channels.preparedOnly
                    : labels.channels.notActivated;
              const note =
                ch.id === "web"
                  ? labels.channels.webNote
                  : ch.id === "app"
                    ? labels.channels.appNote
                    : ch.id === "partner"
                      ? labels.channels.partnerNote
                      : ch.id === "module"
                        ? labels.channels.moduleNote
                        : labels.channels.kompisNote;
              const title =
                ch.id === "web"
                  ? labels.channels.web
                  : ch.id === "app"
                    ? labels.channels.app
                    : ch.id === "partner"
                      ? labels.channels.partner
                      : ch.id === "module"
                        ? labels.channels.module
                        : labels.channels.kompis;
              const tone =
                ch.status === "active"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                  : ch.status === "prepared_only"
                    ? "border-sky-200 bg-sky-50 text-sky-900"
                    : "border-slate-200 bg-slate-50 text-slate-800";
              return (
                <li
                  key={ch.id}
                  className={`rounded-xl border p-4 ${tone}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold">{title}</h3>
                    <span className="text-xs font-medium">{statusLabel}</span>
                  </div>
                  <p className="mt-2 text-sm opacity-90">{note}</p>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}
