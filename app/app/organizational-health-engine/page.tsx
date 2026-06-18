import { redirect } from "next/navigation";

export default function LegacyOrganizationalHealthRedirectPage() {
  redirect("/app/intelligence/health");
}
