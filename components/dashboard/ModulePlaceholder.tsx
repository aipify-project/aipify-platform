import { AipifyEmptyState } from "@/components/branding";

type ModulePlaceholderProps = {
  title: string;
  subtitle: string;
  comingSoon: string;
  pulseLabel: string;
};

export default function ModulePlaceholder({
  title,
  subtitle,
  comingSoon,
  pulseLabel,
}: ModulePlaceholderProps) {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
        {title}
      </h1>
      <p className="mt-2 text-base text-gray-500">{subtitle}</p>
      <div className="mt-8">
        <AipifyEmptyState message={comingSoon} pulseLabel={pulseLabel} />
      </div>
    </div>
  );
}
