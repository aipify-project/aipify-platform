/**
 * Editable reply-template workspace for Platform Admin.
 * Starters ship in code. Create/edit/archive work in-process for UX/tests;
 * durable persistence stays CORE_BLOCKED until SQL apply.
 */

import {
  listSupportReplyStarterTemplates,
  SUPPORT_TEMPLATE_PERSIST_CONFIGURED,
  type SupportReplyTemplate,
  type SupportReplyTemplateCategory,
} from "./reply-templates";
import { SUPPORT_TEMPLATE_VARIABLES } from "./types";
import { renderSupportTemplateBody } from "./template-render";

export type EditableSupportTemplate = Omit<SupportReplyTemplate, "starter" | "locale"> & {
  starter: boolean;
  locale: string;
  archived: boolean;
};

type StoreState = {
  templates: EditableSupportTemplate[];
  nextCustomId: number;
};

const globalStore = globalThis as typeof globalThis & {
  __aipifySupportTemplateStore?: StoreState;
};

function ensureStore(): StoreState {
  if (!globalStore.__aipifySupportTemplateStore) {
    globalStore.__aipifySupportTemplateStore = {
      templates: listSupportReplyStarterTemplates().map((t) => ({
        ...t,
        starter: true,
        archived: false,
      })),
      nextCustomId: 1,
    };
  }
  return globalStore.__aipifySupportTemplateStore;
}

export function listEditableSupportTemplates(options?: {
  includeArchived?: boolean;
}): EditableSupportTemplate[] {
  const store = ensureStore();
  return store.templates.filter((t) => options?.includeArchived || !t.archived);
}

export function getEditableSupportTemplate(
  id: string,
): EditableSupportTemplate | null {
  return listEditableSupportTemplates({ includeArchived: true }).find((t) => t.id === id) ?? null;
}

export type TemplateMutationResult =
  | { ok: true; template: EditableSupportTemplate; persistConfigured: boolean }
  | { ok: false; error: string };

export function createSupportTemplate(input: {
  name: string;
  category: SupportReplyTemplateCategory;
  subject: string;
  body: string;
  locale?: string;
}): TemplateMutationResult {
  const name = input.name.trim().slice(0, 160);
  const subject = input.subject.trim().slice(0, 200);
  const body = input.body.trim().slice(0, 20000);
  if (name.length < 2 || subject.length < 2 || body.length < 10) {
    return { ok: false, error: "name_subject_body_required" };
  }
  const probe = renderSupportTemplateBody(body, {
    customer_name: "x",
    ticket_number: "x",
    product_name: "x",
    agent_name: "x",
  });
  if (!probe.ok) return { ok: false, error: probe.error };

  const store = ensureStore();
  const id = `custom_${store.nextCustomId++}`;
  const template: EditableSupportTemplate = {
    id,
    name,
    category: input.category,
    locale: input.locale ?? "no",
    subject,
    body,
    variables: [...SUPPORT_TEMPLATE_VARIABLES],
    active: true,
    version: 1,
    starter: false,
    ownerNote: "Egendefinert mal — lagring i Core krever eiergodkjent SQL.",
    archived: false,
  };
  store.templates = [template, ...store.templates];
  return {
    ok: true,
    template,
    persistConfigured: SUPPORT_TEMPLATE_PERSIST_CONFIGURED,
  };
}

export function updateSupportTemplate(
  id: string,
  patch: Partial<Pick<EditableSupportTemplate, "name" | "category" | "subject" | "body" | "active">>,
): TemplateMutationResult {
  const store = ensureStore();
  const idx = store.templates.findIndex((t) => t.id === id);
  if (idx < 0) return { ok: false, error: "not_found" };
  const current = store.templates[idx];
  if (current.archived) return { ok: false, error: "archived" };

  const nextBody = patch.body ?? current.body;
  const probe = renderSupportTemplateBody(nextBody, {
    customer_name: "x",
    ticket_number: "x",
    product_name: "x",
    agent_name: "x",
  });
  if (!probe.ok) return { ok: false, error: probe.error };

  const updated: EditableSupportTemplate = {
    ...current,
    name: patch.name?.trim() ? patch.name.trim().slice(0, 160) : current.name,
    category: patch.category ?? current.category,
    subject: patch.subject?.trim()
      ? patch.subject.trim().slice(0, 200)
      : current.subject,
    body: nextBody,
    active: patch.active ?? current.active,
    version: current.version + 1,
  };
  store.templates[idx] = updated;
  return {
    ok: true,
    template: updated,
    persistConfigured: SUPPORT_TEMPLATE_PERSIST_CONFIGURED,
  };
}

export function restoreSupportTemplate(id: string): TemplateMutationResult {
  const store = ensureStore();
  const idx = store.templates.findIndex((t) => t.id === id);
  if (idx < 0) return { ok: false, error: "not_found" };
  const current = store.templates[idx];
  if (!current.archived && current.active) return { ok: false, error: "not_archived" };
  const updated: EditableSupportTemplate = {
    ...current,
    archived: false,
    active: true,
    version: current.version + 1,
  };
  store.templates[idx] = updated;
  return {
    ok: true,
    template: updated,
    persistConfigured: SUPPORT_TEMPLATE_PERSIST_CONFIGURED,
  };
}

export function archiveSupportTemplate(id: string): TemplateMutationResult {
  const store = ensureStore();
  const idx = store.templates.findIndex((t) => t.id === id);
  if (idx < 0) return { ok: false, error: "not_found" };
  const updated = {
    ...store.templates[idx],
    archived: true,
    active: false,
    version: store.templates[idx].version + 1,
  };
  store.templates[idx] = updated;
  return {
    ok: true,
    template: updated,
    persistConfigured: SUPPORT_TEMPLATE_PERSIST_CONFIGURED,
  };
}

/** Reset store — tests only. */
export function __resetSupportTemplateStoreForTests(): void {
  globalStore.__aipifySupportTemplateStore = undefined;
}
