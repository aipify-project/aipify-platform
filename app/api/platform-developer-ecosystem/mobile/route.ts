import { NextResponse } from "next/server";
import { getDeveloperEcosystemMobileSummary } from "@/lib/platform-developer-ecosystem";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const data = await getDeveloperEcosystemMobileSummary(supabase);
    return NextResponse.json(data ?? { found: false });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to load mobile summary" },
      { status: 500 }
    );
  }
}
