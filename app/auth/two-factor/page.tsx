import { redirectNeutralTwoFactorIndex } from "./layout";

export default async function NeutralTwoFactorIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; required?: string }>;
}) {
  await redirectNeutralTwoFactorIndex(await searchParams);
}
