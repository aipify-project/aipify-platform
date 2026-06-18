"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseApiPlatformEngineDashboard,
  type ApiCategoryItem,
  type ApiPlatformEngineDashboard,
  type DeveloperObjective,
  type SecurityPrinciple,
} from "@/lib/aipify/api-platform-engine";

type Props = { labels: Record<string, string> };

function ObjectiveItem({ item }: { item: DeveloperObjective | SecurityPrinciple }) {
  return (
    <li className="text-sm text-gray-600">
      <span className="font-medium text-gray-800">{item.label}</span>
      {item.description ? <span className="text-gray-500"> — {item.description}</span> : null}
    </li>
  );
}

function CategoryGroup({
  title,
  items,
  labels,
}: {
  title: string;
  items?: ApiCategoryItem[];
  labels: Record<string, string>;
}) {
  if (!items?.length) return null;
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50/50 p-3">
      <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500">{title}</h4>
      <ul className="mt-2 space-y-2">
        {items.map((item) => (
          <li key={String(item.key ?? item.label)} className="text-sm text-gray-700">
            <span className="font-medium">{item.label}</span>
            {item.scopes?.length ? (
              <span className="mt-0.5 block text-xs text-gray-500">
                {labels.scopes}: {item.scopes.join(", ")}
              </span>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ApiPlatformEngineDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<ApiPlatformEngineDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/api-platform-engine/dashboard");
    if (res.ok) setDashboard(parseApiPlatformEngineDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;
  if (!dashboard?.has_organization) return null;

  const summary = dashboard.summary ?? {};
  const engagement = dashboard.engagement_summary;
  const categories = dashboard.api_categories;

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-slate-50/60 p-6">
        <h2 className="text-sm font-semibold text-slate-900">{labels.engineTitle}</h2>
        {dashboard.mission ? <p className="mt-2 text-sm text-slate-700">{dashboard.mission}</p> : null}
        {dashboard.blueprint_philosophy ? (
          <p className="mt-2 text-sm text-slate-600">{dashboard.blueprint_philosophy}</p>
        ) : null}
        {dashboard.abos_principle ? (
          <p className="mt-2 text-xs font-medium text-slate-500">{dashboard.abos_principle}</p>
        ) : null}
        {dashboard.distinction_note ? (
          <p className="mt-3 text-xs text-slate-500">{dashboard.distinction_note}</p>
        ) : null}
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.activeKeys}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">
            {String(summary.active_keys ?? engagement?.active_keys ?? 0)}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.activeWebhooks}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">
            {String(summary.active_webhooks ?? engagement?.active_webhooks ?? 0)}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.pendingApprovalKeys}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">
            {String(summary.pending_approval_keys ?? engagement?.pending_approval_keys ?? 0)}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.auditEvents30d}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">
            {String(summary.audit_events_30d ?? engagement?.audit_events_30d ?? 0)}
          </p>
        </div>
      </section>

      {dashboard.principles && dashboard.principles.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.principles}</h3>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-gray-600">
            {dashboard.principles.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.developer_objectives && dashboard.developer_objectives.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.developerObjectives}</h3>
          <ul className="mt-3 space-y-2">
            {dashboard.developer_objectives.map((item) => (
              <ObjectiveItem key={String(item.key ?? item.label)} item={item} />
            ))}
          </ul>
        </section>
      ) : null}

      {categories ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.apiCategories}</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <CategoryGroup title={labels.categoryCore} items={categories.core} labels={labels} />
            <CategoryGroup title={labels.categoryCompanion} items={categories.companion} labels={labels} />
            <CategoryGroup title={labels.categoryCommerce} items={categories.commerce} labels={labels} />
            <CategoryGroup title={labels.categoryPartner} items={categories.partner} labels={labels} />
          </div>
        </section>
      ) : null}

      {dashboard.security_principles && dashboard.security_principles.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.securityPrinciples}</h3>
          <ul className="mt-3 space-y-2">
            {dashboard.security_principles.map((item) => (
              <ObjectiveItem key={String(item.key ?? item.label)} item={item} />
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.developer_experience?.principle ? (
        <section className="rounded-lg border border-teal-100 bg-teal-50/40 p-4 text-sm">
          <h3 className="text-sm font-semibold text-teal-900">{labels.developerExperience}</h3>
          <p className="mt-2 text-teal-800">{dashboard.developer_experience.principle}</p>
          {dashboard.developer_experience.surfaces?.length ? (
            <ul className="mt-3 space-y-2">
              {dashboard.developer_experience.surfaces.map((surface) => (
                <li key={String(surface.key ?? surface.label)}>
                  {surface.route ? (
                    <Link href={surface.route} className="font-medium text-teal-700 hover:underline">
                      {surface.label}
                    </Link>
                  ) : (
                    <span className="font-medium">{surface.label}</span>
                  )}
                  {surface.note ? <p className="text-xs text-teal-700/80">{surface.note}</p> : null}
                </li>
              ))}
            </ul>
          ) : null}
          {dashboard.developer_experience.boundary ? (
            <p className="mt-2 text-xs text-teal-700/70">{dashboard.developer_experience.boundary}</p>
          ) : null}
        </section>
      ) : null}

      {Array.isArray(dashboard.blueprint_success_criteria) && dashboard.blueprint_success_criteria.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.blueprintSuccessCriteria}</h3>
          <ul className="mt-2 space-y-2 text-sm">
            {dashboard.blueprint_success_criteria.map((item) => {
              const label = typeof item.label === "string" ? item.label : String(item.key ?? "");
              const met = Boolean(item.met);
              const note = typeof item.note === "string" ? item.note : null;
              return (
                <li key={item.key ?? label}>
                  <span className={met ? "text-green-800" : "text-gray-700"}>
                    {met ? "✓" : "○"} {label}
                  </span>
                  {note ? <p className="text-xs text-gray-500">{note}</p> : null}
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      {dashboard.trust_connection_blueprint?.principle ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.trustConnectionBlueprint}</h3>
          <p className="mt-2 text-gray-600">{dashboard.trust_connection_blueprint.principle}</p>
          {dashboard.trust_connection_blueprint.organizations_should_understand?.length ? (
            <ul className="mt-2 list-inside list-disc space-y-1 text-gray-600">
              {dashboard.trust_connection_blueprint.organizations_should_understand.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {dashboard.api_keys && dashboard.api_keys.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.apiKeys}</h3>
          <ul className="mt-2 space-y-2 text-sm">
            {dashboard.api_keys.map((key) => (
              <li key={String(key.id ?? key.key_prefix)} className="flex items-center justify-between">
                <span>
                  {key.key_name}{" "}
                  <span className="text-xs text-gray-500">({key.key_prefix})</span>
                </span>
                <span className="text-xs text-gray-500">{key.status}</span>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-gray-500">{labels.keysMetadataNote}</p>
        </section>
      ) : null}

      {engagement ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.engagementSummary}</h3>
          <dl className="mt-2 grid gap-2 sm:grid-cols-2">
            <div>
              <dt className="text-xs text-gray-500">{labels.rateLimitTier}</dt>
              <dd className="font-medium">{engagement.rate_limit_tier ?? "standard"}</dd>
            </div>
            <div>
              <dt className="text-xs text-gray-500">{labels.sandboxEnabled}</dt>
              <dd className="font-medium">
                {engagement.sandbox_enabled ? labels.enabled : labels.disabled}
              </dd>
            </div>
          </dl>
          {engagement.privacy_note ? <p className="mt-2 text-xs text-gray-500">{engagement.privacy_note}</p> : null}
        </section>
      ) : null}

      {dashboard.blueprint_integration_links && dashboard.blueprint_integration_links.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.integrationLinks}</h3>
          <ul className="mt-2 space-y-2 text-sm">
            {dashboard.blueprint_integration_links.map((link) => (
              <li key={String(link.key ?? link.route)}>
                {link.route ? (
                  <Link href={link.route} className="font-medium text-teal-700 hover:underline">
                    {link.label}
                  </Link>
                ) : (
                  <span className="font-medium">{link.label}</span>
                )}
                {link.note ? <p className="text-xs text-gray-500">{link.note}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.privacy_note ? <p className="text-xs text-gray-500">{dashboard.privacy_note}</p> : null}
    </div>
  );
}
