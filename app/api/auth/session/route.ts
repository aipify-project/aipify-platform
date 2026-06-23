import { NextResponse } from "next/server";
import { buildSafeSessionMetadata } from "@/lib/auth/session-diagnostics";
import { isFetchNetworkError } from "@/lib/pwa/manifest-audit";
import { createRouteHandlerSupabaseClient } from "@/lib/supabase/route-handler";
import {
  getAuthenticatedUserFromSession,
  isSessionAccessValid,
} from "@/lib/supabase/session-auth";

export async function GET() {
  try {
    const { supabase, applyCookies } = await createRouteHandlerSupabaseClient();
    const user = await getAuthenticatedUserFromSession(supabase);

    if (user?.id) {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      return applyCookies(
        NextResponse.json({
          authenticated: true,
          userId: user.id,
          session: buildSafeSessionMetadata({ user, session }),
        }),
      );
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.refresh_token && !isSessionAccessValid(session)) {
      return applyCookies(
        NextResponse.json({ authenticated: false, transient: true }, { status: 503 }),
      );
    }

    return applyCookies(NextResponse.json({ authenticated: false }, { status: 401 }));
  } catch (caught) {
    const message = caught instanceof Error ? caught.message : "";
    const transient = isFetchNetworkError(message);
    return NextResponse.json(
      { authenticated: false, transient },
      { status: transient ? 503 : 500 },
    );
  }
}
