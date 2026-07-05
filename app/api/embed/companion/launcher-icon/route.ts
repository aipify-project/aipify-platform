import { NextResponse } from "next/server";
import { getCompanionLauncherIconEmbedConfig } from "@/lib/branding/companion-launcher-icon";

/** Public embed metadata for Core-owned Website Kompis / Companion launcher icon variants. */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const origin = url.origin;
  const variant = url.searchParams.get("variant");

  return NextResponse.json(getCompanionLauncherIconEmbedConfig(origin, { variant }), {
    headers: {
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  });
}
