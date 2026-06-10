"use client";

import { useCallback, useEffect, useState } from "react";
import { AipifyEmptyState } from "@/components/branding";
import { TOKEN_SECURITY_RULES } from "@/lib/install/token-policy";
import { getCompanyInstallations } from "@/lib/tenant/get-installations";
import type { Installation } from "@/lib/tenant/types";
import { createClient } from "@/lib/supabase/client";

type DeveloperSettingsPanelProps = {
  labels: {
    title: string;
    subtitle: string;
    loading: string;
    empty: string;
    pulseLabel: string;
    advancedNotice: string;
    tokens: string;
    tokensHint: string;
    rotate: string;
    rotating: string;
    rotated: string;
    rotateError: string;
    apiKeys: string;
    apiKeysHint: string;
    sdk: string;
    sdkHint: string;
    diagnostics: string;
    diagnosticsHint: string;
    securityRules: string;
    installations: string;
    noInstallations: string;
    tokenMasked: string;
  };
};

export function DeveloperSettingsPanel({ labels }: DeveloperSettingsPanelProps) {
  const [installations, setInstallations] = useState<Installation[]>([]);
  const [loading, setLoading] = useState(true);
  const [rotatingId, setRotatingId] = useState<string | null>(null);
  const [revealedToken, setRevealedToken] = useState<{
    installationId: string;
    token: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const rows = await getCompanyInstallations(supabase);
    setInstallations(rows);
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function handleRotate(installationId: string) {
    setRotatingId(installationId);
    setError(null);
    setRevealedToken(null);

    const res = await fetch(`/api/installations/${installationId}/rotate-token`, {
      method: "POST",
    });

    setRotatingId(null);

    if (!res.ok) {
      setError(labels.rotateError);
      return;
    }

    const data = (await res.json()) as { installation_token?: string };
    if (data.installation_token) {
      setRevealedToken({
        installationId,
        token: data.installation_token,
      });
    }
    await refresh();
  }

  if (loading) {
    return <div className="p-6 text-sm text-gray-600">{labels.loading}</div>;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8 p-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-sm text-gray-600">{labels.subtitle}</p>
        <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          {labels.advancedNotice}
        </p>
      </div>

      <section className="rounded-lg border border-gray-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-gray-900">{labels.tokens}</h2>
        <p className="mt-1 text-sm text-gray-600">{labels.tokensHint}</p>

        {installations.length === 0 ? (
          <div className="mt-4">
            <AipifyEmptyState message={labels.noInstallations} pulseLabel={labels.pulseLabel} />
          </div>
        ) : (
          <ul className="mt-4 divide-y divide-gray-100">
            {installations.map((install) => (
              <li key={install.id} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
                <div>
                  <div className="font-medium text-gray-900">
                    {install.name ?? install.site_url ?? install.id}
                  </div>
                  <div className="text-gray-500">{labels.tokenMasked}</div>
                </div>
                <button
                  type="button"
                  disabled={rotatingId === install.id}
                  onClick={() => void handleRotate(install.id)}
                  className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  {rotatingId === install.id ? labels.rotating : labels.rotate}
                </button>
              </li>
            ))}
          </ul>
        )}

        {revealedToken && (
          <div className="mt-4 rounded-lg border border-indigo-200 bg-indigo-50 p-4 text-sm">
            <p className="font-medium text-indigo-900">{labels.rotated}</p>
            <code className="mt-2 block break-all text-xs text-indigo-800">
              {revealedToken.token}
            </code>
          </div>
        )}
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-gray-900">{labels.apiKeys}</h2>
        <p className="mt-1 text-sm text-gray-600">{labels.apiKeysHint}</p>
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-gray-900">{labels.sdk}</h2>
        <p className="mt-1 text-sm text-gray-600">{labels.sdkHint}</p>
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-gray-900">{labels.diagnostics}</h2>
        <p className="mt-1 text-sm text-gray-600">{labels.diagnosticsHint}</p>
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-gray-900">{labels.securityRules}</h2>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-gray-600">
          {TOKEN_SECURITY_RULES.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
