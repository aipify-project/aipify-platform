"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseKnowledgeCenterEngineDashboard,
  type KnowledgeCenterEngineDashboard,
} from "@/lib/aipify/knowledge-center-engine";

type KnowledgeCenterEngineDashboardPanelProps = {
  labels: Record<string, string>;
};

function badgeClass(value?: string) {
  switch (value) {
    case "published":
      return "bg-emerald-100 text-emerald-800";
    case "review":
      return "bg-amber-100 text-amber-800";
    case "draft":
      return "bg-slate-100 text-slate-700";
    case "archived":
      return "bg-rose-100 text-rose-800";
    default:
      return "bg-stone-100 text-stone-700";
  }
}

function ArticleList({
  items,
  emptyLabel,
  showStatus = false,
}: {
  items: KnowledgeCenterEngineDashboard["published_list"];
  emptyLabel: string;
  showStatus?: boolean;
}) {
  if (items.length === 0) return <p className="text-xs text-gray-500">{emptyLabel}</p>;
  return (
    <ul className="space-y-2">
      {items.map((a) => (
        <li key={a.id} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-medium text-gray-900">{a.title}</span>
            {showStatus && a.status ? (
              <span className={`rounded-full px-2 py-0.5 text-xs capitalize ${badgeClass(a.status)}`}>
                {a.status}
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-xs text-gray-500">
            {a.category_slug?.replace(/_/g, " ")}
            {a.view_count != null ? ` · ${a.view_count} views` : ""}
            {a.version != null ? ` · v${a.version}` : ""}
          </p>
        </li>
      ))}
    </ul>
  );
}

export function KnowledgeCenterEngineDashboardPanel({ labels }: KnowledgeCenterEngineDashboardPanelProps) {
  const [dashboard, setDashboard] = useState<KnowledgeCenterEngineDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Record<string, unknown>[]>([]);
  const [searching, setSearching] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/knowledge-center-engine/dashboard");
    if (res.ok) setDashboard(parseKnowledgeCenterEngineDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearching(true);
    const res = await fetch(`/api/knowledge/search?query=${encodeURIComponent(searchQuery)}&status=published`);
    if (res.ok) {
      const data = (await res.json()) as { results?: Record<string, unknown>[] };
      setSearchResults(data.results ?? []);
    }
    setSearching(false);
  }

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (!dashboard?.has_organization) return null;

  const successCriteria = Array.isArray(dashboard.success_criteria) ? dashboard.success_criteria : [];
  const knowledgeTypes = Array.isArray(dashboard.knowledge_types) ? dashboard.knowledge_types : [];
  const visibilityLevels = Array.isArray(dashboard.visibility_levels) ? dashboard.visibility_levels : [];
  const kcObjectives = Array.isArray(dashboard.kc_objectives) ? dashboard.kc_objectives : [];
  const blueprintLinks = Array.isArray(dashboard.blueprint_integration_links)
    ? dashboard.blueprint_integration_links
    : [];
  const dogfooding =
    typeof dashboard.dogfooding === "object" && dashboard.dogfooding
      ? (dashboard.dogfooding as Record<string, unknown>)
      : null;
  const evolution =
    typeof dashboard.knowledge_evolution === "object" && dashboard.knowledge_evolution
      ? dashboard.knowledge_evolution
      : null;
  const phase14 =
    typeof dashboard.implementation_blueprint_phase14 === "object" && dashboard.implementation_blueprint_phase14
      ? dashboard.implementation_blueprint_phase14
      : null;
  const healthIndicators =
    typeof dashboard.health_indicators === "object" && dashboard.health_indicators
      ? dashboard.health_indicators
      : null;
  const healthMeta =
    healthIndicators && typeof healthIndicators.metadata === "object" && healthIndicators.metadata
      ? (healthIndicators.metadata as Record<string, unknown>)
      : null;
  const recommendations = Array.isArray(dashboard.proactive_recommendations)
    ? dashboard.proactive_recommendations
    : [];
  const creationOpportunities = Array.isArray(dashboard.creation_opportunities)
    ? dashboard.creation_opportunities
    : [];
  const evolutionObjectives = Array.isArray(dashboard.evolution_objectives)
    ? dashboard.evolution_objectives
    : [];
  const evolutionSuccessCriteria = Array.isArray(dashboard.evolution_success_criteria)
    ? dashboard.evolution_success_criteria
    : [];
  const visionPhrases = Array.isArray(dashboard.vision_phrases) ? dashboard.vision_phrases : [];
  const integrationLinks = Array.isArray(dashboard.integration_links) ? dashboard.integration_links : [];
  const selfLoveConnection =
    typeof dashboard.self_love_connection === "object" && dashboard.self_love_connection
      ? dashboard.self_love_connection
      : null;
  const orgMemoryConnection =
    typeof dashboard.organizational_memory_connection === "object" &&
    dashboard.organizational_memory_connection
      ? dashboard.organizational_memory_connection
      : null;
  const trustConnection =
    typeof dashboard.trust_connection === "object" && dashboard.trust_connection
      ? dashboard.trust_connection
      : null;

  function priorityClass(priority?: string) {
    switch (priority) {
      case "high":
        return "border-rose-200 bg-rose-50/50";
      case "medium":
        return "border-amber-200 bg-amber-50/50";
      default:
        return "border-gray-100 bg-gray-50";
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Link href="/app/aipify-core" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.aipifyCore}
        </Link>
        <Link href="/app/organization-workspace-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.organizationWorkspace}
        </Link>
        <Link href="/app/identity-access" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.identityPermissions}
        </Link>
        <Link href="/app/knowledge-center" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.kcSelfKnowledge}
        </Link>
      </div>

      <section className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-6">
        <h2 className="text-sm font-semibold text-indigo-900">{labels.knowledgeEngine}</h2>
        {dashboard.mission && <p className="mt-2 text-sm font-medium text-indigo-900">{dashboard.mission}</p>}
        <p className="mt-2 text-sm text-indigo-900">{dashboard.philosophy}</p>
        {dashboard.abos_principle && (
          <p className="mt-2 text-xs text-indigo-700">{dashboard.abos_principle}</p>
        )}
        <p className="mt-1 text-xs text-indigo-700">{dashboard.safety_note}</p>
        <p className="mt-2 text-xs text-indigo-600">{labels.distinctionNote}</p>
      </section>

      {successCriteria.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.successCriteria}</h3>
          <ul className="mt-2 space-y-2 text-sm">
            {successCriteria.map((item) => {
              const label = typeof item.label === "string" ? item.label : String(item.key ?? "");
              const met = Boolean(item.met);
              const note = typeof item.note === "string" ? item.note : null;
              return (
                <li key={label} className="flex flex-col gap-0.5">
                  <span className={met ? "text-green-800" : "text-gray-700"}>
                    {met ? "✓" : "○"} {label}
                  </span>
                  {note && <span className="text-xs text-gray-500">{note}</span>}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {kcObjectives.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.kcObjectives}</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-gray-700">
            {kcObjectives.map((obj) => (
              <li key={obj}>{obj}</li>
            ))}
          </ul>
        </section>
      )}

      {knowledgeTypes.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.knowledgeTypes}</h3>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {knowledgeTypes.map((type) => {
              const key = typeof type.key === "string" ? type.key : String(type.label ?? "");
              const label = typeof type.label === "string" ? type.label : key;
              const description = typeof type.description === "string" ? type.description : null;
              return (
                <div key={key} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-xs">
                  <p className="font-medium text-gray-900">{label}</p>
                  {description && <p className="mt-1 text-gray-600">{description}</p>}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {visibilityLevels.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.visibilityLevels}</h3>
          <ul className="mt-2 space-y-2 text-xs text-gray-700">
            {visibilityLevels.map((level) => {
              const blueprint = typeof level.blueprint === "string" ? level.blueprint : "";
              const engine = typeof level.engine === "string" ? level.engine : "";
              const description = typeof level.description === "string" ? level.description : "";
              return (
                <li key={blueprint} className="rounded border border-gray-100 bg-gray-50 px-3 py-2">
                  <span className="font-medium capitalize">{blueprint}</span>
                  {engine ? <span className="text-gray-500"> → {engine}</span> : null}
                  {description ? <p className="mt-0.5 text-gray-600">{description}</p> : null}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {evolution && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.knowledgeEvolution}</h3>
          <p className="mt-1 text-xs text-gray-500">{labels.knowledgeEvolutionNote}</p>
          <ul className="mt-2 space-y-1 text-xs text-gray-700">
            {(
              [
                ["gap_detection_enabled", labels.gapDetection],
                ["evolution_tracking_enabled", labels.evolutionTracking],
                ["self_love_integration_enabled", labels.selfLoveIntegration],
                ["companion_guidance_priority", labels.companionGuidance],
                ["proactive_recommendations_enabled", labels.proactiveRecommendationsEnabled],
                ["health_scoring_enabled", labels.healthScoringEnabled],
                ["duplicate_detection_scaffold", labels.duplicateDetectionScaffold],
                ["organizational_memory_sync_scaffold", labels.organizationalMemorySync],
              ] as const
            ).map(([key, label]) => (
              <li key={key}>
                {label}: {evolution[key] ? labels.enabled : labels.disabled}
              </li>
            ))}
            {typeof evolution.review_cycle_days === "number" && (
              <li>
                {labels.reviewCycle}: {evolution.review_cycle_days} {labels.days}
              </li>
            )}
          </ul>
        </section>
      )}

      {phase14 && (
        <section className="rounded-xl border border-violet-200 bg-violet-50/40 p-6">
          <h2 className="text-sm font-semibold text-violet-900">{labels.knowledgeEvolution}</h2>
          {typeof phase14.mission === "string" && (
            <p className="mt-2 text-sm font-medium text-violet-900">
              <span className="text-xs text-violet-700">{labels.phase14Mission}: </span>
              {phase14.mission}
            </p>
          )}
          {typeof phase14.philosophy === "string" && (
            <p className="mt-2 text-sm text-violet-900">
              <span className="text-xs text-violet-700">{labels.phase14Philosophy}: </span>
              {phase14.philosophy}
            </p>
          )}
        </section>
      )}

      {evolutionObjectives.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.evolutionObjectives}</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-gray-700">
            {evolutionObjectives.map((obj) => (
              <li key={obj}>{obj}</li>
            ))}
          </ul>
        </section>
      )}

      {healthIndicators && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.healthIndicators}</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {(
              [
                ["freshness_score", labels.freshnessScore],
                ["coverage_score", labels.coverageScore],
                ["quality_score", labels.qualityScore],
              ] as const
            ).map(([key, label]) => (
              <div key={key} className="rounded-lg border border-gray-100 bg-white p-3 text-center">
                <p className="text-xs font-medium text-gray-600">{label}</p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">
                  {typeof healthIndicators[key] === "number" ? healthIndicators[key] : "—"}
                </p>
              </div>
            ))}
          </div>
          {healthMeta && (
            <p className="mt-3 text-xs text-gray-500">
              {labels.healthMetadata}:{" "}
              {[
                healthMeta.published_articles != null ? `${healthMeta.published_articles} articles` : null,
                healthMeta.published_faqs != null ? `${healthMeta.published_faqs} FAQs` : null,
                healthMeta.stale_articles != null ? `${healthMeta.stale_articles} stale` : null,
                healthMeta.open_support_gaps != null ? `${healthMeta.open_support_gaps} gaps` : null,
              ]
                .filter(Boolean)
                .join(" · ")}
            </p>
          )}
        </section>
      )}

      <section className="rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-semibold">{labels.proactiveRecommendations}</h3>
        {recommendations.length === 0 ? (
          <p className="mt-2 text-xs text-gray-500">{labels.noRecommendations}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {recommendations.map((rec) => {
              const key = typeof rec.key === "string" ? rec.key : String(rec.title ?? "");
              const title = typeof rec.title === "string" ? rec.title : key;
              const explanation = typeof rec.explanation === "string" ? rec.explanation : null;
              const source = typeof rec.source === "string" ? rec.source : null;
              const actionHint = typeof rec.action_hint === "string" ? rec.action_hint : null;
              const priority = typeof rec.priority === "string" ? rec.priority : undefined;
              return (
                <li key={key} className={`rounded-lg border px-3 py-2 text-sm ${priorityClass(priority)}`}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-medium text-gray-900">{title}</span>
                    {rec.type ? (
                      <span className="rounded-full bg-white px-2 py-0.5 text-xs capitalize text-gray-600">
                        {String(rec.type).replace(/_/g, " ")}
                      </span>
                    ) : null}
                  </div>
                  {explanation && <p className="mt-1 text-xs text-gray-700">{explanation}</p>}
                  {source && (
                    <p className="mt-1 text-xs text-gray-500">
                      {labels.recommendationSource}: {source}
                    </p>
                  )}
                  {actionHint && (
                    <p className="mt-1 text-xs text-indigo-700">
                      {labels.recommendationAction}: {actionHint}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {creationOpportunities.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.creationOpportunities}</h3>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {creationOpportunities.map((item) => {
              const key = typeof item.key === "string" ? item.key : String(item.label ?? "");
              const label = typeof item.label === "string" ? item.label : key;
              const description = typeof item.description === "string" ? item.description : null;
              return (
                <div key={key} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-xs">
                  <p className="font-medium text-gray-900">{label}</p>
                  {description && <p className="mt-1 text-gray-600">{description}</p>}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {evolutionSuccessCriteria.length > 0 && (
        <section className="rounded-lg border border-violet-100 bg-violet-50/30 p-4">
          <h3 className="text-sm font-semibold text-violet-900">{labels.evolutionSuccessCriteria}</h3>
          <ul className="mt-2 space-y-2 text-sm">
            {evolutionSuccessCriteria.map((item) => {
              const label = typeof item.label === "string" ? item.label : String(item.key ?? "");
              const met = Boolean(item.met);
              const note = typeof item.note === "string" ? item.note : null;
              return (
                <li key={label} className="flex flex-col gap-0.5">
                  <span className={met ? "text-green-800" : "text-gray-700"}>
                    {met ? "✓" : "○"} {label}
                  </span>
                  {note && <span className="text-xs text-gray-500">{note}</span>}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {(selfLoveConnection || orgMemoryConnection || trustConnection) && (
        <section className="grid gap-4 lg:grid-cols-3">
          {selfLoveConnection && (
            <div className="rounded-lg border border-gray-200 p-4">
              <h3 className="text-sm font-semibold">{labels.selfLoveConnection}</h3>
              {typeof selfLoveConnection.principle === "string" && (
                <p className="mt-2 text-xs text-gray-600">{selfLoveConnection.principle}</p>
              )}
            </div>
          )}
          {orgMemoryConnection && (
            <div className="rounded-lg border border-gray-200 p-4">
              <h3 className="text-sm font-semibold">{labels.organizationalMemoryConnection}</h3>
              {typeof orgMemoryConnection.principle === "string" && (
                <p className="mt-2 text-xs text-gray-600">{orgMemoryConnection.principle}</p>
              )}
            </div>
          )}
          {trustConnection && (
            <div className="rounded-lg border border-gray-200 p-4">
              <h3 className="text-sm font-semibold">{labels.trustConnection}</h3>
              {typeof trustConnection.principle === "string" && (
                <p className="mt-2 text-xs text-gray-600">{trustConnection.principle}</p>
              )}
            </div>
          )}
        </section>
      )}

      {visionPhrases.length > 0 && (
        <section className="rounded-lg border border-indigo-100 bg-indigo-50/30 p-4">
          <h3 className="text-sm font-semibold text-indigo-900">{labels.visionPhrases}</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-indigo-800">
            {visionPhrases.map((phrase) => (
              <li key={phrase}>{phrase}</li>
            ))}
          </ul>
        </section>
      )}

      {integrationLinks.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.integrationLinks}</h3>
          <ul className="mt-2 space-y-1 text-sm">
            {integrationLinks.map((link) => {
              const route = typeof link.route === "string" ? link.route : null;
              const label = typeof link.label === "string" ? link.label : route ?? "";
              return (
                <li key={label}>
                  {route ? (
                    <Link href={route} className="text-indigo-600 hover:underline">
                      {label}
                    </Link>
                  ) : (
                    label
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {dogfooding && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.dogfooding}</h3>
          {typeof dogfooding.principle === "string" && (
            <p className="mt-1 text-xs text-gray-600">{dogfooding.principle}</p>
          )}
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            {(["aipify_group", "unonight"] as const).map((orgKey) => {
              const org = dogfooding[orgKey];
              if (typeof org !== "object" || !org) return null;
              const orgData = org as Record<string, unknown>;
              const slug = typeof orgData.slug === "string" ? orgData.slug : orgKey;
              const categories = Array.isArray(orgData.categories) ? (orgData.categories as string[]) : [];
              return (
                <div key={orgKey} className="rounded border border-gray-100 bg-gray-50 p-3">
                  <p className="text-xs font-medium text-gray-900">{slug}</p>
                  {categories.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {categories.map((cat) => (
                        <span key={cat} className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs text-indigo-800">
                          {cat}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {blueprintLinks.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.blueprintLinks}</h3>
          <ul className="mt-2 space-y-1 text-sm">
            {blueprintLinks.map((link) => {
              const route = typeof link.route === "string" ? link.route : null;
              const label = typeof link.label === "string" ? link.label : route ?? "";
              return (
                <li key={label}>
                  {route ? (
                    <Link href={route} className="text-indigo-600 hover:underline">
                      {label}
                    </Link>
                  ) : (
                    label
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-100 bg-white p-3">
          <p className="text-xs font-medium text-gray-700">{labels.publishedArticles}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{dashboard.published_articles ?? 0}</p>
        </div>
        <div className="rounded-lg border border-gray-100 bg-white p-3">
          <p className="text-xs font-medium text-gray-700">{labels.awaitingReview}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{dashboard.drafts_awaiting_review ?? 0}</p>
        </div>
        <div className="rounded-lg border border-gray-100 bg-white p-3">
          <p className="text-xs font-medium text-gray-700">{labels.faqCount}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{dashboard.faq_count ?? 0}</p>
        </div>
        <div className="rounded-lg border border-gray-100 bg-white p-3">
          <p className="text-xs font-medium text-gray-700">{labels.categories}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{dashboard.categories.length}</p>
        </div>
      </section>

      <form onSubmit={(e) => void handleSearch(e)} className="flex flex-wrap gap-2">
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={labels.searchPlaceholder}
          className="min-w-[200px] flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={searching}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white disabled:opacity-50"
        >
          {labels.search}
        </button>
      </form>

      {searchResults.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.searchResults}</h2>
          <ul className="mt-3 space-y-2">
            {searchResults.map((r, i) => (
              <li key={String(r.id ?? i)} className="rounded-lg border border-indigo-100 bg-indigo-50/30 px-3 py-2 text-sm">
                <span className="font-medium">{String(r.title ?? "")}</span>
                <p className="mt-1 text-xs text-gray-500">{String(r.summary ?? "").slice(0, 120)}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.categories.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.categoryList}</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {dashboard.categories.map((c) => (
              <span key={c.slug} className="rounded-full bg-indigo-100 px-3 py-1 text-xs text-indigo-800">
                {c.name}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      <section className="grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">{labels.publishedList}</h2>
          <div className="mt-3">
            <ArticleList items={dashboard.published_list} emptyLabel={labels.noArticles} />
          </div>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-gray-900">{labels.awaitingReviewList}</h2>
          <div className="mt-3">
            <ArticleList items={dashboard.awaiting_review} emptyLabel={labels.noArticles} showStatus />
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">{labels.mostViewed}</h2>
          <div className="mt-3">
            <ArticleList items={dashboard.most_viewed} emptyLabel={labels.noArticles} />
          </div>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-gray-900">{labels.needsUpdate}</h2>
          <div className="mt-3">
            <ArticleList items={dashboard.needs_update} emptyLabel={labels.noAlerts} />
          </div>
        </div>
      </section>

      {dashboard.outdated_alerts.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-rose-800">{labels.outdatedAlerts}</h2>
          <div className="mt-3">
            <ArticleList items={dashboard.outdated_alerts} emptyLabel={labels.noAlerts} />
          </div>
        </section>
      ) : null}

      {dashboard.recent_faqs.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.recentFaqs}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.recent_faqs.map((f) => (
              <li key={f.id} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
                <span className="font-medium text-gray-900">{f.question}</span>
                <span className={`ml-2 rounded-full px-2 py-0.5 text-xs capitalize ${badgeClass(f.status)}`}>
                  {f.status}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.principles && dashboard.principles.length > 0 ? (
        <section className="rounded-lg border border-indigo-100 bg-indigo-50/30 p-4">
          <h2 className="text-sm font-semibold text-indigo-900">{labels.principles}</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-indigo-800">
            {dashboard.principles.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
