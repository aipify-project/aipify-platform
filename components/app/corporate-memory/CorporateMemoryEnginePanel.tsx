"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import { AipifyModuleAccessDenied } from "@/components/ui/aipify-module-access-denied";
import { AipifyShellClasses } from "@/lib/design/light-enterprise-theme";
import {
  parseCorporateMemoryCenter,
  type ContributionItem,
  type CorporateDocumentItem,
  type CorporateMemoryCenter,
  type CorporateMemoryLabels,
  type KnowledgeArticleItem,
  type MemoryItem,
  type PlaybookItem,
  type TemplateItem,
} from "@/lib/corporate-memory";

type Tab =
  | "overview"
  | "articles"
  | "documents"
  | "policies"
  | "procedures"
  | "playbooks"
  | "templates"
  | "corporate_memory"
  | "search"
  | "reports";

const STATUS_STYLE: Record<string, string> = {
  draft: "bg-aipify-surface-muted text-aipify-text-secondary ring-aipify-border",
  review: "bg-sky-50 text-sky-900 ring-sky-200",
  under_review: "bg-sky-50 text-sky-900 ring-sky-200",
  published: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  update_required: "bg-amber-50 text-amber-900 ring-amber-200",
  requires_update: "bg-amber-50 text-amber-900 ring-amber-200",
  archived: "bg-red-50 text-red-900 ring-red-200",
  pending: "bg-amber-50 text-amber-900 ring-amber-200",
  approved: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  rejected: "bg-red-50 text-red-900 ring-red-200",
};

type Props = {
  labels: CorporateMemoryLabels;
  initialTab?: Tab;
};

