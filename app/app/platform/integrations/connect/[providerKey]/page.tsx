import { renderAppPortalIntegrationSetupPage } from "@/lib/app-portal/render-pages";

type PageProps = { params: Promise<{ providerKey: string }> };

/** APP customer route — connect external business platforms (not Platform Admin). */
export default async function AppPlatformIntegrationSetupPage({ params }: PageProps) {
  const { providerKey } = await params;
  return renderAppPortalIntegrationSetupPage(providerKey);
}
