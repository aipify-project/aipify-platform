import { WebsiteKompisEmbedWidget } from "@/components/embed/WebsiteKompisEmbedWidget";
import { parseWebsiteKompisEmbedSearchParams } from "@/lib/marketing/website-kompis-embed";

type WebsiteKompisEmbedPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function WebsiteKompisEmbedPage({ searchParams }: WebsiteKompisEmbedPageProps) {
  const resolved = await searchParams;
  const parsed = parseWebsiteKompisEmbedSearchParams(resolved);

  if (!parsed.ok) {
    return (
      <main className="flex min-h-dvh items-center justify-center p-4">
        <p className="rounded-lg border border-aipify-border bg-aipify-surface px-4 py-3 text-sm text-aipify-text-secondary">
          Midlertidig utilgjengelig
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-dvh w-full">
      <WebsiteKompisEmbedWidget
        installId={parsed.params.installId}
        domain={parsed.params.domain}
        locale={parsed.params.locale}
      />
    </main>
  );
}
