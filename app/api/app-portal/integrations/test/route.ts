import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { runUnonightAppPortalConnectionTest } from "@/lib/unonight/connection/run-test";
import { UNONIGHT_PROVIDER_KEY } from "@/lib/unonight/connection/constants";

const NO_STORE = { "Cache-Control": "no-store" };

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { connection_id?: string; activation?: boolean };
    if (!body.connection_id) {
      return NextResponse.json({ error: "connection_id required" }, { status: 400, headers: NO_STORE });
    }

    const supabase = await createClient();
    const materialRes = await supabase.rpc("get_app_portal_integration_test_material", {
      p_connection_id: body.connection_id,
    });

    if (materialRes.error) {
      return NextResponse.json({ error: "Connection test could not be completed" }, { status: 400, headers: NO_STORE });
    }

    const material = materialRes.data as { provider_key?: string } | null;
    let result: Record<string, unknown>;

    if (material?.provider_key === UNONIGHT_PROVIDER_KEY) {
      const testResult = await runUnonightAppPortalConnectionTest(supabase, body.connection_id);
      if (testResult.success === false && testResult.error) {
        return NextResponse.json({ error: String(testResult.error) }, { status: 400, headers: NO_STORE });
      }
      result = testResult;
    } else {
      const { data, error } = await supabase.rpc("test_app_portal_integration_connection", {
        p_connection_id: body.connection_id,
      });
      if (error) {
        return NextResponse.json({ error: "Connection test could not be completed" }, { status: 400, headers: NO_STORE });
      }
      result = (data as Record<string, unknown>) ?? {};
    }

    if (body.activation === true && result.success !== false) {
      const activateRes = await supabase.rpc("activate_app_portal_integration_connection", {
        p_connection_id: body.connection_id,
      });
      if (activateRes.error) {
        return NextResponse.json({ error: "Activation could not be completed" }, { status: 400, headers: NO_STORE });
      }
      return NextResponse.json(activateRes.data, { headers: NO_STORE });
    }

    return NextResponse.json(result, { headers: NO_STORE });
  } catch {
    return NextResponse.json({ error: "Connection test could not be completed" }, { status: 500, headers: NO_STORE });
  }
}
