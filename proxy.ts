import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/update-session";

export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/app",
    "/app/:path*",
    "/platform",
    "/platform/:path*",
    "/login",
    "/register",
  ],
};
