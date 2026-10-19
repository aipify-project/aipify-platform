"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import { summarizeAddonModules } from "@/lib/commercial-packages/addon-module-summary";
import { parseModulesCenter, type ModulesCenter } from "@/lib/commercial-packages";
import { Blocks } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

type ModulesAdminPanelProps = {
  labels: {
    title: string;
    subtitle: string;
    loading: string;
    back: string;
    viewBilling: string;
    empty: string;
    enable: string;
    disable: string;
    statusActive: string;
    statusAvailable: string;
    statusTrial: string;
    openManage: string;
    upgradeRequired: string;
    plannedSection: string;
    plannedHint: string;
    plannedCta: string;
    plannedProducts: {
      designStudio: { name: string; description: string };
      aiTranslator: { name: string; description: string };
    };
    sections: {
      installed: string;
      available: string;
      trials: string;
      recommendations: string;
      packages: string;
      flags: string;
    };
    retry: string;
    unnamedModule: string;
    loadError: string;
    activeCount: string;
    unnamedNote: string;
    notForPurchase: string;
    purchaseGap: string;
    contactSupport: string;
    emptyAddons: string;
    licensedRecord: string;
  };
  /** Inside AppHubShell. Commercial catalog stays off this surface. */
  embedded?: boolean;
};

export function ModulesAdminPanel({ labels, embedded = false }: ModulesAdminPanelProps) {
  const [center, setCenter] = useState<ModulesCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    const res = await fetch("/api/commercial-packages/modules");
    if (res.ok) {
      setCenter(parseModulesCenter(await res.json()));
    } else {
      setLoadError(labels.loadError);
      setCenter(null);
    }
    setLoading(false);
  }, [labels.loadError]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  if (loading) {
    return (
      <div
        className="rounded-[var(--app-radius-lg)] border border-[var(--app-border)] bg-[var(--app-card)]"
        role="status"
        aria-live="polite"
        data-embedded={embedded ? "true" : "false"}
      >
        <AipifyLoadingState message={labels.loading} centered className="bg-transparent" />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="space-y-3 rounded-[var(--app-radius-lg)] border border-[var(--app-border)] bg-[var(--app-card)] px-5 py-5">
        <p className="text-sm text-[var(--app-text)]">{labels.loadError}</p>
        <button
          type="button"
          onClick={() => void refresh()}
          className="inline-flex min-h-11 items-center rounded-[var(--app-radius-md)] bg-[image:var(--app-primary-gradient)] px-3 py-2 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-focus)]"
        >
          {labels.retry}
        </button>
      </div>
    );
  }

  const installed = center?.installed_modules ?? [];
  const installedSummary = summarizeAddonModules(installed);
  const trials = center?.trial_modules ?? [];
  const trialSummary = summarizeAddonModules(trials);

  return (
    <div className="space-y-6">
      <section className="space-y-3" aria-labelledby="modules-installed-heading">
        <h2 id="modules-installed-heading" className="text-lg font-semibold text-[var(--app-text)]">
          {labels.sections.installed}
        </h2>
        {installedSummary.total > 0 ? (
          <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {installedSummary.named.map((mod) => (
              <li
                key={mod.key}
                className="rounded-[var(--app-radius-lg)] border border-[var(--app-border)] bg-[var(--app-card)] p-5 shadow-[var(--app-shadow-card)]"
              >
                <div className="flex items-start gap-3">
                  <Blocks aria-hidden className="mt-0.5 size-5 shrink-0 text-[var(--app-primary)]" strokeWidth={2} />
                  <div>
                    <h3 className="text-base font-semibold text-[var(--app-text)]">{mod.name}</h3>
                    <p className={`mt-1 text-sm ${mod.tone === "active" ? "text-[var(--app-positive)]" : "text-[var(--app-text-muted)]"}`}>
                      {mod.tone === "active" ? labels.statusActive : mod.tone === "trial" ? labels.statusTrial : labels.licensedRecord}
                    </p>
                  </div>
                </div>
              </li>
            ))}
            {installedSummary.unnamedCount > 0 ? (
              <li className="rounded-[var(--app-radius-lg)] border border-[var(--app-border)] bg-[var(--app-card)] p-5 shadow-[var(--app-shadow-card)]">
                <h3 className="text-base font-semibold text-[var(--app-text)]">
                  {labels.activeCount}: {installedSummary.unnamedCount}
                </h3>
                <p className="mt-2 text-sm text-[var(--app-text-muted)]">{labels.unnamedNote}</p>
              </li>
            ) : null}
          </ul>
        ) : (
          <p className="text-sm text-[var(--app-text-muted)]">{labels.emptyAddons}</p>
        )}
      </section>

      {trials.length > 0 ? (
        <section className="space-y-3" aria-labelledby="modules-trials-heading">
          <h2 id="modules-trials-heading" className="text-lg font-semibold text-[var(--app-text)]">
            {labels.sections.trials}
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {trialSummary.named.map((mod) => (
              <li
                key={mod.key}
                className="rounded-[var(--app-radius-lg)] border border-[var(--app-border)] bg-[var(--app-card)] p-5"
              >
                <h3 className="text-base font-semibold text-[var(--app-text)]">{mod.name}</h3>
                <p className="mt-1 text-sm text-[var(--app-pending)]">{labels.statusTrial}</p>
              </li>
            ))}
            {trialSummary.unnamedCount > 0 ? (
              <li className="rounded-[var(--app-radius-lg)] border border-[var(--app-border)] bg-[var(--app-card)] p-5">
                <h3 className="text-base font-semibold text-[var(--app-text)]">
                  {labels.sections.trials}: {trialSummary.unnamedCount}
                </h3>
                <p className="mt-2 text-sm text-[var(--app-text-muted)]">{labels.unnamedNote}</p>
              </li>
            ) : null}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
