import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      integration_key?: string;
      configuration?: Record<string, unknown>;
    };
    if (!body.integration_key) {
      return NextResponse.json({ error: "integration_key required" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("create_organization_integration", {
      p_integration_key: body.integration_key,
      p_configuration: body.configuration ?? {},
      p_secret: null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to create integration" }, { status: 500 });
  }
}
