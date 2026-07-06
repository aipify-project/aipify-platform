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
import { resolveWebsiteKompisPublicLicensedAvailability } from "@/lib/marketing/website-kompis-licensed-availability-server";

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
    const visitorContext = resolvePublicCompanionVisitorContext({
      clientDomain: domain,
      requestHost: url.hostname,
      installId,
    });

    if (!hasPublicCompanionVisitorContext(visitorContext)) {
      publicMetadata = buildWebsiteKompisLicensedDisabledPublicMetadata("not_available");
    } else {
      const availability = await resolveWebsiteKompisPublicLicensedAvailability(visitorContext);

      if (!availability.available) {
        publicMetadata = buildWebsiteKompisLicensedDisabledPublicMetadata(
          mapWebsiteKompisAvailabilityToPublicReason(availability.reason),
        );
      } else {
        const installConfig = await getWebsiteKompisInstallConfigForPublicRequest({
          installId,
          domain,
          requestHost: url.hostname,
        });

        publicMetadata = installConfig.enabled
          ? toWebsiteKompisPublicInstallMetadata(installConfig)
          : buildWebsiteKompisLicensedDisabledPublicMetadata("not_available");
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
