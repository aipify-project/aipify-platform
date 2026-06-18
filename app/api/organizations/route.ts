import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseOrganizationSummary } from "@/lib/aipify/multi-tenant-architecture/parse";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: orgs, error: listError } = await supabase.rpc("get_user_organizations");
    if (listError) return NextResponse.json({ error: listError.message }, { status: 400 });

    const { data: current, error: currentError } = await supabase.rpc("get_current_organization");
    if (currentError) return NextResponse.json({ error: currentError.message }, { status: 400 });

    const currentRecord = (current ?? {}) as Record<string, unknown>;
    return NextResponse.json({
      organizations: Array.isArray(orgs)
        ? orgs.map((o) => parseOrganizationSummary(o))
        : [],
      current:
        currentRecord.id && !currentRecord.error
          ? parseOrganizationSummary(current)
          : null,
    });
  } catch {
    return NextResponse.json({ error: "Failed to load organizations" }, { status: 500 });
  }
}
