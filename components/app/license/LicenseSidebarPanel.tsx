"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AipifyPulse } from "@/components/branding";
import { AIPIFY_BRAND } from "@/lib/branding/tokens";
import { formatSoftwareVersion } from "@/lib/license";
import { resolveAppHref } from "@/lib/app/route-aliases";
import { createClient } from "@/lib/supabase/client";

type LicenseSidebarPanelProps = {
  companyName: string;
  labels: {
    poweredBy: string;
    licensedTo: string;
    subscription: string;
    status: string;
    version: string;
    copyright: string;
    statusActive: string;
    statusGrace: string;
    statusPaused: string;
    pulseLabel: string;
  };
};

type LicenseSummary = {
  plan_name: string | null;
  license_status: string;
  software_version: string;
};

export default function LicenseSidebarPanel({
  companyName,
  labels,
}: LicenseSidebarPanelProps) {
  const [summary, setSummary] = useState<LicenseSummary | null>(null);
  const licenseHref = resolveAppHref("/app/license");
  const { sidebarMark } = AIPIFY_BRAND;

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase.rpc("get_customer_license_center");
      if (data && typeof data === "object" && data.has_customer) {
        setSummary({
          plan_name: (data.subscription as { plan_name?: string })?.plan_name ?? null,
          license_status: String(data.license_status ?? "active"),
          software_version: String(data.software_version ?? "1.0.0"),
        });
      }
    }
    void load();
  }, []);

  const statusLabel =
    summary?.license_status === "grace_period"
      ? labels.statusGrace
      : summary?.license_status === "paused"
        ? labels.statusPaused
        : labels.statusActive;

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
          <p className="font-medium text-gray-700">{labels.poweredBy} Aipify™</p>
          <p className="mt-1 truncate">
            <span className="text-gray-500">{labels.licensedTo}</span> {companyName}
          </p>
          <p className="truncate">
            <span className="text-gray-500">{labels.subscription}</span>{" "}
            {summary?.plan_name ?? "—"}
          </p>
          <p>
            <span className="text-gray-500">{labels.status}</span> {statusLabel}
          </p>
          <p>
            <span className="text-gray-500">{labels.version}</span>{" "}
            {formatSoftwareVersion(summary?.software_version)}
          </p>
          <p className="mt-2 text-[10px] text-gray-400">{labels.copyright}</p>
        </div>
      </div>
    </Link>
  );
}
