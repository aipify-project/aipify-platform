import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string; action: string }> }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id, action } = await params;

    if (action === "sync") {
      const { data, error } = await supabase.rpc("sync_organization_integration", {
        p_integration_id: id,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 403 });
      return NextResponse.json(data);
    }
    if (action === "disable") {
      const { data, error } = await supabase.rpc("disable_organization_integration", {
        p_integration_id: id,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 403 });
      return NextResponse.json(data);
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Failed to process integration action" }, { status: 500 });
  }
}
