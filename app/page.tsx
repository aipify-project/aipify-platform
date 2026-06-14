import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Modules from "@/components/Modules";
import HowItWorks from "@/components/HowItWorks";
import SocialProof from "@/components/SocialProof";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import {
  buildHomeModules,
  buildHowItWorksSteps,
  buildSocialProofSegments,
} from "@/lib/landing/home-sections";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function Home() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["common", "landing"]);
  const t = createTranslator(dict);
  const p = "landing";

  return (
    <>
      <Navbar
        appName={t("common.appName")}
        links={[
          { label: t(`${p}.navbar.features`), href: "#features" },
          { label: t(`${p}.navbar.solutions`), href: "#solutions" },
          { label: t(`${p}.navbar.pricing`), href: "#pricing" },
          { label: t(`${p}.navbar.about`), href: "#about" },
        ]}
        bookDemo={t("common.bookDemo")}
        login={t("common.login")}
        getStarted={t("common.getStarted")}
        controlCenter={t(`${p}.navbar.controlCenter`)}
      />
      <main>
        <Hero
          badge={t(`${p}.hero.badge`)}
          title={t(`${p}.hero.title`)}
          subtitle={t(`${p}.hero.subtitle`)}
          ctaPrimary={t(`${p}.hero.ctaPrimary`)}
          ctaSecondary={t(`${p}.hero.ctaSecondary`)}
          statResponse={t(`${p}.hero.statResponse`)}
          statResponseLabel={t(`${p}.hero.statResponseLabel`)}
          statModules={t(`${p}.hero.statModules`)}
          statModulesLabel={t(`${p}.hero.statModulesLabel`)}
          statAvailability={t(`${p}.hero.statAvailability`)}
          statAvailabilityLabel={t(`${p}.hero.statAvailabilityLabel`)}
        />
        <Modules
          title={t(`${p}.modules.title`)}
          subtitle={t(`${p}.modules.subtitle`)}
          modules={buildHomeModules(t)}
        />
        <HowItWorks
          title={t(`${p}.howItWorks.title`)}
          subtitle={t(`${p}.howItWorks.subtitle`)}
          steps={buildHowItWorksSteps(t)}
        />
        <SocialProof
          title={t(`${p}.socialProof.title`)}
          segments={buildSocialProofSegments(t)}
        />
        <CTA
          title={t(`${p}.cta.title`)}
          subtitle={t(`${p}.cta.subtitle`)}
          primary={t(`${p}.cta.primary`)}
          secondary={t(`${p}.cta.secondary`)}
          trustLine={t(`${p}.cta.trustLine`)}
        />
      </main>
      <Footer />
    </>
  );
}
