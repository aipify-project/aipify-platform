"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseEnterpriseConnectors, type EnterpriseConnector } from "@/lib/aipify/enterprise";

type EnterpriseConnectorsPanelProps = {
  labels: Record<string, string>;
};

export function EnterpriseConnectorsPanel({ labels }: EnterpriseConnectorsPanelProps) {
  const [connectors, setConnectors] = useState<EnterpriseConnector[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/enterprise/connectors");
    if (res.ok) {
      const data = await res.json();
      setConnectors(data.connectors ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{labels.title}</h1>
        <Link href="/app/enterprise" className="text-sm text-indigo-700">{labels.back}</Link>
      </div>
      <p className="text-sm text-gray-600">{labels.subtitle}</p>

      <ul className="space-y-3">
        {connectors.map((c) => (
          <li key={c.connector_key} className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-medium">{c.display_name}</p>
                <p className="text-xs capitalize text-gray-500">{c.status.replace(/_/g, " ")}</p>
                <p className="text-xs text-gray-500">
                  {c.requires_agent ? labels.requiresAgent : labels.cloudOk} · {c.supported_deployment_modes.join(", ")}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
