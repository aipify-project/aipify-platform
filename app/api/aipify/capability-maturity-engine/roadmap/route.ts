import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as { domain?: string; status?: string };

    const { data, error } = await supabase.rpc("generate_maturity_roadmap", {
      p_domain: body.domain ?? null,
      p_status: body.status ?? "active",
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to generate roadmap" }, { status: 500 });
  }
}
