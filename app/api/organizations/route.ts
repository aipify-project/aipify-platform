import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseOrganizationSummary } from "@/lib/aipify/multi-tenant-architecture/parse";
import { parseAppOrganizationContext } from "@/lib/tenant/resolve-app-organization-context";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: orgs, error: listError } = await supabase.rpc("get_app_eligible_organizations");
    if (listError) return NextResponse.json({ error: listError.message }, { status: 400 });

    const { data: contextRaw, error: contextError } = await supabase.rpc(
      "get_app_organization_context"
    );
    if (contextError) return NextResponse.json({ error: contextError.message }, { status: 400 });

    const organizations = Array.isArray(orgs)
      ? orgs.map((o) => parseOrganizationSummary(o))
      : [];

    const context = parseAppOrganizationContext(contextRaw);
    const current =
      context.organization_id != null
        ? (organizations.find((org) => org.id === context.organization_id) ?? null)
        : null;

    return NextResponse.json({
      organizations,
      current,
    });
  } catch {
    return NextResponse.json({ error: "Failed to load organizations" }, { status: 500 });
  }
}
