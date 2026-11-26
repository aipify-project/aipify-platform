/**
 * Core persist ops for Support Center signature + templates.
 * Prefer Core RPCs when available; fall back to workspace store and migrate
 * customized workspace data into Core once on first successful Core read.
 * Email send stays OFF. Fail closed for unauthorized callers (RPC raises).
 */

import {
  createDefaultSupportSignature,
  SUPPORT_SIGNATURE_LOGO_URL,
  type SupportSignatureDraft,
} from "./signature";
import {
  getStoredSupportSignature,
  saveSupportSignature,
  sanitizeSupportSignatureInput,
  type StoredSupportSignature,
} from "./signature-store";
import {
  archiveSupportTemplate as archiveWorkspaceTemplate,
  createSupportTemplate as createWorkspaceTemplate,
  listEditableSupportTemplates,
  updateSupportTemplate as updateWorkspaceTemplate,
  type EditableSupportTemplate,
  type TemplateMutationResult,
} from "./template-store";
import {
  SUPPORT_TEMPLATE_PERSIST_CONFIGURED,
  listSupportReplyStarterTemplates,
  type SupportReplyTemplateCategory,
} from "./reply-templates";
import { SUPPORT_TEMPLATE_VARIABLES } from "./types";
import { resolveSupportCenterLiveGates } from "./staging-core-activation";
import {
  deriveSupportTemplateKeyFromName,
  normalizeSupportTemplateKey,
  normalizeSupportTemplateLocale,
} from "./normalize-template-key";

type RpcClient = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rpc: (fn: string, args?: Record<string, unknown>) => any;
};

function isMissingRpcMessage(message: string): boolean {
  const m = message.toLowerCase();
  return (
    m.includes("could not find the function") ||
    (m.includes("function") && m.includes("does not exist")) ||
    m.includes("42883") ||
    m.includes("pgrst202")
  );
}

function isAccessDeniedMessage(message: string): boolean {
  const m = message.toLowerCase();
  return (
    m.includes("platform portal access denied") ||
    m.includes("access denied") ||
    m.includes("forbidden") ||
    m.includes("not authorized")
  );
}

function asObject(data: unknown): Record<string, unknown> | null {
  return data && typeof data === "object" && !Array.isArray(data)
    ? (data as Record<string, unknown>)
    : null;
}

export function isSupportPersistCorePreferred(): boolean {
  const gates = resolveSupportCenterLiveGates();
  return Boolean(gates.liveBound);
}

function mapCoreSignature(row: Record<string, unknown>): SupportSignatureDraft {
  return {
    displayName: String(row.display_name ?? ""),
    agentName: String(row.agent_name_default ?? ""),
    agentTitle: String(row.agent_title_default ?? ""),
    companyName: String(row.company_name ?? "Aipify Group AS"),
    websiteUrl: String(row.website_url ?? "https://aipify.ai"),
    supportEmail: String(row.support_email ?? "support@aipify.ai"),
    phone: String(row.phone ?? ""),
    addressLine: String(row.address_line ?? ""),
    logoUrl: SUPPORT_SIGNATURE_LOGO_URL,
    includeLogo: row.include_logo !== false,
    active: row.is_active !== false,
    version: Number(row.version) || 1,
  };
}

function mapCoreTemplate(row: Record<string, unknown>): EditableSupportTemplate {
  const key = String(row.template_key ?? row.id ?? "");
  const locale = normalizeSupportTemplateLocale(String(row.locale ?? "no")) ?? "no";
  const active = row.is_active !== false;
  return {
    id: key,
    name: String(row.name ?? ""),
    category: String(row.category ?? "general") as SupportReplyTemplateCategory,
    locale,
    subject: String(row.subject ?? ""),
    body: String(row.body_text ?? row.body ?? ""),
    variables: Array.isArray(row.allowed_variables)
      ? (row.allowed_variables as typeof SUPPORT_TEMPLATE_VARIABLES)
      : [...SUPPORT_TEMPLATE_VARIABLES],
    active,
    version: Number(row.version) || 1,
    starter: row.is_starter === true,
    ownerNote: row.is_starter === true ? "Starter" : "Core",
    archived: row.archived === true || !active,
  };
}

async function tryCoreListTemplates(
  rpc: RpcClient,
  includeArchived: boolean,
): Promise<
  | { ok: true; items: EditableSupportTemplate[]; persistConfigured: true }
  | { ok: false; missing: true }
  | { ok: false; forbidden: true }
  | { ok: false; error: string }
