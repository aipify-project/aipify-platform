"use client";

import { useCallback, useEffect, useState } from "react";
import type { PilotIntegration } from "@/lib/aipify/pilot";

type TenantIntegrationsPanelProps = {
  tenantId: string;
  labels: Record<string, string>;
};

export function TenantIntegrationsPanel({ tenantId, labels }: TenantIntegrationsPanelProps) {
  const [integrations, setIntegrations] = useState<PilotIntegration[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  const reload = useCallback(async () => {
    const res = await fetch(`/api/aipify/tenants/${tenantId}/integrations`);
    const data = await res.json();
    if (res.ok) setIntegrations(data);
    setLoading(false);
  }, [tenantId]);

  useEffect(() => {
    void reload();
  }, [reload]);

  async function connect(key: string) {
    setBusy(key);
    await fetch(`/api/aipify/tenants/${tenantId}/integrations/${key}/connect`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "connected", connection_mode: "api" }),
    });
    await reload();
    setBusy(null);
  }

  if (loading) return <div className="p-6 text-sm text-gray-600">{labels.loading}</div>;

  return (
    <div className="mx-auto max-w-4xl space-y-4 p-6">
      <h1 className="text-2xl font-semibold">{labels.title}</h1>
      <div className="grid gap-3">
        {integrations.map((i) => (
          <div key={i.integration_key} className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="font-medium">{i.display_name}</h2>
                <p className="text-sm text-gray-600">
                  {i.integration_key} · {i.status}
                </p>
              </div>
              {i.status !== "connected" ? (
                <button
                  type="button"
                  disabled={busy === i.integration_key}
                  onClick={() => void connect(i.integration_key)}
                  className="rounded border border-gray-300 px-3 py-1 text-sm disabled:opacity-50"
                >
                  {labels.testConnection}
                </button>
              ) : null}
            </div>
            {i.error_message ? (
              <p className="mt-2 text-sm text-red-600">{i.error_message}</p>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
