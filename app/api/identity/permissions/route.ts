import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const key = new URL(request.url).searchParams.get("key");
    if (!key) return NextResponse.json({ error: "key required" }, { status: 400 });

    const { data, error } = await supabase.rpc("check_identity_permission", {
      p_permission_key: key,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to check permission" }, { status: 500 });
  }
}
