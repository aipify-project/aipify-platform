import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { sanitizeNextPath } from "@/lib/auth/safe-next-path";
import {
  buildCustomerPortalUrl,
  resolveCustomerPortalLoginUrl,
  resolveLoginPageCanonicalRedirect,
} from "@/lib/portals/customer-portal-url";
import {
  getPlatformAccessProfile,
  isSuperAdminHost,
  resolvePortalRouteDecision,
  resolvePostLoginPath,
  shouldCanonicalizeToCustomerPortal,
} from "@/lib/portals";
import { mergeAuthCookieOptions } from "@/lib/supabase/auth-cookies";

const PROTECTED_PREFIXES = ["/dashboard", "/app", "/platform", "/super"];

function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

/** Forward pathname for server-side locale resolution (`lib/i18n/get-locale.ts`). */
export function withPathnameRequestHeaders(request: NextRequest): Headers {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);
  return requestHeaders;
}

export async function updateSession(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const host = request.headers.get("host");

  if (shouldCanonicalizeToCustomerPortal(host, pathname)) {
    const canonicalUrl = buildCustomerPortalUrl(
      request,
      pathname,
      request.nextUrl.search
    );
    return NextResponse.redirect(canonicalUrl);
  }

  if (pathname === "/login" || pathname === "/register") {
    const canonicalLogin = resolveLoginPageCanonicalRedirect(
      request,
      host,
      request.nextUrl.searchParams.get("next")
    );
    if (canonicalLogin) {
      return NextResponse.redirect(canonicalLogin);
    }
  }

  let supabaseResponse = NextResponse.next({
    request: { headers: withPathnameRequestHeaders(request) },
  });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return supabaseResponse;
  }

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
        cookiesToSet.forEach(({ name, value }: { name: string; value: string }) => {
          request.cookies.set(name, value);
        });
        supabaseResponse = NextResponse.next({
          request: { headers: withPathnameRequestHeaders(request) },
        });
        cookiesToSet.forEach(({ name, value, options }: { name: string; value: string; options?: Record<string, unknown> }) => {
          supabaseResponse.cookies.set(
            name,
            value,
            mergeAuthCookieOptions(options, host)
          );
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && isProtectedPath(pathname)) {
    if (shouldCanonicalizeToCustomerPortal(host, pathname)) {
      return NextResponse.redirect(resolveCustomerPortalLoginUrl(request, pathname));
    }

    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    const safeNext = sanitizeNextPath(pathname);
    loginUrl.searchParams.set("next", safeNext ?? pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (user) {
    const access = await getPlatformAccessProfile(supabase);
    const decision = resolvePortalRouteDecision(pathname, host, access);

    if (decision.action === "redirect") {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = decision.pathname;
      redirectUrl.search = "";
      return NextResponse.redirect(redirectUrl);
    }

    if (decision.action === "rewrite") {
      const rewriteUrl = request.nextUrl.clone();
      rewriteUrl.pathname = decision.pathname;
      return NextResponse.rewrite(rewriteUrl);
    }

    if (pathname === "/login" || pathname === "/register") {
      const next = request.nextUrl.searchParams.get("next");
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = resolvePostLoginPath(host, access.role, next);
      redirectUrl.search = "";
      return NextResponse.redirect(redirectUrl);
    }
  }

  if (isSuperAdminHost(host) && (pathname === "/" || pathname === "")) {
    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = "/super";
    return NextResponse.rewrite(rewriteUrl);
  }

  return supabaseResponse;
}
