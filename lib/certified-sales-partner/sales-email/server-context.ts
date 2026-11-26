import type { SupabaseClient, User } from "@supabase/supabase-js";
import { callCspRpc } from "../core-rpc";
import { evaluateSalesLinkGates } from "../partner-overview";
import { parseCspPortalView } from "../portal-view";
import {
  AIPIFY_INTERNAL_SALES_TENANT,
  getSalesEmailTemplate,
  isSalesEmailLocale,
  isSalesEmailProductKey,
  type SalesEmailTemplate,
} from "./catalog";
import { evaluateSalesEmailSend, isSingleEmailAddress, normalizeEmailAddress, readOutboundOwnerGate, type SalesEmailSendBlock } from "./gates";
import { salesEmailRateLimited } from "./send";
import { buildSalesReferralUrl, publicEmailAssetUrl, renderSalesEmail, type SalesEmailSellerContext } from "./render";

export type SalesEmailActorContext = {
  partnerId: string | null;
  partnerStatus: string | null;
  seller: SalesEmailSellerContext;
  referralCode: string | null;
  certifiedProductKeys: string[];
  persistenceReady: boolean;
};

function str(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

export async function salesEmailPersistenceReady(supabase: SupabaseClient): Promise<boolean> {
  const result = await callCspRpc(supabase, "csp_sales_email_backend_status");
  if (!result.ready || !result.data || typeof result.data !== "object") return false;
  return (result.data as { ready?: unknown }).ready === true;
}

export async function loadSalesEmailActor(supabase: SupabaseClient, user: User): Promise<SalesEmailActorContext> {
  const overview = await callCspRpc(supabase, "csp_get_partner_overview");
  const view = overview.ready ? parseCspPortalView(overview.data) : null;
  const partner = overview.ready && overview.data && typeof overview.data === "object"
    ? (overview.data as { partner?: Record<string, unknown> }).partner ?? null
    : null;
  const metadata = (user.user_metadata ?? {}) as Record<string, unknown>;
  const company = str(partner?.company_name) ?? str(partner?.company) ?? str(metadata.company_name);
  const contact = str(user.email) ?? str(partner?.email) ?? str(metadata.email);
  const avatar = publicEmailAssetUrl(str(metadata.avatar_url) ?? str(metadata.picture));
  const certified = view
    ? view.overview.products
        .filter((product) => product.productKey && evaluateSalesLinkGates(view.overview, product.productKey).allowed)
        .map((product) => product.productKey as string)
    : [];
  return {
    partnerId: view?.overview.partnerId ?? null,
    partnerStatus: view?.overview.partnerStatus ?? null,
    seller: {
      displayName: view?.overview.displayName ?? str(metadata.full_name) ?? str(user.email) ?? "",
      company,
      contact,
      avatarUrl: avatar,
    },
    referralCode: view?.links.find((link) => link.active && link.code)?.code ?? null,
    certifiedProductKeys: certified,
    persistenceReady: await salesEmailPersistenceReady(supabase),
  };
}

export function previewSalesEmailForActor(input: {
  actor: SalesEmailActorContext;
  template: SalesEmailTemplate;
  locale: string;
  recipient?: string | null;
  idempotencyKey?: string | null;
}): {
  rendered: ReturnType<typeof renderSalesEmail>;
  send: { ok: true } | { ok: false; code: SalesEmailSendBlock };
} {
  const locale = isSalesEmailLocale(input.locale) ? input.locale : null;
  const row = locale ? input.template.locales[locale] : null;
  const gateEnv = readOutboundOwnerGate();
  const recipient = input.recipient?.trim() ? normalizeEmailAddress(input.recipient) : "";
  const referralUrl =
    locale && input.actor.referralCode && isSalesEmailProductKey(input.template.productKey)
      ? buildSalesReferralUrl({
          code: input.actor.referralCode,
          productKey: input.template.productKey,
          locale,
        })
      : null;
  const send = evaluateSalesEmailSend({
    tenantId: AIPIFY_INTERNAL_SALES_TENANT,
    partnerStatus: input.actor.partnerStatus,
    productCertified: input.actor.certifiedProductKeys.includes(input.template.productKey),
    referralUrl,
    sellerCompany: input.actor.seller.company,
    sellerContact: input.actor.seller.contact,
    templatePublished: row?.status === "published",
    recipients: recipient ? [recipient] : [],
    suppressed: suppressionList().includes(recipient),
    lawfulBasisRecorded: gateEnv.lawfulBasisRecorded,
    outboundOwnerApproved: gateEnv.outboundOwnerApproved,
    recipientAllowlisted: gateEnv.allowlist.includes(recipient),
    transportConfigured: gateEnv.transportConfigured,
    replyDomainConfigured: gateEnv.replyDomainConfigured,
    tokenSecretConfigured: gateEnv.tokenSecretConfigured,
    persistenceReady: input.actor.persistenceReady,
    rateLimited: input.actor.partnerId ? salesEmailRateLimited(input.actor.partnerId) : false,
    idempotencyKey: input.idempotencyKey ?? null,
  });
  if (!locale || !row || row.status !== "published" || !input.actor.referralCode) {
    return {
      rendered: { ok: false, code: row?.status === "unavailable" ? "missing_placeholder" : "referral_rejected" },
      send,
    };
  }
  return {
    rendered: renderSalesEmail({
      locale,
      productKey: input.template.productKey,
      source: row,
      seller: input.actor.seller,
      referralCode: input.actor.referralCode,
    }),
    send,
  };
}

export function suppressionList(env: NodeJS.ProcessEnv = process.env): string[] {
  return (env.CSP_SALES_EMAIL_SUPPRESSION ?? "")
    .split(",")
    .map((item) => normalizeEmailAddress(item))
    .filter((item) => isSingleEmailAddress(item));
}

export function templateOrNull(id: string): SalesEmailTemplate | null {
  return getSalesEmailTemplate(id);
}
