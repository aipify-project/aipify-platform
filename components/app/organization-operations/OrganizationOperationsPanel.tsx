"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { AipifyModuleAccessDenied } from "@/components/ui/aipify-module-access-denied";
import { AipifyShellClasses } from "@/lib/design/light-enterprise-theme";
import {
  HEALTH_STATUS_BADGES,
  parseOrganizationOperationsCenter,
  type OrganizationOperationsCenter,
  type OrganizationOperationsLabels,
  type OrganizationOperationsTab,
} from "@/lib/organization-operations";

type Tab = OrganizationOperationsTab;

type Props = {
  labels: OrganizationOperationsLabels;
  initialTab?: Tab;
  visibleTabs?: Tab[];
  titleOverride?: string;
  subtitleOverride?: string;
};

function OverviewCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className={`${AipifyShellClasses.surfaceCard} px-5 py-4`}>
      <dt className="text-xs font-medium uppercase tracking-wide text-aipify-text-muted">{label}</dt>
      <dd className="mt-2 text-2xl font-semibold text-aipify-text">{value}</dd>
    </div>
  );
}

function ChartNode({ node, depth = 0 }: { node: Record<string, unknown>; depth?: number }) {
  const name = String(node.name ?? node.title ?? node.type ?? "");
  const children = Array.isArray(node.children)
    ? (node.children as Record<string, unknown>[])
    : [
        ...(Array.isArray(node.departments) ? (node.departments as Record<string, unknown>[]) : []),
        ...(Array.isArray(node.business_units) ? (node.business_units as Record<string, unknown>[]) : []),
        ...(Array.isArray(node.teams) ? (node.teams as Record<string, unknown>[]) : []),
      ];
  return (
    <div style={{ marginLeft: depth * 16 }} className="border-l border-aipify-border pl-3">
      <p className="py-1 text-sm font-medium text-aipify-text">{name}</p>
      {children.map((child, i) => (
        <ChartNode key={`${String(child.id ?? child.name)}-${i}`} node={child} depth={depth + 1} />
      ))}
    </div>
  );
}

