import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { DEFAULT_LOCALE, LOCALE_COOKIE, type Locale } from "@/lib/i18n/config";
import { isAppLocale, resolveAppLocale } from "@/lib/i18n/app-locales";
import { isPublicFooterEnabledLocale } from "@/lib/i18n/public-locales";
import { createClient } from "@/lib/supabase/server";

type Body = {
  locale?: string;
  scope?: "app" | "public";
};

function resolveRequestedLocale(requested: string, scope: "app" | "public"): Locale {
  if (scope === "app") {
    return resolveAppLocale(requested);
  }
  if (isPublicFooterEnabledLocale(requested)) {
    return requested;
  }
  return DEFAULT_LOCALE;
}

export async function POST(request: Request) {
  let body: Body = {};
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  const scope = body.scope === "app" ? "app" : "public";
  const requested = typeof body.locale === "string" ? body.locale : DEFAULT_LOCALE;
  const locale = resolveRequestedLocale(requested, scope);

  if (scope === "app" && !isAppLocale(locale)) {
    return NextResponse.json({ ok: false, error: "Unsupported locale" }, { status: 400 });
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user && scope === "app") {
      await supabase.rpc("update_user_preferred_locale", { p_locale: locale });
    }
  } catch {
    // Cookie persistence still applies when profile update is unavailable.
  }

  const response = NextResponse.json({ ok: true, locale, scope });
  response.cookies.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  return response;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const scope = url.searchParams.get("scope") === "app" ? "app" : "public";
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get(LOCALE_COOKIE)?.value ?? null;
  const acceptLanguage = request.headers.get("accept-language");

  if (scope === "app" && cookieLocale && isAppLocale(cookieLocale)) {
    return NextResponse.json({ locale: cookieLocale, source: "cookie" });
  }

  if (scope === "public" && cookieLocale && isPublicFooterEnabledLocale(cookieLocale)) {
    return NextResponse.json({ locale: cookieLocale, source: "cookie" });
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("resolve_app_ui_locale", {
      p_accept_language: acceptLanguage,
    });
    if (!error && data && typeof data === "object") {
      const payload = data as { locale?: string; source?: string };
      if (payload.locale) {
        return NextResponse.json(payload);
      }
    }
  } catch {
    // Fall through to default.
  }

  return NextResponse.json({ locale: DEFAULT_LOCALE, source: "default" });
}
