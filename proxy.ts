import { NextResponse, type NextRequest } from "next/server";
import { updateSession, withPathnameRequestHeaders } from "@/lib/supabase/update-session";
import {
  authGuardUnavailableResponse,
  classifyPrivilegedPlatformRequest,
  guardPrivilegedPlatformApiByClassification,
  PlatformAuthGuardUnavailableError,
} from "@/lib/auth/platform-server-access";
import { createServerClient } from "@supabase/ssr";
import { mergeAuthCookieOptions } from "@/lib/supabase/auth-cookies";
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

  const pathname = request.nextUrl.pathname;
  const classification = classifyPrivilegedPlatformRequest({
    pathname,
    method: request.method,
    searchParams: request.nextUrl.searchParams,
  });

  if (classification.privileged) {
    const platformApiGuard = await enforcePrivilegedPlatformApiAtEdge(request, classification);
    if (platformApiGuard) return platformApiGuard;
  }

  if (requiresSessionProxy(pathname)) {
    return updateSession(request);
  }

  return NextResponse.next({
    request: { headers: withPathnameRequestHeaders(request) },
  });
}

async function enforcePrivilegedPlatformApiAtEdge(
  request: NextRequest,
  classification: ReturnType<typeof classifyPrivilegedPlatformRequest>,
): Promise<NextResponse | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    return authGuardUnavailableResponse();
  }

  let response = NextResponse.next({
    request: { headers: withPathnameRequestHeaders(request) },
  });

  const host = request.headers.get("host");
  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        response = NextResponse.next({
          request: { headers: withPathnameRequestHeaders(request) },
        });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, mergeAuthCookieOptions(options, host));
        });
      },
    },
  });

  try {
    return await guardPrivilegedPlatformApiByClassification(supabase, classification);
  } catch (error) {
    if (error instanceof PlatformAuthGuardUnavailableError) {
      return authGuardUnavailableResponse();
    }
    throw error;
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
