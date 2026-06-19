import { CheckoutVatExperience } from "@/components/shared/checkout-vat";
import { buildCheckoutVatLabels } from "@/lib/checkout-vat-operations";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

type Props = {
  searchParams: Promise<{ product?: string; subtotal?: string; currency?: string }>;
};

export default async function CheckoutPage({ searchParams }: Props) {
  const params = await searchParams;
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "checkoutVat");
  const labels = buildCheckoutVatLabels(createTranslator(dict));

  return (
    <CheckoutVatExperience
      backHref="/app/settings/billing/packages"
      labels={labels}
      initialProductType={params.product ?? "subscription"}
      initialSubtotal={Number(params.subtotal ?? 0)}
      initialCurrency={params.currency ?? "NOK"}
    />
  );
}
