import { NextResponse } from "next/server";
import { parseAppPortalFeatureAccess } from "@/lib/app-portal/parse";
import {
  buildBusinessPackSettingsUpgradeHref,
  buildInstalledPackRows,
  type BusinessPackSettingsAccessState,
} from "@/lib/app-portal/business-pack-settings";
import { getAppStoreHome, parseAppStoreHome } from "@/lib/app-store";
import { getOrganizationBusinessPackActivationGates } from "@/lib/business-pack-activation-gate";
import {
  appPortalRpcErrorResponse,
  requireOrganizationViewPermission,
  requireReadyAppPortalContext,
} from "@/lib/tenant/app-portal-route-access";
import { createClient } from "@/lib/supabase/server";

const REQUIRED_PLAN_LABEL = "business";

function orgContextAccessState(state: string): BusinessPackSettingsAccessState {
  if (state === "subscription_inactive") return "subscription_inactive";
  if (state === "license_inactive") return "license_inactive";
  if (state === "entitlement_missing") return "entitlement_missing";
  if (state === "permission_missing") return "permission_missing";
  return "organization_context_missing";
}

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { found: false, access_state: "organization_context_missing" },
        { status: 401 }
      );
    }

    const contextResult = await requireReadyAppPortalContext(supabase);
    if (!contextResult.ok) {
      const body = (await contextResult.response.json()) as {
        access_state?: string;
      };
      return NextResponse.json({
        found: true,
        access_state: orgContextAccessState(body.access_state ?? "organization_context_missing"),
        upgrade_href: buildBusinessPackSettingsUpgradeHref(),
        return_href: "/app/business-packs/settings",
      });
    }

    const permission = await requireOrganizationViewPermission(
      supabase,
      "business_packs.view",
      "business_packs.manage"
    );
    if (!permission.ok) {
      return NextResponse.json({
        found: true,
        access_state: "permission_missing" as const,
        upgrade_href: buildBusinessPackSettingsUpgradeHref(),
        return_href: "/app/business-packs/settings",
      });
    }

    let currentPlan = contextResult.context.plan_name ?? "starter";
    let licenseStatus = contextResult.context.license_status ?? "active";

    const { data: licenseRaw } = await supabase.rpc("get_customer_license_dashboard");
    const licenseRow = (licenseRaw ?? {}) as Record<string, unknown>;
    const currentPlanRow = licenseRow.current_plan as Record<string, unknown> | undefined;
    if (currentPlanRow?.plan_key) currentPlan = String(currentPlanRow.plan_key);
    if (currentPlanRow?.status) licenseStatus = String(currentPlanRow.status);

    if (licenseStatus === "paused" || licenseStatus === "cancelled") {
      return NextResponse.json({
        found: true,
        access_state: "subscription_inactive" as const,
        current_plan: currentPlan,
        upgrade_href: buildBusinessPackSettingsUpgradeHref(),
        return_href: "/app/business-packs/settings",
      });
    }

    if (licenseStatus === "suspended") {
      return NextResponse.json({
        found: true,
        access_state: "suspended" as const,
        current_plan: currentPlan,
        upgrade_href: buildBusinessPackSettingsUpgradeHref(),
        return_href: "/app/business-packs/settings",
      });
    }

    const { data: featureRaw, error: featureError } = await supabase.rpc(
      "get_app_portal_feature_access",
      { p_feature: "business_packs" }
    );
    if (featureError) {
      return appPortalRpcErrorResponse("[business-pack-settings]", featureError.message);
    }

    const feature = parseAppPortalFeatureAccess(featureRaw);
    currentPlan = feature.plan_key || currentPlan;

    if (!feature.enabled || feature.upgrade_required) {
      return NextResponse.json({
        found: true,
        access_state: "plan_required" as const,
        current_plan: currentPlan,
        required_plan: REQUIRED_PLAN_LABEL,
        capability_summary: "business_pack_settings",
        upgrade_href: buildBusinessPackSettingsUpgradeHref(),
        return_href: "/app/business-packs/settings",
      });
    }

    const activationGates = await getOrganizationBusinessPackActivationGates(supabase).catch(
      () => ({ found: false as const })
    );
    const gateItems = activationGates.found ? activationGates.items ?? [] : [];
    const activationByPack = new Map(
      gateItems.map((item) => [item.pack_key, item.activation_status])
    );

    const failedPackKeys = gateItems
      .filter((item) => item.activation_status === "activation_failed")
      .map((item) => item.pack_key);
    const pendingPackKeys = gateItems
      .filter((item) =>
        ["pending_activation", "validating"].includes(item.activation_status)
      )
      .map((item) => item.pack_key);
    const suspendedPackKeys = gateItems
      .filter((item) => item.activation_status === "suspended")
      .map((item) => item.pack_key);

    if (failedPackKeys.length > 0) {
      return NextResponse.json({
        found: true,
        access_state: "activation_failed" as const,
        current_plan: currentPlan,
        failed_pack_keys: failedPackKeys,
        upgrade_href: buildBusinessPackSettingsUpgradeHref(),
        return_href: "/app/business-packs/settings",
      });
    }

    if (pendingPackKeys.length > 0) {
      return NextResponse.json({
        found: true,
        access_state: "pending_activation" as const,
        current_plan: currentPlan,
        pending_pack_keys: pendingPackKeys,
        upgrade_href: buildBusinessPackSettingsUpgradeHref(),
        return_href: "/app/business-packs/settings",
      });
    }

    if (suspendedPackKeys.length > 0) {
      return NextResponse.json({
        found: true,
        access_state: "suspended" as const,
        current_plan: currentPlan,
        upgrade_href: buildBusinessPackSettingsUpgradeHref(),
        return_href: "/app/business-packs/settings",
      });
    }

    const storeRaw = await getAppStoreHome(supabase, "en");
    const store = parseAppStoreHome(storeRaw);
    const installed = store?.sections?.installed ?? [];

    if (installed.length === 0) {
      return NextResponse.json({
        found: true,
        access_state: "no_installed_packs" as const,
        current_plan: currentPlan,
        upgrade_href: buildBusinessPackSettingsUpgradeHref(),
        return_href: "/app/business-packs/settings",
      });
    }

    const packs = buildInstalledPackRows(installed, activationByPack);

    return NextResponse.json({
      found: true,
      access_state: "active" as const,
      current_plan: currentPlan,
      packs,
      upgrade_href: buildBusinessPackSettingsUpgradeHref(),
      return_href: "/app/business-packs/settings",
    });
  } catch (error) {
    console.error("[business-pack-settings]", error);
    return NextResponse.json(
      {
        found: false,
        access_state: "load_error" as const,
        return_href: "/app/business-packs/settings",
      },
      { status: 500 }
    );
  }
}
