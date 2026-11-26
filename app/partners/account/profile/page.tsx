import { PartnersProfileAvatarPanel } from "@/components/partners-portal/PartnersProfileAvatarPanel";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";
import { resolvePartnersAvatarPointer } from "@/lib/partners-portal/avatar";
import { resolvePartnersPortalServerAccess } from "@/lib/partners-portal/server-access";
import { buildPartnersPortalAvatarLabels } from "@/lib/partners-portal/shell-labels";

export default async function PartnersPortalProfilePage() {
  const dict = await getDictionary(await getLocale(), ["partnersPortal"]);
  const t = createTranslator(dict);

  // Layout already gates the portal; resolve again here for the partner's own metadata only.
  const access = await resolvePartnersPortalServerAccess();
  let avatarUrl: string | null = null;
  if (access.kind === "allowed") {
    try {
      const {
        data: { user },
      } = await access.supabase.auth.getUser();
      avatarUrl = resolvePartnersAvatarPointer(user?.user_metadata?.avatar_url);
    } catch {
      avatarUrl = null;
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-aipify-text">
          {t("partnersPortal.pages.profile.title")}
        </h1>
        <p className="mt-2 max-w-3xl text-aipify-text-secondary">
          {t("partnersPortal.pages.profile.subtitle")}
        </p>
      </div>
      <PartnersProfileAvatarPanel
        labels={buildPartnersPortalAvatarLabels(t)}
        initialAvatarUrl={avatarUrl}
      />
    </div>
  );
}
