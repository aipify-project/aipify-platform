"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { AppLayoutClasses } from "@/lib/design/app-layout";
import { CUSTOMER_AVATAR_API_PATH } from "@/lib/app/account-profile/avatar";
import { SUPPORT_ASSISTANT_CONTEXT_STORAGE_KEY } from "@/lib/app-portal/support-assistant";
import {
  filterItemsByInboxView,
  formatSupportActivityAt,
  initialsFromName,
  lastVisiblePreview,
  parseSupportRequestList,
  sortItemsByActivityDesc,
  supportPriorityTone,
  supportStatusTone,
  supportTicketReference,
  type SupportInboxView,
  type SupportProductOption,
  type SupportRequestCategory,
  type SupportRequestItem,
  type SupportRequestListResponse,
  type SupportRequestPriority,
  type SupportRequestsLabels,
} from "@/lib/app-portal/support-requests";

type Props = {
  labels: SupportRequestsLabels;
  locale: string;
};

const CATEGORIES: SupportRequestCategory[] = [
  "technical", "billing", "integrations", "business_packs", "account", "security", "general",
];
const PRIORITIES: SupportRequestPriority[] = ["low", "medium", "high", "urgent"];
const VIEWS: SupportInboxView[] = ["all", "open", "waiting", "closed"];

type SenderContext = {
  fullName: string;
  workspaceName: string;
  companyName: string;
  customerNumber: string;
  avatarUrl: string | null;
};

