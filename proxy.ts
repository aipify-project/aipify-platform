import { NextResponse, type NextRequest } from "next/server";
import { updateSession, withPathnameRequestHeaders } from "@/lib/supabase/update-session";

function requiresSessionProxy(pathname: string): boolean {
  return (
    pathname === "/" ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/app") ||
    pathname.startsWith("/platform") ||
    pathname.startsWith("/super") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/api/")
  );
}

export async function proxy(request: NextRequest) {
  if (requiresSessionProxy(request.nextUrl.pathname)) {
    return updateSession(request);
  }

  return NextResponse.next({
    request: { headers: withPathnameRequestHeaders(request) },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
