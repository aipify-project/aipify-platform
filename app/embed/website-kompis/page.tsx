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
      <main className="flex h-[72px] w-[72px] items-center justify-center bg-transparent p-2">
        <p className="sr-only">Midlertidig utilgjengelig</p>
      </main>
    );
  }

  return (
    <main className="h-full min-h-0 w-full bg-transparent">
      <WebsiteKompisEmbedWidget
        installId={parsed.params.installId}
        domain={parsed.params.domain}
        locale={parsed.params.locale}
      />
    </main>
  );
}