export function OrganizationOperationsPanel({
  labels,
  initialTab = "overview",
  visibleTabs,
  titleOverride,
  subtitleOverride,
}: Props) {
  const allTabs: Tab[] = visibleTabs ?? [
    "overview",
    "structure",
    "domains",
    "departments",
    "locations",
    "business_units",
    "brands",
    "entities",
    "workspaces",
    "health",
    "executive",
    "reports",
    "companion",
  ];

  const [center, setCenter] = useState<OrganizationOperationsCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>(initialTab);
  const [busy, setBusy] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Record<string, unknown>[]>([]);
  const [entityName, setEntityName] = useState("");
  const [brandName, setBrandName] = useState("");
  const [workspaceName, setWorkspaceName] = useState("");
  const [unitName, setUnitName] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/app/organization-operations");
    if (res.ok) setCenter(parseOrganizationOperationsCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  const runAction = useCallback(
    async (action_type: string, payload: Record<string, unknown> = {}) => {
      setBusy(true);
      try {
        await fetch("/api/app/organization-operations/action", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action_type, payload }),
        });
        await load();
      } finally {
        setBusy(false);
      }
    },
    [load]
  );

  const runSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;
    const res = await fetch(
      `/api/app/organization-operations/search?q=${encodeURIComponent(searchQuery)}`
    );
    if (res.ok) {
      const data = await res.json();
      setSearchResults(Array.isArray(data.results) ? data.results : []);
    }
  }, [searchQuery]);

  if (loading && !center) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <AipifyLoader centered />
      </div>
    );
  }

  if (!center?.found) {
    return <AipifyModuleAccessDenied message={labels.accessDenied} />;
  }

  const overview = center.overview ?? {};
  const healthStatus = String(overview.organization_health_status ?? "healthy");
  const advisorPrompts = (center.companion_advisor?.advisor_prompts as string[]) ?? [];
  const routes = center.routes ?? {};

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
      <div>
        <h1 className="text-2xl font-bold text-aipify-text">{titleOverride ?? labels.title}</h1>
        <p className="mt-2 text-aipify-text-secondary">{subtitleOverride ?? labels.subtitle}</p>
        {center.principle ? (
          <p className="mt-3 rounded-2xl border border-aipify-border bg-aipify-surface-muted px-5 py-4 text-sm text-aipify-text">
            {center.principle}
          </p>
        ) : null}
        {center.organization ? (
          <p className="mt-2 text-sm text-aipify-text-secondary">{center.organization.name}</p>
        ) : null}
        <div className="mt-3 flex flex-wrap gap-3 text-sm">
          {routes.workspaces ? (
            <Link href={routes.workspaces} className="text-indigo-700 hover:underline">
              {labels.workspacesLink}
            </Link>
          ) : null}
          {routes.employees ? (
            <Link href={routes.employees} className="text-indigo-700 hover:underline">
              {labels.employeesLink}
            </Link>
          ) : null}
          {routes.domains ? (
            <Link href={routes.domains} className="text-indigo-700 hover:underline">
              {labels.domainsLink}
            </Link>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={labels.searchPlaceholder}
          className="flex-1 rounded-lg border border-aipify-border px-3 py-2 text-sm"
        />
        <button
          type="button"
          disabled={busy || !searchQuery.trim()}
          onClick={() => void runSearch()}
          className={`${AipifyShellClasses.primaryButton} disabled:opacity-50`}
        >
          {labels.search}
        </button>
      </div>
      {searchResults.length > 0 ? (
        <div className={`${AipifyShellClasses.surfaceCard} space-y-2 p-4 text-sm`}>
          {searchResults.map((r) => (
            <p key={String(r.id)}>
              {String(r.title)} · {String(r.subtitle ?? r.result_type)}
            </p>
          ))}
        </div>
      ) : null}

      <div className="-mx-1 flex gap-1 overflow-x-auto border-b border-aipify-border pb-2">
        {allTabs.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium ${
              tab === key ? "bg-indigo-600 text-white" : "text-aipify-text-secondary hover:bg-aipify-surface-muted"
            }`}
          >
            {labels.tabs[key]}
          </button>
        ))}
      </div>

      {tab === "overview" ? (
        <section className="space-y-4">
          <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <OverviewCard label={labels.entities} value={overview.entities ?? 0} />
            <OverviewCard label={labels.brands} value={overview.brands ?? 0} />
            <OverviewCard label={labels.workspaces} value={overview.workspaces ?? 0} />
            <OverviewCard label={labels.domains} value={overview.domains ?? 0} />
            <OverviewCard label={labels.departments} value={overview.departments ?? 0} />
            <OverviewCard label={labels.locations} value={overview.locations ?? 0} />
            <OverviewCard label={labels.health} value={labels.healthStatuses[healthStatus] ?? healthStatus} />
            <OverviewCard label="Score" value={overview.organization_health_score ?? 0} />
          </dl>
        </section>
      ) : null}

      {tab === "structure" ? (
        <section className={`${AipifyShellClasses.surfaceCard} p-4`}>
          <h2 className="font-semibold text-aipify-text">{labels.structure}</h2>
          {center.structure_map ? <ChartNode node={center.structure_map as Record<string, unknown>} /> : null}
        </section>
      ) : null}

      {tab === "domains" ? (
        <section className="space-y-3">
          {(center.domains ?? []).map((d) => (
            <div key={d.id} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
              <p className="font-medium text-aipify-text">{d.domain}</p>
              <p className="text-aipify-text-muted">{d.verification_status}</p>
            </div>
          ))}
        </section>
      ) : null}

      {tab === "departments" ? (
        <section className="grid gap-4 lg:grid-cols-2">
          {(center.department_view ?? []).map((d) => (
            <div key={String(d.id)} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
              <p className="font-medium text-aipify-text">{String(d.name)}</p>
              <p className="text-aipify-text-muted">
                {String(d.employees ?? 0)} employees · {String(d.teams ?? 0)} teams
              </p>
            </div>
          ))}
        </section>
      ) : null}

      {tab === "locations" ? (
        <section className="space-y-3">
          {(center.locations ?? []).map((l) => (
            <div key={String(l.id)} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
              <p className="font-medium text-aipify-text">{String(l.name)}</p>
              <p className="text-aipify-text-muted">
                {[l.city, l.country].filter(Boolean).join(", ")} · {String(l.location_type ?? "")}
              </p>
            </div>
          ))}
        </section>
      ) : null}

      {tab === "business_units" ? (
        <section className="space-y-4">
          <form
            className="flex flex-col gap-2 rounded-xl border border-aipify-border bg-aipify-surface-muted p-4 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              void runAction("create_business_unit", { name: unitName });
              setUnitName("");
            }}
          >
            <input
              value={unitName}
              onChange={(e) => setUnitName(e.target.value)}
              placeholder={labels.businessUnits}
              className="flex-1 rounded-lg border border-aipify-border px-3 py-2 text-sm"
              required
            />
            <button type="submit" disabled={busy} className={AipifyShellClasses.primaryButton}>
              {labels.createBusinessUnit}
            </button>
          </form>
          {(center.business_units ?? []).map((u) => (
            <div key={String(u.id)} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
              <p className="font-medium text-aipify-text">{String(u.name)}</p>
            </div>
          ))}
        </section>
      ) : null}

      {tab === "brands" ? (
        <section className="space-y-4">
          <form
            className="flex flex-col gap-2 rounded-xl border border-aipify-border bg-aipify-surface-muted p-4 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              void runAction("create_brand", { name: brandName });
              setBrandName("");
            }}
          >
            <input
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder={labels.brands}
              className="flex-1 rounded-lg border border-aipify-border px-3 py-2 text-sm"
              required
            />
            <button type="submit" disabled={busy} className={AipifyShellClasses.primaryButton}>
              {labels.createBrand}
            </button>
          </form>
          {(center.brands ?? []).map((b) => (
            <div key={b.id} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
              <p className="font-medium text-aipify-text">{b.name}</p>
            </div>
          ))}
        </section>
      ) : null}

      {tab === "entities" ? (
        <section className="space-y-4">
          <form
            className="flex flex-col gap-2 rounded-xl border border-aipify-border bg-aipify-surface-muted p-4 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              void runAction("create_entity", { name: entityName });
              setEntityName("");
            }}
          >
            <input
              value={entityName}
              onChange={(e) => setEntityName(e.target.value)}
              placeholder={labels.entities}
              className="flex-1 rounded-lg border border-aipify-border px-3 py-2 text-sm"
              required
            />
            <button type="submit" disabled={busy} className={AipifyShellClasses.primaryButton}>
              {labels.createEntity}
            </button>
          </form>
          {(center.business_entities ?? []).map((e) => (
            <div key={e.id} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
              <p className="font-medium text-aipify-text">{e.name}</p>
              <p className="text-aipify-text-muted">
                {labels.entityTypes[e.entity_type ?? "custom"] ?? e.entity_type}
              </p>
            </div>
          ))}
        </section>
      ) : null}

      {tab === "workspaces" ? (
        <section className="space-y-4">
          <form
            className="flex flex-col gap-2 rounded-xl border border-aipify-border bg-aipify-surface-muted p-4 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              void runAction("create_workspace", { name: workspaceName });
              setWorkspaceName("");
            }}
          >
            <input
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              placeholder={labels.workspaces}
              className="flex-1 rounded-lg border border-aipify-border px-3 py-2 text-sm"
              required
            />
            <button type="submit" disabled={busy} className={AipifyShellClasses.primaryButton}>
              {labels.createWorkspace}
            </button>
          </form>
          {(center.workspaces ?? []).map((w) => (
            <div key={w.id} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
              <p className="text-xs uppercase text-aipify-text-muted">
                {labels.workspaceTypes[w.workspace_type ?? "general"] ?? w.workspace_type}
              </p>
              <p className="font-medium text-aipify-text">{w.name}</p>
            </div>
          ))}
        </section>
      ) : null}

      {tab === "health" ? (
        <section className="space-y-4">
          <button
            type="button"
            disabled={busy}
            onClick={() => void runAction("refresh_health", { health_score: 75 })}
            className={AipifyShellClasses.primaryButton}
          >
            {labels.refreshHealth}
          </button>
          <span
            className={`ml-3 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${
              HEALTH_STATUS_BADGES[healthStatus] ?? HEALTH_STATUS_BADGES.healthy
            }`}
          >
            {labels.healthStatuses[healthStatus] ?? healthStatus}
          </span>
          {(center.organization_health ?? []).map((h, i) => (
            <div key={i} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
              <p>
                {String(h.scope_type)} · {String(h.health_status)} · {String(h.health_score)}
              </p>
              {h.summary ? <p className="text-aipify-text-muted">{String(h.summary)}</p> : null}
            </div>
          ))}
        </section>
      ) : null}

      {tab === "executive" ? (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(center.executive_dashboard ?? {}).map(([key, value]) => (
            <OverviewCard key={key} label={key.replace(/_/g, " ")} value={String(value)} />
          ))}
        </section>
      ) : null}

      {tab === "reports" ? (
        <section className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
          <h2 className="font-semibold text-aipify-text">{labels.reports}</h2>
          <pre className="mt-3 overflow-x-auto whitespace-pre-wrap text-aipify-text-secondary">
            {JSON.stringify(center.reports ?? {}, null, 2)}
          </pre>
        </section>
      ) : null}

      {tab === "companion" ? (
        <section className={`${AipifyShellClasses.surfaceCard} p-4`}>
          <h2 className="font-semibold text-aipify-text">{labels.companionInsights}</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-aipify-text-secondary">
            {advisorPrompts.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {center.audit_recent?.length ? (
        <section className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
          <h2 className="font-semibold text-aipify-text">Audit</h2>
          <ul className="mt-2 space-y-1 text-aipify-text-secondary">
            {center.audit_recent.map((entry, i) => (
              <li key={`${entry.event_type}-${i}`}>{entry.summary}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
