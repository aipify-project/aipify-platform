import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: center, error: centerError } = await supabase.rpc(
      "get_customer_employee_knowledge_center"
    );
    if (centerError) return NextResponse.json({ error: centerError.message }, { status: 400 });

    const health = (center as { health?: unknown })?.health ?? null;
    return NextResponse.json({ health });
  } catch {
    return NextResponse.json({ error: "Health request failed" }, { status: 500 });
  }
}
