"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import {
  categoryLabel,
  formatLabel,
  parsePartnerMaterialsCategories,
  parsePartnerMaterialsFavorites,
  parsePartnerMaterialsOverview,
  parsePartnerMaterialsRecommended,
  type PartnerMaterial,
  type PartnerMaterialsOverview,
} from "@/lib/partner-materials";

type Props = {
  labels: Record<string, string>;
};

function MetricCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="mt-1 text-xl font-semibold text-slate-900">{value}</dd>
    </div>
  );
}

function MaterialCard({
  material,
  labels,
  canFavorite,
  onFavorite,
  onDownload,
}: {
  material: PartnerMaterial;
  labels: Record<string, string>;
  canFavorite: boolean;
  onFavorite: (id: string) => void;
  onDownload: (id: string) => void;
}) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-slate-900">{material.title}</h3>
          <p className="mt-1 text-sm text-slate-600 line-clamp-2">{material.description}</p>
        </div>
        <span className="shrink-0 rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-800">
          {formatLabel(labels, material.format_type)}
        </span>
      </div>
      <dl className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-500">
        <div>
          <dt className="inline">{labels.filterCategory}: </dt>
          <dd className="inline text-slate-700">{categoryLabel(labels, material.category)}</dd>
        </div>
        <div>
          <dt className="inline">{labels.filterLanguage}: </dt>
          <dd className="inline uppercase text-slate-700">{material.language_code}</dd>
        </div>
        <div>
          <dt className="inline">{labels.version}: </dt>
          <dd className="inline text-slate-700">{material.version_label}</dd>
        </div>
        <div>
          <dt className="inline">{labels.downloads}: </dt>
          <dd className="inline text-slate-700">{material.download_count}</dd>
        </div>
      </dl>
      {material.usage_recommendations ? (
        <p className="mt-2 text-xs text-slate-500">
          <span className="font-medium text-slate-700">{labels.usageRecommendations}: </span>
          {material.usage_recommendations}
        </p>
      ) : null}
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onDownload(material.id)}
          className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800"
        >
          {labels.download}
        </button>
        {canFavorite ? (
          <button
            type="button"
            onClick={() => onFavorite(material.id)}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-800 hover:bg-slate-50"
          >
            {material.is_favorite ? labels.unfavorite : labels.favorite}
          </button>
        ) : null}
        {material.customizable ? (
          <span className="rounded-lg bg-emerald-50 px-2 py-1 text-xs text-emerald-800">
            {labels.customizable}
          </span>
        ) : null}
      </div>
    </article>
  );
}

function MaterialSection({
  title,
  materials,
  labels,
  canFavorite,
  onFavorite,
  onDownload,
}: {
  title: string;
  materials: PartnerMaterial[];
  labels: Record<string, string>;
  canFavorite: boolean;
  onFavorite: (id: string) => void;
  onDownload: (id: string) => void;
}) {
  if (materials.length === 0) return null;
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {materials.map((m) => (
          <MaterialCard
            key={m.id}
            material={m}
            labels={labels}
            canFavorite={canFavorite}
            onFavorite={onFavorite}
            onDownload={onDownload}
          />
        ))}
      </div>
    </section>
  );
}

