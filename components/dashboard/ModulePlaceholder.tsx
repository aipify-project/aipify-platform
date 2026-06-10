type ModulePlaceholderProps = {
  title: string;
  subtitle: string;
  comingSoon: string;
};

export default function ModulePlaceholder({
  title,
  subtitle,
  comingSoon,
}: ModulePlaceholderProps) {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
        {title}
      </h1>
      <p className="mt-2 text-base text-gray-500">{subtitle}</p>
      <div className="mt-8 rounded-2xl border border-dashed border-gray-200 bg-gray-50/80 p-6 text-sm text-gray-600">
        {comingSoon}
      </div>
    </div>
  );
}
