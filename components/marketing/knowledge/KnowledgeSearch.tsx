"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { PublicMarketingClasses } from "@/lib/design/public-marketing-tokens";
import { useKnowledgeHub } from "./KnowledgeHubContext";
import { KNOWLEDGE_CONTAINER } from "./KnowledgeHero";
import type { KnowledgePageRedesignLabels } from "./types";

type KnowledgeSearchProps = {
  labels: KnowledgePageRedesignLabels["search"];
};

export default function KnowledgeSearch({ labels }: KnowledgeSearchProps) {
  const { query, setQuery } = useKnowledgeHub();

  return (
    <section aria-labelledby="knowledge-search-title" className="border-b border-aipify-border bg-aipify-surface">
      <div className={`${KNOWLEDGE_CONTAINER} py-10 sm:py-12`}>
        <h2 id="knowledge-search-title" className="sr-only">
          {labels.ariaLabel}
        </h2>

        <div className="relative mx-auto max-w-2xl">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-aipify-text-muted"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={labels.placeholder}
            aria-label={labels.ariaLabel}
            className={`${PublicMarketingClasses.input} w-full py-3.5 pl-12 pr-4 text-base`}
          />
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-aipify-text-muted">{labels.quickLinksTitle}</p>
          <ul className="mt-3 flex flex-wrap items-center justify-center gap-2">
            {labels.quickLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex rounded-full border border-aipify-border bg-aipify-surface-muted/60 px-4 py-2 text-sm font-medium text-aipify-text-secondary transition hover:border-aipify-companion/40 hover:text-aipify-companion focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aipify-focus"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
