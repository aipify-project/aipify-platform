"use client";

import { useCallback, useState } from "react";
import {
  AppHubShell,
  type AppHubBreadcrumbItem,
  type AppHubStatus,
} from "@/components/app/hubs/AppHubShell";
import { WebsiteKompisFaqAdminPanel } from "@/components/app/website-kompis/WebsiteKompisFaqAdminPanel";
import { WebsiteKompisKnowledgeCenterPanel } from "@/components/app/website-kompis/WebsiteKompisKnowledgeCenterPanel";
import { applyAuthoritativeFaqCount } from "@/lib/website-kompis-faq/list-window";
import type { WebsiteKompisFaqLabels } from "@/lib/website-kompis-faq/labels";
import type { WebsiteKompisKnowledgeLabels } from "@/lib/website-kompis-knowledge/labels";
import type { WebsiteKompisKnowledgeSummary } from "@/lib/website-kompis-knowledge/load-summary";
import type { FaqKnowledgeCounts } from "@/lib/website-kompis-knowledge/source-inventory";

type WebsiteKompisKnowledgeCenterScreenProps = {
  breadcrumbLabel: string;
  breadcrumb: AppHubBreadcrumbItem[];
  eyebrow: string;
  title: string;
  description: string;
  contextLabel: string | null;
  publishedWord: string;
  unavailableLabel: string;
  knowledgeLabels: WebsiteKompisKnowledgeLabels;
  faqLabels: WebsiteKompisFaqLabels;
  suggestFromFeedbackWarning?: string;
  initialSummary: WebsiteKompisKnowledgeSummary;
};

export function WebsiteKompisKnowledgeCenterScreen({
  breadcrumbLabel,
  breadcrumb,
  eyebrow,
  title,
  description,
  contextLabel,
  publishedWord,
  unavailableLabel,
  knowledgeLabels,
  faqLabels,
  suggestFromFeedbackWarning,
  initialSummary,
}: WebsiteKompisKnowledgeCenterScreenProps) {
  const [summary, setSummary] = useState(initialSummary);
  const onLibraryCounts = useCallback((counts: FaqKnowledgeCounts) => {
    setSummary((current) => ({
      ...current,
      faqLoadOk: true,
      faq: {
        ...counts,
        lastUpdatedAt: counts.lastUpdatedAt ?? current.faq.lastUpdatedAt,
      },
      faqWindow: applyAuthoritativeFaqCount(current.faqWindow, counts.total),
    }));
  }, []);

  const status: AppHubStatus = summary.faqLoadOk
    ? { label: `${summary.faq.published} ${publishedWord}`, tone: "emerald" }
    : { label: unavailableLabel, tone: "slate" };

  return (
    <AppHubShell
      breadcrumbLabel={breadcrumbLabel}
      breadcrumb={breadcrumb}
      eyebrow={eyebrow}
      title={title}
      description={description}
      contextLabel={contextLabel}
      status={status}
    >
      <WebsiteKompisKnowledgeCenterPanel
        labels={knowledgeLabels}
        summary={summary}
        faqPanel={
          <WebsiteKompisFaqAdminPanel
            labels={faqLabels}
            embedded
            suggestFromFeedbackWarning={suggestFromFeedbackWarning}
            onLibraryCounts={onLibraryCounts}
          />
        }
      />
    </AppHubShell>
  );
}
