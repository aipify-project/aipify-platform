"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  parseCustomerModuleRegistryCenter,
  type CustomerModuleRegistryCenter,
} from "@/lib/module-registry";
import type { ModuleRegistryLabels } from "@/lib/module-registry/labels";

export function ModuleAccessPanel({ labels }: { labels: ModuleRegistryLabels }) {
  const [center, setCenter] = useState<CustomerModuleRegistryCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/app/module-registry");
    if (res.ok) setCenter(parseCustomerModuleRegistryCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  async function updateGrant(moduleKey: string, roleKey: string, field: "can_view" | "can_use" | "can_manage", value: boolean) {
    const existing = center?.roleGrants.find((g) => g.moduleKey === moduleKey && g.roleKey === roleKey);
    const payload = {
      module_key: moduleKey,
      role_key: roleKey,
      can_view: field === "can_view" ? value : existing?.canView ?? false,
      can_use: field === "can_use" ? value : existing?.canUse ?? false,
      can_manage: field === "can_manage" ? value : existing?.canManage ?? false,
    };
    await fetch("/api/app/module-registry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action_type: "update_role_grant", payload }),
    });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
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
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-950">
        <p className="font-medium">{labels.accessDenied}</p>
        {center?.error ? <p className="mt-2 text-sm">{center.error}</p> : null}
      </div>
    );
  }

  const packModules = center.navigationModules.filter((m) => m.requiredBusinessPack);
  const coreModules = center.navigationModules.filter((m) => !m.requiredBusinessPack);

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      <div>
        <Link href="/app/settings" className="text-sm text-indigo-600 hover:underline">← {labels.back}</Link>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
        {center.principle ? <p className="mt-3 text-sm font-medium text-violet-800">{center.principle}</p> : null}
        <p className="mt-1 text-xs text-zinc-500">{labels.singleAppRule}</p>
        {!center.appLicenseActive ? (
          <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">{labels.appSuspended}</p>
        ) : null}
      </div>

      <section className="rounded-2xl border border-indigo-100 bg-indigo-50/30 p-5">
        <h2 className="font-semibold text-indigo-950">{labels.coreModules}</h2>
        <ModuleGrantTable
          modules={coreModules}
          roles={center.supportedRoles}
          grants={center.roleGrants}
          labels={labels}
          onToggle={updateGrant}
          licenseActive={center.appLicenseActive ?? true}
        />
      </section>

      {packModules.length > 0 ? (
        <section className="rounded-2xl border border-violet-100 bg-violet-50/30 p-5">
          <h2 className="font-semibold text-violet-950">{labels.packModules}</h2>
          <ModuleGrantTable
            modules={packModules}
            roles={center.supportedRoles}
            grants={center.roleGrants}
            labels={labels}
            onToggle={updateGrant}
            licenseActive={center.appLicenseActive ?? true}
          />
        </section>
      ) : null}

      {saved ? <p className="text-sm text-emerald-700">{labels.saved}</p> : null}
      {center.privacyNote ? <p className="text-xs text-zinc-500">{center.privacyNote}</p> : null}
    </div>
  );
}

function ModuleGrantTable({
  modules,
  roles,
  grants,
  labels,
  onToggle,
  licenseActive,
}: {
  modules: CustomerModuleRegistryCenter["navigationModules"];
  roles: string[];
  grants: CustomerModuleRegistryCenter["roleGrants"];
  labels: ModuleRegistryLabels;
  onToggle: (moduleKey: string, roleKey: string, field: "can_view" | "can_use" | "can_manage", value: boolean) => Promise<void>;
  licenseActive: boolean;
}) {
  const employeeRoles = roles.filter((r) => !["owner", "administrator"].includes(r));

  return (
    <div className="mt-4 overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead>
          <tr className="text-xs uppercase text-zinc-500">
            <th className="py-2 pr-4">{labels.modules}</th>
            {employeeRoles.map((role) => (
              <th key={role} className="px-2 py-2 capitalize">{role.replace(/_/g, " ")}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {modules.map((mod) => {
            const active = licenseActive && mod.menuVisible !== false && mod.licensed !== false;
            return (
              <tr key={mod.moduleKey} className={active ? "" : "opacity-50"}>
                <td className="py-3 pr-4">
                  <p className="font-medium text-zinc-900">{mod.moduleName}</p>
                  {mod.requiredBusinessPack ? (
                    <p className="text-xs text-zinc-500">{labels.businessPack}: {mod.requiredBusinessPack}</p>
                  ) : null}
                </td>
                {employeeRoles.map((role) => {
                  const grant = grants.find((g) => g.moduleKey === mod.moduleKey && g.roleKey === role);
                  return (
                    <td key={role} className="px-2 py-3">
                      <label className="flex items-center gap-1 text-xs">
                        <input
                          type="checkbox"
                          checked={grant?.canView ?? false}
                          disabled={!active}
                          onChange={(e) => void onToggle(mod.moduleKey, role, "can_view", e.target.checked)}
                        />
                        {labels.canView}
                      </label>
                      <label className="mt-1 flex items-center gap-1 text-xs">
                        <input
                          type="checkbox"
                          checked={grant?.canUse ?? false}
                          disabled={!active}
                          onChange={(e) => void onToggle(mod.moduleKey, role, "can_use", e.target.checked)}
                        />
                        {labels.canUse}
                      </label>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