> {
  const { data, error } = await rpc.rpc("platform_support_list_templates", {
    p_include_archived: includeArchived,
  });
  if (error) {
    const message = error.message ?? "";
    if (isMissingRpcMessage(message)) return { ok: false, missing: true };
    if (isAccessDeniedMessage(message)) return { ok: false, forbidden: true };
    return { ok: false, error: message || "list_failed" };
  }
  const row = asObject(data);
  if (!row || row.ok !== true) return { ok: false, error: "list_failed" };
  const items = Array.isArray(row.items)
    ? row.items.map((item) => mapCoreTemplate(item as Record<string, unknown>))
    : [];
  return { ok: true, items, persistConfigured: true };
}

async function migrateWorkspaceSignatureToCore(rpc: RpcClient): Promise<void> {
  const workspace = getStoredSupportSignature();
  if (!workspace.customized) return;
  const s = workspace.signature;
  await rpc.rpc("platform_support_upsert_signature", {
    p_display_name: s.displayName || "Aipify Support",
    p_agent_name_default: s.agentName,
    p_agent_title_default: s.agentTitle,
    p_phone: s.phone,
    p_address_line: s.addressLine,
    p_include_logo: s.includeLogo,
  });
}

async function migrateWorkspaceTemplatesToCore(rpc: RpcClient): Promise<void> {
  const customs = listEditableSupportTemplates({ includeArchived: false }).filter(
    (t) => !t.starter,
  );
  for (const tpl of customs) {
    const key =
      normalizeSupportTemplateKey(tpl.id).ok === true
        ? (normalizeSupportTemplateKey(tpl.id) as { ok: true; value: string }).value
        : deriveSupportTemplateKeyFromName(tpl.name);
    if (!("value" in key) || !key.value) continue;
    const locale = normalizeSupportTemplateLocale(tpl.locale) ?? "no";
    const category = normalizeSupportTemplateKey(tpl.category, "category");
    await rpc.rpc("platform_support_upsert_template", {
      p_template_key: key.value,
      p_name: tpl.name,
      p_category: category.ok ? category.value : "general",
      p_locale: locale,
      p_subject: tpl.subject,
      p_body_text: tpl.body,
      p_is_starter: false,
    });
  }
}

export async function loadSupportSignatureForUser(input: {
  rpc?: RpcClient | null;
}): Promise<StoredSupportSignature & { ok: true; source: "core" | "workspace" }> {
  if (input.rpc && isSupportPersistCorePreferred()) {
    const { data, error } = await input.rpc.rpc("platform_support_get_active_signature");
    if (error) {
      if (!isMissingRpcMessage(error.message ?? "")) {
        if (isAccessDeniedMessage(error.message ?? "")) {
          throw new Error("forbidden");
        }
      } else {
        // Core persist RPC not applied yet.
        return { ok: true, source: "workspace", ...getStoredSupportSignature() };
      }
    } else {
      const row = asObject(data);
      if (row?.ok === true && row.found === true && row.signature) {
        const signature = mapCoreSignature(row.signature as Record<string, unknown>);
        return {
          ok: true,
          source: "core",
          signature,
          customized: true,
          persistConfigured: true,
        };
      }
      if (row?.ok === true && row.found === false) {
        await migrateWorkspaceSignatureToCore(input.rpc);
        const again = await input.rpc.rpc("platform_support_get_active_signature");
        const againRow = asObject(again.data);
        if (againRow?.ok === true && againRow.found === true && againRow.signature) {
          return {
            ok: true,
            source: "core",
            signature: mapCoreSignature(againRow.signature as Record<string, unknown>),
            customized: true,
            persistConfigured: true,
          };
        }
        return {
          ok: true,
          source: "core",
          signature: createDefaultSupportSignature(),
          customized: false,
          persistConfigured: true,
        };
      }
    }
  }
  return { ok: true, source: "workspace", ...getStoredSupportSignature() };
}

export async function saveSupportSignatureForUser(input: {
  rpc?: RpcClient | null;
  signature: unknown;
}): Promise<
  | ({ ok: true; source: "core" | "workspace" } & StoredSupportSignature)
  | { ok: false; error: string; status?: number }
