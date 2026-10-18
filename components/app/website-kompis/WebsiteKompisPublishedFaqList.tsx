"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FOUNDATION_NAV_BINDINGS } from "@/lib/app-portal/foundation-nav/bindings";
import type { WebsiteKompisFeedbackLabels } from "@/lib/website-kompis-feedback/labels";

type PublishedItem = {
  id: string;
  title: string;
  question: string | null;
  answer: string;
  locale: string;
  domain: string | null;
  status: string;
};

export function WebsiteKompisPublishedFaqList({
  labels,
  query,
}: {
  labels: WebsiteKompisFeedbackLabels;
  query: string;
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [items, setItems] = useState<PublishedItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);
    const params = new URLSearchParams();
    params.set("status", "published");
    if (query.trim()) params.set("query", query.trim());
    void (async () => {
      try {
        const response = await fetch(`/api/website-kompis/faq?${params.toString()}`);
        if (!response.ok) {
          if (!cancelled) setError(true);
          return;
        }
        const payload = (await response.json()) as { items?: PublishedItem[] };
        if (!cancelled) {
          setItems(
            (payload.items ?? []).filter((item) => item.status === "published" && item.id && item.title),
          );
        }
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [query]);

  if (loading) {
    return (
      <div className="grid gap-3 md:grid-cols-2" aria-busy="true">
        <span className="sr-only">{labels.loading}</span>
        {Array.from({ length: 2 }, (_, index) => (
          <div
            key={index}
            className="h-28 rounded-[var(--app-radius-lg)] border border-[var(--app-border)] bg-[var(--app-soft-surface)] motion-safe:animate-pulse motion-reduce:animate-none"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-sm text-[var(--app-text)]">{labels.errorGeneric}</p>;
  }

  if (items.length === 0) {
    return <p className="text-sm leading-relaxed text-[var(--app-text-muted)]">{labels.quality.publishedEmpty}</p>;
  }

  const names = labels.quality.languages as Record<string, string>;

  return (
    <div className="space-y-3">
      {items.length >= 100 ? (
        <p className="text-sm text-[var(--app-text-muted)]">{labels.quality.publishedCap}</p>
      ) : null}
      <ul className="grid gap-3 md:grid-cols-2">
        {items.map((item) => (
          <li
            key={item.id}
            className="rounded-[var(--app-radius-lg)] border border-[var(--app-border)] bg-[var(--app-card)] p-5 shadow-[var(--app-shadow-card)]"
          >
            <p className="text-xs font-medium text-[var(--app-positive)]">{labels.quality.tabs.published}</p>
            <h3 className="mt-2 text-base font-semibold text-[var(--app-text)]">{item.title}</h3>
            <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-[var(--app-text-muted)]">
              {item.answer}
            </p>
            <p className="mt-3 text-xs text-[var(--app-text-muted)]">
              {[names[item.locale] ?? item.locale, item.domain].filter(Boolean).join(" · ")}
            </p>
          </li>
        ))}
      </ul>
      <Link
        href={FOUNDATION_NAV_BINDINGS.kompisWebFaq}
        className="inline-flex min-h-11 items-center text-sm font-medium text-[var(--app-primary)] underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-focus)]"
      >
        {labels.actions.openFaq}
      </Link>
    </div>
  );
}
