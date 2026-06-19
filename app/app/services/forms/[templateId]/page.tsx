import { ServiceIntakeDetailPage } from "@/lib/service-intake-engine/detail-page";
export default async function Page({ params }: { params: Promise<{ templateId: string }> }) {
  const { templateId } = await params; return <ServiceIntakeDetailPage entityType="form" entityKey={templateId} />;
}