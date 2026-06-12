import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      verification_type?: string;
      metadata?: Record<string, unknown>;
    };

    if (!body.verification_type) {
      return NextResponse.json({ error: "verification_type required" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("request_organization_trust_verification", {
      p_verification_type: body.verification_type,
      p_metadata: body.metadata ?? {},
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to request verification" }, { status: 500 });
  }
}
