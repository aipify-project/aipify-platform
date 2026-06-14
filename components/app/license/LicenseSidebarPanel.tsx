"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyPulse } from "@/components/branding";
import { AIPIFY_BRAND } from "@/lib/branding/tokens";
import { formatSoftwareVersion } from "@/lib/license";
import { resolveAppHref } from "@/lib/app/route-aliases";
import {
  CACHE_TTL_LICENSE_MS,
  dedupeFetch,
  getCachedValue,
  setCachedValue,
} from "@/lib/polling";
import { createClient } from "@/lib/supabase/client";

type LicenseSidebarPanelProps = {
  labels: {
    workspace: string;
    licensedTo: string;
    plan: string;
    status: string;
    version: string;
    poweredBy: string;
    copyright: string;
    statusActive: string;
    statusGrace: string;
    statusPaused: string;
    statusUnknown: string;
    notConfigured: string;
    notAssigned: string;
    pulseLabel: string;
  };
};

type LicenseSummary = {
  licensed_to: string | null;
  plan_name: string | null;
  license_status: string | null;
  software_version: string | null;
  software_owner: string | null;
  has_customer: boolean;
};

type LicenseCache = {
  workspaceName: string | null;
  summary: LicenseSummary | null;
};

const LICENSE_CACHE_KEY = "license-sidebar";

export default function LicenseSidebarPanel({ labels }: LicenseSidebarPanelProps) {
  const cached = getCachedValue<LicenseCache>(LICENSE_CACHE_KEY);
  const [workspaceName, setWorkspaceName] = useState<string | null>(cached?.workspaceName ?? null);
  const [summary, setSummary] = useState<LicenseSummary | null>(cached?.summary ?? null);
  const licenseHref = resolveAppHref("/app/license");
  const { sidebarMark } = AIPIFY_BRAND;

  const load = useCallback(async () => {
    const hit = getCachedValue<LicenseCache>(LICENSE_CACHE_KEY);
    if (hit) {
      setWorkspaceName(hit.workspaceName);
      setSummary(hit.summary);
      return;
    }

    await dedupeFetch(LICENSE_CACHE_KEY, async () => {
      const supabase = createClient();

      const [orgRes, licenseRes] = await Promise.all([
        fetch("/api/organizations"),
        supabase.rpc("get_customer_license_center"),
      ]);

      let nextWorkspace: string | null = null;
      if (orgRes.ok) {
        const orgData = (await orgRes.json()) as {
          current?: { name?: string } | null;
          organizations?: Array<{ name?: string }>;
        };
        nextWorkspace =
          orgData.current?.name ??
          orgData.organizations?.[0]?.name ??
          null;
      }

      let nextSummary: LicenseSummary | null = null;
      const data = licenseRes.data;
      if (data && typeof data === "object") {
        const record = data as Record<string, unknown>;
        const hasCustomer = record.has_customer === true;
        nextSummary = {
          has_customer: hasCustomer,
          licensed_to:
            typeof record.company_name === "string" ? record.company_name : null,
          plan_name: (record.subscription as { plan_name?: string } | undefined)?.plan_name ?? null,
          license_status: hasCustomer ? String(record.license_status ?? "active") : null,
          software_version:
            typeof record.software_version === "string" ? record.software_version : null,
          software_owner:
            typeof record.software_owner === "string" ? record.software_owner : null,
        };
      }

      setCachedValue(
        LICENSE_CACHE_KEY,
        { workspaceName: nextWorkspace, summary: nextSummary },
        CACHE_TTL_LICENSE_MS
      );
      setWorkspaceName(nextWorkspace);
      setSummary(nextSummary);
      return true;
    });
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const statusLabel =
    summary?.license_status === "grace_period"
      ? labels.statusGrace
      : summary?.license_status === "paused"
        ? labels.statusPaused
        : summary?.license_status === "active"
          ? labels.statusActive
          : labels.statusUnknown;

  const workspaceDisplay = workspaceName?.trim() || labels.notConfigured;
  const licensedToDisplay =
    summary?.licensed_to?.trim() ||
    summary?.software_owner?.trim() ||
    labels.notConfigured;
  const planDisplay = summary?.plan_name?.trim() || labels.notAssigned;

  return (
    <Link
      href={licenseHref}
      className="relative mx-4 mb-4 block shrink-0 rounded-xl border border-gray-100 bg-gray-50/80 px-3 py-3 transition hover:border-violet-200 hover:bg-violet-50/40"
      aria-label={labels.poweredBy}
    >
      <div className="flex items-start gap-2.5">
        <AipifyPulse
          size={sidebarMark.pulseSize}
          variant="mono"
          opacity={sidebarMark.pulseOpacity}
          title={labels.pulseLabel}
          aria-label={labels.pulseLabel}
          className="mt-0.5 shrink-0 text-violet-600/80"
        />
        <div className="min-w-0 text-[11px] leading-snug text-gray-600">
          <p className="truncate" title={`${labels.workspace} ${workspaceDisplay}`}>
            <span className="text-gray-500">{labels.workspace}</span> {workspaceDisplay}
          </p>
          <p className="mt-1 truncate" title={`${labels.licensedTo} ${licensedToDisplay}`}>
            <span className="text-gray-500">{labels.licensedTo}</span> {licensedToDisplay}
          </p>
          <p className="truncate" title={`${labels.plan} ${planDisplay}`}>
            <span className="text-gray-500">{labels.plan}</span> {planDisplay}
          </p>
          <p title={`${labels.status} ${statusLabel}`}>
            <span className="text-gray-500">{labels.status}</span> {statusLabel}
          </p>
          <p>
            <span className="text-gray-500">{labels.version}</span>{" "}
            {formatSoftwareVersion(summary?.software_version ?? "1.0.0")}
          </p>
          <p className="mt-2 font-medium text-gray-700">
            {labels.poweredBy} Aipify™
          </p>
          <p className="mt-1 text-[10px] text-gray-400">{labels.copyright}</p>
        </div>
      </div>
    </Link>
  );
}
