import { NextResponse } from "next/server";
import {
  mapKompisOperatorRpcError,
  parseCreateConversationInput,
} from "@/lib/kompis-operator/parse";
import { requireReadyAppPortalContext } from "@/lib/tenant/app-portal-route-access";
import { createClient } from "@/lib/supabase/server";

const headers = { "Cache-Control": "no-store" };

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized", code: "unauthorized" }, { status: 401, headers });
    }
    const access = await requireReadyAppPortalContext(supabase);
    if (!access.ok) return access.response;
    const { data, error } = await supabase.rpc("list_app_kompis_operator_conversations", {
      p_limit: 20,
    });
    if (error) {
      const mapped = mapKompisOperatorRpcError(error.message);
      return NextResponse.json(
        { error: "Unable to load conversations.", code: mapped.code },
        { status: mapped.status, headers },
      );
    }
    return NextResponse.json({ conversations: data ?? [] }, { headers });
  } catch {
    return NextResponse.json({ error: "Unable to load conversations.", code: "unknown" }, { status: 500, headers });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized", code: "unauthorized" }, { status: 401, headers });
    }
    const access = await requireReadyAppPortalContext(supabase);
    if (!access.ok) return access.response;
    const input = parseCreateConversationInput(await request.json().catch(() => null));
    if (!input.ok) {
      return NextResponse.json({ error: "Invalid input.", code: input.code }, { status: 400, headers });
    }
    const { data, error } = await supabase.rpc("create_app_kompis_operator_conversation", {
      p_title: input.title,
      p_locale: input.locale,
    });
    if (error) {
      const mapped = mapKompisOperatorRpcError(error.message);
      return NextResponse.json(
        { error: "Unable to create conversation.", code: mapped.code },
        { status: mapped.status, headers },
      );
    }
    return NextResponse.json(data, { status: 201, headers });
  } catch {
    return NextResponse.json({ error: "Unable to create conversation.", code: "unknown" }, { status: 500, headers });
  }
}
