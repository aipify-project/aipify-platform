import { NextResponse } from "next/server";
import {
  getCompanionNavigationContext,
  parseCompanionNavigationContext,
} from "@/lib/dynamic-navigation";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await getCompanionNavigationContext(supabase);
    return NextResponse.json(parseCompanionNavigationContext(data) ?? { found: false });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load companion navigation context";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
