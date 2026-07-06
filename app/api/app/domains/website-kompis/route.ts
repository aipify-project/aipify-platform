import { NextResponse } from "next/server";
import { getDomainLicenseCenter } from "@/lib/domain-license";
import {
  activateWebsiteKompisForDomain,
  deactivateWebsiteKompisForDomain,
} from "@/lib/marketing/website-kompis-domain-activation-client";
import {
  buildWebsiteKompisDomainSettingsView,
  buildWebsiteKompisSettingsPatch,
  isWebsiteKompisDomainVerified,
  type WebsiteKompisDomainSettingsRecord,
} from "@/lib/marketing/website-kompis-domain-settings";
import {
  loadWebsiteKompisInstallConfigForApp,
  updateWebsiteKompisInstallConfigInStorage,
} from "@/lib/marketing/website-kompis-install-config-storage";
import {
  canManageWebsiteKompisDomainSettings,
  evaluateWebsiteKompisLicensedAvailabilityFromAppContext,
} from "@/lib/marketing/website-kompis-licensed-availability";
import {
  loadWebsiteKompisEntitlementForAppTenant,
  resolveWebsiteKompisAppLicensedAvailability,
} from "@/lib/marketing/website-kompis-licensed-availability-server";
import {
  loadWebsiteKompisInstallIdForTenantDomain,
  resolveWebsiteKompisCustomerDomainBinding,
} from "@/lib/marketing/website-kompis-domain-settings-server";
import {
  requireReadyAppPortalContext,
  appPortalAccessDeniedResponse,
} from "@/lib/tenant/app-portal-route-access";
import { createClient } from "@/lib/supabase/server";

function findDomainRecord(
  center: Record<string, unknown>,
  domainId: string,
): WebsiteKompisDomainSettingsRecord | null {
  const active = Array.isArray(center.active_domains) ? center.active_domains : [];
  const match = active.find(
    (row) =>
      row &&
      typeof row === "object" &&
      (row as Record<string, unknown>).id === domainId,
  ) as Record<string, unknown> | undefined;

  if (!match || typeof match.domain !== "string") {
    return null;
  }

  return {
    domainId,
    domain: match.domain,
    verificationStatus:
      typeof match.verification_status === "string" ? match.verification_status : null,
    domainStatus: typeof match.domain_status === "string" ? match.domain_status : null,
  };
}

