import Link from "next/link";
import { parseAppPortalFeatureAccess } from "@/lib/app-portal/parse";
import { createClient } from "@/lib/supabase/server";

type AppPortalLicenseGateProps = {
  feature?: string;
  labels: {
    upgradeTitle: string;
    upgradeBody: string;
    upgradeCta: string;
    unavailableTitle: string;
  };
  children: React.ReactNode;
};

export async function AppPortalLicenseGate({
  feature,
  labels,
  children,
}: AppPortalLicenseGateProps) {
  if (!feature) return children;

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_app_portal_feature_access", {
    p_feature: feature,
  });

  if (error) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center">
        <h1 className="text-lg font-semibold text-slate-900">{labels.unavailableTitle}</h1>
        <p className="mt-2 text-sm text-slate-600">{labels.upgradeBody}</p>
        <Link
          href="/app/billing/upgrade"
          className="mt-4 inline-flex rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          {labels.upgradeCta}
        </Link>
      </div>
    );
  }

  const access = parseAppPortalFeatureAccess(data);
  if (access.enabled) return children;

  return (
    <div className="mx-auto max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <h1 className="text-xl font-semibold text-slate-900">{labels.upgradeTitle}</h1>
      <p className="mt-3 text-sm text-slate-600">{labels.upgradeBody}</p>
      <Link
        href={access.upgrade_href}
        className="mt-6 inline-flex rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
      >
        {labels.upgradeCta}
      </Link>
    </div>
  );
}