export function CorporateMemoryEnginePanel({ labels, initialTab = "overview" }: Props) {
  const [center, setCenter] = useState<CorporateMemoryCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>(initialTab);
  const [busy, setBusy] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Record<string, unknown> | null>(null);
  const [playbookTitle, setPlaybookTitle] = useState("");
  const [contributionTitle, setContributionTitle] = useState("");
  const [memoryTitle, setMemoryTitle] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/app/corporate-memory");
    if (res.ok) setCenter(parseCorporateMemoryCenter(await res.json()));
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
    await fetch("/api/app/corporate-memory/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action_type, payload }),
    });
    setBusy(false);
    await load();
  }

  async function runSearch() {
    if (!searchQuery.trim()) return;
    setBusy(true);
    const res = await fetch(`/api/app/knowledge/search?q=${encodeURIComponent(searchQuery.trim())}`);
    if (res.ok) {
      const data = await res.json();
      setSearchResults(data as Record<string, unknown>);
      await runAction("log_search", {
        query: searchQuery.trim(),
        result_count:
          (Array.isArray(data.documents) ? data.documents.length : 0) +
          (Array.isArray(data.knowledge_articles) ? data.knowledge_articles.length : 0),
      });
    }
    setBusy(false);
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
  const articles = center.knowledge_articles ?? [];
  const documents = center.documents ?? [];
  const policies = center.policies ?? [];
  const procedures = center.procedures ?? [];
  const playbooks = center.playbooks ?? [];
  const templates = center.templates ?? [];
  const memoryItems = center.corporate_memory ?? [];
  const pendingContributions = center.pending_contributions ?? [];
  const documentsRoute = center.routes?.documents ?? "/app/documents";

  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: labels.overview },
    { id: "articles", label: labels.articles },
    { id: "documents", label: labels.documents },
    { id: "policies", label: labels.policies },
    { id: "procedures", label: labels.procedures },
    { id: "playbooks", label: labels.playbooks },
    { id: "templates", label: labels.templates },
    { id: "corporate_memory", label: labels.corporateMemory },
    { id: "search", label: labels.search },
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
        <Link href={documentsRoute} className={`mt-3 inline-block text-sm ${AipifyShellClasses.link}`}>
          {labels.viewDocuments}
        </Link>
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
              [labels.publishedArticles, overview.published_articles],
              [labels.publishedDocuments, overview.published_documents],
              [labels.playbookCount, overview.playbooks],
              [labels.memoryItems, overview.corporate_memory_items],
              [labels.pendingContributions, overview.pending_contributions],
              [labels.pendingReviews, overview.pending_reviews],
              [labels.templateCount, overview.templates],
            ] as [string, string | number][]
          ).map(([label, value]) => (
            <div key={String(label)} className={`${AipifyShellClasses.surfaceCard} p-4`}>
              <p className="text-xs text-aipify-text-muted">{label}</p>
              <p className="mt-1 text-xl font-semibold text-aipify-text">{value ?? "—"}</p>
            </div>
          ))}
        </div>
      ) : null}

      {tab === "search" || tab === "overview" ? (
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={labels.searchPlaceholder}
            className={AipifyShellClasses.input}
          />
          <button
            type="button"
            disabled={busy || !searchQuery.trim()}
            onClick={() => void runSearch()}
            className={AipifyShellClasses.primaryButton}
          >
            {labels.search}
          </button>
        </div>
      ) : null}

      {searchResults && (tab === "search" || tab === "overview") ? (
        <SearchResults labels={labels} data={searchResults} />
      ) : null}

      {tab === "articles" ? (
        <ItemList
          emptyTitle={labels.noArticles}
          emptyMessage={labels.emptyHint}
          items={articles}
          render={(a: KnowledgeArticleItem) => (
            <ArticleCard key={a.id} item={a} labels={labels} />
          )}
        />
      ) : null}

      {tab === "documents" ? (
        <ItemList
          emptyTitle={labels.noDocuments}
          emptyMessage={labels.emptyHint}
          items={documents}
          render={(d: CorporateDocumentItem) => (
            <DocCard key={d.id} item={d} labels={labels} />
          )}
        />
      ) : null}

      {tab === "policies" ? (
        <ItemList
          emptyTitle={labels.policies}
          emptyMessage={labels.emptyHint}
          items={policies}
          render={(d: CorporateDocumentItem) => (
            <DocCard key={d.id} item={d} labels={labels} />
          )}
        />
      ) : null}

      {tab === "procedures" ? (
        <ItemList
          emptyTitle={labels.procedures}
          emptyMessage={labels.emptyHint}
          items={procedures}
          render={(d: CorporateDocumentItem) => (
            <DocCard key={d.id} item={d} labels={labels} />
          )}
        />
      ) : null}

      {tab === "playbooks" ? (
        <div className="space-y-4">
          <div className={`${AipifyShellClasses.surfaceCard} grid gap-3 p-4 sm:grid-cols-2`}>
            <input
              value={playbookTitle}
              onChange={(e) => setPlaybookTitle(e.target.value)}
              placeholder={labels.playbookTitle}
              className={AipifyShellClasses.input}
            />
            <button
              type="button"
              disabled={busy || !playbookTitle.trim()}
              onClick={() =>
                void runAction("create_playbook", { title: playbookTitle.trim(), playbook_type: "operations" }).then(
                  () => setPlaybookTitle(""),
                )
              }
              className={AipifyShellClasses.primaryButton}
            >
              {labels.createPlaybook}
            </button>
          </div>
          <ItemList
            emptyTitle={labels.noPlaybooks}
            emptyMessage={labels.emptyHint}
            items={playbooks}
            render={(p: PlaybookItem) => (
              <div key={p.id} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
                <p className="text-xs text-aipify-text-muted">{p.playbook_number}</p>
                <h3 className="font-semibold text-aipify-text">{p.title}</h3>
                <p className="text-aipify-text-secondary">{p.playbook_type.replace(/_/g, " ")} · v{p.version ?? 1}</p>
                <StatusBadge status={p.status} label={labels.status} />
                {p.status === "draft" ? (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void runAction("publish_playbook", { playbook_id: p.id })}
                    className={`mt-3 ${AipifyShellClasses.primaryButton}`}
                  >
                    {labels.publishPlaybook}
                  </button>
                ) : null}
              </div>
            )}
          />
        </div>
      ) : null}

      {tab === "templates" ? (
        <div className="grid gap-3 md:grid-cols-2">
          {templates.map((t: TemplateItem) => (
            <div key={t.id} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
              <p className="text-xs text-aipify-text-muted">{t.template_key}</p>
              <h3 className="font-semibold text-aipify-text">{t.name}</h3>
              <p className="text-aipify-text-secondary">
                {t.category} · {t.file_type}
              </p>
            </div>
          ))}
        </div>
      ) : null}

      {tab === "corporate_memory" ? (
        <div className="space-y-4">
          <div className={`${AipifyShellClasses.surfaceCard} grid gap-3 p-4 sm:grid-cols-2`}>
            <input
              value={memoryTitle}
              onChange={(e) => setMemoryTitle(e.target.value)}
              placeholder={labels.memoryTitle}
              className={AipifyShellClasses.input}
            />
            <button
              type="button"
              disabled={busy || !memoryTitle.trim()}
              onClick={() =>
                void runAction("create_memory_item", {
                  title: memoryTitle.trim(),
                  memory_type: "lessons_learned",
                }).then(() => setMemoryTitle(""))
              }
              className={AipifyShellClasses.primaryButton}
            >
              {labels.createMemory}
            </button>
          </div>
          <div className={`${AipifyShellClasses.surfaceCard} grid gap-3 p-4 sm:grid-cols-2`}>
            <input
              value={contributionTitle}
              onChange={(e) => setContributionTitle(e.target.value)}
              placeholder={labels.contributionTitle}
              className={AipifyShellClasses.input}
            />
            <button
              type="button"
              disabled={busy || !contributionTitle.trim()}
              onClick={() =>
                void runAction("submit_contribution", {
                  title: contributionTitle.trim(),
                  contribution_type: "process_improvement",
                }).then(() => setContributionTitle(""))
              }
              className={AipifyShellClasses.secondaryButton}
            >
              {labels.submitContribution}
            </button>
          </div>
          {pendingContributions.length > 0 ? (
            <section className="space-y-3">
              <h2 className="text-sm font-semibold text-aipify-text">{labels.pendingContributions}</h2>
              {pendingContributions.map((c: ContributionItem) => (
                <div key={c.id} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
                  <p className="font-semibold text-aipify-text">{c.title}</p>
                  <p className="text-aipify-text-secondary">{c.contribution_type.replace(/_/g, " ")}</p>
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void runAction("approve_contribution", { contribution_id: c.id })}
                      className={AipifyShellClasses.primaryButton}
                    >
                      {labels.approveContribution}
                    </button>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void runAction("reject_contribution", { contribution_id: c.id })}
                      className={AipifyShellClasses.secondaryButton}
                    >
                      {labels.rejectContribution}
                    </button>
                  </div>
                </div>
              ))}
            </section>
          ) : null}
          <ItemList
            emptyTitle={labels.noMemory}
            emptyMessage={labels.emptyHint}
            items={memoryItems}
            render={(m: MemoryItem) => (
              <div key={m.id} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
                <p className="text-xs text-aipify-text-muted">{m.memory_number}</p>
                <h3 className="font-semibold text-aipify-text">{m.title}</h3>
                <p className="text-aipify-text-secondary">{m.memory_type.replace(/_/g, " ")}</p>
                <StatusBadge status={m.status} label={labels.status} />
              </div>
            )}
          />
        </div>
      ) : null}

      {tab === "reports" ? (
        <div className={`${AipifyShellClasses.surfaceCard} space-y-3 p-4 text-sm`}>
          <p>
            {labels.knowledgeUsage}: {String(reports.knowledge_usage_month ?? 0)}
          </p>
          <p>
            {labels.documentViews}: {String(reports.document_views_estimate ?? 0)}
          </p>
          <p>
            {labels.missingKnowledge}: {String(reports.missing_knowledge_gaps ?? 0)}
          </p>
          <p>
            {labels.companionSearches}: {String(reports.companion_searches ?? 0)}
          </p>
        </div>
      ) : null}

      {center.audit_recent && center.audit_recent.length > 0 ? (
        <section>
          <h2 className="mb-2 text-sm font-semibold text-aipify-text">{labels.auditLog}</h2>
          <ul className={`${AipifyShellClasses.surfaceCard} divide-y divide-aipify-border text-sm`}>
            {center.audit_recent.map((entry, i) => (
              <li key={`${entry.action}-${i}`} className="px-4 py-2 text-aipify-text-secondary">
                {entry.summary}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

function StatusBadge({ status, label }: { status: string; label: string }) {
  return (
    <span
      className={`mt-2 inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${STATUS_STYLE[status] ?? STATUS_STYLE.draft}`}
    >
      {label}: {status.replace(/_/g, " ")}
    </span>
  );
}

function ArticleCard({ item, labels }: { item: KnowledgeArticleItem; labels: CorporateMemoryLabels }) {
  return (
    <div className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
      <p className="text-xs text-aipify-text-muted">{item.knowledge_id}</p>
      <h3 className="font-semibold text-aipify-text">{item.title}</h3>
      {item.description ? <p className="mt-1 text-aipify-text-secondary line-clamp-2">{item.description}</p> : null}
      <StatusBadge status={item.status} label={labels.status} />
    </div>
  );
}

function DocCard({ item, labels }: { item: CorporateDocumentItem; labels: CorporateMemoryLabels }) {
  return (
    <div className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
      <p className="text-xs text-aipify-text-muted">{item.document_number}</p>
      <h3 className="font-semibold text-aipify-text">{item.title}</h3>
      <p className="text-aipify-text-secondary">
        {item.category} · v{item.version ?? 1}
      </p>
      <StatusBadge status={item.status} label={labels.status} />
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

function SearchResults({ labels, data }: { labels: CorporateMemoryLabels; data: Record<string, unknown> }) {
  const articles = Array.isArray(data.knowledge_articles) ? data.knowledge_articles : [];
  const docs = Array.isArray(data.documents) ? data.documents : [];
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-aipify-text">
        {labels.search}: &ldquo;{String(data.query ?? "")}&rdquo;
      </h2>
      {articles.map((a, i) => (
        <div key={`a-${i}`} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
          <p className="font-semibold text-aipify-text">{String((a as Record<string, unknown>).title ?? "")}</p>
        </div>
      ))}
      {docs.map((d, i) => (
        <div key={`d-${i}`} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
          <p className="text-xs text-aipify-text-muted">Document</p>
          <p className="font-semibold text-aipify-text">{String((d as Record<string, unknown>).title ?? "")}</p>
        </div>
      ))}
    </section>
  );
}
