import type { SupabaseClient } from "@supabase/supabase-js";
import { getDashboardProfile } from "@/lib/tenant/get-profile";

export type CompanionAttachmentStorageContext = {
  tenantId: string;
  userId: string;
};

export async function resolveCompanionAttachmentStorageContext(
  supabase: SupabaseClient,
): Promise<CompanionAttachmentStorageContext | null> {
  const profile = await getDashboardProfile(supabase);
  if (!profile) return null;

  const { data: customer, error } = await supabase
    .from("customers")
    .select("id")
    .eq("company_id", profile.company.id)
    .maybeSingle();

  if (error || !customer?.id) return null;

  return {
    tenantId: customer.id,
    userId: profile.user.id,
  };
}

export function buildCompanionAttachmentStoragePath(input: {
  tenantId: string;
  userId: string;
  conversationId: string;
  attachmentId: string;
  filename: string;
}): string {
  return `${input.tenantId}/${input.userId}/${input.conversationId}/${input.attachmentId}/${input.filename}`;
}
