import { NextResponse } from "next/server";
import { headers } from "next/headers";
import {
  buildPasswordResetRedirectUrl,
  readRequestHostFromHeaders,
} from "@/lib/auth/auth-redirect-urls";
import { createClient } from "@/lib/supabase/server";

function normalizeEmail(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim().toLowerCase();
  return trimmed || null;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: unknown };
    const email = normalizeEmail(body.email);

    if (!email) {
      return NextResponse.json({ error: "email_required" }, { status: 400 });
    }

    const supabase = await createClient();
    const headerStore = await headers();
    const redirectTo = buildPasswordResetRedirectUrl({
      requestHost: readRequestHostFromHeaders(headerStore),
    });

    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true, redirectToHost: new URL(redirectTo).host });
  } catch {
    return NextResponse.json({ error: "request_failed" }, { status: 500 });
  }
}
