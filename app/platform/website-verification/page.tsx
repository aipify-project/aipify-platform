import { Suspense } from "react";
import { WebsiteReleaseVerificationPanel } from "@/components/platform/website-verification/WebsiteReleaseVerificationPanel";
import { buildWebsiteStagingVerificationLabels } from "@/lib/website-staging-verification/labels";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";
import { createClient } from "@/lib/supabase/server";
import { getPlatformProfile } from "@/lib/tenant/get-platform-profile";
import { PlatformDriftHubShell } from "@/components/platform/drift/PlatformDriftHubShell";
import { DRIFT_PUBLISH_VERIFY_HUB_ID } from "@/lib/platform/drift-hub";

export default async function PlatformWebsiteReleaseVerificationPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);
  const supabase = await createClient();
  const profile = await getPlatformProfile(supabase);
  const canOperate = profile?.role === "super_admin";

  return (
    <PlatformDriftHubShell hub={DRIFT_PUBLISH_VERIFY_HUB_ID}>
      <Suspense fallback={null}>
        <WebsiteReleaseVerificationPanel
          labels={buildWebsiteStagingVerificationLabels(t)}
          canOperate={canOperate}
          locale={locale}
        />
      </Suspense>
    </PlatformDriftHubShell>
  );
}
