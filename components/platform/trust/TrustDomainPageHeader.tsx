type Props = {
  title: string;
  subtitle: string;
};

export function TrustDomainPageHeader({ title, subtitle }: Props) {
  return (
    <header className="mb-6 space-y-2">
      <h1 className="text-2xl font-semibold tracking-tight text-gray-900">{title}</h1>
      <p className="max-w-3xl text-sm leading-relaxed text-gray-600">{subtitle}</p>
    </header>
  );
}
