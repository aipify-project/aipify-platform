import Link from "next/link";
import { marketingDataAttr } from "@/lib/marketing/analytics";

type HeroLabels = {
  badge: string;
  title: string;
  subtitle: string;
  notChatbot: string;
  ctaPrimary: string;
  ctaSecondary: string;
  statInstall: string;
  statInstallLabel: string;
  statModules: string;
  statModulesLabel: string;
  statControl: string;
  statControlLabel: string;
};

type HeroSectionProps = {
  labels: HeroLabels;
};

export default function HeroSection({ labels }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -top-32 right-0 h-[480px] w-[480px] rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute top-24 -left-24 h-[400px] w-[400px] rounded-full bg-violet-600/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-sm font-medium text-cyan-300">
            {labels.badge}
          </span>

          <h1 className="mt-8 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl lg:leading-[1.08]">
            {labels.title}
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-slate-400 sm:text-xl">{labels.subtitle}</p>

          <p className="mt-4 text-sm font-medium text-violet-300/90">{labels.notChatbot}</p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/early-access"
              className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:from-cyan-400 hover:to-blue-500 sm:w-auto"
              {...marketingDataAttr("cta_click", "hero_early_access")}
            >
              {labels.ctaPrimary}
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex w-full items-center justify-center rounded-xl border border-white/15 bg-white/5 px-8 py-4 text-base font-semibold text-white transition hover:bg-white/10 sm:w-auto"
              {...marketingDataAttr("cta_click", "hero_how_it_works")}
            >
              {labels.ctaSecondary}
            </a>
          </div>

          <dl className="mt-14 grid grid-cols-1 gap-6 border-t border-white/10 pt-10 sm:grid-cols-3">
            <div>
              <dt className="text-2xl font-bold text-white">{labels.statInstall}</dt>
              <dd className="mt-1 text-sm text-slate-500">{labels.statInstallLabel}</dd>
            </div>
            <div>
              <dt className="text-2xl font-bold text-white">{labels.statModules}</dt>
              <dd className="mt-1 text-sm text-slate-500">{labels.statModulesLabel}</dd>
            </div>
            <div>
              <dt className="text-2xl font-bold text-white">{labels.statControl}</dt>
              <dd className="mt-1 text-sm text-slate-500">{labels.statControlLabel}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
