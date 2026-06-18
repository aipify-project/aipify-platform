"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseRouteRegistryDashboard, type BuildGovernanceLabels } from "@/lib/build-governance";

type RouteRegistryPanelProps = {
  labels: BuildGovernanceLabels;
  backHref: string;
};

export function RouteRegistryPanel({ labels, backHref }: RouteRegistryPanelProps) {
  const [category, setCategory] = useState("all");
  const [registry, setRegistry] = useState<ReturnType<typeof parseRouteRegistryDashboard> | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(
      `/api/platform/build-governance/registry${category !== "all" ? `?category=${category}` : ""}`
    );
    if (res.ok) setRegistry(parseRouteRegistryDashboard(await res.json()));
    setLoading(false);
  }, [category]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <div>
        <Link href={backHref} className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
          ← {labels.back}
        </Link>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900">{labels.registryTitle}</h1>
        <p className="mt-2 max-w-3xl text-zinc-600">{labels.registrySubtitle}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setCategory("all")}
          className={`rounded-full px-3 py-1.5 text-sm ${category === "all" ? "bg-indigo-600 text-white" : "bg-zinc-100 text-zinc-700"}`}
        >
          {labels.registry.filterAll}
        </button>
        {Object.entries(labels.categories).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setCategory(key)}
            className={`rounded-full px-3 py-1.5 text-sm ${category === key ? "bg-indigo-600 text-white" : "bg-zinc-100 text-zinc-700"}`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading && !registry ? (
        <p className="text-sm text-zinc-500">{labels.loading}</p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-zinc-200 text-sm">
            <thead className="bg-zinc-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-zinc-600">{labels.registry.route}</th>
                <th className="px-4 py-3 text-left font-medium text-zinc-600">{labels.registry.owner}</th>
                <th className="px-4 py-3 text-left font-medium text-zinc-600">{labels.registry.module}</th>
                <th className="px-4 py-3 text-left font-medium text-zinc-600">{labels.registry.modified}</th>
                <th className="px-4 py-3 text-left font-medium text-zinc-600">{labels.registry.status}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {(registry?.routes ?? []).slice(0, 200).map((route) => (
                <tr key={route.id}>
                  <td className="px-4 py-3">
                    <div className="font-medium text-zinc-900">{route.urlPattern}</div>
                    <div className="text-xs text-zinc-500">{route.filePath}</div>
                  </td>
                  <td className="px-4 py-3 text-zinc-700">{route.owner}</td>
                  <td className="px-4 py-3 text-zinc-700">{route.module}</td>
                  <td className="px-4 py-3 text-zinc-500">
                    {route.lastModified ? new Date(route.lastModified).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        route.status === "legacy"
                          ? "bg-amber-50 text-amber-800"
                          : route.status === "warning"
                            ? "bg-orange-50 text-orange-800"
                            : "bg-emerald-50 text-emerald-700"
                      }`}
                    >
                      {route.statusLabel}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
