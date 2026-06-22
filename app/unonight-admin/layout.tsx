import { redirect } from "next/navigation";
import GrowthPartnerPortalSignOutButton from "@/components/growth-partner-portal/GrowthPartnerPortalSignOutButton";
import { createClient } from "@/lib/supabase/server";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";
import { buildUnonightAipifyConnectionLabels } from "@/lib/unonight-platform";
import { AipifyConnectionTokensPanel } from "@/components/unonight-admin/AipifyConnectionTokensPanel";

export default async function UnonightAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const locale = await getLocale();
  const dict = await getDictionary(locale, ["common", "auth", "unonightAdmin"]);
  const t = createTranslator(dict);
  const labels = buildUnonightAipifyConnectionLabels(t);

  return (
    <div className="min-h-screen bg-[#F7F6F3]">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-violet-700">
              {labels.shell.portalBadge}
            </p>
            <p className="text-sm font-medium text-slate-900">{labels.shell.portalTitle}</p>
          </div>
          <GrowthPartnerPortalSignOutButton label={labels.shell.signOut} />
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
