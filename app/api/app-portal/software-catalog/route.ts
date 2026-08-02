import { NextResponse } from "next/server";
import { loadSoftwareCatalog } from "@/lib/app-portal/software-catalog";
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
    const catalog = await loadSoftwareCatalog(supabase);
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
