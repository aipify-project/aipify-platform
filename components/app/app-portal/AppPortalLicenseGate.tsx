import Link from "next/link";
import { parseAppPortalFeatureAccess } from "@/lib/app-portal/parse";
import { resolvePortalFeatureEnabled } from "@/lib/app-portal/feature-entitlements";
import { parseAppOrganizationContext } from "@/lib/tenant/resolve-app-organization-context";
import { createClient } from "@/lib/supabase/server";

type AppPortalLicenseGateProps = {
  feature?: string;
  labels: {
    upgradeTitle: string;
    upgradeBody: string;
    upgradeCta: string;
    unavailableTitle: string;
    pageLoadError: string;
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
    const { data: contextData } = await supabase.rpc("get_app_organization_context");
    const context = parseAppOrganizationContext(contextData);
    const planKey = context.plan_name?.toLowerCase() ?? null;
    if (context.state === "ready" && resolvePortalFeatureEnabled(feature, planKey)) {
      return children;
    }

    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">{labels.unavailableTitle}</h1>
        <p className="mt-3 text-sm text-slate-600">{labels.pageLoadError}</p>
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
