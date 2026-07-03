import { HumanApprovalCenterPanel } from "@/components/app/human-approval/HumanApprovalCenterPanel";
import {
  isCoreHumanApprovalUiEnabled,
  resolveHumanApprovalAccessState,
} from "@/lib/app/human-approval-nav";
import {
  buildHumanApprovalUiLabels,
  loadHumanApprovalDictionary,
} from "@/lib/core/human-approval/labels";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";
import { requireReadyAppPortalContext } from "@/lib/tenant/app-portal-route-access";
import { createClient } from "@/lib/supabase/server";

export default async function HumanApprovalPage() {
  const locale = await getLocale();
  const dict = await loadHumanApprovalDictionary(locale);
  const t = createTranslator(dict);
  const labels = buildHumanApprovalUiLabels(t);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let accessState = resolveHumanApprovalAccessState({
    authenticated: Boolean(user),
    organizationRole: null,
    featureEnabled: isCoreHumanApprovalUiEnabled(),
  });

  if (user && accessState !== "feature_disabled" && accessState !== "unauthenticated") {
    const access = await requireReadyAppPortalContext(supabase);
    if (access.ok) {
      accessState = resolveHumanApprovalAccessState({
        authenticated: true,
        organizationRole: access.context.organization_role,
        featureEnabled: isCoreHumanApprovalUiEnabled(),
      });
    }
  }

  return (
    <HumanApprovalCenterPanel locale={locale} labels={labels} accessState={accessState} />
  );
}
