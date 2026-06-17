import { NextResponse } from "next/server";
import { recordPartnerMaterialDownload } from "@/lib/core/partner-materials";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as { material_id?: string; action_type?: string };
    if (!body.material_id) {
      return NextResponse.json({ error: "material_id required" }, { status: 400 });
    }

    const data = await recordPartnerMaterialDownload(
      supabase,
      body.material_id,
      body.action_type ?? "download",
    );
    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to record download";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
