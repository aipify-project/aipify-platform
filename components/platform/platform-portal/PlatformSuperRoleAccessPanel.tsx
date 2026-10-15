"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  Building2,
  FileStack,
  KeyRound,
  Layers,
  Shield,
  Users,
} from "lucide-react";
import { PlatformLayoutClasses } from "@/lib/design";
import { SUPER_ADMIN_ROLE_PERMISSION_MATRIX_HREF } from "@/lib/super-portal/dashboard-access-constants";
import {
  parsePlatformSuperRoleAccessOverview,
  type PlatformSuperRoleAccessOverview,
} from "@/lib/super-portal/platform-role-access";
import type { PlatformSuperRoleAccessLabels } from "@/lib/super-portal/platform-role-access-labels";
import { AipifyLoader } from "@/components/ui/aipify-loader";

type PlatformSuperRoleAccessPanelProps = {
  labels: PlatformSuperRoleAccessLabels;
};

type MetricCard = {
  key: string;
  label: string;
  value: number;
  icon: typeof Shield;
};

export default function PlatformSuperRoleAccessPanel({
  labels,
}: PlatformSuperRoleAccessPanelProps) {
  const [overview, setOverview] = useState<PlatformSuperRoleAccessOverview | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(false);
    setOverview(null);

    try {
      const res = await fetch("/api/super-portal/role-permission-matrix", {
        credentials: "same-origin",
        cache: "no-store",
      });
      if (!res.ok) {
        setLoadError(true);
        return;
      }

      let payload: unknown;
      try {
        payload = await res.json();
      } catch {
        setLoadError(true);
        return;
      }

      const parsed = parsePlatformSuperRoleAccessOverview(payload);
      if (!parsed) {
        setLoadError(true);
        return;
      }
      setOverview(parsed);
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const cards: MetricCard[] = overview
    ? [
        {
          key: "permissions",
          label: labels.totalPermissions,
          value: overview.total_permissions,
          icon: KeyRound,
        },
        {
          key: "modules",
          label: labels.totalModules,
          value: overview.total_modules,
          icon: Layers,
        },
        {
          key: "orgs",
          label: labels.organizationsWithGrants,
          value: overview.organizations_with_grants,
          icon: Building2,
        },
        {
          key: "grants",
          label: labels.totalRoleGrants,
          value: overview.total_role_grants,
          icon: Shield,
        },
        {
          key: "overrides",
          label: labels.userOverrides,
          value: overview.user_overrides,
          icon: Users,
        },
        {
          key: "custom",
          label: labels.customRoles,
          value: overview.custom_roles,
          icon: FileStack,
        },
        {
          key: "templates",
          label: labels.templates,
          value: overview.templates,
          icon: FileStack,
        },
      ]
    : [];

  return (
    <section
      className={`${PlatformLayoutClasses.card} border-violet-200/80 bg-white dark:border-violet-900/50 dark:bg-slate-900/40`}
      data-area="super-role-access"
      aria-labelledby="super-role-access-title"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2
            id="super-role-access-title"
            className="text-base font-semibold text-slate-900 dark:text-slate-100"
          >
            {labels.title}
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            {labels.subtitle}
          </p>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            {labels.sourceNote}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {labels.definitionNote}
          </p>
          {overview?.principle ? (
            <p className="mt-3 text-sm font-medium text-violet-900 dark:text-violet-200">
              {overview.principle}
            </p>
          ) : null}
          {overview?.privacy_note ? (
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {overview.privacy_note}
            </p>
          ) : null}
          {overview?.governance_note ? (
            <p className="mt-2 text-sm text-amber-900 dark:text-amber-200">
              {overview.governance_note}
            </p>
          ) : null}
        </div>
        <Link
          href={SUPER_ADMIN_ROLE_PERMISSION_MATRIX_HREF}
          className="inline-flex shrink-0 items-center justify-center rounded-lg border border-violet-300 bg-white px-3 py-2 text-sm font-medium text-violet-900 shadow-sm transition hover:bg-violet-50 dark:border-violet-700 dark:bg-violet-950 dark:text-violet-100 dark:hover:bg-violet-900"
        >
          {labels.openSuperMatrix}
        </Link>
      </div>

      {loading ? (
        <div className="mt-6 flex min-h-[8rem] items-center justify-center">
          <AipifyLoader centered />
          <span className="sr-only">{labels.loading}</span>
        </div>
      ) : null}

      {!loading && loadError ? (
        <div
          role="alert"
          className="mt-6 flex flex-col gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between dark:border-rose-800 dark:bg-rose-950/40"
        >
          <p className="text-sm text-rose-900 dark:text-rose-100">{labels.loadError}</p>
          <button
            type="button"
            onClick={() => void load()}
            className="inline-flex shrink-0 items-center justify-center rounded-lg border border-rose-300 bg-white px-3 py-1.5 text-sm font-medium text-rose-900 dark:border-rose-700 dark:bg-rose-950 dark:text-rose-50"
          >
            {labels.retry}
          </button>
        </div>
      ) : null}

      {!loading && !loadError && !overview ? (
        <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">{labels.empty}</p>
      ) : null}

      {!loading && !loadError && overview ? (
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.key}
                className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-700 dark:bg-slate-950/40"
              >
                <div className="flex items-center gap-2 text-violet-700 dark:text-violet-300">
                  <Icon className="h-4 w-4 shrink-0" aria-hidden />
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    {card.label}
                  </p>
                </div>
                <p className="mt-2 text-2xl font-semibold tabular-nums text-slate-900 dark:text-slate-50">
                  {card.value}
                </p>
              </div>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}
