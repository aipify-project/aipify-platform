import { NextRequest, NextResponse } from "next/server";
import {
  listSupportTemplatesForUser,
  mutateSupportTemplateForUser,
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

/** List templates from Core when available; workspace fallback + one-time migrate. */
export async function GET(request: NextRequest) {
  const { supabase, user } = await requireClient();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: NO_STORE });
  }
  try {
    const includeArchived =
      request.nextUrl.searchParams.get("include_archived") === "1" ||
      request.nextUrl.searchParams.get("include_archived") === "true";
    const result = await listSupportTemplatesForUser({
      rpc: supabase,
      includeArchived,
    });
    return NextResponse.json(result, { headers: NO_STORE });
  } catch (error) {
    if (error instanceof Error && error.message === "forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403, headers: NO_STORE });
    }
    return NextResponse.json({ error: "list_failed" }, { status: 500, headers: NO_STORE });
  }
}

/** Create / update / archive — Core upsert/archive when persist RPCs exist. */
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

  if (
    body.action !== "create" &&
    body.action !== "update" &&
    body.action !== "archive"
  ) {
    return NextResponse.json({ error: "unknown_action" }, { status: 400, headers: NO_STORE });
  }

  const result = await mutateSupportTemplateForUser({
    rpc: supabase,
    action: body.action,
    body,
  });
  if (!result.ok) {
    return NextResponse.json(
      { error: result.error },
      { status: "status" in result && result.status ? result.status : 400, headers: NO_STORE },
    );
  }
  return NextResponse.json(result, { headers: NO_STORE });
}
