import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { createKompisOperatorIdempotencyKey } from "./ids";
import type { KompisOperatorPlan, KompisOperatorPlanStep } from "./planner";
import { getKompisOperatorTool } from "./tools-registry";
import { resolveKompisWebsiteContext } from "./website-context";
import {
  buildWebsiteContentQualityAudit,
  buildWebsiteDraftPreview,
  buildWebsiteLocaleCoverage,
  buildWebsiteSeoAudit,
  isWebsiteDraftKind,
  listWebsiteDraftPages,
  validateWebsiteDraftInput,
  type WebsiteDraftKind,
} from "./website-ops";
import { resolveWebsiteCmsContext } from "../website-cms/context";
import {
  createWebsitePublishIdempotencyKey,
  createWebsiteRollbackIdempotencyKey,
  publishWebsiteCandidate,
} from "../website-cms/publish";
import { rollbackWebsiteVersion } from "../website-cms/rollback";
import { assertKompisCoreApprovalReady, consumeKompisCoreApproval } from "./core-approval";

type ToolResult = {
  ok: boolean;
  summary: string;
  verified: boolean;
  data?: Record<string, unknown>;
  errorCode?: string;
  changed?: boolean;
};

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

async function loadWorkspace(supabase: SupabaseClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_app_kompis_operator_workspace");
  if (error) return {};
  return asRecord(data);
}

async function verifyDraft(
  supabase: SupabaseClient,
  draftId: string,
  organizationId: unknown,
): Promise<boolean> {
  const { data, error } = await supabase.rpc("get_app_kompis_operator_draft", {
    p_draft_id: draftId,
  });
  if (error) return false;
  const row = asRecord(data);
  return row.id === draftId && row.organization_id === organizationId && row.published !== true;
}

