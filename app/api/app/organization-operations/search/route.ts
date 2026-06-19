import { NextRequest, NextResponse } from "next/server";
import {
  parseOrganizationSearchResults,
  searchOrganizationOperatingSystem,
} from "@/lib/organization-operations";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const query = request.nextUrl.searchParams.get("q") ?? "";
    const data = await searchOrganizationOperatingSystem(supabase, query);
    return NextResponse.json({
      found: data.found === true,
      results: parseOrganizationSearchResults(data),
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Search failed" },
      { status: 500 }
    );
  }
}
