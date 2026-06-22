import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { runUnonightAppPortalConnectionTest } from "@/lib/unonight/connection/run-test";
import { UNONIGHT_PROVIDER_KEY } from "@/lib/unonight/connection/constants";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { connection_id?: string };
    if (!body.connection_id) {
      return NextResponse.json({ error: "connection_id required" }, { status: 400 });
    }

    const supabase = await createClient();
    const materialRes = await supabase.rpc("get_app_portal_integration_test_material", {
      p_connection_id: body.connection_id,
    });

    if (materialRes.error) {
      return NextResponse.json({ error: materialRes.error.message }, { status: 400 });
    }

    const material = materialRes.data as { provider_key?: string } | null;
    if (material?.provider_key === UNONIGHT_PROVIDER_KEY) {
      const result = await runUnonightAppPortalConnectionTest(supabase, body.connection_id);
      if (result.success === false && result.error) {
        return NextResponse.json({ error: String(result.error) }, { status: 400 });
      }
      return NextResponse.json(result);
    }

    const { data, error } = await supabase.rpc("test_app_portal_integration_connection", {
      p_connection_id: body.connection_id,
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to test integration" }, { status: 500 });
  }
}