async function executeTool(
  supabase: SupabaseClient,
  step: KompisOperatorPlanStep,
  workspace: Record<string, unknown>,
  runId: string,
): Promise<ToolResult> {
  const organization = asRecord(workspace.organization);
  const organizationId = organization.id ?? null;
  const safeInput = step.safeInput ?? {};

  switch (step.toolKey) {
    case "customer_profile_read":
      return {
        ok: true,
        verified: Boolean(organizationId),
        summary: "Organization profile loaded.",
        data: { organization },
      };
    case "agreement_status_read":
      return {
        ok: true,
        verified: true,
        summary: "Agreement status loaded.",
        data: { agreement: asRecord(workspace.agreement) },
      };
    case "license_status_read":
      return {
        ok: true,
        verified: true,
        summary: "APP license status loaded.",
        data: { parentLicense: asRecord(workspace.parent_license) },
      };
    case "domain_installation_status_read":
      return {
        ok: true,
        verified: true,
        summary: "Domain and installation status loaded.",
        data: {
          domain: asRecord(workspace.website_kompis).domain ?? null,
          installationId: asRecord(workspace.website_kompis).installation_id ?? null,
        },
      };
    case "website_kompis_status_read":
      return {
        ok: true,
        verified: true,
        summary: "Website Kompis delivery status loaded.",
        data: { websiteKompis: asRecord(workspace.website_kompis) },
      };
    case "app_access_status_read":
      return {
        ok: true,
        verified: workspace.available === true,
        summary: "APP panel access status loaded.",
        data: { available: workspace.available === true, organization },
      };
    case "support_cases_read": {
      const { data, error } = await supabase.rpc("get_support_ai_engine_dashboard");
      if (error) {
        return {
          ok: false,
          verified: false,
          summary: "Support cases could not be loaded.",
          errorCode: "support_read_failed",
        };
      }
      const dashboard = asRecord(data);
      const cases = asArray(dashboard.cases ?? dashboard.queue ?? dashboard.items).slice(0, 20);
      return {
        ok: true,
        verified: true,
        summary: `Loaded ${cases.length} support case summaries.`,
        data: { count: cases.length, cases },
      };
    }
    case "support_case_read": {
      const caseId = typeof safeInput.caseId === "string" ? safeInput.caseId : "";
      const { data, error } = await supabase.rpc("get_support_ai_engine_dashboard");
      if (error) {
        return { ok: false, verified: false, summary: "Support case could not be loaded.", errorCode: "support_read_failed" };
      }
      const cases = asArray(asRecord(data).cases ?? asRecord(data).queue ?? asRecord(data).items);
      const match = cases
        .map((item) => asRecord(item))
        .find((item) => item.id === caseId || item.case_id === caseId);
      if (!match) {
        return { ok: false, verified: false, summary: "Support case was not found.", errorCode: "support_case_not_found" };
      }
      return {
        ok: true,
        verified: true,
        summary: "Support case loaded.",
        data: {
          case: {
            id: match.id ?? match.case_id ?? null,
            subject: match.subject ?? match.title ?? null,
            status: match.status ?? null,
            priority: match.priority ?? null,
          },
        },
      };
    }
    case "notifications_read": {
      const { data, error } = await supabase.rpc("list_presence_notifications", {
        p_limit: 20,
        p_unread_only: false,
      });
      if (error) {
        return { ok: false, verified: false, summary: "Notifications could not be loaded.", errorCode: "notifications_read_failed" };
      }
      const items = asArray(data).slice(0, 20).map((item) => {
        const row = asRecord(item);
        return {
          id: row.id ?? null,
          title: row.title ?? row.headline ?? null,
          status: row.status ?? null,
          read: row.read === true || row.is_read === true || row.reviewed_at != null,
        };
      });
      return {
        ok: true,
        verified: true,
        summary: `Loaded ${items.length} notifications.`,
        data: { count: items.length, notifications: items },
      };
    }
    case "organization_members_read": {
      const { data, error } = await supabase.rpc("get_employee_directory", {
        p_search: null,
        p_department_id: null,
        p_role: null,
        p_status: "active",
        p_manager_user_id: null,
      });
      if (error) {
        return { ok: false, verified: false, summary: "Members could not be loaded.", errorCode: "members_read_failed" };
      }
      const payload = asRecord(data);
      const members = asArray(payload.employees ?? payload.members ?? payload.items)
        .slice(0, 50)
        .map((item) => {
          const row = asRecord(item);
          return {
            id: row.id ?? row.user_id ?? null,
            displayName: row.display_name ?? row.full_name ?? row.name ?? null,
            role: row.role ?? row.organization_role ?? null,
            status: row.status ?? null,
          };
        });
      return {
        ok: true,
        verified: true,
        summary: `Loaded ${members.length} members.`,
        data: { count: members.length, members },
      };
    }
    case "activity_summary_read": {
      const { data, error } = await supabase.rpc("get_my_activity_operations_summary");
      if (error) {
        return { ok: false, verified: false, summary: "Activity could not be loaded.", errorCode: "activity_read_failed" };
      }
      return {
        ok: true,
        verified: true,
        summary: "Activity summary loaded.",
        data: { summary: asRecord(data) },
      };
    }
    case "knowledge_search": {
      const query =
        typeof safeInput.query === "string" && safeInput.query.trim()
          ? safeInput.query.trim().slice(0, 200)
          : "overview";
      const { data, error } = await supabase.rpc("search_organization_knowledge", {
        p_filters: { query, limit: 5, status: "published" },
      });
      if (error) {
        return { ok: false, verified: false, summary: "Knowledge search failed.", errorCode: "knowledge_search_failed" };
      }
      const hits = asArray(data)
        .slice(0, 5)
        .map((item) => {
          const row = asRecord(item);
          return {
            id: row.id ?? row.article_id ?? null,
            title: row.title ?? row.question ?? null,
            status: row.status ?? "published",
            locale: row.language ?? row.locale ?? null,
          };
        });
      return {
        ok: true,
        verified: true,
        summary: hits.length ? `Found ${hits.length} authorized sources.` : "No authorized sources were found.",
        data: { count: hits.length, sources: hits, query },
      };
    }
    case "content_inventory_read": {
      const { data, error } = await supabase.rpc("list_app_kompis_operator_drafts", { p_limit: 20 });
      if (error) {
        return { ok: false, verified: false, summary: "Content inventory could not be loaded.", errorCode: "content_inventory_failed" };
      }
      const drafts = asArray(asRecord(data).drafts);
      return {
        ok: true,
        verified: true,
        summary: `Loaded ${drafts.length} drafts.`,
        data: { count: drafts.length, drafts },
      };
    }
    case "operator_history_read": {
      const { data, error } = await supabase.rpc("list_app_kompis_operator_conversations", {
        p_limit: 20,
      });
      if (error) {
        return { ok: false, verified: false, summary: "Operator history could not be loaded.", errorCode: "history_read_failed" };
      }
      const conversations = asArray(asRecord(data).conversations ?? data);
      return {
        ok: true,
        verified: true,
        summary: `Loaded ${conversations.length} conversations.`,
        data: { count: conversations.length, conversations },
      };
    }
    case "support_case_create": {
      const subject =
        typeof safeInput.subject === "string" && safeInput.subject.trim()
          ? safeInput.subject.trim().slice(0, 500)
          : "Kompis support request";
      const message =
        typeof safeInput.message === "string" && safeInput.message.trim()
          ? safeInput.message.trim().slice(0, 8000)
          : "Created via Kompis after operator approval.";
      const idempotencyKey =
        typeof safeInput.idempotencyKey === "string" && safeInput.idempotencyKey
          ? safeInput.idempotencyKey
          : createKompisOperatorIdempotencyKey();
      const { data, error } = await supabase.rpc("create_organization_support_case", {
        p_subject: subject,
        p_customer_identifier: null,
        p_channel: "admin_inbox",
        p_priority: "medium",
        p_initial_message: message,
        p_idempotency_key: idempotencyKey,
        p_priority_explicit: false,
      });
      if (error) {
        return { ok: false, verified: false, summary: "Support case could not be created.", errorCode: "support_create_failed" };
      }
      const created = asRecord(data);
      return {
        ok: true,
        verified: Boolean(created.id || created.case_id),
        changed: true,
        summary: "Support case created and verified.",
        data: { caseId: created.id ?? created.case_id ?? null, subject },
      };
    }
    case "notification_mark_read": {
      const notificationId =
        typeof safeInput.notificationId === "string" ? safeInput.notificationId : "";
      if (!notificationId) {
        return { ok: false, verified: false, summary: "Notification id is required.", errorCode: "invalid_input" };
      }
      const { data, error } = await supabase.rpc("perform_presence_notification_action", {
        p_notification_id: notificationId,
        p_action_type: "mark_as_reviewed",
      });
      if (error) {
        return { ok: false, verified: false, summary: "Notification could not be updated.", errorCode: "notification_write_failed" };
      }
      return {
        ok: true,
        verified: true,
        changed: true,
        summary: "Notification marked as read.",
        data: { notificationId, result: asRecord(data) },
      };
    }
    case "organization_profile_draft":
    case "content_draft_create":
    case "knowledge_draft_create": {
      const kind =
        step.toolKey === "organization_profile_draft"
          ? "organization_profile"
          : step.toolKey === "knowledge_draft_create"
            ? "knowledge"
            : "content";
      const title =
        typeof safeInput.title === "string" && safeInput.title.trim()
          ? safeInput.title.trim().slice(0, 200)
          : kind === "organization_profile"
            ? "Organization profile draft"
            : kind === "knowledge"
              ? "Knowledge draft"
              : "Content draft";
      const locale =
        typeof safeInput.locale === "string" && safeInput.locale.trim()
          ? safeInput.locale.trim().slice(0, 16)
          : "en";
      const idempotencyKey =
        typeof safeInput.idempotencyKey === "string" && safeInput.idempotencyKey
          ? safeInput.idempotencyKey
          : createKompisOperatorIdempotencyKey();
      const { data, error } = await supabase.rpc("create_app_kompis_operator_draft", {
        p_draft_kind: kind,
        p_title: title,
        p_locale: locale,
        p_body: {
          text: typeof safeInput.text === "string" ? safeInput.text.slice(0, 4000) : "",
          source: "kompis_operator_v2",
        },
        p_idempotency_key: idempotencyKey,
        p_run_id: runId,
      });
      if (error) {
        return { ok: false, verified: false, summary: "Draft could not be created.", errorCode: "draft_create_failed" };
      }
      const draft = asRecord(data);
      const verified = await verifyDraft(supabase, String(draft.id ?? ""), organizationId);
      return {
        ok: verified,
        verified,
        changed: draft.idempotent_replay !== true,
        summary: verified
          ? "Draft created. Nothing was published."
          : "Draft write needs follow-up verification.",
        data: draft,
        errorCode: verified ? undefined : "draft_verify_uncertain",
      };
    }
    case "content_draft_update": {
      const draftId = typeof safeInput.draftId === "string" ? safeInput.draftId : "";
      const expectedVersion =
        typeof safeInput.expectedVersion === "number" ? safeInput.expectedVersion : null;
      if (!draftId || expectedVersion == null) {
        return { ok: false, verified: false, summary: "Draft id and version are required.", errorCode: "invalid_input" };
      }
      const { data, error } = await supabase.rpc("update_app_kompis_operator_draft", {
        p_draft_id: draftId,
        p_title: typeof safeInput.title === "string" ? safeInput.title : null,
        p_body: {
          text: typeof safeInput.text === "string" ? safeInput.text.slice(0, 4000) : "",
        },
        p_expected_version: expectedVersion,
      });
      if (error) {
        const code = /VERSION_CONFLICT/i.test(error.message)
          ? "draft_version_conflict"
          : "draft_update_failed";
        return { ok: false, verified: false, summary: "Draft could not be updated.", errorCode: code };
      }
      const draft = asRecord(data);
      const verified = await verifyDraft(supabase, String(draft.id ?? draftId), organizationId);
      return {
        ok: verified,
        verified,
        changed: true,
        summary: verified
          ? "Draft updated. Nothing was published."
          : "Draft update needs follow-up verification.",
        data: draft,
        errorCode: verified ? undefined : "draft_verify_uncertain",
      };
    }
    case "website_overview_read":
    case "website_health_read": {
      const context = await resolveKompisWebsiteContext(supabase);
      return {
        ok: true,
        verified: Boolean(context.organizationId),
        summary: "Website operations context loaded.",
        data: { context },
      };
    }
    case "website_pages_read":
    case "website_navigation_read":
    case "website_preview_status_read": {
      const listed = await listWebsiteDraftPages(supabase, 50);
      if (!listed.ok) {
        return {
          ok: false,
          verified: false,
          summary: "Website pages could not be loaded.",
          errorCode: listed.errorCode,
        };
      }
      const pages =
        step.toolKey === "website_navigation_read"
          ? listed.pages.filter((page) => page.draftKind === "website_navigation")
          : listed.pages;
      const context = await resolveKompisWebsiteContext(supabase);
      return {
        ok: true,
        verified: true,
        summary: `Loaded ${pages.length} website draft items.`,
        data: {
          count: pages.length,
          pages,
          authoritativePageModel: context.authoritativePageModel,
          publishCapability: context.publishCapability,
          rollbackCapability: context.rollbackCapability,
          previewCapability: context.previewCapability,
          currentVersion: context.currentVersion,
        },
      };
    }
    case "website_publish_history_read": {
      const cms = await resolveWebsiteCmsContext(supabase);
      if (!cms.available || !cms.website) {
        return {
          ok: true,
          verified: true,
          summary: "No website has been provisioned yet, so there is no publish history.",
          data: { count: 0, history: [], authoritativePageModel: false },
        };
      }
      const { data, error } = await supabase.rpc("get_customer_website_publish_history", {
        p_limit: 20,
      });
      if (error) {
        return {
          ok: false,
          verified: false,
          summary: "Publish history could not be loaded.",
          errorCode: "publish_history_read_failed",
        };
      }
      const history = asArray(asRecord(data).operations);
      return {
        ok: true,
        verified: true,
        summary: `Loaded ${history.length} publish history entries.`,
        data: { count: history.length, history, authoritativePageModel: true },
      };
    }
    case "website_page_read": {
      const draftId = typeof safeInput.draftId === "string" ? safeInput.draftId : "";
      if (!draftId) {
        return { ok: false, verified: false, summary: "Draft id is required.", errorCode: "invalid_input" };
      }
      const { data, error } = await supabase.rpc("get_app_kompis_operator_draft", {
        p_draft_id: draftId,
      });
      if (error) {
        return { ok: false, verified: false, summary: "Website page draft was not found.", errorCode: "draft_not_found" };
      }
      const draft = asRecord(data);
      if (typeof draft.draft_kind !== "string" || !String(draft.draft_kind).startsWith("website_")) {
        return { ok: false, verified: false, summary: "Draft is not a website draft.", errorCode: "invalid_draft_kind" };
      }
      return {
        ok: true,
        verified: draft.organization_id === organizationId && draft.published !== true,
        summary: "Website page draft loaded.",
        data: { page: draft },
      };
    }
    case "website_seo_audit": {
      const listed = await listWebsiteDraftPages(supabase, 50);
      const context = await resolveKompisWebsiteContext(supabase);
      const audit = buildWebsiteSeoAudit({
        context,
        pages: listed.pages.map((page) => ({ ...page, body: page })),
      });
      return {
        ok: true,
        verified: true,
        summary: `SEO audit completed with ${audit.findingCount} findings.`,
        data: audit,
      };
    }
    case "website_content_quality_audit": {
      const listed = await listWebsiteDraftPages(supabase, 50);
      const audit = buildWebsiteContentQualityAudit(
        listed.pages.map((page) => ({ ...page, body: page })),
      );
      return {
        ok: true,
        verified: true,
        summary: `Content quality audit completed with ${audit.findingCount} findings.`,
        data: audit,
      };
    }
    case "website_locale_coverage_read": {
      const listed = await listWebsiteDraftPages(supabase, 100);
      return {
        ok: true,
        verified: true,
        summary: "Locale coverage loaded for website drafts.",
        data: buildWebsiteLocaleCoverage(listed.pages),
      };
    }
    case "website_page_draft_create":
    case "website_seo_draft_update":
    case "website_navigation_draft_update":
    case "website_translation_draft_create":
    case "website_section_draft_update":
    case "website_image_metadata_draft_update": {
      const kindMap: Record<string, WebsiteDraftKind> = {
        website_page_draft_create: "website_page",
        website_seo_draft_update: "website_seo",
        website_navigation_draft_update: "website_navigation",
        website_translation_draft_create: "website_translation",
        website_section_draft_update: "website_section",
        website_image_metadata_draft_update: "website_image_metadata",
      };
      const kind = kindMap[step.toolKey];
      if (!kind || !isWebsiteDraftKind(kind)) {
        return { ok: false, verified: false, summary: "Invalid website draft kind.", errorCode: "invalid_draft_kind" };
      }
      const context = await resolveKompisWebsiteContext(supabase);
      const validated = validateWebsiteDraftInput({
        kind,
        title: safeInput.title,
        locale: safeInput.locale ?? context.defaultLocale,
        path: safeInput.path,
        text: safeInput.text,
        metaDescription: safeInput.metaDescription,
        canonicalUrl: safeInput.canonicalUrl,
        altText: safeInput.altText,
        navigation: safeInput.navigation,
        activeLocales: context.supportedLocales,
      });
      if (!validated.ok) {
        return {
          ok: false,
          verified: false,
          summary: "Website draft input was rejected.",
          errorCode: validated.errorCode,
        };
      }
      const idempotencyKey =
        typeof safeInput.idempotencyKey === "string" && safeInput.idempotencyKey
          ? safeInput.idempotencyKey
          : createKompisOperatorIdempotencyKey();
      const { data, error } = await supabase.rpc("create_app_kompis_operator_draft", {
        p_draft_kind: kind,
        p_title: validated.title,
        p_locale: validated.locale,
        p_body: validated.body,
        p_idempotency_key: idempotencyKey,
        p_run_id: runId,
      });
      if (error) {
        return { ok: false, verified: false, summary: "Website draft could not be created.", errorCode: "draft_create_failed" };
      }
      const draft = asRecord(data);
      const verified = await verifyDraft(supabase, String(draft.id ?? ""), organizationId);
      return {
        ok: verified,
        verified,
        changed: draft.idempotent_replay !== true,
        summary: verified
          ? "Website draft created. Nothing was published."
          : "Website draft needs follow-up verification.",
        data: draft,
        errorCode: verified ? undefined : "draft_verify_uncertain",
      };
    }
    case "website_page_draft_update": {
      const draftId = typeof safeInput.draftId === "string" ? safeInput.draftId : "";
      const expectedVersion =
        typeof safeInput.expectedVersion === "number" ? safeInput.expectedVersion : null;
      if (!draftId || expectedVersion == null) {
        return { ok: false, verified: false, summary: "Draft id and version are required.", errorCode: "invalid_input" };
      }
      const context = await resolveKompisWebsiteContext(supabase);
      const validated = validateWebsiteDraftInput({
        kind: "website_page",
        title: safeInput.title,
        locale: safeInput.locale ?? context.defaultLocale,
        path: safeInput.path,
        text: safeInput.text,
        metaDescription: safeInput.metaDescription,
        canonicalUrl: safeInput.canonicalUrl,
        activeLocales: context.supportedLocales,
      });
      if (!validated.ok) {
        return { ok: false, verified: false, summary: "Website draft update rejected.", errorCode: validated.errorCode };
      }
      const { data, error } = await supabase.rpc("update_app_kompis_operator_draft", {
        p_draft_id: draftId,
        p_title: validated.title,
        p_body: validated.body,
        p_expected_version: expectedVersion,
      });
      if (error) {
        const code = /VERSION_CONFLICT/i.test(error.message)
          ? "draft_version_conflict"
          : "draft_update_failed";
        return { ok: false, verified: false, summary: "Website draft could not be updated.", errorCode: code };
      }
      const draft = asRecord(data);
      const verified = await verifyDraft(supabase, String(draft.id ?? draftId), organizationId);
      return {
        ok: verified,
        verified,
        changed: true,
        summary: verified
          ? "Website draft updated. Nothing was published."
          : "Website draft update needs follow-up verification.",
        data: draft,
        errorCode: verified ? undefined : "draft_verify_uncertain",
      };
    }
    case "website_draft_preview_create": {
      const draftId = typeof safeInput.draftId === "string" ? safeInput.draftId : "";
      if (!draftId) {
        return { ok: false, verified: false, summary: "Draft id is required for preview.", errorCode: "invalid_input" };
      }
      const { data: draftData, error: draftError } = await supabase.rpc("get_app_kompis_operator_draft", {
        p_draft_id: draftId,
      });
      if (draftError) {
        return { ok: false, verified: false, summary: "Draft was not found.", errorCode: "draft_not_found" };
      }
      const draft = asRecord(draftData);
      const preview = buildWebsiteDraftPreview(draft);
      const { data, error } = await supabase.rpc("create_app_kompis_website_ops_preview", {
        p_draft_id: draftId,
        p_preview_payload: preview,
      });
      if (error) {
        return { ok: false, verified: false, summary: "Preview could not be created.", errorCode: "preview_create_failed" };
      }
      return {
        ok: true,
        verified: true,
        changed: true,
        summary: "Draft preview created. Production was not changed.",
        data: asRecord(data),
      };
    }
    case "website_publish_approved_draft": {
      const candidateId = typeof safeInput.candidateId === "string" ? safeInput.candidateId : "";
      const confirmation = safeInput.confirmation === true;
      if (!candidateId) {
        return {
          ok: false,
          verified: false,
          summary: "A built candidate version is required before publishing.",
          errorCode: "invalid_input",
        };
      }
      if (!confirmation) {
        return {
          ok: false,
          verified: false,
          summary: "Explicit confirmation is required before publishing to production.",
          errorCode: "confirmation_required",
        };
      }
      const cms = await resolveWebsiteCmsContext(supabase);
      if (!cms.capabilities.publishCapability) {
        return {
          ok: false,
          verified: false,
          summary: "The website is not ready to publish yet (delivery, acknowledgement, or preview verification missing).",
          errorCode: "website_publish_capability_not_ready",
        };
      }
      const internalReason =
        typeof safeInput.internalReason === "string" && safeInput.internalReason.trim()
          ? safeInput.internalReason.trim().slice(0, 500)
          : "Published via Kompis after operator approval.";
      const expectedCurrentVersionId =
        typeof safeInput.expectedCurrentVersionId === "string"
          ? safeInput.expectedCurrentVersionId
          : (cms.website?.currentVersionId ?? null);
      const path =
        typeof safeInput.path === "string" && safeInput.path.trim()
          ? safeInput.path.trim()
          : null;
      const core = await assertKompisCoreApprovalReady(supabase, {
        runId,
        toolKey: "website_publish_approved_draft",
        scope: {
          website_id: cms.website?.id ?? null,
          path,
          candidate_id: candidateId,
          expected_current_version_id: expectedCurrentVersionId,
        },
      });
      if (!core.ok) {
        return {
          ok: false,
          verified: false,
          summary: "Publish is waiting for Approval Center (CORE.APPROVAL).",
          errorCode: core.errorCode,
          data: { actionRequestId: core.actionRequestId ?? null },
        };
      }
      const idempotencyKey =
        typeof safeInput.idempotencyKey === "string" && safeInput.idempotencyKey
          ? safeInput.idempotencyKey
          : createWebsitePublishIdempotencyKey();
      const result = await publishWebsiteCandidate(supabase, {
        candidateId,
        expectedCurrentVersionId,
        internalReason,
        confirmation: true,
        idempotencyKey,
      });
      if (!result.ok) {
        return {
          ok: false,
          verified: false,
          summary: "Website publish could not be completed.",
          errorCode: result.errorCode,
        };
      }
      await consumeKompisCoreApproval(supabase, {
        runId,
        toolKey: "website_publish_approved_draft",
        scope: {
          website_id: cms.website?.id ?? null,
          path,
          candidate_id: candidateId,
          expected_current_version_id: expectedCurrentVersionId,
        },
      });
      const verified = result.status === "active" && result.runtimeVerification.verified;
      return {
        ok: true,
        verified,
        changed: !result.idempotentReplay,
        summary: verified
          ? "Website published and runtime-verified against the live domain."
          : "Publish was recorded but still needs runtime verification.",
        data: {
          operationId: result.operationId,
          status: result.status,
          versionId: result.versionId ?? null,
          versionNumber: result.versionNumber ?? null,
          runtimeVerification: result.runtimeVerification,
          coreApprovalRequestId: core.actionRequestId ?? null,
        },
        errorCode: verified ? undefined : "publish_pending_verification",
      };
    }
    case "website_publish_rollback": {
      const targetVersionId = typeof safeInput.targetVersionId === "string" ? safeInput.targetVersionId : "";
      const confirmation = safeInput.confirmation === true;
      if (!targetVersionId) {
        return {
          ok: false,
          verified: false,
          summary: "A target published version is required to roll back to.",
          errorCode: "invalid_input",
        };
      }
      if (!confirmation) {
        return {
          ok: false,
          verified: false,
          summary: "Explicit confirmation is required before rolling back production.",
          errorCode: "confirmation_required",
        };
      }
      const cms = await resolveWebsiteCmsContext(supabase);
      if (!cms.capabilities.rollbackCapability) {
        return {
          ok: false,
          verified: false,
          summary: "Rollback is not available yet (no published version, delivery, or acknowledgement).",
          errorCode: "website_rollback_capability_not_ready",
        };
      }
      const internalReason =
        typeof safeInput.internalReason === "string" && safeInput.internalReason.trim()
          ? safeInput.internalReason.trim().slice(0, 500)
          : "Rolled back via Kompis after operator approval.";
      const expectedCurrentVersionId =
        typeof safeInput.expectedCurrentVersionId === "string"
          ? safeInput.expectedCurrentVersionId
          : (cms.website?.currentVersionId ?? null);
      const path =
        typeof safeInput.path === "string" && safeInput.path.trim()
          ? safeInput.path.trim()
          : null;
      const core = await assertKompisCoreApprovalReady(supabase, {
        runId,
        toolKey: "website_publish_rollback",
        scope: {
          website_id: cms.website?.id ?? null,
          path,
          target_version_id: targetVersionId,
          expected_current_version_id: expectedCurrentVersionId,
        },
      });
      if (!core.ok) {
        return {
          ok: false,
          verified: false,
          summary: "Rollback is waiting for Approval Center (CORE.APPROVAL).",
          errorCode: core.errorCode,
          data: { actionRequestId: core.actionRequestId ?? null },
        };
      }
      const idempotencyKey =
        typeof safeInput.idempotencyKey === "string" && safeInput.idempotencyKey
          ? safeInput.idempotencyKey
          : createWebsiteRollbackIdempotencyKey();
      const result = await rollbackWebsiteVersion(supabase, {
        targetVersionId,
        expectedCurrentVersionId,
        internalReason,
        confirmation: true,
        idempotencyKey,
      });
      if (!result.ok) {
        return {
          ok: false,
          verified: false,
          summary: "Website rollback could not be completed.",
          errorCode: result.errorCode,
        };
      }
      await consumeKompisCoreApproval(supabase, {
        runId,
        toolKey: "website_publish_rollback",
        scope: {
          website_id: cms.website?.id ?? null,
          path,
          target_version_id: targetVersionId,
          expected_current_version_id: expectedCurrentVersionId,
        },
      });
      const verified = result.status === "active" && result.runtimeVerification.verified;
      return {
        ok: true,
        verified,
        changed: !result.idempotentReplay,
        summary: verified
          ? "Website rolled back and runtime-verified against the live domain. Publish history was preserved."
          : "Rollback was recorded but still needs runtime verification.",
        data: {
          operationId: result.operationId,
          status: result.status,
          versionId: result.versionId ?? null,
          versionNumber: result.versionNumber ?? null,
          coreApprovalRequestId: core.actionRequestId ?? null,
          runtimeVerification: result.runtimeVerification,
        },
        errorCode: verified ? undefined : "rollback_pending_verification",
      };
    }
    default: {
      const tool = getKompisOperatorTool(step.toolKey);
      return {
        ok: false,
        verified: false,
        summary: "Tool is unavailable.",
        errorCode: tool?.unavailableReason ?? "tool_unavailable",
      };
    }
  }
}

