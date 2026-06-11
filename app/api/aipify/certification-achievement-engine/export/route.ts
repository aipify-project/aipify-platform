import { NextResponse } from "next/server";
import { parseCertificateExportPayload } from "@/lib/aipify/certification-achievement-engine";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as { user_certification_id: string };

    const { data, error } = await supabase.rpc("export_user_certificate", {
      p_user_certification_id: body.user_certification_id,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseCertificateExportPayload(data));
  } catch {
    return NextResponse.json({ error: "Failed to export certificate" }, { status: 500 });
  }
}
