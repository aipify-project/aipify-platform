import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { getPostLoginPath } from "@/lib/auth/get-post-login-path";
import {
  classifyPasswordSignInFailure,
  parsePasswordSignInPayload,
} from "@/lib/auth/password-sign-in";
import { sanitizeNextPath } from "@/lib/auth/safe-next-path";
import { isFetchNetworkError } from "@/lib/pwa/manifest-audit";
import { createRouteHandlerSupabaseClient } from "@/lib/supabase/route-handler";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const credentials = parsePasswordSignInPayload(body);
    const nextPath =
      body && typeof body === "object" && typeof (body as Record<string, unknown>).next === "string"
        ? sanitizeNextPath((body as Record<string, unknown>).next as string)
        : null;

    if (!credentials) {
      return NextResponse.json({ error: "required_fields" }, { status: 400 });
    }

    const { supabase, applyCookies } = await createRouteHandlerSupabaseClient();
    await supabase.auth.signOut({ scope: "local" });

    const { data, error } = await supabase.auth.signInWithPassword(credentials);

    if (error) {
      const failure = classifyPasswordSignInFailure(error.message);
      return NextResponse.json(
        {
          error: failure,
          message: error.message,
        },
        { status: failure === "invalid_credentials" || failure === "email_not_confirmed" ? 401 : failure === "network" ? 503 : 500 },
      );
    }

    if (!data.session) {
      return NextResponse.json({ error: "auth_failed" }, { status: 500 });
    }

    const headerStore = await headers();
    const host = headerStore.get("host");
    const destination = await getPostLoginPath(supabase, nextPath, host);

    return applyCookies(
      NextResponse.json({
        ok: true,
        destination,
      }),
    );
  } catch (caught) {
    const message = caught instanceof Error ? caught.message : "auth_failed";
    const failure = isFetchNetworkError(message) ? "network" : "auth_failed";
    return NextResponse.json(
      {
        error: failure,
        message,
      },
      { status: failure === "network" ? 503 : 500 },
    );
  }
}
