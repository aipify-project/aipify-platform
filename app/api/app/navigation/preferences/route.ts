import { NextResponse } from "next/server";
import {
  getNavigationPreferencesCenter,
  getVisibleNavigationSearch,
  parseNavigationPreferencesCenter,
  parseNavigationSearchResult,
  performNavigationPreferenceAction,
} from "@/lib/dynamic-navigation";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const url = new URL(request.url);
    if (url.searchParams.get("section") === "search") {
      const data = await getVisibleNavigationSearch(supabase, url.searchParams.get("q") ?? undefined);
      return NextResponse.json(parseNavigationSearchResult(data) ?? { found: false, items: [] });
    }

    const data = await getNavigationPreferencesCenter(supabase);
    return NextResponse.json(parseNavigationPreferencesCenter(data) ?? { found: false });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load navigation preferences";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as { action_type?: string; payload?: Record<string, unknown> };
    const data = await performNavigationPreferenceAction(
      supabase,
      body.action_type ?? "record_module_use",
      body.payload ?? {},
    );
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Navigation action failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
