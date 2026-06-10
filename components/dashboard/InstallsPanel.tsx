"use client";

import { useCallback, useEffect, useState } from "react";
import { AipifyEmptyState } from "@/components/branding";
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
import InstallationWizard from "./InstallationWizard";
import type { InstallationWizardLabels } from "@/lib/platform/installation-engine";

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
    pulseLabel: string;
    connectionSuccess: string;
    wizard: InstallationWizardLabels;
  };
};

export default function InstallsPanel({ locale, labels }: InstallsPanelProps) {
  const [installations, setInstallations] = useState<Installation[]>([]);
  const [loading, setLoading] = useState(true);

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

      <div className="mb-8">
        <InstallationWizard
          locale={locale}
          labels={labels.wizard}
          onComplete={() => void refresh()}
        />
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">{labels.loading}</p>
      ) : installations.length === 0 ? (
        <AipifyEmptyState message={labels.empty} pulseLabel={labels.pulseLabel} />
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
