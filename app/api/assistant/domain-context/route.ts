import { NextResponse } from "next/server";
import { getCompanionDomainContext } from "@/lib/domain-license";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await getCompanionDomainContext(supabase);
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load domain context";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
