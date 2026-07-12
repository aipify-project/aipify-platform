import { NextResponse } from "next/server";
import { getCompanionLauncherIconEmbedConfig } from "@/lib/branding/companion-launcher-icon";
import {
  buildWebsiteKompisLicensedDisabledPublicMetadata,
  getWebsiteKompisInstallConfigForPublicRequest,
  toWebsiteKompisPublicInstallMetadata,
} from "@/lib/marketing/website-kompis-install-config";
import { mapWebsiteKompisAvailabilityToPublicReason } from "@/lib/marketing/website-kompis-licensed-availability";
import {
  hasPublicCompanionVisitorContext,
  resolvePublicCompanionVisitorContext,
} from "@/lib/marketing/public-companion-tenant-faq";
import {
  resolveWebsiteKompisLicensedAvailabilityForPublicTenant,
  resolveWebsiteKompisPublicInstallDomainTrust,
} from "@/lib/marketing/website-kompis-licensed-availability-server";
import {
  assertWebsiteKompisEmbedProtectedRequest,
  websiteKompisPublicSecurityErrorResponse,
} from "@/lib/marketing/website-kompis-public-security-gate";

/** Public embed metadata for Core-owned Website Kompis / Companion launcher icon variants. */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const origin = url.origin;
  const variant = url.searchParams.get("variant");
  const installId = url.searchParams.get("installId");
  const domain = url.searchParams.get("domain");
  const hasInstallSelector = Boolean(installId?.trim() || domain?.trim());

  let publicMetadata = null;

  if (hasInstallSelector) {
    const gate = await assertWebsiteKompisEmbedProtectedRequest(request, {
      installId,
      domain,
      category: "launcher",
    });
    if (!gate.ok) {
      return websiteKompisPublicSecurityErrorResponse(gate);
    }
    const visitorContext = resolvePublicCompanionVisitorContext({
      clientDomain: domain,
      requestHost: url.hostname,
      installId,
    });

    if (!hasPublicCompanionVisitorContext(visitorContext)) {
      publicMetadata = buildWebsiteKompisLicensedDisabledPublicMetadata("not_available");
    } else {
      const trust = await resolveWebsiteKompisPublicInstallDomainTrust({
        installId,
        domain,
      });

      if (!trust.trusted) {
        publicMetadata = buildWebsiteKompisLicensedDisabledPublicMetadata(
          mapWebsiteKompisAvailabilityToPublicReason(trust.reason),
        );
      } else {
        const availability = trust.tenantId
          ? await resolveWebsiteKompisLicensedAvailabilityForPublicTenant(trust.tenantId)
          : { available: false, reason: "license_unknown" as const };

        if (!availability.available) {
          publicMetadata = buildWebsiteKompisLicensedDisabledPublicMetadata(
            mapWebsiteKompisAvailabilityToPublicReason(availability.reason),
          );
        } else {
          const installConfig = await getWebsiteKompisInstallConfigForPublicRequest({
            installId: trust.installId ?? installId,
            domain: trust.domain ?? domain,
            requestHost: url.hostname,
          });

          publicMetadata = installConfig.enabled
            ? toWebsiteKompisPublicInstallMetadata(installConfig)
            : buildWebsiteKompisLicensedDisabledPublicMetadata("not_available");
        }
      }
    }
  }

  return NextResponse.json(
    getCompanionLauncherIconEmbedConfig(origin, {
      variant: publicMetadata?.available === false ? undefined : variant,
      installConfig: publicMetadata,
      preferInstallConfigVariant: hasInstallSelector && publicMetadata?.available !== false,
    }),
    {
      headers: {
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      },
    },
  );
}
