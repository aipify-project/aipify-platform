import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { SYSTEM_TYPES, type SystemType } from "@/lib/tenant/types";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const systemType = body.system_type as SystemType;

    if (!SYSTEM_TYPES.includes(systemType)) {
      return NextResponse.json(
        { error: "Invalid system type" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase.rpc("create_installation", {
      p_system_type: systemType,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const row = data?.[0];

    if (!row) {
      return NextResponse.json(
        { error: "Failed to create installation" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      installation_id: row.installation_id,
      installation_token: row.installation_token,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to create installation" },
      { status: 500 }
    );
  }
}
