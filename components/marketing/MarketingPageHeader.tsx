type MarketingPageHeaderProps = {
  title: string;
  subtitle?: string;
};

export default function MarketingPageHeader({ title, subtitle }: MarketingPageHeaderProps) {
  return (
    <div className="border-b border-white/10 bg-[#0c1018]">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        {subtitle && <p className="mt-4 max-w-2xl text-lg text-slate-400">{subtitle}</p>}
      </div>
    </div>
  );
}
