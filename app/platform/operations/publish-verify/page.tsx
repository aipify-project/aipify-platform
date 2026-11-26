import { redirect } from "next/navigation";

/** Hub entry for Publisering og verifisering — lands on Publiseringer tab. */
export default function PlatformPublishVerifyHubPage() {
  redirect("/platform/operations/deployments");
}