export function PartnerMaterialsPanel({ labels }: Props) {
  const [overview, setOverview] = useState<PartnerMaterialsOverview | null>(null);
  const [recommended, setRecommended] = useState<PartnerMaterial[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [categories, setCategories] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [denied, setDenied] = useState(false);
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [language, setLanguage] = useState("");
  const [format, setFormat] = useState("");

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (category) params.set("category", category);
    if (language) params.set("language", language);
    if (format) params.set("format", format);
    return params.toString();
  }, [category, format, language, search]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    setDenied(false);
    try {
      const [overviewRes, recRes, catRes, favRes] = await Promise.all([
        fetch(`/api/partner/materials${queryString ? `?${queryString}` : ""}`),
        fetch("/api/partner/materials/recommended"),
        fetch("/api/partner/materials/categories"),
        fetch("/api/partner/materials/favorites"),
      ]);

      const overviewJson = overviewRes.ok ? await overviewRes.json() : null;
      if (!overviewJson?.has_access) {
        setDenied(Boolean(overviewJson?.access_denied ?? !overviewJson?.has_access));
        setLoading(false);
        return;
      }
      setOverview(parsePartnerMaterialsOverview(overviewJson));

      if (recRes.ok) {
        const rec = parsePartnerMaterialsRecommended(await recRes.json());
        setRecommended(rec?.recommended ?? []);
      }
      if (catRes.ok) {
        const cats = parsePartnerMaterialsCategories(await catRes.json());
        setCategories(cats?.categories.map((c) => c.category) ?? []);
        setLanguages(cats?.languages ?? []);
      }
      if (favRes.ok) {
        const fav = parsePartnerMaterialsFavorites(await favRes.json());
        setFavoriteIds(new Set(fav?.favorites.map((f) => f.id) ?? []));
      }
    } catch {
      setError(true);
    }
    setLoading(false);
  }, [queryString]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleDownload = async (materialId: string) => {
    setBusy(true);
    await fetch("/api/partner/materials/download", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ material_id: materialId, action_type: "download" }),
    });
    await load();
    setBusy(false);
  };

  const handleFavorite = async (materialId: string) => {
    if (!overview?.can_favorite) return;
    setBusy(true);
    const res = await fetch("/api/partner/materials/favorite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ material_id: materialId }),
    });
    if (res.ok) {
      const fav = parsePartnerMaterialsFavorites(await res.json());
      setFavoriteIds(new Set(fav?.favorites.map((f) => f.id) ?? []));
      await load();
    }
    setBusy(false);
  };

  const materialsWithFavorites = useMemo(() => {
    const mark = (list: PartnerMaterial[]) =>
      list.map((m) => ({ ...m, is_favorite: favoriteIds.has(m.id) || m.is_favorite }));
    if (!overview) return [];
    return mark(overview.materials);
  }, [favoriteIds, overview]);

  if (loading && !overview) {
    return (
      <div className="space-y-3">
        <AipifyLoader centered />
        <p className="text-center text-sm text-slate-600">{labels.loading}</p>
      </div>
    );
  }

  if (denied) {
    return <PlatformEmptyState title={labels.accessDenied} message={labels.subtitle} />;
  }

  if (error) {
    return (
      <PlatformEmptyState
        title={labels.errorTitle}
        message={labels.errorMessage}
        primaryAction={{ label: labels.retry, onClick: () => void load() }}
      />
    );
  }

  const dash = overview?.dashboard;
  const canFavorite = overview?.can_favorite ?? false;
  const centers = overview?.centers;

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-900">{labels.title}</h1>
        <p className="max-w-3xl text-sm text-slate-600">{labels.subtitle}</p>
        {overview?.positioning ? (
          <p className="max-w-3xl text-sm text-slate-500">{overview.positioning}</p>
        ) : null}
      </header>

      {dash ? (
        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <MetricCard label={labels.availableMaterials} value={dash.available_materials} />
          <MetricCard label={labels.readinessScore} value={`${dash.readiness_score}%`} />
          <MetricCard
            label={labels.languageCoverage}
            value={dash.language_coverage.join(", ").toUpperCase() || "—"}
          />
          <MetricCard label={labels.recentlyUpdated} value={dash.recently_updated.length} />
          <MetricCard label={labels.mostDownloaded} value={dash.most_downloaded.length} />
        </section>
      ) : null}

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap gap-3">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={labels.searchPlaceholder}
            className="min-w-[200px] flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
          >
            <option value="">{labels.filterAll}</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {categoryLabel(labels, c)}
              </option>
            ))}
          </select>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm uppercase"
          >
            <option value="">{labels.filterLanguage}</option>
            {languages.map((l) => (
              <option key={l} value={l}>
                {l.toUpperCase()}
              </option>
            ))}
          </select>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
          >
            <option value="">{labels.filterFormat}</option>
            {["pdf", "pptx", "docx", "xlsx", "video", "image", "canva", "adobe"].map((f) => (
              <option key={f} value={f}>
                {formatLabel(labels, f)}
              </option>
            ))}
          </select>
        </div>
      </section>

      {recommended.length > 0 ? (
        <MaterialSection
          title={labels.recommendedMaterials}
          materials={recommended.map((m) => ({
            ...m,
            is_favorite: favoriteIds.has(m.id) || m.is_favorite,
          }))}
          labels={labels}
          canFavorite={canFavorite}
          onFavorite={(id) => void handleFavorite(id)}
          onDownload={(id) => void handleDownload(id)}
        />
      ) : null}

      {materialsWithFavorites.length === 0 ? (
        <PlatformEmptyState
          title={overview?.empty_state?.title ?? labels.emptyTitle}
          message={overview?.empty_state?.message ?? labels.emptyMessage}
          primaryAction={{ label: labels.browseMaterials, onClick: () => void load() }}
        />
      ) : (
        <MaterialSection
          title={labels.allMaterials}
          materials={materialsWithFavorites}
          labels={labels}
          canFavorite={canFavorite}
          onFavorite={(id) => void handleFavorite(id)}
          onDownload={(id) => void handleDownload(id)}
        />
      )}

      {centers ? (
        <>
          <MaterialSection
            title={labels.discoveryTitle}
            materials={centers.discovery}
            labels={labels}
            canFavorite={canFavorite}
            onFavorite={(id) => void handleFavorite(id)}
            onDownload={(id) => void handleDownload(id)}
          />
          <MaterialSection
            title={labels.objectionsTitle}
            materials={centers.objections}
            labels={labels}
            canFavorite={canFavorite}
            onFavorite={(id) => void handleFavorite(id)}
            onDownload={(id) => void handleDownload(id)}
          />
          <MaterialSection
            title={labels.emailTitle}
            materials={centers.email_templates}
            labels={labels}
            canFavorite={canFavorite}
            onFavorite={(id) => void handleFavorite(id)}
            onDownload={(id) => void handleDownload(id)}
          />
          <MaterialSection
            title={labels.socialTitle}
            materials={centers.social}
            labels={labels}
            canFavorite={canFavorite}
            onFavorite={(id) => void handleFavorite(id)}
            onDownload={(id) => void handleDownload(id)}
          />
          <MaterialSection
            title={labels.campaignPacksTitle}
            materials={centers.campaign_packs}
            labels={labels}
            canFavorite={canFavorite}
            onFavorite={(id) => void handleFavorite(id)}
            onDownload={(id) => void handleDownload(id)}
          />
        </>
      ) : null}

      <section className="rounded-xl border border-slate-200 bg-slate-50 p-6">
        <h2 className="text-lg font-semibold text-slate-900">{labels.faqTitle}</h2>
        <dl className="mt-4 space-y-4 text-sm">
          <div>
            <dt className="font-medium text-slate-900">{labels.faqWhatIs}</dt>
            <dd className="mt-1 text-slate-600">{labels.faqWhatIsAnswer}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-900">{labels.faqCustomize}</dt>
            <dd className="mt-1 text-slate-600">{labels.faqCustomizeAnswer}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-900">{labels.faqUpdates}</dt>
            <dd className="mt-1 text-slate-600">{labels.faqUpdatesAnswer}</dd>
          </div>
        </dl>
      </section>

      {busy ? <p className="sr-only">Processing</p> : null}
    </div>
  );
}
