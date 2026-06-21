import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import PublicBreadcrumbs, { type PublicBreadcrumbItem } from "@/components/marketing/public/PublicBreadcrumbs";
import { KNOWLEDGE_CONTAINER } from "./KnowledgeHero";
import type { KnowledgePageRedesignLabels } from "./types";

type KnowledgeNestedNavProps = {
  nested: KnowledgePageRedesignLabels["nested"];
  breadcrumbs: PublicBreadcrumbItem[];
};

export default function KnowledgeNestedNav({ nested, breadcrumbs }: KnowledgeNestedNavProps) {
  return (
    <div className={`${KNOWLEDGE_CONTAINER} pt-8 sm:pt-10`}>
      <Link
        href="/knowledge"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-aipify-companion lg:hidden"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        {nested.backToKnowledge}
      </Link>

      <PublicBreadcrumbs items={breadcrumbs} />

      <Link
        href="/knowledge"
        className="mt-2 hidden text-sm font-medium text-aipify-text-secondary transition hover:text-aipify-companion lg:inline-flex"
      >
        ← {nested.backToKnowledge}
      </Link>
    </div>
  );
}

export function buildKnowledgeBreadcrumbs(
  nested: KnowledgePageRedesignLabels["nested"],
  segments: PublicBreadcrumbItem[],
): PublicBreadcrumbItem[] {
  return [
    { label: nested.breadcrumbHome, href: "/" },
    { label: nested.breadcrumbKnowledge, href: "/knowledge" },
    ...segments,
  ];
}