> {
  const sanitized = sanitizeSupportSignatureInput(input.signature);
  if (!sanitized.ok) return { ok: false, error: sanitized.error, status: 400 };

  if (input.rpc && isSupportPersistCorePreferred()) {
    const s = sanitized.value;
    const { data, error } = await input.rpc.rpc("platform_support_upsert_signature", {
      p_display_name: s.displayName || "Aipify Support",
      p_agent_name_default: s.agentName,
      p_agent_title_default: s.agentTitle,
      p_phone: s.phone,
      p_address_line: s.addressLine,
      p_include_logo: s.includeLogo,
    });
    if (error) {
      if (isMissingRpcMessage(error.message ?? "")) {
        const local = saveSupportSignature(input.signature);
        if (!local.ok) return { ok: false, error: local.error, status: 400 };
        return { ...local, source: "workspace" };
      }
      if (isAccessDeniedMessage(error.message ?? "")) {
        return { ok: false, error: "forbidden", status: 403 };
      }
      return { ok: false, error: "save_failed", status: 500 };
    }
    const row = asObject(data);
    if (!row || row.ok !== true) {
      return { ok: false, error: "save_failed", status: 500 };
    }
    // Keep workspace mirror so reload before Core apply-path still has data.
    saveSupportSignature(input.signature);
    return {
      ok: true,
      source: "core",
      signature: {
        ...s,
        version: Number(row.version) || s.version,
        companyName: "Aipify Group AS",
        websiteUrl: "https://aipify.ai",
        supportEmail: "support@aipify.ai",
        logoUrl: SUPPORT_SIGNATURE_LOGO_URL,
      },
      customized: true,
      persistConfigured: true,
    };
  }

  const local = saveSupportSignature(input.signature);
  if (!local.ok) return { ok: false, error: local.error, status: 400 };
  return { ...local, source: "workspace" };
}

export async function resetSupportSignatureForUser(input: {
  rpc?: RpcClient | null;
}): Promise<StoredSupportSignature & { ok: true; source: "core" | "workspace" }> {
  // Reset means company defaults in the workspace form path.
  // Core keeps historical versions; we insert a fresh defaults version when Core is live.
  const defaults = createDefaultSupportSignature();
  if (input.rpc && isSupportPersistCorePreferred()) {
    const { error } = await input.rpc.rpc("platform_support_upsert_signature", {
      p_display_name: defaults.displayName,
      p_agent_name_default: "",
      p_agent_title_default: "",
      p_phone: "",
      p_address_line: defaults.addressLine,
      p_include_logo: true,
    });
    if (!error || isMissingRpcMessage(error.message ?? "")) {
      if (!error) {
        return {
          ok: true,
          source: "core",
          signature: defaults,
          customized: true,
          persistConfigured: true,
        };
      }
    } else if (isAccessDeniedMessage(error.message ?? "")) {
      throw new Error("forbidden");
    }
  }
  const { resetSupportSignature } = await import("./signature-store");
  return { ok: true, source: "workspace", ...resetSupportSignature() };
}

export async function listSupportTemplatesForUser(input: {
  rpc?: RpcClient | null;
  includeArchived?: boolean;
}): Promise<{
  ok: true;
  items: EditableSupportTemplate[];
  persistConfigured: boolean;
  source: "core" | "workspace";
}> {
  if (input.rpc && isSupportPersistCorePreferred()) {
    const listed = await tryCoreListTemplates(
      input.rpc,
      Boolean(input.includeArchived),
    );
    if ("forbidden" in listed && listed.forbidden) {
      throw new Error("forbidden");
    }
    if ("missing" in listed && listed.missing) {
      return {
        ok: true,
        source: "workspace",
        persistConfigured: SUPPORT_TEMPLATE_PERSIST_CONFIGURED,
        items: listEditableSupportTemplates({
          includeArchived: input.includeArchived,
        }),
      };
    }
    if (listed.ok) {
      if (listed.items.length === 0) {
        await migrateWorkspaceTemplatesToCore(input.rpc);
        const starters = listSupportReplyStarterTemplates();
        for (const starter of starters) {
          const key = normalizeSupportTemplateKey(starter.id);
          if (!key.ok) continue;
          await input.rpc.rpc("platform_support_upsert_template", {
            p_template_key: key.value,
            p_name: starter.name,
            p_category: starter.category,
            p_locale: starter.locale,
            p_subject: starter.subject,
            p_body_text: starter.body,
            p_is_starter: true,
          });
        }
        const again = await tryCoreListTemplates(
          input.rpc,
          Boolean(input.includeArchived),
        );
        if (again.ok) {
          return {
            ok: true,
            source: "core",
            persistConfigured: true,
            items: again.items,
          };
        }
      }
      return {
        ok: true,
        source: "core",
        persistConfigured: true,
        items: listed.items,
      };
    }
  }

  return {
    ok: true,
    source: "workspace",
    persistConfigured: SUPPORT_TEMPLATE_PERSIST_CONFIGURED,
    items: listEditableSupportTemplates({ includeArchived: input.includeArchived }),
  };
}

