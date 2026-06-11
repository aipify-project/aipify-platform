import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_communication_digests", { p_limit: 20 });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ digests: data ?? [] });
  } catch {
    return NextResponse.json({ error: "Failed to load digests" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as { digest_type?: string };
    const { data, error } = await supabase.rpc("generate_communication_digest", {
      p_digest_type: body.digest_type ?? "daily",
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to generate digest" }, { status: 500 });
  }
}
