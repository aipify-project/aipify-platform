type PartnerPortalPreviewSectionProps = {
  title: string;
  items: string[];
};

export default function PartnerPortalPreviewSection({ title, items }: PartnerPortalPreviewSectionProps) {
  return (
    <section aria-labelledby="partner-portal-preview-title" className="border-y border-white/10 bg-white/[0.02] py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 id="partner-portal-preview-title" className="text-center text-2xl font-bold tracking-tight text-white sm:text-3xl">
          {title}
        </h2>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <li
              key={item}
              className="flex aspect-[4/3] items-center justify-center rounded-2xl border border-dashed border-violet-500/30 bg-gradient-to-br from-violet-950/30 to-indigo-950/20 p-4 text-center text-sm font-medium text-violet-200/90"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
