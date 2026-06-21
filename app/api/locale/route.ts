import { NextResponse } from "next/server";
import { DEFAULT_LOCALE, isValidLocale, LOCALE_COOKIE, type Locale } from "@/lib/i18n/config";
import { isPublicFooterEnabledLocale } from "@/lib/i18n/public-locales";

type Body = {
  locale?: string;
};

export async function POST(request: Request) {
  let body: Body = {};
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  const requested = typeof body.locale === "string" ? body.locale : DEFAULT_LOCALE;
  const locale: Locale =
    isPublicFooterEnabledLocale(requested) && isValidLocale(requested) ? requested : DEFAULT_LOCALE;

  const response = NextResponse.json({ ok: true, locale });
  response.cookies.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  return response;
}
