"use client";

import { useState } from "react";
import { APP_PORTAL_FAQ_ARTICLES } from "@/lib/app-portal/nav-config";

type AppPortalKnowledgePanelProps = {
  title: string;
  subtitle: string;
  faqLabels: Record<string, string>;
  answerLabels: Record<string, string>;
};

export function AppPortalKnowledgePanel({
  title,
  subtitle,
  faqLabels,
  answerLabels,
}: AppPortalKnowledgePanelProps) {
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{title}</h1>
        <p className="mt-2 text-slate-600">{subtitle}</p>
      </div>
      <div className="space-y-3">
        {APP_PORTAL_FAQ_ARTICLES.map((article) => {
          const question = faqLabels[article.titleKey] ?? article.slug;
          const answer = answerLabels[`customerApp.portalStructure.faqAnswers.${article.slug}`] ?? "";

          const isOpen = openSlug === article.slug;

          return (
            <article key={article.slug} className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <button
                type="button"
                onClick={() => setOpenSlug(isOpen ? null : article.slug)}
                className="flex w-full items-center justify-between px-5 py-4 text-left"
              >
                <span className="font-medium text-slate-900">{question}</span>
                <span className="text-slate-400">{isOpen ? "−" : "+"}</span>
              </button>
              {isOpen && answer ? (
                <div className="border-t border-slate-100 px-5 py-4 text-sm text-slate-600">{answer}</div>
              ) : null}
            </article>
          );
        })}
      </div>
    </div>
  );
}
