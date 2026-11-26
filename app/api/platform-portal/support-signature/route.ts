import { NextRequest, NextResponse } from "next/server";
import {
  loadSupportSignatureForUser,
  resetSupportSignatureForUser,
  saveSupportSignatureForUser,
} from "@/lib/platform-portal/support-center/persist-ops";
import { createClient } from "@/lib/supabase/server";

const NO_STORE = { "Cache-Control": "no-store" } as const;

async function requireClient() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}

/** Active signature from Core when available; workspace fallback otherwise. */
export async function GET() {
  const { supabase, user } = await requireClient();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: NO_STORE });
  }
  try {
    const result = await loadSupportSignatureForUser({ rpc: supabase });
    return NextResponse.json(result, { headers: NO_STORE });
  } catch (error) {
    if (error instanceof Error && error.message === "forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403, headers: NO_STORE });
    }
    return NextResponse.json({ error: "load_failed" }, { status: 500, headers: NO_STORE });
  }
}

/**
 * Save or reset signature.
 * Body: { action: "save", signature } | { action: "reset" }.
 * Uses Core upsert when persist RPCs exist; preserves workspace mirror.
 */
export async function POST(request: NextRequest) {
  const { supabase, user } = await requireClient();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: NO_STORE });
  }

  const body = (await request.json().catch(() => null)) as Record<
    string,
    unknown
  > | null;
  if (!body || typeof body.action !== "string") {
    return NextResponse.json({ error: "validation" }, { status: 400, headers: NO_STORE });
  }

  try {
    if (body.action === "save") {
      const result = await saveSupportSignatureForUser({
        rpc: supabase,
        signature: body.signature,
      });
      if (!result.ok) {
        return NextResponse.json(
          { error: result.error },
          { status: result.status ?? 400, headers: NO_STORE },
        );
      }
      return NextResponse.json(result, { headers: NO_STORE });
    }

    if (body.action === "reset") {
      const result = await resetSupportSignatureForUser({ rpc: supabase });
      return NextResponse.json(result, { headers: NO_STORE });
    }
  } catch (error) {
    if (error instanceof Error && error.message === "forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403, headers: NO_STORE });
    }
    return NextResponse.json({ error: "save_failed" }, { status: 500, headers: NO_STORE });
  }

  return NextResponse.json({ error: "unknown_action" }, { status: 400, headers: NO_STORE });
}
