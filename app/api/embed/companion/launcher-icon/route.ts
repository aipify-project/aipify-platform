import { NextResponse } from "next/server";
import { getCompanionLauncherIconEmbedConfig } from "@/lib/branding/companion-launcher-icon";
import {
  getWebsiteKompisInstallConfigForPublicRequest,
  toWebsiteKompisPublicInstallMetadata,
} from "@/lib/marketing/website-kompis-install-config";

/** Public embed metadata for Core-owned Website Kompis / Companion launcher icon variants. */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const origin = url.origin;
  const variant = url.searchParams.get("variant");
  const installId = url.searchParams.get("installId");
  const domain = url.searchParams.get("domain");
  const hasInstallSelector = Boolean(installId?.trim() || domain?.trim());

  const installConfig = hasInstallSelector
    ? await getWebsiteKompisInstallConfigForPublicRequest({
        installId,
        domain,
        requestHost: url.hostname,
      })
    : null;

  const publicMetadata = installConfig
    ? toWebsiteKompisPublicInstallMetadata(installConfig)
    : null;

  return NextResponse.json(
    getCompanionLauncherIconEmbedConfig(origin, {
      variant,
      installConfig: publicMetadata,
      preferInstallConfigVariant: hasInstallSelector,
    }),
    {
      headers: {
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      },
    },
  );
}
