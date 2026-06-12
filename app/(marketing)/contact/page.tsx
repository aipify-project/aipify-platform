import type { Metadata } from "next";
import Link from "next/link";
import { MarketingCtaBand, MarketingPageHeader } from "@/components/marketing";
import { getMarketingContext } from "@/lib/marketing/get-marketing-context";
import { getSection } from "@/lib/marketing/parse-marketing";

export async function generateMetadata(): Promise<Metadata> {
  const { marketing } = await getMarketingContext();
  const meta = getSection<{ contactTitle?: string; contactDescription?: string }>(marketing, "meta");
  return { title: meta.contactTitle, description: meta.contactDescription };
}

export default async function ContactPage() {
  const { marketing } = await getMarketingContext();
  const contact = getSection<Record<string, string>>(marketing, "contact");
  const ctaBand = getSection<Record<string, string>>(marketing, "ctaBand");

  return (
    <>
      <MarketingPageHeader title={contact.title ?? ""} subtitle={contact.subtitle} />
      <div className="mx-auto max-w-xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
          <p className="text-sm font-medium text-slate-300">{contact.emailLabel}</p>
          <a href={`mailto:${contact.emailValue}`} className="mt-2 block text-lg font-semibold text-cyan-400 hover:text-cyan-300">
            {contact.emailValue}
          </a>
          <p className="mt-6 text-sm text-slate-500">{contact.note}</p>
          <Link
            href="/early-access"
            className="mt-8 inline-flex rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-sm font-semibold text-white"
          >
            {ctaBand.button}
          </Link>
        </div>
      </div>
      <MarketingCtaBand title={ctaBand.title ?? ""} subtitle={ctaBand.subtitle ?? ""} button={ctaBand.button ?? ""} />
    </>
  );
}
