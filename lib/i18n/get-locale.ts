import { cookies, headers } from "next/headers";
import { DEFAULT_LOCALE, LOCALE_COOKIE, type Locale } from "./config";
import { resolveAppUiLocale, resolvePublicLocale } from "./resolve-locale";
import { createClient } from "@/lib/supabase/server";

function isAppScopedPath(pathname: string): boolean {
  return pathname.startsWith("/app") || pathname.startsWith("/dashboard");
}

async function loadAuthenticatedLocaleHints(): Promise<{
  userPreferredLocale: string | null;
  organizationDefaultLanguage: string | null;
}> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { userPreferredLocale: null, organizationDefaultLanguage: null };
    }

    const { data: profile } = await supabase
      .from("users")
      .select("preferred_locale, company_id")
      .eq("auth_user_id", user.id)
      .maybeSingle();

    let organizationDefaultLanguage: string | null = null;

    if (profile?.company_id) {
      const { data: customer } = await supabase
        .from("customers")
        .select("id")
        .eq("company_id", profile.company_id)
        .maybeSingle();

      if (customer?.id) {
        const { data: org } = await supabase
          .from("organizations")
          .select("default_language")
          .eq("id", customer.id)
          .maybeSingle();
        organizationDefaultLanguage =
          typeof org?.default_language === "string" ? org.default_language : null;
      }
    }

    return {
      userPreferredLocale:
        typeof profile?.preferred_locale === "string" ? profile.preferred_locale : null,
      organizationDefaultLanguage,
    };
  } catch {
    return { userPreferredLocale: null, organizationDefaultLanguage: null };
  }
}

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const headerStore = await headers();
  const cookieLocale = cookieStore.get(LOCALE_COOKIE)?.value ?? null;
  const acceptLanguage = headerStore.get("accept-language");
  const pathname = headerStore.get("x-pathname") ?? headerStore.get("x-invoke-path") ?? "/";

  if (isAppScopedPath(pathname)) {
    const hints = await loadAuthenticatedLocaleHints();
    return resolveAppUiLocale({
      cookieLocale,
      acceptLanguage,
      ...hints,
    }).locale;
  }

  return resolvePublicLocale({ cookieLocale, acceptLanguage }).locale;
}

export async function getLocaleResolution() {
  const cookieStore = await cookies();
  const headerStore = await headers();
  const cookieLocale = cookieStore.get(LOCALE_COOKIE)?.value ?? null;
  const acceptLanguage = headerStore.get("accept-language");
  const pathname = headerStore.get("x-pathname") ?? headerStore.get("x-invoke-path") ?? "/";

  if (isAppScopedPath(pathname)) {
    const hints = await loadAuthenticatedLocaleHints();
    return resolveAppUiLocale({
      cookieLocale,
      acceptLanguage,
      ...hints,
    });
  }

  return resolvePublicLocale({ cookieLocale, acceptLanguage });
}

export { DEFAULT_LOCALE, LOCALE_COOKIE };
