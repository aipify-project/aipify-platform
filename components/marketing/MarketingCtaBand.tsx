import Link from "next/link";
import { marketingDataAttr } from "@/lib/marketing/analytics";

type MarketingCtaBandProps = {
  title: string;
  subtitle: string;
  button: string;
};

export default function MarketingCtaBand({ title, subtitle, button }: MarketingCtaBandProps) {
  return (
    <section className="border-t border-aipify-border">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 via-blue-600/10 to-violet-600/10 px-8 py-12 text-center sm:px-12">
          <h2 className="text-2xl font-bold text-aipify-text sm:text-3xl">{title}</h2>
          <p className="mx-auto mt-3 max-w-xl text-aipify-text-secondary">{subtitle}</p>
          <Link
            href="/early-access"
            className="mt-8 inline-flex rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:from-cyan-400 hover:to-blue-500"
            {...marketingDataAttr("cta_click", "cta_band")}
          >
            {button}
          </Link>
        </div>
      </div>
    </section>
  );
}
