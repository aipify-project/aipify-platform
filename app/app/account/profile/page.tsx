import { redirect } from "next/navigation";

/** Profile is the company profile. Deep links no longer leave the profile surface. */
export default function AccountProfilePage() {
  redirect("/app/settings/company-profile");
}
