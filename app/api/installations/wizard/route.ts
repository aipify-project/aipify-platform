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
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const systemType = (body.system_type as SystemType) ?? "custom";

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    if (!SYSTEM_TYPES.includes(systemType)) {
      return NextResponse.json({ error: "Invalid system type" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("create_installation_draft", {
      p_name: name,
      p_system_type: systemType,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to start installation wizard" },
      { status: 500 }
    );
  }
}
