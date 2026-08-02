"use client";

import { AipifyLoader } from "@/components/ui/aipify-loader";
import { AipifyStatusBadge } from "@/components/ui/aipify-status-badge";
import type { SoftwareCatalogLabels } from "@/lib/app-portal/software-catalog/labels";
import type {
  SoftwareCatalogItem,
  SoftwareCatalogStatus,
  SoftwareCatalogViewModel,
} from "@/lib/app-portal/software-catalog/types";
import { AppPremiumShell } from "@/lib/design/app-premium-shell";
import type { AipifyStatusKind } from "@/lib/design/status-system";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

type FilterId = "all" | "package" | "module" | "business_pack";

function statusKind(status: SoftwareCatalogStatus): AipifyStatusKind {
  switch (status) {
    case "active":
    case "included":
      return "verified";
    case "available":
      return "information";
    case "pending_approval":
      return "waiting";
    case "unavailable":
      return "restricted";
    default:
      return "waiting";
  }
}

function ProductCard({
  item,
  labels,
}: {
  item: SoftwareCatalogItem;
  labels: SoftwareCatalogLabels;
}) {
  return (
    <article className={`${AppPremiumShell.elevatedCard} flex h-full flex-col p-5`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className={AppPremiumShell.eyebrow}>{labels.sourceTypes[item.sourceType]}</p>
          <h3 className="mt-1 text-lg font-semibold text-aipify-text">{item.name}</h3>
        </div>
        <AipifyStatusBadge kind={statusKind(item.status)} label={labels.statuses[item.status]} />
      </div>
      {item.valueProposition ? (
        <p className="mt-3 text-sm leading-relaxed text-aipify-text-secondary">{item.valueProposition}</p>
      ) : item.description ? (
        <p className="mt-3 text-sm leading-relaxed text-aipify-text-secondary">{item.description}</p>
      ) : null}
      {item.features.length > 0 ? (
        <ul className="mt-4 space-y-1.5 text-sm text-aipify-text">
          {item.features.slice(0, 5).map((feature) => (
            <li key={feature} className="flex gap-2">
              <span aria-hidden className="text-aipify-companion">
                •
              </span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      ) : null}
      {item.licenseModel ? (
        <p className="mt-4 text-xs text-aipify-text-muted">{item.licenseModel}</p>
      ) : null}
      <div className="mt-auto flex flex-wrap gap-3 pt-5">
        {item.detailsRoute ? (
          <Link
            href={item.detailsRoute}
            className={`inline-flex items-center rounded-lg bg-aipify-companion px-3.5 py-2 text-sm font-medium text-white hover:opacity-95 ${AppPremiumShell.focusRing}`}
          >
            {labels.seeDetails}
          </Link>
        ) : null}
        {item.status === "available" || item.status === "unavailable" ? (
          <span className="inline-flex items-center rounded-lg border border-aipify-border px-3.5 py-2 text-sm text-aipify-text-secondary">
            {item.status === "available" ? labels.contactSales : labels.statuses.unavailable}
          </span>
        ) : null}
      </div>
    </article>
  );
}

export function SoftwareCatalogPanel({ labels }: { labels: SoftwareCatalogLabels }) {
  const [catalog, setCatalog] = useState<SoftwareCatalogViewModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filter, setFilter] = useState<FilterId>("all");

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await fetch("/api/app-portal/software-catalog", { cache: "no-store" });
      if (!response.ok) {
        setError(true);
        setCatalog(null);
        return;
      }
      const data = (await response.json()) as SoftwareCatalogViewModel;
      setCatalog(data);
    } catch {
      setError(true);
      setCatalog(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filterOptions = useMemo(() => {
    if (!catalog) return [] as Array<[FilterId, string]>;
    const options: Array<[FilterId, string]> = [["all", labels.filterAll]];
    if (catalog.sections.packages) options.push(["package", labels.packages]);
    if (catalog.sections.modules) options.push(["module", labels.modules]);
    if (catalog.sections.businessPacks) options.push(["business_pack", labels.businessPacks]);
    return options;
  }, [catalog, labels]);

  useEffect(() => {
    if (!catalog) return;
    if (filter === "business_pack" && !catalog.sections.businessPacks) {
      setFilter("all");
    }
    if (filter === "module" && !catalog.sections.modules) {
      setFilter("all");
    }
    if (filter === "package" && !catalog.sections.packages) {
      setFilter("all");
    }
  }, [catalog, filter]);

  const filteredItems = useMemo(() => {
    const items = catalog?.items ?? [];
    if (filter === "all") return items;
    return items.filter((item) => item.sourceType === filter);
  }, [catalog?.items, filter]);

  if (loading) {
    return (
      <div className={AppPremiumShell.page}>
        <AipifyLoader centered fullPage />
      </div>
    );
  }

  if (error || !catalog?.found) {
    return (
      <div className={AppPremiumShell.page}>
        <header className="mb-8 max-w-3xl">
          <h1 className={AppPremiumShell.pageTitle}>{labels.title}</h1>
          <p className={AppPremiumShell.pageDescription}>{labels.subtitle}</p>
        </header>
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-900/40 dark:bg-red-950/30">
          <p className="text-sm text-red-800 dark:text-red-200">{labels.error}</p>
          <button
            type="button"
            onClick={() => void load()}
            className={`mt-4 rounded-lg bg-aipify-companion px-4 py-2 text-sm font-medium text-white ${AppPremiumShell.focusRing}`}
          >
            {labels.retry}
          </button>
        </div>
      </div>
    );
  }

  const packages = filteredItems.filter((item) => item.sourceType === "package");
  const modules = filteredItems.filter((item) => item.sourceType === "module");
  const packs = filteredItems.filter((item) => item.sourceType === "business_pack");

  return (
    <div className={`${AppPremiumShell.page} ${AppPremiumShell.sectionGap}`}>
      <header className="max-w-3xl">
        <h1 className={AppPremiumShell.pageTitle}>{labels.title}</h1>
        <p className={AppPremiumShell.pageDescription}>{labels.subtitle}</p>
      </header>

      {catalog.currentPackage ? (
        <section className={`${AppPremiumShell.elevatedCard} p-6`}>
          <p className={AppPremiumShell.eyebrow}>{labels.currentPackage}</p>
          <h2 className="mt-1 text-2xl font-semibold text-aipify-text">
            {catalog.currentPackage.packageName}
          </h2>
          {catalog.currentPackage.description ? (
            <p className="mt-2 max-w-3xl text-sm text-aipify-text-secondary">
              {catalog.currentPackage.description}
            </p>
          ) : null}
        </section>
      ) : null}

      {catalog.partial ? (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-100">
          {labels.partialNotice}
        </p>
      ) : null}

      {filterOptions.length > 1 ? (
        <div className="flex flex-wrap gap-2">
          {filterOptions.map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setFilter(id)}
              className={
                filter === id
                  ? `rounded-full bg-aipify-companion px-4 py-1.5 text-sm font-medium text-white ${AppPremiumShell.focusRing}`
                  : `rounded-full border border-aipify-border px-4 py-1.5 text-sm text-aipify-text ${AppPremiumShell.focusRing}`
              }
            >
              {label}
            </button>
          ))}
        </div>
      ) : null}

      {filteredItems.length === 0 ? (
        <p className="text-sm text-aipify-text-secondary">
          {filter === "business_pack" ? labels.emptyBusinessPacks : labels.empty}
        </p>
      ) : (
        <div className="space-y-10">
          {packages.length > 0 ? (
            <section>
              <h2 className={AppPremiumShell.sectionTitle}>{labels.packages}</h2>
              <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {packages.map((item) => (
                  <ProductCard key={item.id} item={item} labels={labels} />
                ))}
              </div>
            </section>
          ) : null}
          {modules.length > 0 ? (
            <section>
              <h2 className={AppPremiumShell.sectionTitle}>{labels.modules}</h2>
              <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {modules.map((item) => (
                  <ProductCard key={item.id} item={item} labels={labels} />
                ))}
              </div>
            </section>
          ) : null}
          {packs.length > 0 ? (
            <section>
              <h2 className={AppPremiumShell.sectionTitle}>{labels.businessPacks}</h2>
              <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {packs.map((item) => (
                  <ProductCard key={item.id} item={item} labels={labels} />
                ))}
              </div>
            </section>
          ) : null}
        </div>
      )}
    </div>
  );
}
