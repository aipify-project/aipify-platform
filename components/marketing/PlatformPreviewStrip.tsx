type PreviewItem = { label: string; description: string };

type PlatformPreviewStripProps = {
  items: PreviewItem[];
};

export default function PlatformPreviewStrip({ items }: PlatformPreviewStripProps) {
  return (
    <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-xl border border-aipify-border bg-aipify-surface/80 px-3 py-3 text-left shadow-sm backdrop-blur-sm"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-aipify-companion">{item.label}</p>
          <p className="mt-1 text-xs leading-snug text-aipify-text-secondary">{item.description}</p>
        </div>
      ))}
    </div>
  );
}
