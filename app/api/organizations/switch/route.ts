import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as { organization_id?: string };
    if (!body.organization_id) {
      return NextResponse.json({ error: "organization_id required" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("switch_organization", {
      p_organization_id: body.organization_id,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to switch organization" }, { status: 500 });
  }
}
