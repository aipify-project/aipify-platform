"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { getCompanyInstallations } from "@/lib/tenant/get-installations";
import type {
  Installation,
  IntegrationKey,
  IntegrationStatus,
  ModuleKey,
  SystemType,
} from "@/lib/tenant/types";
import InstallationCard from "./InstallationCard";

type InstallsPanelProps = {
  locale: string;
  labels: {
    title: string;
    subtitle: string;
    create: string;
    name: string;
    siteUrl: string;
    systemType: string;
    systemTypes: Record<SystemType, string>;
    empty: string;
    tokenTitle: string;
    tokenHint: string;
    copy: string;
    copied: string;
    status: Record<string, string>;
    verifyEndpoint: string;
    error: string;
    loading: string;
    company: string;
    installationId: string;
    modules: string;
    integrations: string;
    lastSynced: string;
    neverSynced: string;
    modulesList: Record<ModuleKey, string>;
    integrationsList: Record<IntegrationKey, string>;
    integrationStatus: Record<IntegrationStatus, string>;
  };
};

export default function InstallsPanel({ locale, labels }: InstallsPanelProps) {
  const [installations, setInstallations] = useState<Installation[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [siteUrl, setSiteUrl] = useState("");
  const [systemType, setSystemType] = useState<SystemType>("custom");
  const [newToken, setNewToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const rows = await getCompanyInstallations(supabase);
    setInstallations(rows);
    setLoading(false);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadInstallations() {
      const supabase = createClient();
      const rows = await getCompanyInstallations(supabase);
      if (!cancelled) {
        setInstallations(rows);
        setLoading(false);
      }
    }

    void loadInstallations();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setNewToken(null);
    setCreating(true);

    try {
      const response = await fetch("/api/installations/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_type: systemType,
          name: name.trim() || undefined,
          site_url: siteUrl.trim() || undefined,
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        setError(payload.error ?? labels.error);
        return;
      }

      setNewToken(payload.installation_token);
      setName("");
      setSiteUrl("");
      await refresh();
    } catch {
      setError(labels.error);
    } finally {
      setCreating(false);
    }
  }

  async function handleCopy() {
    if (!newToken) return;
    await navigator.clipboard.writeText(newToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const cardLabels = {
    company: labels.company,
    installationId: labels.installationId,
    systemType: labels.systemType,
    status: labels.status,
    systemTypes: labels.systemTypes,
    modules: labels.modules,
    integrations: labels.integrations,
    lastSynced: labels.lastSynced,
    neverSynced: labels.neverSynced,
    modulesList: labels.modulesList,
    integrationsList: labels.integrationsList,
    integrationStatus: labels.integrationStatus,
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          {labels.title}
        </h1>
        <p className="mt-2 text-base text-gray-500 sm:text-lg">{labels.subtitle}</p>
      </div>

      <form
        onSubmit={handleCreate}
        className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="installName" className="block text-sm font-medium text-gray-700">
              {labels.name}
            </label>
            <input
              id="installName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Unonight.com"
              className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-violet-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-100"
            />
          </div>
          <div>
            <label htmlFor="siteUrl" className="block text-sm font-medium text-gray-700">
              {labels.siteUrl}
            </label>
            <input
              id="siteUrl"
              type="url"
              value={siteUrl}
              onChange={(e) => setSiteUrl(e.target.value)}
              placeholder="https://unonight.com"
              className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-violet-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-100"
            />
          </div>
          <div>
            <label htmlFor="systemType" className="block text-sm font-medium text-gray-700">
              {labels.systemType}
            </label>
            <select
              id="systemType"
              value={systemType}
              onChange={(e) => setSystemType(e.target.value as SystemType)}
              className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-violet-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-100"
            >
              {(Object.keys(labels.systemTypes) as SystemType[]).map((type) => (
                <option key={type} value={type}>
                  {labels.systemTypes[type]}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={creating}
              className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:from-blue-700 hover:to-violet-700 disabled:opacity-60"
            >
              {creating ? labels.loading : labels.create}
            </button>
          </div>
        </div>
        {error && (
          <p className="mt-4 text-sm font-medium text-red-600" role="alert">
            {error}
          </p>
        )}
      </form>

      {newToken && (
        <div className="mb-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
          <h2 className="text-sm font-semibold text-emerald-900">
            {labels.tokenTitle}
          </h2>
          <p className="mt-2 break-all rounded-lg bg-white px-3 py-2 font-mono text-xs text-gray-800">
            {newToken}
          </p>
          <p className="mt-3 text-sm text-emerald-800">{labels.tokenHint}</p>
          <p className="mt-2 text-xs text-emerald-700">
            POST {labels.verifyEndpoint}
          </p>
          <button
            type="button"
            onClick={handleCopy}
            className="mt-4 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800"
          >
            {copied ? labels.copied : labels.copy}
          </button>
        </div>
      )}

      {loading ? (
        <p className="text-sm text-gray-500">{labels.loading}</p>
      ) : installations.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/80 p-6 text-sm text-gray-500">
          {labels.empty}
        </div>
      ) : (
        <div className="space-y-6">
          {installations.map((installation) => (
            <InstallationCard
              key={installation.id}
              installation={installation}
              labels={cardLabels}
              locale={locale}
            />
          ))}
        </div>
      )}
    </div>
  );
}
