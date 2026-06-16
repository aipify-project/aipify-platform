import { redirect } from "next/navigation";

type SuperPlaybookDesignerRedirectPageProps = {
  params: Promise<{ id: string }>;
};

export default async function SuperPlaybookDesignerRedirectPage({
  params,
}: SuperPlaybookDesignerRedirectPageProps) {
  const { id } = await params;
  redirect(`/platform/operations/playbooks/${id}/designer`);
}
