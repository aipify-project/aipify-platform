import { NextResponse } from "next/server";
import { extractBearerToken } from "@/lib/desktop/session-auth";
import { createClient } from "@/lib/supabase/server";

export async function withDesktopToken<T>(
  request: Request,
  handler: (token: string, supabase: Awaited<ReturnType<typeof createClient>>) => Promise<T>
) {
  const token = extractBearerToken(request);
  if (!token) {
    return NextResponse.json({ error: "Missing session token" }, { status: 401 });
  }
  const supabase = await createClient();
  return handler(token, supabase);
}
