"use client";

import { useCallback, useEffect, useState } from "react";
import type { OrganizationSummary } from "@/lib/aipify/multi-tenant-architecture";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import { AipifyLoader } from "@/components/ui/aipify-loader";

export type AppTenantBootstrapSurfaceProps = {
  state: "selection_required" | "membership_missing";
  labels: {
    titleSelectionRequired: string;
    messageSelectionRequired: string;
    titleMembershipMissing: string;
    messageMembershipMissing: string;
    selectOrganization: string;
    switching: string;
    switchFailed: string;
    retry: string;
  };
};

export function AppTenantBootstrapSurface({ state, labels }: AppTenantBootstrapSurfaceProps) {
  const [organizations, setOrganizations] = useState<OrganizationSummary[]>([]);
  const [loading, setLoading] = useState(state === "selection_required");
  const [loadFailed, setLoadFailed] = useState(false);
  const [switchingId, setSwitchingId] = useState<string | null>(null);
  const [switchFailed, setSwitchFailed] = useState(false);

  const loadOrganizations = useCallback(async () => {
    if (state !== "selection_required") {
      setLoading(false);
      return;
    }

    setLoading(true);
    setLoadFailed(false);
    try {
      const res = await fetch("/api/organizations", { cache: "no-store" });
      if (!res.ok) {
        setLoadFailed(true);
        setOrganizations([]);
        return;
      }
      const data = (await res.json()) as {
        organizations?: OrganizationSummary[];
      };
      setOrganizations(Array.isArray(data.organizations) ? data.organizations : []);
    } catch {
      setLoadFailed(true);
      setOrganizations([]);
    } finally {
      setLoading(false);
    }
  }, [state]);

  useEffect(() => {
    void loadOrganizations();
  }, [loadOrganizations]);

  async function handleSelectOrganization(organizationId: string) {
    setSwitchingId(organizationId);
    setSwitchFailed(false);
    try {
      const res = await fetch("/api/organizations/switch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ organization_id: organizationId }),
      });
      if (!res.ok) {
        setSwitchFailed(true);
        return;
      }
      window.location.reload();
    } catch {
      setSwitchFailed(true);
    } finally {
      setSwitchingId(null);
    }
  }

  if (state === "membership_missing") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-6 py-12">
        <PlatformEmptyState
          title={labels.titleMembershipMissing}
          message={labels.messageMembershipMissing}
          className="w-full max-w-xl bg-[var(--aipify-surface)]"
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-6 py-12">
        <AipifyLoader centered />
      </div>
    );
  }

  if (loadFailed) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-6 py-12">
        <PlatformEmptyState
          title={labels.titleSelectionRequired}
          message={labels.switchFailed}
          primaryAction={{ label: labels.retry, onClick: () => void loadOrganizations() }}
          className="w-full max-w-xl bg-[var(--aipify-surface)]"
        />
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-xl flex-col justify-center px-6 py-12">
      <div className="rounded-2xl border border-[var(--aipify-border)] bg-[var(--aipify-surface)] p-6 shadow-sm">
        <h1 className="text-xl font-semibold tracking-tight text-[var(--aipify-text-primary)]">
          {labels.titleSelectionRequired}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-[var(--aipify-text-secondary)]">
          {labels.messageSelectionRequired}
        </p>

        <ul className="mt-6 divide-y divide-[var(--aipify-border)] rounded-xl border border-[var(--aipify-border)]" role="listbox" aria-label={labels.selectOrganization}>
          {organizations.map((org) => {
            const busy = switchingId === org.id;
            return (
              <li key={org.id}>
                <button
                  type="button"
                  role="option"
                  disabled={switchingId != null}
                  aria-selected={false}
                  onClick={() => void handleSelectOrganization(org.id)}
                  className="flex w-full flex-col px-4 py-3 text-left transition hover:bg-[var(--aipify-surface-muted)] disabled:cursor-wait disabled:opacity-60"
                >
                  <span className="text-sm font-medium text-[var(--aipify-text-primary)]">
                    {busy ? labels.switching : org.name}
                  </span>
                  <span className="mt-0.5 text-xs capitalize text-[var(--aipify-text-muted)]">
                    {org.role.replace(/_/g, " ")}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        {switchFailed ? (
          <p className="mt-4 text-sm text-[var(--aipify-text-secondary)]" role="alert">
            {labels.switchFailed}
          </p>
        ) : null}
      </div>
    </div>
  );
}