async function buildDomainSettingsResponse(input: {
  supabase: Awaited<ReturnType<typeof createClient>>;
  domainId: string;
  origin: string;
}) {
  const access = await requireReadyAppPortalContext(input.supabase);
  if (!access.ok) {
    return access.response;
  }

  const center = (await getDomainLicenseCenter(input.supabase)) as Record<string, unknown>;
  const record = findDomainRecord(center, input.domainId);
  if (!record) {
    return NextResponse.json({ error: "domain_not_found", found: false }, { status: 404 });
  }

  const customerBinding =
    access.context.customer_id != null
      ? await resolveWebsiteKompisCustomerDomainBinding({
          tenantId: access.context.customer_id,
          domainName: record.domain,
        })
      : null;

  const domainVerified =
    customerBinding != null
      ? customerBinding.verificationStatus === "verified" &&
        customerBinding.domainStatus === "active"
      : isWebsiteKompisDomainVerified(record);

  const installId =
    customerBinding?.installId ??
    (access.context.customer_id
      ? await loadWebsiteKompisInstallIdForTenantDomain({
          tenantId: access.context.customer_id,
          domainName: record.domain,
        })
      : null);

  const entitlementEnabled = await loadWebsiteKompisEntitlementForAppTenant(
    input.supabase,
    access.context.customer_id,
  );

  const availability = evaluateWebsiteKompisLicensedAvailabilityFromAppContext({
    context: access.context,
    entitlementEnabled,
    domainVerified,
    installTrusted: installId != null,
  });

  const canManage =
    canManageWebsiteKompisDomainSettings(access.context) && availability.available;

  const rpcResult =
    installId != null
      ? await loadWebsiteKompisInstallConfigForApp(input.supabase, installId)
      : null;

  const view = buildWebsiteKompisDomainSettingsView({
    record,
    availability,
    canManage,
    installId,
    metadataOrigin: input.origin,
    rpcResult,
  });

  return NextResponse.json({
    found: true,
    customerDomainId: customerBinding?.customerDomainId ?? null,
    settings: view,
  });
}

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const domainId = url.searchParams.get("domain_id");
    if (!domainId) {
      return NextResponse.json({ error: "domain_id_required" }, { status: 400 });
    }

    return buildDomainSettingsResponse({
      supabase,
      domainId,
      origin: url.origin,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load Website Kompis settings";
    return NextResponse.json({ error: message, found: false }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const access = await requireReadyAppPortalContext(supabase);
    if (!access.ok) {
      return access.response;
    }

    if (!canManageWebsiteKompisDomainSettings(access.context)) {
      return appPortalAccessDeniedResponse("permission_missing");
    }

    const body = (await request.json()) as Record<string, unknown>;
    const domainId = typeof body.domain_id === "string" ? body.domain_id : null;
    const action = typeof body.action === "string" ? body.action : "update";

    if (!domainId) {
      return NextResponse.json({ error: "domain_id_required" }, { status: 400 });
    }

    const center = (await getDomainLicenseCenter(supabase)) as Record<string, unknown>;
    const record = findDomainRecord(center, domainId);
    if (!record) {
      return NextResponse.json({ error: "domain_not_found", found: false }, { status: 404 });
    }

    const customerBinding =
      access.context.customer_id != null
        ? await resolveWebsiteKompisCustomerDomainBinding({
            tenantId: access.context.customer_id,
            domainName: record.domain,
          })
        : null;

    const domainVerified =
      customerBinding != null
        ? customerBinding.verificationStatus === "verified" &&
          customerBinding.domainStatus === "active"
        : isWebsiteKompisDomainVerified(record);

    const availability = await resolveWebsiteKompisAppLicensedAvailability({
      context: access.context,
      supabase,
      domainVerified,
      installTrusted: customerBinding?.installId != null,
    });

    if (!availability.available) {
      return NextResponse.json(
        {
          error: "website_kompis_unavailable",
          reason: availability.reason,
          found: false,
        },
        { status: 403 },
      );
    }

    if (!domainVerified || !customerBinding?.customerDomainId) {
      return NextResponse.json(
        {
          error: "domain_must_be_verified",
          found: false,
        },
        { status: 409 },
      );
    }

    let installId = customerBinding.installId;

    if (action === "activate") {
      const activation = await activateWebsiteKompisForDomain(
        supabase,
        customerBinding.customerDomainId,
      );
      if (!activation) {
        return NextResponse.json({ error: "activation_failed", found: false }, { status: 500 });
      }
      installId = activation.installId;
    } else if (action === "deactivate") {
      const activation = await deactivateWebsiteKompisForDomain(
        supabase,
        customerBinding.customerDomainId,
      );
      if (!activation) {
        return NextResponse.json({ error: "deactivation_failed", found: false }, { status: 500 });
      }
      installId = activation.installId;
    }

    if (action === "update") {
      const patch = buildWebsiteKompisSettingsPatch(body.patch && typeof body.patch === "object"
        ? (body.patch as Record<string, unknown>)
        : body);

      if (Object.keys(patch).length === 0) {
        return NextResponse.json({ error: "empty_patch" }, { status: 400 });
      }

      if (patch.enabled === true && !installId) {
        const activation = await activateWebsiteKompisForDomain(
          supabase,
          customerBinding.customerDomainId,
        );
        if (!activation) {
          return NextResponse.json({ error: "activation_failed", found: false }, { status: 500 });
        }
        installId = activation.installId;
      }

      if (patch.enabled === false && installId) {
        await deactivateWebsiteKompisForDomain(supabase, customerBinding.customerDomainId);
      }

      if (!installId) {
        return NextResponse.json({ error: "install_missing", found: false }, { status: 409 });
      }

      await updateWebsiteKompisInstallConfigInStorage(supabase, installId, patch);
    }

    const url = new URL(request.url);
    return buildDomainSettingsResponse({
      supabase,
      domainId,
      origin: url.origin,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to update Website Kompis settings";
    return NextResponse.json({ error: message, found: false }, { status: 500 });
  }
}