export function SupportRequestsCenterPanel({ labels, locale }: Props) {
  const [data, setData] = useState<SupportRequestListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<SupportInboxView>("all");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("");
  const [search, setSearch] = useState("");
  const [searchDraft, setSearchDraft] = useState("");
  const [mode, setMode] = useState<"inbox" | "create">("inbox");
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formCategory, setFormCategory] = useState<SupportRequestCategory>("general");
  const [formPriority, setFormPriority] = useState<SupportRequestPriority>("medium");
  const [formProduct, setFormProduct] = useState("");
  const [products, setProducts] = useState<SupportProductOption[]>([]);
  const [sender, setSender] = useState<SenderContext | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [createdId, setCreatedId] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (priority) params.set("priority", priority);
    if (search.trim()) params.set("search", search.trim());
    const res = await fetch(`/api/aipify/support-requests?${params}`);
    if (res.ok) setData(parseSupportRequestList(await res.json()));
    setLoading(false);
  }, [category, priority, search]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const openCreate = params.get("new") === "1" || params.get("create") === "1" || params.get("from") === "assistant" || params.get("from") === "companion";
    if (openCreate) {
      queueMicrotask(() => setMode("create"));
    }
    if (params.get("from") !== "assistant" && params.get("from") !== "companion") return;
    const raw = sessionStorage.getItem(SUPPORT_ASSISTANT_CONTEXT_STORAGE_KEY);
    if (!raw) return;
    try {
      const ctx = JSON.parse(raw) as { context?: Record<string, unknown> };
      const c = ctx.context;
      queueMicrotask(() => {
        if (c?.question_asked) setFormTitle(String(c.question_asked));
        if (c?.article_title) {
          setFormDescription(
            `${String(c.article_title)}\n\n${String(c.question_asked ?? "")}`,
          );
        }
        const mod = c?.related_module ? String(c.related_module) : "";
        if (mod === "billing") setFormCategory("billing");
        else if (mod === "integrations") setFormCategory("integrations");
        else if (mod === "business_packs") setFormCategory("business_packs");
        else if (mod === "organization" || mod === "account") setFormCategory("account");
        if (mod) setFormProduct(mod);
        setMode("create");
      });
      sessionStorage.removeItem(SUPPORT_ASSISTANT_CONTEXT_STORAGE_KEY);
    } catch {
      /* ignore malformed context */
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch on filter change
    void load();
  }, [load]);

  useEffect(() => {
    let cancelled = false;
    async function loadSender() {
      const [orgRes, avatarRes] = await Promise.all([
        fetch("/api/app/organization-context"),
        fetch(CUSTOMER_AVATAR_API_PATH),
      ]);
      let workspaceName = "";
      let companyName = "";
      let customerNumber = "";
      let fullName = "";
      if (orgRes.ok) {
        const org = (await orgRes.json()) as Record<string, unknown>;
        workspaceName = String(org.workspace_name ?? org.licensed_to ?? "").trim();
        companyName = String(org.company_name ?? org.organization_name ?? org.licensed_to ?? "").trim();
        customerNumber = String(org.customer_number ?? org.customerNumber ?? "").trim();
        fullName = String(org.user_full_name ?? org.full_name ?? "").trim();
      }
      let avatarUrl: string | null = null;
      if (avatarRes.ok) {
        const avatar = (await avatarRes.json()) as { avatarUrl?: string | null; hasAvatar?: boolean };
        avatarUrl = avatar.hasAvatar && avatar.avatarUrl ? avatar.avatarUrl : null;
      }
      if (!cancelled) {
        setSender({
          fullName: fullName || labels.customerSender,
          workspaceName: workspaceName || companyName || "—",
          companyName: companyName || workspaceName || "—",
          customerNumber,
          avatarUrl,
        });
      }
    }
    void loadSender();
    return () => {
      cancelled = true;
    };
  }, [labels.customerSender]);

  useEffect(() => {
    let cancelled = false;
    async function loadProducts() {
      try {
        const res = await fetch("/api/commercial-packages/billing");
        if (!res.ok) return;
        const body = (await res.json()) as {
          products?: Array<Record<string, unknown>>;
          portfolio?: { products?: Array<Record<string, unknown>> };
        };
        const raw =
          body.products ??
          body.portfolio?.products ??
          [];
        const options: SupportProductOption[] = raw
          .map((row) => {
            const id = String(row.id ?? row.product_key ?? row.key ?? "").trim();
            const label = String(row.label ?? row.name ?? "").trim();
            if (!id || !label) return null;
            return { id, label };
          })
          .filter((row): row is SupportProductOption => Boolean(row));
        if (!cancelled) setProducts(options);
      } catch {
        /* optional products */
      }
    }
    void loadProducts();
    return () => {
      cancelled = true;
    };
  }, []);

  const items = useMemo(() => {
    const sorted = sortItemsByActivityDesc(data?.items ?? []);
    return filterItemsByInboxView(sorted, view);
  }, [data?.items, view]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [items.length, view, search, category, priority]);

  async function createRequest() {
    if (submitting) return;
    if (!formTitle.trim()) {
      setFormError(labels.form.validationTitle);
      return;
    }
    if (!formDescription.trim()) {
      setFormError(labels.form.validationDescription);
      return;
    }
    setSubmitting(true);
    setFormError(null);
    const res = await fetch("/api/aipify/support-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: formTitle.trim().slice(0, 200),
        description: formDescription.slice(0, 5000),
        category: formCategory,
        priority: formPriority,
        related_module: formProduct || undefined,
      }),
    });
    setSubmitting(false);
    if (res.ok) {
      const body = (await res.json()) as { request?: { id?: string } };
      const id = body.request?.id ?? null;
      setCreatedId(id);
      setFormTitle("");
      setFormDescription("");
      setFormProduct("");
      if (id) {
        window.location.href = `/app/support/requests/${id}`;
        return;
      }
      setMode("inbox");
      void load();
      return;
    }
    setFormError(labels.form.submitError);
  }

  function abandonCreate() {
    setMode("inbox");
    setFormError(null);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.delete("new");
      url.searchParams.delete("create");
      url.searchParams.delete("from");
      window.history.replaceState({}, "", url.pathname + (url.search ? url.search : ""));
    }
  }

  if (loading && !data) {
    return (
      <div className={`${AppLayoutClasses.pageWidth} flex min-h-[40vh] flex-col items-center justify-center text-center`}>
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-200 border-t-violet-600" aria-hidden />
        <p className="sr-only">{labels.loading}</p>
      </div>
    );
  }

  if (mode === "create") {
    return (
      <div className={`${AppLayoutClasses.pageWidth} space-y-6`}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <button
              type="button"
              onClick={abandonCreate}
              className="text-sm font-medium text-violet-700 hover:underline"
            >
              ← {labels.backToInbox}
            </button>
            <h1 className="mt-3 text-2xl font-semibold text-slate-900">{labels.form.title}</h1>
            <p className="mt-1 max-w-2xl text-sm text-slate-600">{labels.form.subtitle}</p>
          </div>
        </div>

        <section className={AppLayoutClasses.card}>
          <h2 className="text-sm font-semibold text-slate-900">{labels.form.senderTitle}</h2>
          <div className="mt-4 flex items-center gap-3">
            <SenderAvatar sender={sender} />
            <div className="min-w-0 text-sm">
              <p className="font-medium text-slate-900">{sender?.fullName ?? labels.customerSender}</p>
              <p className="text-slate-600">
                {labels.form.senderCompany}: {sender?.companyName ?? "—"}
                {sender?.workspaceName && sender.workspaceName !== sender.companyName
                  ? ` · ${labels.form.senderWorkspace}: ${sender.workspaceName}`
                  : null}
              </p>
              {sender?.customerNumber ? (
                <p className="text-slate-500">
                  {labels.form.senderCustomerNumber}: {sender.customerNumber}
                </p>
              ) : null}
            </div>
          </div>
        </section>

        <section className={`${AppLayoutClasses.card} space-y-5`}>
          <Field label={labels.form.titleLabel} requiredHint={labels.form.required}>
            <input
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              placeholder={labels.form.titlePlaceholder}
              maxLength={200}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={labels.form.category} requiredHint={labels.form.required}>
              <select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value as SupportRequestCategory)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{labels.categories[c]}</option>
                ))}
              </select>
            </Field>
            <Field label={labels.form.priority} requiredHint={labels.form.required}>
              <select
                value={formPriority}
                onChange={(e) => setFormPriority(e.target.value as SupportRequestPriority)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>{labels.priorities[p]}</option>
                ))}
              </select>
              <p className="mt-1.5 text-xs text-slate-500">{labels.priorityHints[formPriority]}</p>
            </Field>
          </div>

          <Field label={labels.form.product}>
            {products.length > 0 ? (
              <select
                value={formProduct}
                onChange={(e) => setFormProduct(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
              >
                <option value="">{labels.form.productNone}</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>{p.label}</option>
                ))}
              </select>
            ) : (
              <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-500">
                {labels.form.productUnavailable}
              </p>
            )}
          </Field>

          <Field label={labels.form.descriptionLabel} requiredHint={labels.form.required}>
            <textarea
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              placeholder={labels.form.descriptionPlaceholder}
              rows={8}
              maxLength={5000}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
            />
          </Field>

          {formError ? <p className="text-sm text-rose-700" role="alert">{formError}</p> : null}

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              disabled={submitting}
              onClick={() => void createRequest()}
              className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-60"
            >
              <PlusIcon />
              {labels.form.submit}
            </button>
            <button
              type="button"
              onClick={abandonCreate}
              className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              {labels.form.cancel}
            </button>
          </div>
        </section>

        {createdId ? (
          <p className="text-sm text-emerald-700">
            {labels.form.successTitle}{" "}
            <Link href={`/app/support/requests/${createdId}`} className="font-medium underline">
              {labels.form.openCase}
            </Link>
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div className={`${AppLayoutClasses.pageWidth} space-y-5`}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">{labels.title}</h1>
          <p className="mt-1 text-sm text-slate-600">{labels.subtitle}</p>
        </div>
        <button
          type="button"
          onClick={() => setMode("create")}
          className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-violet-700"
        >
          <PlusIcon />
          {labels.createRequest}
        </button>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label={labels.filters.status}>
          {VIEWS.map((v) => (
            <button
              key={v}
              type="button"
              role="tab"
              aria-selected={view === v}
              onClick={() => setView(v)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                view === v
                  ? "bg-violet-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {labels.views[v]}
            </button>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <form
            className="min-w-[220px] flex-1"
            onSubmit={(e) => {
              e.preventDefault();
              setSearch(searchDraft);
            }}
          >
            <label className="sr-only" htmlFor="support-inbox-search">{labels.filters.search}</label>
            <input
              id="support-inbox-search"
              type="search"
              value={searchDraft}
              onChange={(e) => setSearchDraft(e.target.value)}
              placeholder={labels.filters.searchPlaceholder}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
          </form>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            aria-label={labels.filters.category}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
          >
            <option value="">{labels.filters.all} — {labels.filters.category}</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{labels.categories[c]}</option>
            ))}
          </select>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            aria-label={labels.filters.priority}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
          >
            <option value="">{labels.filters.all} — {labels.filters.priority}</option>
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>{labels.priorities[p]}</option>
            ))}
          </select>
        </div>
      </section>

      {items.length === 0 ? (
        <section className={`${AppLayoutClasses.card} text-center`}>
          <h2 className="text-lg font-semibold text-slate-900">{labels.emptyTitle}</h2>
          <p className="mt-2 text-sm text-slate-600">{labels.emptyBody}</p>
          <button
            type="button"
            onClick={() => setMode("create")}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white"
          >
            <PlusIcon />
            {labels.emptyAction}
          </button>
        </section>
      ) : (
        <div
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
          role="listbox"
          aria-label={labels.title}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setSelectedIndex((i) => Math.min(i + 1, items.length - 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setSelectedIndex((i) => Math.max(i - 1, 0));
            } else if (e.key === "Enter") {
              const item = items[selectedIndex];
              if (item) window.location.href = `/app/support/requests/${item.id}`;
            }
          }}
        >
          <ul className="divide-y divide-slate-100">
            {items.map((item, index) => (
              <InboxRow
                key={item.id}
                item={item}
                labels={labels}
                locale={locale}
                selected={index === selectedIndex}
                onFocus={() => setSelectedIndex(index)}
              />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function InboxRow({
  item,
  labels,
  locale,
  selected,
  onFocus,
}: {
  item: SupportRequestItem;
  labels: SupportRequestsLabels;
  locale: string;
  selected: boolean;
  onFocus: () => void;
}) {
  const preview = lastVisiblePreview(item);
  const aipifyHint =
    item.last_message_author &&
    /aipify|support|platform|agent/i.test(item.last_message_author)
      ? item.last_message_author
      : null;
  const statusTone = supportStatusTone(item.status);
  const priorityTone = supportPriorityTone(item.priority);

  return (
    <li>
      <Link
        href={`/app/support/requests/${item.id}`}
        role="option"
        aria-selected={selected}
        onFocus={onFocus}
        onMouseEnter={onFocus}
        className={`block px-4 py-3.5 transition hover:bg-violet-50/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-violet-500 sm:px-5 ${
          selected ? "bg-violet-50 shadow-[inset_3px_0_0_#7C3AED]" : ""
        }`}
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate text-sm font-semibold text-slate-900">{item.title}</h3>
              <StatusChip tone={statusTone} label={labels.statuses[item.status]} />
              <PriorityChip tone={priorityTone} label={labels.priorities[item.priority]} />
            </div>
            {preview ? (
              <p className="mt-1 line-clamp-1 text-sm text-slate-600">{preview}</p>
            ) : null}
            <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500">
              <span>
                {labels.reference} {supportTicketReference(item.id)}
              </span>
              {aipifyHint ? <span>{aipifyHint}</span> : null}
              <span>
                {labels.lastActivity}: {formatSupportActivityAt(item.updated_at, locale)}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </li>
  );
}

function StatusChip({
  tone,
  label,
}: {
  tone: ReturnType<typeof supportStatusTone>;
  label: string;
}) {
  const cls =
    tone === "waiting"
      ? "bg-amber-50 text-amber-900 ring-amber-200"
      : tone === "resolved"
        ? "bg-emerald-50 text-emerald-900 ring-emerald-200"
        : tone === "closed"
          ? "bg-slate-100 text-slate-700 ring-slate-300"
          : tone === "open"
            ? "bg-sky-50 text-sky-900 ring-sky-200"
            : "bg-slate-100 text-slate-700 ring-slate-200";
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset ${cls}`}>
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}

function PriorityChip({
  tone,
  label,
}: {
  tone: ReturnType<typeof supportPriorityTone>;
  label: string;
}) {
  const cls =
    tone === "urgent"
      ? "bg-rose-50 text-rose-900 ring-rose-200"
      : tone === "high"
        ? "bg-amber-50 text-amber-900 ring-amber-200"
        : tone === "medium"
          ? "bg-violet-50 text-violet-900 ring-violet-200"
          : "bg-slate-100 text-slate-700 ring-slate-200";
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset ${cls}`}>
      {label}
    </span>
  );
}

function Field({
  label,
  requiredHint,
  children,
}: {
  label: string;
  requiredHint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block text-sm">
      <span className="font-medium text-slate-800">
        {label}
        {requiredHint ? <span className="ml-1 text-rose-600">*</span> : null}
      </span>
      {requiredHint ? <span className="sr-only">{requiredHint}</span> : null}
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

function SenderAvatar({ sender }: { sender: SenderContext | null }) {
  const initials = initialsFromName(sender?.fullName ?? "?");
  if (sender?.avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- same-origin avatar pointer
      <img
        src={sender.avatarUrl}
        alt=""
        className="h-12 w-12 rounded-full object-cover ring-1 ring-slate-200"
      />
    );
  }
  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-100 text-sm font-semibold text-violet-800">
      {initials}
    </div>
  );
}

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}
