"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseSecretReferences, type SecretReference } from "@/lib/aipify/security-compliance";

type SecuritySecretsPanelProps = {
  labels: Record<string, string>;
};

export function SecuritySecretsPanel({ labels }: SecuritySecretsPanelProps) {
  const [secrets, setSecrets] = useState<SecretReference[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/security/secrets");
    if (res.ok) {
      const data = await res.json();
      setSecrets(data.secrets ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function rotate(id: string) {
    await fetch(`/api/aipify/security/secrets/${id}/rotate`, { method: "POST" });
    await load();
  }

  async function revoke(id: string) {
    await fetch(`/api/aipify/security/secrets/${id}/revoke`, { method: "POST" });
    await load();
  }

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{labels.title}</h1>
        <Link href="/app/security" className="text-sm text-rose-700">{labels.back}</Link>
      </div>
      <p className="text-sm text-gray-600">{labels.subtitle}</p>
      <p className="rounded border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">{labels.noRawSecrets}</p>

      {secrets.length === 0 ? (
        <p className="text-sm text-gray-500">{labels.noSecrets}</p>
      ) : (
        <ul className="space-y-3">
          {secrets.map((s) => (
            <li key={s.id} className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-medium">{s.secret_key}</p>
                  <p className="text-xs text-gray-500">{s.provider} · {s.purpose} · <span className="capitalize">{s.status}</span></p>
                </div>
                {s.status === "active" ? (
                  <div className="flex gap-2 text-sm">
                    <button type="button" onClick={() => void rotate(s.id)} className="text-indigo-700">{labels.rotate}</button>
                    <button type="button" onClick={() => void revoke(s.id)} className="text-red-700">{labels.revoke}</button>
                  </div>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
