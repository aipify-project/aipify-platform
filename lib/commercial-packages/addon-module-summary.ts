import { resolveCustomerFacingModuleName } from "@/lib/app-portal/software-catalog/module-presentation";

export type AddonModuleTone = "active" | "trial" | "licensed";

export type NamedAddonModule = {
  key: string;
  name: string;
  tone: AddonModuleTone;
};

export type AddonModuleSummary = {
  named: NamedAddonModule[];
  unnamedCount: number;
  total: number;
};

function moduleKey(row: Record<string, unknown>): string {
  const key = row.module_key ?? row.moduleKey ?? row.key;
  return typeof key === "string" ? key.trim() : "";
}

function addonTone(row: Record<string, unknown>): AddonModuleTone {
  const status = typeof row.status === "string" ? row.status : "";
  if (row.enabled !== true) return "licensed";
  if (status === "trial") return "trial";
  if (status === "enabled" || status === "beta") return "active";
  return "licensed";
}

/** Collapse technical keys that have no customer-facing name. Never invent a title. */
export function summarizeAddonModules(rows: Array<Record<string, unknown>> | null | undefined): AddonModuleSummary {
  const named: NamedAddonModule[] = [];
  const seen = new Set<string>();
  let unnamedCount = 0;

  for (const row of rows ?? []) {
    const key = moduleKey(row);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    const name = resolveCustomerFacingModuleName({
      moduleKey: key,
      moduleName: typeof row.module_name === "string" ? row.module_name : null,
      name: typeof row.name === "string" ? row.name : null,
    });
    if (name) named.push({ key, name, tone: addonTone(row) });
    else unnamedCount += 1;
  }

  return { named, unnamedCount, total: named.length + unnamedCount };
}
