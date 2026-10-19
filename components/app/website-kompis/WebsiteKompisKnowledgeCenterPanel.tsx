"use client";

import { Archive, BookOpen, FileText } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AppVisualClasses } from "@/lib/design/app-visual-system";
import { FOUNDATION_NAV_BINDINGS } from "@/lib/app-portal/foundation-nav/bindings";
import type { WebsiteKompisKnowledgeLabels } from "@/lib/website-kompis-knowledge/labels";
import type { WebsiteKompisKnowledgeSummary } from "@/lib/website-kompis-knowledge/load-summary";

export type KnowledgeCenterSection = "faq" | "pages" | "documents" | "followUp";

type WebsiteKompisKnowledgeCenterPanelProps = {
  labels: WebsiteKompisKnowledgeLabels;
  summary: WebsiteKompisKnowledgeSummary;
  faqPanel: ReactNode;
  contextLabel?: string | null;
};

function formatWhen(value: string | null): string {
  if (!value) return "—";
  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) return "—";
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(parsed));
  } catch {
    return "—";
  }
}

function SectionButton({
  active,
  onClick,
  title,
  meta,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  meta: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex min-h-11 flex-col items-start justify-center rounded-xl border px-3 py-2 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7357e8] ${
        active
          ? "border-[#D3C7FF] bg-[#F3EDFF] text-[#5538D3]"
          : "border-[#E3E6F1] bg-white text-[#20243A]"
      }`}
      aria-current={active ? "true" : undefined}
    >
      <span className="text-base font-semibold text-[var(--app-text)]">{title}</span>
      <span className="mt-1 text-sm text-[var(--app-text-muted)]">{meta}</span>
    </button>
  );
}

export function WebsiteKompisKnowledgeCenterPanel({
  labels,
  summary,
  faqPanel,
  contextLabel,
}: WebsiteKompisKnowledgeCenterPanelProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const raw = searchParams.get("section");
  const section: KnowledgeCenterSection =
    raw === "pages" || raw === "documents" || raw === "followUp" || raw === "faq"
      ? raw
      : "faq";

  function setSection(next: KnowledgeCenterSection) {
    const params = new URLSearchParams(searchParams.toString());
    if (next === "faq") params.delete("section");
    else params.set("section", next);
    // Preserve suggestQuestion flow from job 64 when landing on FAQ
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  const windowNote = summary.faqLoadOk
    ? summary.faqWindow.totalState === "exact_tenant"
      ? labels.counts.windowExact.replace("{total}", String(summary.faqWindow.tenantTotal ?? 0))
      : labels.counts.windowLimited.replace("{minimum}", String(summary.faqWindow.tenantMinimum))
    : labels.counts.unavailable;

  const faqMeta = summary.faqLoadOk
    ? `${summary.faq.published} ${labels.counts.published} · ${summary.faq.draft} ${labels.counts.draft}`
    : labels.counts.unavailable;

  const followUpCount = summary.faq.draft + summary.feedbackNeedsReview;

  const metrics = summary.faqLoadOk
    ? [
        { label: labels.counts.published, value: summary.faq.published, hint: labels.hintPublished, chip: "bg-[#E9F8F0] text-[#146C43]", icon: BookOpen },
        { label: labels.counts.draft, value: summary.faq.draft, hint: labels.hintDraft, chip: "bg-[#F3EDFF] text-[#7055EE]", icon: FileText },
        { label: labels.counts.archived, value: summary.faq.archived, hint: labels.hintArchived, chip: "bg-[#F4F6FB] text-[#5F6788]", icon: Archive },
      ]
    : [];

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-[#E8E4FB] bg-gradient-to-br from-white to-[#F5F1FF] p-6 shadow-[0_12px_32px_rgba(49,38,112,0.055)] sm:p-8">
        <h1 className="text-3xl font-semibold tracking-tight text-[#20243A] sm:text-4xl">{labels.title}</h1>
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-[#657089]">{labels.subtitle}</p>
        {contextLabel ? <p className="mt-3 text-sm text-[#657089]">{contextLabel}</p> : null}
      </section>

      <section className="space-y-3" aria-labelledby="wk-kc-overview">
        <div>
          <h2 id="wk-kc-overview" className="text-lg font-semibold text-[#20243A]">{labels.overviewTitle}</h2>
          <p className="mt-1 text-sm text-[#657089]">{labels.overviewDescription}</p>
        </div>
        {metrics.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {metrics.map((metric) => {
              const Icon = metric.icon;
              return (
              <div key={metric.label} className="rounded-[18px] border border-[#E3E6F1] bg-white p-5 shadow-[0_8px_22px_rgba(38,37,104,0.05)]">
                <span className={`inline-flex size-11 items-center justify-center rounded-2xl ${metric.chip}`} aria-hidden>
                  <Icon className="size-5" strokeWidth={2} />
                </span>
                <p className="mt-4 text-sm font-medium text-[#657089]">{metric.label}</p>
                <p className="mt-1 text-[1.85rem] font-semibold tabular-nums tracking-tight text-[#20243A]">{metric.value}</p>
                <p className="mt-1 text-sm text-[#657089]">{metric.hint}</p>
              </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-[#657089]">{labels.counts.unavailable}</p>
        )}
        <p className="text-sm text-[#657089]">{windowNote}</p>
      </section>

      <div className={`${AppVisualClasses.card} space-y-2 text-sm`}>
        <p className="text-[var(--app-text)]">{labels.neverAutoPublish}</p>
        <p className="text-[var(--app-text-muted)]">{labels.bedriftNotMixed}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <SectionButton
          active={section === "faq"}
          onClick={() => setSection("faq")}
          title={labels.sections.faq}
          meta={faqMeta}
        />
        <SectionButton
          active={section === "pages"}
          onClick={() => setSection("pages")}
          title={labels.sections.pages}
          meta={labels.counts.unavailable}
        />
        <SectionButton
          active={section === "documents"}
          onClick={() => setSection("documents")}
          title={labels.sections.documents}
          meta={labels.counts.unavailable}
        />
        <SectionButton
          active={section === "followUp"}
          onClick={() => setSection("followUp")}
          title={labels.sections.followUp}
          meta={
            summary.faqLoadOk || summary.feedbackPersistenceReady
              ? `${summary.faq.draft} ${labels.counts.draft} · ${summary.feedbackNeedsReview} ${labels.counts.needsReview}`
              : labels.counts.unavailable
          }
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Link
          href={`${FOUNDATION_NAV_BINDINGS.kompisWebFaq}?section=followUp`}
          className="inline-flex rounded-[var(--app-radius-md)] border border-[var(--app-border)] bg-[var(--app-card)] px-3 py-2 text-sm font-medium text-[var(--app-text)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-focus)]"
        >
          {labels.reviewDrafts}
        </Link>
        <Link
          href={`${FOUNDATION_NAV_BINDINGS.kompisWebQa}?vote=not_helpful`}
          className="inline-flex rounded-[var(--app-radius-md)] border border-[var(--app-border)] bg-[var(--app-card)] px-3 py-2 text-sm font-medium text-[var(--app-text)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-focus)]"
        >
          {labels.openFeedback}
        </Link>
        <Link
          href={FOUNDATION_NAV_BINDINGS.kompisWebConnection}
          className="inline-flex rounded-[var(--app-radius-md)] border border-[var(--app-border)] bg-[var(--app-card)] px-3 py-2 text-sm font-medium text-[var(--app-text)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-focus)]"
        >
          {labels.openConnection}
        </Link>
      </div>

      {section === "faq" ? (
        <section className="space-y-3" aria-labelledby="wk-kc-faq">
          <div>
            <h2 id="wk-kc-faq" className="text-lg font-semibold text-[var(--app-text)]">
              {labels.sections.faq}
            </h2>
            <p className="mt-1 text-sm text-[var(--app-text-muted)]">{labels.sectionHints.faq}</p>
            {summary.faqLoadOk ? (
              <>
                <p className="mt-2 text-sm text-[var(--app-text-muted)]">
                  {labels.counts.published}: {summary.faq.published} · {labels.counts.draft}:{" "}
                  {summary.faq.draft} · {labels.counts.archived}: {summary.faq.archived} ·{" "}
                  {labels.counts.lastUpdated}: {formatWhen(summary.faq.lastUpdatedAt)}
                </p>
                <p className="mt-1 text-sm text-[var(--app-text-muted)]">{windowNote}</p>
              </>
            ) : null}
          </div>
          {faqPanel}
        </section>
      ) : null}

      {section === "pages" ? (
        <section className={`${AppVisualClasses.card} space-y-2`} aria-labelledby="wk-kc-pages">
          <h2 id="wk-kc-pages" className="text-lg font-semibold text-[var(--app-text)]">
            {labels.pagesUnavailableTitle}
          </h2>
          <p className="text-sm text-[var(--app-text-muted)]">{labels.sectionHints.pages}</p>
          <p className="text-sm text-[var(--app-text-muted)]">{labels.pagesUnavailableBody}</p>
          <Link
            href={FOUNDATION_NAV_BINDINGS.kompisWebConnection}
            className="inline-flex text-sm font-medium text-[var(--app-primary-blue)] hover:text-[var(--app-primary)]"
          >
            {labels.openConnection}
          </Link>
        </section>
      ) : null}

      {section === "documents" ? (
        <section className={`${AppVisualClasses.card} space-y-2`} aria-labelledby="wk-kc-docs">
          <h2 id="wk-kc-docs" className="text-lg font-semibold text-[var(--app-text)]">
            {labels.documentsUnavailableTitle}
          </h2>
          <p className="text-sm text-[var(--app-text-muted)]">{labels.sectionHints.documents}</p>
          <p className="text-sm text-[var(--app-text-muted)]">{labels.documentsUnavailableBody}</p>
        </section>
      ) : null}

      {section === "followUp" ? (
        <section className="space-y-4" aria-labelledby="wk-kc-followup">
          <div>
            <h2 id="wk-kc-followup" className="text-lg font-semibold text-[var(--app-text)]">
              {labels.sections.followUp}
            </h2>
            <p className="mt-1 text-sm text-[var(--app-text-muted)]">{labels.sectionHints.followUp}</p>
          </div>
          {followUpCount === 0 ? (
            <div className={AppVisualClasses.card}>
              <p className="font-medium text-[var(--app-text)]">{labels.followUpEmptyTitle}</p>
              <p className="mt-1 text-sm text-[var(--app-text-muted)]">{labels.followUpEmptyBody}</p>
            </div>
          ) : (
            <ul className="grid gap-3 md:grid-cols-2">
              {summary.faq.draft > 0 ? (
                <li className={AppVisualClasses.card}>
                  <p className="text-sm font-medium text-[var(--app-text)]">{labels.followUpDrafts}</p>
                  <p className="mt-1 text-2xl font-semibold text-[var(--app-pending)]">
                    {summary.faq.draft}
                  </p>
                  <button
                    type="button"
                    onClick={() => setSection("faq")}
                    className="mt-3 text-sm font-medium text-[var(--app-primary-blue)] hover:text-[var(--app-primary)]"
                  >
                    {labels.openFaqEditor}
                  </button>
                </li>
              ) : null}
              {summary.feedbackNeedsReview > 0 ? (
                <li className={AppVisualClasses.card}>
                  <p className="text-sm font-medium text-[var(--app-text)]">{labels.followUpFeedback}</p>
                  <p className="mt-1 text-2xl font-semibold text-[var(--app-pending)]">
                    {summary.feedbackNeedsReview}
                  </p>
                  <Link
                    href={`${FOUNDATION_NAV_BINDINGS.kompisWebQa}?vote=not_helpful`}
                    className="mt-3 inline-flex text-sm font-medium text-[var(--app-primary-blue)] hover:text-[var(--app-primary)]"
                  >
                    {labels.openFeedback}
                  </Link>
                </li>
              ) : null}
            </ul>
          )}
        </section>
      ) : null}
    </div>
  );
}