export async function executeKompisOperatorPlan(input: {
  supabase: SupabaseClient;
  runId: string;
  idempotencyKey: string;
  plan: KompisOperatorPlan;
}): Promise<{
  status: "completed" | "partial" | "failed" | "blocked" | "attention";
  resultSummary: string;
  safeErrorCode: string | null;
  stepResults: Array<{ sequence: number; status: string; result: Record<string, unknown> }>;
}> {
  const { supabase, runId, idempotencyKey, plan } = input;

  const begin = await supabase.rpc("begin_app_kompis_operator_run_execution", {
    p_run_id: runId,
    p_idempotency_key: idempotencyKey,
  });
  if (begin.error) {
    return {
      status: "failed",
      resultSummary: "Execution could not start.",
      safeErrorCode: "execution_begin_failed",
      stepResults: [],
    };
  }

  if (plan.riskClass === 3) {
    await supabase.rpc("complete_app_kompis_operator_run", {
      p_run_id: runId,
      p_status: "blocked",
      p_result_summary: "Critical action blocked.",
      p_safe_error_code: "critical_blocked",
    });
    return {
      status: "blocked",
      resultSummary: "Critical action blocked.",
      safeErrorCode: "critical_blocked",
      stepResults: [],
    };
  }

  const workspace = await loadWorkspace(supabase);
  if (workspace.available !== true) {
    await supabase.rpc("complete_app_kompis_operator_run", {
      p_run_id: runId,
      p_status: "blocked",
      p_result_summary: "Kompis is not available for this organization.",
      p_safe_error_code: "kompis_unavailable",
    });
    return {
      status: "blocked",
      resultSummary: "Kompis is not available for this organization.",
      safeErrorCode: "kompis_unavailable",
      stepResults: [],
    };
  }

  const stepResults: Array<{ sequence: number; status: string; result: Record<string, unknown> }> = [];
  let failed = false;
  let uncertain = false;

  for (const step of plan.steps) {
    const tool = getKompisOperatorTool(step.toolKey);
    if (!tool?.available) {
      failed = true;
      stepResults.push({
        sequence: step.sequence,
        status: "blocked",
        result: { ok: false, errorCode: tool?.unavailableReason ?? "tool_unavailable" },
      });
      break;
    }

    const result = await executeTool(supabase, step, workspace, runId);
    const status = result.ok ? (result.verified ? "completed" : "attention") : "failed";
    if (!result.ok) failed = true;
    if (result.ok && !result.verified) uncertain = true;

    await supabase.rpc("record_app_kompis_operator_step_result", {
      p_run_id: runId,
      p_sequence: step.sequence,
      p_status: status === "attention" ? "completed" : status,
      p_result_summary: {
        ok: result.ok,
        verified: result.verified,
        summary: result.summary,
        errorCode: result.errorCode ?? null,
        changed: result.changed === true,
        data: result.data ?? {},
      },
    });

    stepResults.push({
      sequence: step.sequence,
      status,
      result: {
        ok: result.ok,
        verified: result.verified,
        summary: result.summary,
        errorCode: result.errorCode ?? null,
        data: result.data ?? {},
      },
    });

    if (!result.ok) break;
  }

  const finalStatus = failed
    ? stepResults.some((step) => step.status === "completed")
      ? "partial"
      : "failed"
    : uncertain
      ? "attention"
      : "completed";

  const resultSummary = failed
    ? "Task stopped before all steps completed."
    : uncertain
      ? "Task finished but result verification needs follow-up."
      : "Task completed and authoritatively verified.";

  await supabase.rpc("complete_app_kompis_operator_run", {
    p_run_id: runId,
    p_status: finalStatus === "attention" ? "attention" : finalStatus,
    p_result_summary: resultSummary,
    p_safe_error_code: failed
      ? "step_failed"
      : uncertain
        ? "verifier_uncertain"
        : null,
  });

  return {
    status: finalStatus,
    resultSummary,
    safeErrorCode: failed ? "step_failed" : uncertain ? "verifier_uncertain" : null,
    stepResults,
  };
}
