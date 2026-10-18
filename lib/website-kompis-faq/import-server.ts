import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { parseWebsiteKompisFaqList } from "@/lib/website-kompis-faq/parse";
import { parseFaqImportCsv } from "@/lib/website-kompis-faq/import-csv";
import {
  planFaqImport,
  type FaqImportExistingIdentity,
  type FaqImportPlan,
  type PlannedFaqImportRow,
} from "@/lib/website-kompis-faq/import-plan";
import {
  FAQ_IMPORT_DUPLICATE_MAX_PAGES,
  FAQ_IMPORT_DUPLICATE_PAGE_SIZE,
  FAQ_IMPORT_MAX_BYTES,
  type FaqImportColumnTarget,
} from "@/lib/website-kompis-faq/import-schema";
import { readFaqImportXlsx } from "@/lib/website-kompis-faq/import-xlsx";
import {
  filterWebsiteKompisFaqItemsForSiteContext,
  requireInstallIdForFaqWrite,
  loadWebsiteKompisOwnedSites,
} from "@/lib/website-kompis-site-context";

export type ParsedFaqImportFile = {
  plan: FaqImportPlan;
  sheets: string[];
  selectedSheet: string | null;
  scanTruncated: boolean;
  installId: string | null;
  domain: string | null;
};

export async function requireFaqImportUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  return { supabase };
}

export async function parseFaqImportRequest(
  supabase: SupabaseClient,
  form: FormData,
): Promise<{ error: NextResponse } | { parsed: ParsedFaqImportFile; ready: PlannedFaqImportRow[] }> {
  const file = form.get("file");
  if (!(file instanceof File)) {
    return { error: NextResponse.json({ error: "file_required" }, { status: 400 }) };
  }
  if (file.size > FAQ_IMPORT_MAX_BYTES || file.size === 0) {
    return { error: NextResponse.json({ error: "file_size" }, { status: 400 }) };
  }
  const name = file.name.toLowerCase();
  if (name.endsWith(".xlsm") || name.endsWith(".xls")) {
    return { error: NextResponse.json({ error: "file_type" }, { status: 400 }) };
  }
  const bytes = new Uint8Array(await file.arrayBuffer());
  const xlsx = name.endsWith(".xlsx") || (bytes[0] === 0x50 && bytes[1] === 0x4b);
  const csv = name.endsWith(".csv") || name.endsWith(".txt");
  if (!xlsx && !csv) return { error: NextResponse.json({ error: "file_type" }, { status: 400 }) };

  const requestedInstall = typeof form.get("installId") === "string" ? String(form.get("installId")) : null;
  const { sites } = await loadWebsiteKompisOwnedSites(supabase);
  const writeGate = requireInstallIdForFaqWrite({
    sites,
    requestedInstallId: requestedInstall,
    isUpdate: false,
    existingInstallId: null,
  });
  if (!writeGate.ok) {
    return { error: NextResponse.json({ error: "site_required", code: writeGate.reason }, { status: 400 }) };
  }

  const mapping = readMapping(form.get("mapping"));
  const sheet = typeof form.get("sheet") === "string" ? String(form.get("sheet")) : "";
  let table;
  let formulaCells: string[] = [];
  let sheets: string[] = [];
  let selectedSheet: string | null = null;
  if (xlsx) {
    const workbook = readFaqImportXlsx(bytes, sheet || undefined);
    if ("error" in workbook) {
      return { error: NextResponse.json({ error: workbook.error }, { status: 400 }) };
    }
    sheets = workbook.sheets;
    selectedSheet = workbook.selectedSheet;
    formulaCells = workbook.formulaCells;
    if (!workbook.table) {
      return {
        error: NextResponse.json({
          error: "sheet_required",
          sheets,
        }, { status: 409 }),
      };
    }
    table = workbook.table;
  } else {
    const parsed = parseFaqImportCsv(bytes);
    if ("error" in parsed) return { error: NextResponse.json({ error: parsed.error }, { status: 400 }) };
    table = parsed.table;
  }

  const identities = await loadFaqImportIdentities(supabase, writeGate.installId);
  const plan = planFaqImport({
    table,
    mapping,
    formulaCells,
    installId: writeGate.installId,
    existing: identities.rows,
  });
  return {
    parsed: {
      plan,
      sheets,
      selectedSheet,
      scanTruncated: identities.truncated,
      installId: writeGate.installId,
      domain: writeGate.domain,
    },
    ready: plan.rows.filter((row) => row.status === "ready"),
  };
}

function readMapping(value: FormDataEntryValue | null): Record<string, FaqImportColumnTarget> | undefined {
  if (typeof value !== "string" || !value.trim()) return undefined;
  try {
    const parsed = JSON.parse(value) as Record<string, unknown>;
    const mapping: Record<string, FaqImportColumnTarget> = {};
    for (const [header, target] of Object.entries(parsed)) {
      if (
        target === "ignore" ||
        target === "status" ||
        target === "question" ||
        target === "title" ||
        target === "answer" ||
        target === "category" ||
        target === "locale" ||
        target === "tags" ||
        target === "permanent" ||
        target === "validFrom" ||
        target === "validUntil" ||
        target === "reference"
      ) {
        mapping[header] = target;
      }
    }
    return Object.keys(mapping).length > 0 ? mapping : undefined;
  } catch {
    return undefined;
  }
}

async function loadFaqImportIdentities(
  supabase: SupabaseClient,
  installId: string | null,
): Promise<{ rows: FaqImportExistingIdentity[]; truncated: boolean }> {
  const rows: FaqImportExistingIdentity[] = [];
  for (let page = 0; page < FAQ_IMPORT_DUPLICATE_MAX_PAGES; page += 1) {
    const { data, error } = await supabase.rpc("list_tenant_public_companion_faq_items", {
      p_status: null,
      p_locale: null,
      p_content_type: "faq",
      p_query: null,
      p_limit: FAQ_IMPORT_DUPLICATE_PAGE_SIZE,
      p_offset: page * FAQ_IMPORT_DUPLICATE_PAGE_SIZE,
    });
    if (error) break;
    const parsed = filterWebsiteKompisFaqItemsForSiteContext(parseWebsiteKompisFaqList(data), {
      state: installId ? "single_site" : "no_sites",
      selectedInstallId: installId,
    });
    rows.push(
      ...parsed.map((item) => ({
        installId: item.installId,
        locale: item.locale,
        question: item.question,
        title: item.title,
        status: item.status,
      })),
    );
    if (parseWebsiteKompisFaqList(data).length < FAQ_IMPORT_DUPLICATE_PAGE_SIZE) {
      return { rows, truncated: false };
    }
  }
  return { rows, truncated: true };
}
