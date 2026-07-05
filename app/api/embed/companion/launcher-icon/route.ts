import { NextResponse } from "next/server";
import { getCompanionLauncherIconEmbedConfig } from "@/lib/branding/companion-launcher-icon";

/** Public embed metadata for the canonical Website Kompis / Companion launcher icon. */
export async function GET(request: Request) {
  const origin = new URL(request.url).origin;

  return NextResponse.json(getCompanionLauncherIconEmbedConfig(origin), {
    headers: {
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  });
}
