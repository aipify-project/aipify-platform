import { NextResponse } from "next/server";
import { buildSoftwareCatalogLocalizers } from "@/lib/app-portal/software-catalog/localize";
import { loadSoftwareCatalog } from "@/lib/app-portal/software-catalog";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/** Read-only software catalog — no mutations, no invoice creation. */
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ found: false, error: "unauthenticated" }, { status: 401 });
  }

  try {
    const locale = await getLocale();
    const dict = await getCustomerAppDictionaryForSplits(locale, ["portalStructure"]);
    const catalog = await loadSoftwareCatalog(supabase, buildSoftwareCatalogLocalizers(dict));
    return NextResponse.json(catalog);
  } catch (error) {
    const message = error instanceof Error ? error.message.slice(0, 160) : "catalog_unavailable";
    console.error("[software-catalog]", message);
    return NextResponse.json(
      {
        found: false,
        error: "software_catalog_unavailable",
        items: [],
        sections: { packages: false, modules: false, businessPacks: false },
        referencePackKey: "aipify_hosts",
        partial: true,
        diagnostics: ["api_error"],
      },
      { status: 503 }
    );
  }
}
