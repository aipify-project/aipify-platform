import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("export_goals_data");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return new NextResponse(JSON.stringify(data, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": 'attachment; filename="aipify-goals-export.json"',
      },
    });
  } catch {
    return NextResponse.json({ error: "Goals export failed" }, { status: 500 });
  }
}
