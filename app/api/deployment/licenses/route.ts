import { NextResponse } from "next/server";
import { parseOrganizationLicenses } from "@/lib/aipify/enterprise-deployment-device-rollout-engine";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("list_organization_licenses");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseOrganizationLicenses(data));
  } catch {
    return NextResponse.json({ error: "Failed to list licenses" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as Record<string, unknown>;
    const { data, error } = await supabase.rpc("create_organization_license", {
      p_license_type: (body.license_type as string) ?? "enterprise",
      p_seat_limit: (body.seat_limit as number) ?? 25,
      p_expires_at: (body.expires_at as string) ?? null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to create license" }, { status: 500 });
  }
}
