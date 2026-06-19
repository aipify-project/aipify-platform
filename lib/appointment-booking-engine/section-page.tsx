import { AppointmentBookingPanel } from "@/components/app/appointment-booking";
import { buildAppointmentBookingLabels } from "@/lib/appointment-booking-engine/labels";
import type { AppointmentBookingSection } from "@/lib/appointment-booking-engine/config";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export async function AppointmentBookingSectionPage({
  activeSection,
}: {
  activeSection: AppointmentBookingSection;
}) {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForModule(locale, "appointmentBooking");
  const t = createTranslator(dict);
  const labels = buildAppointmentBookingLabels(t);

  return <AppointmentBookingPanel labels={labels} activeSection={activeSection} />;
}
