import { NextResponse } from "next/server";
import { guardPrivilegedPlatformPortalSession } from "@/lib/auth/platform-server-access";
import { buildCommandBarLabels, fetchCommandBarRecommendations } from "@/lib/command-bar";
import type { CommandBarPortal } from "@/lib/command-bar/types";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";
import { createClient } from "@/lib/supabase/server";

const PORTALS = new Set<CommandBarPortal>(["customer", "platform", "super_admin"]);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const portal = (searchParams.get("portal") ?? "customer") as CommandBarPortal;

    if (!PORTALS.has(portal)) {
      return NextResponse.json({ error: "Invalid portal" }, { status: 400 });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const platformGuard = await guardPrivilegedPlatformPortalSession(supabase, portal);
    if (platformGuard) return platformGuard;

    const locale = await getLocale();
    const dict = await getDictionary(locale, ["commandBar"]);
    const t = createTranslator(dict);
    const labels = buildCommandBarLabels(t);

    const recommendations = await fetchCommandBarRecommendations(supabase, portal, labels);

    return NextResponse.json({ recommendations });
  } catch {
    return NextResponse.json({ error: "Failed to load recommendations" }, { status: 500 });
  }
}
