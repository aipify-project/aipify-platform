"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import type { DynamicNavigationLabels } from "@/lib/dynamic-navigation";
import {
  parseNavigationPreferencesCenter,
  type DynamicAppNavigation,
  type NavigationPreferencesCenter,
} from "@/lib/dynamic-navigation";
import { AipifyModuleAccessDenied } from "@/components/ui/aipify-module-access-denied";

export function NavigationPreferencesPanel({ labels }: { labels: DynamicNavigationLabels }) {
  const [center, setCenter] = useState<NavigationPreferencesCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/app/navigation/preferences");
    if (res.ok) setCenter(parseNavigationPreferencesCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  async function action(actionType: string, navKey: string) {
    setBusy(true);
    await fetch("/api/app/navigation/preferences", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action_type: actionType, payload: { nav_key: navKey } }),
    });
    setBusy(false);
    await load();
  }

  if (loading && !center) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <AipifyLoader centered />
      </div>
    );
  }

  if (!center?.found) {
    return (
      <AipifyModuleAccessDenied message={labels.accessDenied} />
    );
  }

  const nav = center.navigation as DynamicAppNavigation | undefined;
  const hiddenKeys = new Set((center.owner_preferences ?? []).filter((p) => p.hidden).map((p) => p.nav_key));

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div>
        <Link href="/app/settings" className="text-sm text-indigo-600 hover:underline">← {labels.back}</Link>
        <h1 className="mt-2 text-2xl font-bold text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
        {center.principle ? <p className="mt-2 text-sm font-medium text-violet-800">{center.principle}</p> : null}
        {nav?.suspended ? (
          <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            {nav.suspended_notice ?? labels.suspendedNotice}
          </p>
        ) : null}
      </div>

      {nav?.personalization?.pinned?.length ? (
        <section className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-4">
          <h2 className="text-sm font-semibold text-indigo-950">{labels.pinnedModules}</h2>
          <ul className="mt-2 space-y-1 text-sm text-indigo-900">
            {nav.personalization.pinned.map((item) => (
              <li key={item.nav_key}>{item.label}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="rounded-xl border border-gray-200 bg-white p-4">
        <h2 className="font-semibold text-gray-900">{labels.allModules}</h2>
        <p className="mt-1 text-xs text-gray-500">
          {nav?.layout_mode === "flat" ? labels.layoutFlat : labels.layoutGrouped} · {nav?.visibility_rule}
        </p>
        <ul className="mt-4 space-y-2">
          {(nav?.categories ?? []).flatMap((cat) =>
            (cat.items ?? []).map((item) => (
              <li key={item.nav_key} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-gray-100 px-3 py-2">
                <div>
                  <p className="font-medium text-gray-900">{item.label}</p>
                  <p className="text-xs text-gray-500">{item.href}</p>
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  <button type="button" disabled={busy} onClick={() => void action("pin_module", item.nav_key)} className="text-indigo-700 hover:underline disabled:opacity-60">
                    {labels.pinModule}
                  </button>
                  <button type="button" disabled={busy} onClick={() => void action("set_default_landing", item.nav_key)} className="text-indigo-700 hover:underline disabled:opacity-60">
                    {labels.setLanding}
                  </button>
                  {hiddenKeys.has(item.nav_key) ? (
                    <button type="button" disabled={busy} onClick={() => void action("show_module", item.nav_key)} className="text-emerald-700 hover:underline disabled:opacity-60">
                      {labels.showModule}
                    </button>
                  ) : (
                    <button type="button" disabled={busy} onClick={() => void action("hide_module", item.nav_key)} className="text-rose-700 hover:underline disabled:opacity-60">
                      {labels.hideModule}
                    </button>
                  )}
                </div>
              </li>
            )),
          )}
        </ul>
      </section>
    </div>
  );
}
