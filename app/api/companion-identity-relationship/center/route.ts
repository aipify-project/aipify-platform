import { NextResponse } from "next/server";
import { parseCompanionIdentityRelationshipCenter } from "@/lib/companion-identity-relationship";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_companion_identity_relationship_center");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseCompanionIdentityRelationshipCenter(data));
  } catch {
    return NextResponse.json(
      { error: "Failed to load Companion Identity center" },
      { status: 500 },
    );
  }
}
