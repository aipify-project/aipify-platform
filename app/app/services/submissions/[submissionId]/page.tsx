import { ServiceIntakeDetailPage } from "@/lib/service-intake-engine/detail-page";
export default async function Page({ params }: { params: Promise<{ submissionId: string }> }) {
  const { submissionId } = await params; return <ServiceIntakeDetailPage entityType="submission" entityKey={submissionId} />;
}