"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseModulesCenter, type ModulesCenter } from "@/lib/commercial-packages";

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
    sections: {
      installed: string;
      available: string;
      trials: string;
      recommendations: string;
      packages: string;
      flags: string;
    };
  };
};

export function ModulesAdminPanel({ labels }: ModulesAdminPanelProps) {
  const [center, setCenter] = useState<ModulesCenter | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const res = await fetch("/api/commercial-packages/modules");
    if (res.ok) setCenter(parseModulesCenter(await res.json()));
    setLoading(false);
  }, []);

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

  if (loading) return <div className="p-6 text-sm text-gray-600">{labels.loading}</div>;

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div>
        <Link href="/app/settings" className="text-sm text-indigo-600 hover:underline">
          ← {labels.back}
        </Link>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
        {center?.documentation_note && (
          <p className="mt-2 text-sm text-gray-500">{center.documentation_note}</p>
        )}
        <div className="mt-3">
          <Link href="/app/settings/billing" className="text-sm text-indigo-600 hover:underline">
            {labels.viewBilling}
          </Link>
        </div>
      </div>

      <section className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5">
        <h2 className="font-semibold text-indigo-900">{labels.sections.installed}</h2>
        <p className="mt-1 text-sm text-gray-600">Package: {center?.current_package}</p>
        <ul className="mt-3 max-h-64 space-y-2 overflow-auto text-sm">
          {center?.installed_modules?.map((mod) => {
            const key = String(mod.module_key);
            const isEnabled = Boolean(mod.enabled);
            return (
              <li
                key={key}
                className="flex items-center justify-between rounded-lg bg-white px-3 py-2"
              >
                <span>
                  {key}{" "}
                  <span className="text-xs text-gray-500">({String(mod.status)})</span>
                </span>
                <button
                  type="button"
                  onClick={() => void toggleModule(key, !isEnabled)}
                  className="text-xs text-indigo-600 hover:underline"
                >
                  {isEnabled ? labels.disable : labels.enable}
                </button>
              </li>
            );
          }) ?? <li className="text-gray-500">{labels.empty}</li>}
        </ul>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.sections.available}</h2>
        <ul className="mt-2 space-y-1 text-sm text-gray-600">
          {center?.available_modules?.map((mod) => (
            <li key={String(mod.module_key)}>{String(mod.module_key)} — upgrade required</li>
          )) ?? <li>{labels.empty}</li>}
        </ul>
      </section>

      <section className="rounded-2xl border border-amber-100 bg-amber-50/40 p-5">
        <h2 className="font-semibold text-amber-900">{labels.sections.trials}</h2>
        <ul className="mt-2 space-y-1 text-sm">
          {center?.trial_modules?.map((mod) => (
            <li key={String(mod.module_key)}>{String(mod.module_key)}</li>
          )) ?? <li className="text-gray-500">{labels.empty}</li>}
        </ul>
      </section>

      <section className="rounded-2xl border border-sky-100 bg-sky-50/40 p-5">
        <h2 className="font-semibold text-sky-900">{labels.sections.recommendations}</h2>
        <ul className="mt-2 space-y-2 text-sm">
          {center?.upgrade_recommendations?.map((rec, i) => (
            <li key={i} className="rounded-lg bg-white px-3 py-2">
              {String(rec.package_key)} — {String(rec.reason)}
            </li>
          )) ?? <li className="text-gray-500">{labels.empty}</li>}
        </ul>
      </section>

      <section className="rounded-2xl border border-violet-100 bg-violet-50/40 p-5">
        <h2 className="font-semibold text-violet-900">{labels.sections.packages}</h2>
        <ul className="mt-2 space-y-1 text-sm">
          {center?.packages?.map((pkg) => (
            <li key={String(pkg.package_key)}>
              {String(pkg.package_name)} ({String(pkg.module_count)} modules)
            </li>
          ))}
        </ul>
      </section>

      {Array.isArray(center?.feature_flag_states) && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-gray-900">{labels.sections.flags}</h2>
          <p className="mt-2 text-sm text-gray-600">
            {center.feature_flag_states.join(" · ")}
          </p>
        </section>
      )}
    </div>
  );
}
