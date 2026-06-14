"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  POLL_INTERVAL_SUPER_ADMIN_HEALTH_MS,
  allowsSuperAdminHealthPolling,
  dedupeFetch,
  usePollingTask,
} from "@/lib/polling";
import type { SuperAdminControlCenter } from "@/lib/super-admin/types";
import { SUPER_ADMIN_SECTIONS } from "@/lib/super-admin/nav-config";
import { usePathname } from "next/navigation";

type SuperAdminControlCenterPanelProps = {
  labels: {
    loading: string;
    loadError: string;
    welcome: string;
    globalPlatformHealth: string;
    organizations: string;
    organizationsActive: string;
    growthPartnerApplications: string;
    growthPartnerPending: string;
    marketplaceReviews: string;
    marketplaceAwaiting: string;
    criticalIncidents: string;
    criticalIncidentsNone: string;
    criticalIncidentsCount: string;
    privacyNote: string;
    sectionsTitle: string;
    openModule: string;
  };
  sectionLabels: Record<string, { title: string; purpose: string }>;
  moduleLabels: Record<string, { label: string; description: string }>;
};

export default function SuperAdminControlCenterPanel({
  labels,
  sectionLabels,
  moduleLabels,
}: SuperAdminControlCenterPanelProps) {
  const pathname = usePathname();
  const [center, setCenter] = useState<SuperAdminControlCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const ok = await dedupeFetch("super-admin-control-center", async () => {
        const res = await fetch("/api/super-admin/control-center");
        if (!res.ok) {
          const body = (await res.json().catch(() => ({}))) as { error?: string };
          throw new Error(body.error ?? labels.loadError);
        }
        const data = (await res.json()) as SuperAdminControlCenter;
        setCenter(data);
        return true;
      });
      return ok;
    } catch (err) {
      setError(err instanceof Error ? err.message : labels.loadError);
      return false;
    } finally {
      setLoading(false);
    }
  }, [labels.loadError]);

  useEffect(() => {
    void load();
  }, [load]);

  const pollingEnabled = allowsSuperAdminHealthPolling(pathname);

  usePollingTask({
    taskKey: "super-admin-control-center",
    intervalMs: pollingEnabled ? POLL_INTERVAL_SUPER_ADMIN_HEALTH_MS : 0,
    enabled: pollingEnabled,
    runImmediately: false,
    refreshOnVisible: true,
    execute: load,
  });

  if (loading) {
    return <p className="text-sm text-zinc-400">{labels.loading}</p>;
  }

  if (error || !center) {
    return <p className="text-sm text-red-400">{error ?? labels.loadError}</p>;
  }

  const displayName = center.display_name ?? "Administrator";
  const criticalCount = center.critical_incidents ?? 0;

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-semibold text-zinc-50">
          {labels.welcome.replace("{name}", displayName)}
        </h2>
        <p className="mt-2 text-xs text-zinc-500">{labels.privacyNote}</p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <MetricCard
          label={labels.globalPlatformHealth}
          value={`${center.platform_health_score ?? 0}%`}
          tone="healthy"
        />
        <MetricCard
          label={labels.organizations}
          value={labels.organizationsActive.replace(
            "{count}",
            String(center.active_organizations ?? 0)
          )}
        />
        <MetricCard
          label={labels.growthPartnerApplications}
          value={labels.growthPartnerPending.replace(
            "{count}",
            String(center.growth_partner_applications_pending ?? 0)
          )}
        />
        <MetricCard
          label={labels.marketplaceReviews}
          value={labels.marketplaceAwaiting.replace(
            "{count}",
            String(center.marketplace_reviews_pending ?? 0)
          )}
        />
        <MetricCard
          label={labels.criticalIncidents}
          value={
            criticalCount === 0
              ? labels.criticalIncidentsNone
              : labels.criticalIncidentsCount.replace("{count}", String(criticalCount))
          }
          tone={criticalCount > 0 ? "critical" : "neutral"}
        />
      </section>

      <section>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
          {labels.sectionsTitle}
        </h3>
        <div className="mt-4 space-y-6">
          {SUPER_ADMIN_SECTIONS.map((section) => {
            const sectionLabel = sectionLabels[section.id];
            return (
              <div
                key={section.id}
                className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-5"
              >
                <h4 className="text-base font-semibold text-zinc-100">{sectionLabel?.title}</h4>
                <p className="mt-1 text-sm text-zinc-500">{sectionLabel?.purpose}</p>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {section.modules.map((module) => {
                    const moduleLabel = moduleLabels[module.id];
                    return (
                      <li key={module.id}>
                        <Link
                          href={module.href}
                          className="block rounded-md border border-zinc-800 bg-zinc-950/60 p-4 transition hover:border-zinc-600"
                        >
                          <p className="text-sm font-medium text-zinc-200">
                            {moduleLabel?.label}
                          </p>
                          <p className="mt-1 text-xs leading-relaxed text-zinc-500">
                            {moduleLabel?.description}
                          </p>
                          <p className="mt-3 text-[11px] font-medium uppercase tracking-wide text-zinc-600">
                            {labels.openModule}
                          </p>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function MetricCard({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: "neutral" | "healthy" | "critical";
}) {
  const valueClass =
    tone === "healthy"
      ? "text-emerald-400"
      : tone === "critical"
        ? "text-amber-400"
        : "text-zinc-100";

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</p>
      <p className={`mt-2 text-xl font-semibold ${valueClass}`}>{value}</p>
    </div>
  );
}