export async function mutateSupportTemplateForUser(input: {
  rpc?: RpcClient | null;
  action: "create" | "update" | "archive";
  body: Record<string, unknown>;
}): Promise<
  | (TemplateMutationResult & { source: "core" | "workspace" })
  | { ok: false; error: string; status?: number }
> {
  const preferCore = Boolean(input.rpc && isSupportPersistCorePreferred());

  if (input.action === "create") {
    const name = String(input.body.name ?? "");
    const subject = String(input.body.subject ?? "");
    const bodyText = String(input.body.body ?? "");
    const locale = normalizeSupportTemplateLocale(
      typeof input.body.locale === "string" ? input.body.locale : "no",
    );
    if (!locale) return { ok: false, error: "invalid_locale", status: 400 };
    const keyRaw =
      typeof input.body.templateKey === "string" && input.body.templateKey.trim()
        ? normalizeSupportTemplateKey(input.body.templateKey)
        : deriveSupportTemplateKeyFromName(name);
    if (!keyRaw.ok) {
      return { ok: false, error: `template_key_${keyRaw.error}`, status: 400 };
    }
    const category = normalizeSupportTemplateKey(
      String(input.body.category ?? "general"),
      "category",
    );
    if (!category.ok) {
      return { ok: false, error: `category_${category.error}`, status: 400 };
    }

    if (preferCore && input.rpc) {
      const { data, error } = await input.rpc.rpc("platform_support_upsert_template", {
        p_template_key: keyRaw.value,
        p_name: name,
        p_category: category.value,
        p_locale: locale,
        p_subject: subject,
        p_body_text: bodyText,
        p_is_starter: false,
      });
      if (error) {
        if (isMissingRpcMessage(error.message ?? "")) {
          const local = createWorkspaceTemplate({
            name,
            category: category.value as SupportReplyTemplateCategory,
            subject,
            body: bodyText,
            locale,
          });
          return local.ok
            ? { ...local, source: "workspace" }
            : { ok: false, error: local.error, status: 400 };
        }
        if (isAccessDeniedMessage(error.message ?? "")) {
          return { ok: false, error: "forbidden", status: 403 };
        }
        if ((error.message ?? "").toLowerCase().includes("invalid argument")) {
          return { ok: false, error: "validation", status: 400 };
        }
        return { ok: false, error: "save_failed", status: 500 };
      }
      const row = asObject(data);
      if (!row || row.ok !== true) {
        return { ok: false, error: "save_failed", status: 500 };
      }
      // Mirror into workspace for continuity.
      createWorkspaceTemplate({
        name,
        category: category.value as SupportReplyTemplateCategory,
        subject,
        body: bodyText,
        locale,
      });
      return {
        ok: true,
        source: "core",
        persistConfigured: true,
        template: {
          id: keyRaw.value,
          name,
          category: category.value as SupportReplyTemplateCategory,
          locale,
          subject,
          body: bodyText,
          variables: [...SUPPORT_TEMPLATE_VARIABLES],
          active: true,
          version: Number(row.version) || 1,
          starter: false,
          ownerNote: "Core",
          archived: false,
        },
      };
    }

    const local = createWorkspaceTemplate({
      name,
      category: category.value as SupportReplyTemplateCategory,
      subject,
      body: bodyText,
      locale,
    });
    return local.ok
      ? { ...local, source: "workspace" }
      : { ok: false, error: local.error, status: 400 };
  }

  if (input.action === "update") {
    const id = String(input.body.id ?? input.body.templateKey ?? "");
    const key = normalizeSupportTemplateKey(id);
    const locale = normalizeSupportTemplateLocale(
      typeof input.body.locale === "string" ? input.body.locale : "no",
    );
    if (!key.ok) return { ok: false, error: `template_key_${key.error}`, status: 400 };
    if (!locale) return { ok: false, error: "invalid_locale", status: 400 };

    if (preferCore && input.rpc) {
      const existing = await tryCoreListTemplates(input.rpc, true);
      if (existing.ok) {
        const current = existing.items.find(
          (t) => t.id === key.value && t.locale === locale,
        );
        const name = typeof input.body.name === "string" ? input.body.name : current?.name;
        const subject =
          typeof input.body.subject === "string" ? input.body.subject : current?.subject;
        const bodyText =
          typeof input.body.body === "string" ? input.body.body : current?.body;
        const categoryRaw =
          typeof input.body.category === "string"
            ? input.body.category
            : current?.category ?? "general";
        const category = normalizeSupportTemplateKey(categoryRaw, "category");
        if (!category.ok || !name || !subject || !bodyText) {
          return { ok: false, error: "validation", status: 400 };
        }
        const { data, error } = await input.rpc.rpc("platform_support_upsert_template", {
          p_template_key: key.value,
          p_name: name,
          p_category: category.value,
          p_locale: locale,
          p_subject: subject,
          p_body_text: bodyText,
          p_is_starter: current?.starter === true,
        });
        if (error) {
          if (isMissingRpcMessage(error.message ?? "")) {
            const local = updateWorkspaceTemplate(id, {
              name,
              category: category.value as SupportReplyTemplateCategory,
              subject,
              body: bodyText,
            });
            return local.ok
              ? { ...local, source: "workspace" }
              : { ok: false, error: local.error, status: 400 };
          }
          if (isAccessDeniedMessage(error.message ?? "")) {
            return { ok: false, error: "forbidden", status: 403 };
          }
          return { ok: false, error: "save_failed", status: 500 };
        }
        const row = asObject(data);
        if (!row || row.ok !== true) {
          return { ok: false, error: "save_failed", status: 500 };
        }
        return {
          ok: true,
          source: "core",
          persistConfigured: true,
          template: {
            id: key.value,
            name,
            category: category.value as SupportReplyTemplateCategory,
            locale,
            subject,
            body: bodyText,
            variables: [...SUPPORT_TEMPLATE_VARIABLES],
            active: true,
            version: Number(row.version) || 1,
            starter: current?.starter === true,
            ownerNote: "Core",
            archived: false,
          },
        };
      }
    }

    const local = updateWorkspaceTemplate(id, {
      name: typeof input.body.name === "string" ? input.body.name : undefined,
      category:
        typeof input.body.category === "string"
          ? (input.body.category as SupportReplyTemplateCategory)
          : undefined,
      subject: typeof input.body.subject === "string" ? input.body.subject : undefined,
      body: typeof input.body.body === "string" ? input.body.body : undefined,
      active: typeof input.body.active === "boolean" ? input.body.active : undefined,
    });
    return local.ok
      ? { ...local, source: "workspace" }
      : { ok: false, error: local.error, status: local.error === "not_found" ? 404 : 400 };
  }

  if (input.action === "archive") {
    const id = String(input.body.id ?? input.body.templateKey ?? "");
    const key = normalizeSupportTemplateKey(id);
    const locale = normalizeSupportTemplateLocale(
      typeof input.body.locale === "string" ? input.body.locale : "no",
    );
    if (!key.ok) return { ok: false, error: `template_key_${key.error}`, status: 400 };
    if (!locale) return { ok: false, error: "invalid_locale", status: 400 };

    if (preferCore && input.rpc) {
      const { data, error } = await input.rpc.rpc("platform_support_archive_template", {
        p_template_key: key.value,
        p_locale: locale,
      });
      if (error) {
        if (isMissingRpcMessage(error.message ?? "")) {
          const local = archiveWorkspaceTemplate(id);
          return local.ok
            ? { ...local, source: "workspace" }
            : { ok: false, error: local.error, status: 404 };
        }
        if (isAccessDeniedMessage(error.message ?? "")) {
          return { ok: false, error: "forbidden", status: 403 };
        }
        if ((error.message ?? "").toLowerCase().includes("not found")) {
          return { ok: false, error: "not_found", status: 404 };
        }
        return { ok: false, error: "archive_failed", status: 500 };
      }
      const row = asObject(data);
      if (!row || row.ok !== true) {
        return { ok: false, error: "archive_failed", status: 500 };
      }
      archiveWorkspaceTemplate(id);
      return {
        ok: true,
        source: "core",
        persistConfigured: true,
        template: {
          id: key.value,
          name: key.value,
          category: "general",
          locale,
          subject: "",
          body: "archived______________",
          variables: [...SUPPORT_TEMPLATE_VARIABLES],
          active: false,
          version: 1,
          starter: false,
          ownerNote: "Core",
          archived: true,
        },
      };
    }

    const local = archiveWorkspaceTemplate(id);
    return local.ok
      ? { ...local, source: "workspace" }
      : { ok: false, error: local.error, status: 404 };
  }

  return { ok: false, error: "unknown_action", status: 400 };
}

/** Compile-time defaults remain false until Core candidate is applied. */
export const SUPPORT_PERSIST_OPS_CORE_PATH =
  "docs/platform/sql-candidates/platform_support_center_persist_and_timeline_rpc_v1.sql" as const;
