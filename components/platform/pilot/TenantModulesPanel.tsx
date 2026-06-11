"use client";

import { useEffect, useState } from "react";
import type { PilotModule } from "@/lib/aipify/pilot";

type TenantModulesPanelProps = {
  tenantId: string;
  labels: Record<string, string>;
};

export function TenantModulesPanel({ tenantId, labels }: TenantModulesPanelProps) {
  const [modules, setModules] = useState<PilotModule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/aipify/tenants/${tenantId}/modules`);
      const data = await res.json();
      if (res.ok) setModules(data);
      setLoading(false);
    }
    void load();
  }, [tenantId]);

  if (loading) return <div className="p-6 text-sm text-gray-600">{labels.loading}</div>;

  return (
    <div className="mx-auto max-w-4xl space-y-4 p-6">
      <h1 className="text-2xl font-semibold">{labels.title}</h1>
      <div className="grid gap-3">
        {modules.map((m) => (
          <div key={m.module_key} className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-medium">{m.module_key}</h2>
              <span className="text-xs text-gray-500">{m.status}</span>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              {labels.mode}: {m.mode}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
