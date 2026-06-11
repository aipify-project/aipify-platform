import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_customer_modules_center");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Modules center request failed" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      module_key?: string;
      enabled?: boolean;
      status?: string;
    };

    if (!body.module_key) {
      return NextResponse.json({ error: "module_key required" }, { status: 400 });
    }

    const { error } = await supabase.rpc("update_tenant_module", {
      p_module_key: body.module_key,
      p_enabled: body.enabled ?? null,
      p_status: body.status ?? null,
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    const { data: center, error: centerError } = await supabase.rpc(
      "get_customer_modules_center"
    );
    if (centerError) return NextResponse.json({ error: centerError.message }, { status: 400 });

    return NextResponse.json(center);
  } catch {
    return NextResponse.json({ error: "Module update failed" }, { status: 500 });
  }
}
