import { NextResponse, type NextRequest } from "next/server";
import { updateSession, withPathnameRequestHeaders } from "@/lib/supabase/update-session";
import {
  hasOrganizationAccessIntentQuery,
  ORGANIZATION_ACCESS_INTENT_COOKIE,
  serializeOrganizationAccessIntentQuery,
} from "@/lib/core/organization-access-approval/access-intent-binding";

function stripOrganizationAccessIntentQuery(request: NextRequest): NextResponse | null {
  if (request.nextUrl.pathname !== "/app/settings/organization-access") return null;

  const params = Object.fromEntries(request.nextUrl.searchParams.entries());
  if (!hasOrganizationAccessIntentQuery(params)) return null;

  const cleanUrl = request.nextUrl.clone();
  cleanUrl.search = "";
  const response = NextResponse.redirect(cleanUrl);
  response.cookies.set(
    ORGANIZATION_ACCESS_INTENT_COOKIE,
    serializeOrganizationAccessIntentQuery(params),
    {
      path: "/app/settings/organization-access",
      maxAge: 120,
      sameSite: "lax",
      httpOnly: false,
    },
  );
  return response;
}

function requiresSessionProxy(pathname: string): boolean {
  return (
    pathname === "/" ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/app") ||
    pathname.startsWith("/platform") ||
    pathname.startsWith("/super") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/auth/") ||
    pathname.startsWith("/api/")
  );
}

export async function proxy(request: NextRequest) {
  const strippedIntent = stripOrganizationAccessIntentQuery(request);
  if (strippedIntent) return strippedIntent;

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
