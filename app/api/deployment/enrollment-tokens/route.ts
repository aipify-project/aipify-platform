import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as Record<string, unknown>;
    const { data, error } = await supabase.rpc("create_deployment_enrollment_token", {
      p_token_name: body.token_name as string,
      p_allowed_domains: (body.allowed_domains as string[]) ?? [],
      p_max_uses: (body.max_uses as number) ?? 1,
      p_expires_at: (body.expires_at as string) ?? null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to create enrollment token" }, { status: 500 });
  }
}
