import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { sanitizeNextPath } from "@/lib/auth/safe-next-path";
import {
  NEUTRAL_MFA_ENROLL_ROUTE,
  NEUTRAL_MFA_VERIFY_ROUTE,
} from "@/lib/auth/two-factor/mfa-portal-routing";
import { getTwoFactorStatusForSession } from "@/lib/auth/two-factor/api";
import { PLATFORM_ADMIN_ROUTE } from "@/lib/portals/routes";

export const dynamic = "force-dynamic";

export default async function NeutralTwoFactorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/auth/two-factor");
  }

  return children;
}

export async function redirectNeutralTwoFactorIndex(searchParams: {
  next?: string;
  required?: string;
}) {
  const supabase = await createClient();
  const status = await getTwoFactorStatusForSession(supabase);
  const safeNext = sanitizeNextPath(searchParams.next) ?? PLATFORM_ADMIN_ROUTE;
  const nextQuery = `?next=${encodeURIComponent(safeNext)}`;

  if (!status) {
    redirect(`/login?next=${encodeURIComponent(NEUTRAL_MFA_ENROLL_ROUTE)}`);
  }

  if (status.needs_enrollment || searchParams.required === "1") {
    redirect(`${NEUTRAL_MFA_ENROLL_ROUTE}?required=1&next=${encodeURIComponent(safeNext)}`);
  }

  if (status.needs_verification) {
    redirect(`${NEUTRAL_MFA_VERIFY_ROUTE}${nextQuery}`);
  }

  redirect(safeNext);
}
