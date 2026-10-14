"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import { resolveCustomerFacingModuleName } from "@/lib/app-portal/software-catalog/module-presentation";
import { parseModulesCenter, type ModulesCenter } from "@/lib/commercial-packages";
import { AppLayoutClasses } from "@/lib/design/app-layout";
import Link from "next/link";
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
  };
  /** Job 61 — inside AppHubShell / product Modules page. */
  embedded?: boolean;
};

function ModuleGlyph({ kind }: { kind: "active" | "available" | "trial" | "planned" }) {
  const color =
    kind === "active"
      ? "text-emerald-700"
      : kind === "trial"
        ? "text-amber-700"
        : kind === "planned"
          ? "text-slate-500"
          : "text-indigo-700";
  return (
    <span
      className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border border-current/20 bg-white ${color}`}
      aria-hidden
    >
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 7.5h15v9h-15z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 7.5V5.25h7.5V7.5" />
      </svg>
    </span>
  );
}

function moduleDisplayName(
  mod: Record<string, unknown>,
  unnamedFallback: string,
): string {
  const key = String(mod.module_key ?? "");
  return (
    resolveCustomerFacingModuleName({
      moduleKey: key,
      moduleName: typeof mod.module_name === "string" ? mod.module_name : null,
      name: typeof mod.name === "string" ? mod.name : null,
    }) ?? unnamedFallback
  );
}

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
      const payload = (await res.json()) as { error?: string };
      setLoadError(
        typeof payload.error === "string" ? payload.error : labels.loadError,
      );
      setCenter(null);
    }
    setLoading(false);
  }, [labels.loadError]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function toggleModule(moduleKey: string, enabled: boolean) {
    await fetch("/api/commercial-packages/modules", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ module_key: moduleKey, enabled }),
    });
    await refresh();
  }

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;

  if (loadError) {
    return (
      <div
        className={
          embedded
            ? "w-full space-y-4"
            : `${AppLayoutClasses.pageWidth} ${AppLayoutClasses.pagePaddingX} space-y-4 pb-10 pt-6`
        }
      >
        {!embedded ? (
          <>
            <Link href="/app/settings" className="text-sm text-indigo-600 hover:underline">
              ← {labels.back}
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
          </>
        ) : null}
        <p className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">{loadError}</p>
        <button
          type="button"
          onClick={() => void refresh()}
          className="rounded-lg bg-[#7C3AED] px-4 py-2 text-sm font-medium text-white hover:bg-[#6D28D9]"
        >
          {labels.retry}
        </button>
      </div>
    );
  }

  const planned = [
    { id: "design_studio", ...labels.plannedProducts.designStudio },
    { id: "ai_translator", ...labels.plannedProducts.aiTranslator },
  ];

  return (
    <div
      className={
        embedded
          ? "w-full space-y-8"
          : `${AppLayoutClasses.pageWidth} ${AppLayoutClasses.pagePaddingX} space-y-8 pb-10 pt-6`
      }
    >
      {!embedded ? (
        <div>
          <Link href="/app/settings" className="text-sm text-indigo-600 hover:underline">
            ← {labels.back}
          </Link>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
          <p className="mt-2 text-base text-gray-600">{labels.subtitle}</p>
          {center?.documentation_note && (
            <p className="mt-2 text-sm text-gray-500">{center.documentation_note}</p>
          )}
          <div className="mt-3">
            <Link href="/app/account/subscription" className="text-sm font-medium text-indigo-600 hover:underline">
              {labels.viewBilling}
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {center?.documentation_note ? (
            <p className="text-sm text-gray-500">{center.documentation_note}</p>
          ) : null}
          <Link
            href="/app/account/subscription"
            className="text-sm font-medium text-indigo-600 hover:underline"
          >
            {labels.viewBilling}
          </Link>
        </div>
      )}

      <section className="space-y-3">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <h2 className="text-lg font-semibold text-gray-900">{labels.sections.installed}</h2>
          <p className="text-sm text-gray-500">
            {labels.openManage}: {String(center?.current_package ?? "—")}
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {center?.installed_modules?.length ? (
            center.installed_modules.map((mod) => {
              const key = String(mod.module_key);
              const isEnabled = Boolean(mod.enabled);
              return (
                <article
                  key={key}
                  className="flex h-full flex-col rounded-2xl border border-indigo-100 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <ModuleGlyph kind="active" />
                    <div className="min-w-0">
                      <h3 className="text-base font-semibold text-gray-900">{moduleDisplayName(mod, labels.unnamedModule)}</h3>
                      <p className="mt-1 text-sm text-emerald-800">{labels.statusActive}</p>
                    </div>
                  </div>
                  <div className="mt-auto pt-5">
                    <button
                      type="button"
                      onClick={() => void toggleModule(key, !isEnabled)}
                      className="rounded-xl border border-indigo-200 bg-indigo-50 px-3.5 py-2 text-sm font-medium text-indigo-800 hover:bg-indigo-100"
                    >
                      {isEnabled ? labels.disable : labels.enable}
                    </button>
                  </div>
                </article>
              );
            })
          ) : (
            <p className="text-sm text-gray-500 sm:col-span-2">{labels.empty}</p>
          )}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-900">{labels.sections.available}</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {center?.available_modules?.length ? (
            center.available_modules.map((mod) => (
              <article
                key={String(mod.module_key)}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <ModuleGlyph kind="available" />
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">{moduleDisplayName(mod, labels.unnamedModule)}</h3>
                    <p className="mt-1 text-sm text-gray-600">{labels.upgradeRequired}</p>
                    <p className="mt-2 text-sm text-indigo-700">{labels.statusAvailable}</p>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <p className="text-sm text-gray-500">{labels.empty}</p>
          )}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-amber-900">{labels.sections.trials}</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {center?.trial_modules?.length ? (
            center.trial_modules.map((mod) => (
              <article
                key={String(mod.module_key)}
                className="rounded-2xl border border-amber-100 bg-amber-50/40 p-5"
              >
                <div className="flex items-start gap-3">
                  <ModuleGlyph kind="trial" />
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">{moduleDisplayName(mod, labels.unnamedModule)}</h3>
                    <p className="mt-1 text-sm text-amber-800">{labels.statusTrial}</p>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <p className="text-sm text-gray-500">{labels.empty}</p>
          )}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-900">{labels.plannedSection}</h2>
        <p className="text-sm text-gray-600">{labels.plannedHint}</p>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {planned.map((product) => (
            <article
              key={product.id}
              className="flex h-full flex-col rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 p-5"
            >
              <div className="flex items-start gap-3">
                <ModuleGlyph kind="planned" />
                <div>
                  <h3 className="text-base font-semibold text-gray-900">{product.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">{product.description}</p>
                </div>
              </div>
              <div className="mt-auto pt-5">
                <span className="inline-flex rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm font-medium text-slate-600">
                  {labels.plannedCta}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {center?.packages && center.packages.length > 0 ? (
        <section className="rounded-2xl border border-violet-100 bg-violet-50/40 p-5">
          <h2 className="font-semibold text-violet-900">{labels.sections.packages}</h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {center.packages.map((pkg) => (
              <li key={String(pkg.package_key)} className="rounded-lg bg-white px-3 py-2 text-sm">
                {String(pkg.package_name)} ({String(pkg.module_count)} modules)
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
