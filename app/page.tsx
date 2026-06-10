import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Modules from "@/components/Modules";
import HowItWorks from "@/components/HowItWorks";
import SocialProof from "@/components/SocialProof";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function Home() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["common", "landing"]);
  const t = createTranslator(dict);

  return (
    <>
      <Navbar
        appName={t("common.appName")}
        links={[
          { label: t("landing.navbar.features"), href: "#features" },
          { label: t("landing.navbar.solutions"), href: "#solutions" },
          { label: t("landing.navbar.pricing"), href: "#pricing" },
          { label: t("landing.navbar.about"), href: "#about" },
        ]}
        bookDemo={t("common.bookDemo")}
        login={t("common.login")}
        getStarted={t("common.getStarted")}
        controlCenter={t("landing.navbar.controlCenter")}
      />
      <main>
        <Hero />
        <Modules />
        <HowItWorks />
        <SocialProof />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
