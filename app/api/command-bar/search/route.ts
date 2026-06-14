import { NextResponse } from "next/server";
import { buildCommandBarLabels, searchCommandBar } from "@/lib/command-bar";
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
    const query = searchParams.get("q") ?? "";

    if (!PORTALS.has(portal)) {
      return NextResponse.json({ error: "Invalid portal" }, { status: 400 });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const locale = await getLocale();
    const dict = await getDictionary(locale, ["commandBar"]);
    const t = createTranslator(dict);
    const labels = buildCommandBarLabels(t);

    const results = await searchCommandBar({ supabase, portal, query, labels });
    return NextResponse.json({ results });
  } catch {
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
