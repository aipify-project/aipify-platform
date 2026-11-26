import { redirect } from "next/navigation";

/** Account security uses the existing sign-in verification surface. MFA is not reimplemented here. */
export default function AccountSecurityPage() {
  redirect("/app/settings/two-factor");
}
