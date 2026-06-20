import { NextResponse } from "next/server";
import { parseAppOrganizationContext } from "@/lib/tenant/resolve-app-organization-context";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        parseAppOrganizationContext({ authenticated: false, state: "unauthenticated" })
      );
    }

    const { data, error } = await supabase.rpc("get_app_organization_context");
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(parseAppOrganizationContext(data));
  } catch {
    return NextResponse.json({ error: "Failed to resolve organization context" }, { status: 500 });
  }
}
