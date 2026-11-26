import { NextRequest, NextResponse } from "next/server";
import {
  getStoredSupportSignature,
  resetSupportSignature,
  saveSupportSignature,
} from "@/lib/platform-portal/support-center/signature-store";
import { createClient } from "@/lib/supabase/server";

const NO_STORE = { "Cache-Control": "no-store" } as const;

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/** Current workspace signature (company defaults until one is saved). */
export async function GET() {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: NO_STORE });
  }
  return NextResponse.json(
    { ok: true, ...getStoredSupportSignature() },
    { headers: NO_STORE },
  );
}

/**
 * Save or reset the workspace signature (in-process; Core persistence gated).
 * Body: { action: "save", signature } | { action: "reset" }.
 * Reset only runs on explicit request — the form's "restore defaults" never calls it.
 */
export async function POST(request: NextRequest) {
  const user = await requireUser();
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

  if (body.action === "save") {
    const result = saveSupportSignature(body.signature);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400, headers: NO_STORE });
    }
    return NextResponse.json(result, { headers: NO_STORE });
  }

  if (body.action === "reset") {
    const result = resetSupportSignature();
    return NextResponse.json(result, { headers: NO_STORE });
  }

  return NextResponse.json({ error: "unknown_action" }, { status: 400, headers: NO_STORE });
}
