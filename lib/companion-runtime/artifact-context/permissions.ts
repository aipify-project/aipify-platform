import type { CompanionArtifactSecurityStatus, CompanionConversationAttachment } from "./types";

export type CompanionAttachmentAccessContext = {
  company_id: string;
  user_id: string;
  conversation_id: string;
};

export function assertAttachmentTenantAccess(
  attachment: Pick<CompanionConversationAttachment, "attachment_id"> & {
    company_id?: string;
    conversation_id?: string;
    user_id?: string;
    deleted_at?: string | null;
  },
  ctx: CompanionAttachmentAccessContext & { attachment_company_id: string; attachment_user_id: string },
): { allowed: true } | { allowed: false; code: string } {
  if (attachment.deleted_at) {
    return { allowed: false, code: "attachment_deleted" };
  }

  if (ctx.attachment_company_id !== ctx.company_id) {
    return { allowed: false, code: "tenant_mismatch" };
  }

  if (ctx.attachment_user_id !== ctx.user_id) {
    return { allowed: false, code: "owner_mismatch" };
  }

  if (attachment.conversation_id && attachment.conversation_id !== ctx.conversation_id) {
    return { allowed: false, code: "conversation_mismatch" };
  }

  return { allowed: true };
}

export function isAttachmentUsableForModel(securityStatus: CompanionArtifactSecurityStatus): boolean {
  return securityStatus === "approved";
}

export function canHandoffAttachment(
  securityStatus: CompanionArtifactSecurityStatus,
  consentGranted: boolean,
): boolean {
  return securityStatus === "approved" && consentGranted;
}
