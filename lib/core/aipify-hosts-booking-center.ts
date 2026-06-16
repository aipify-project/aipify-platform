/**
 * Aipify Hosts — Booking Center (Phase Airbnb 35).
 */

type RpcClient = {
  rpc: (fn: string, params?: Record<string, unknown>) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export async function getAipifyHostsBookingCenterDashboard(
  supabase: RpcClient,
  section = "upcoming_bookings",
  filters?: {
    propertyId?: string | null;
    status?: string | null;
    dateFrom?: string | null;
    dateTo?: string | null;
    guestName?: string | null;
  },
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_hosts_booking_center_dashboard", {
    p_section: section,
    p_property_id: filters?.propertyId ?? null,
    p_status: filters?.status ?? null,
    p_date_from: filters?.dateFrom ?? null,
    p_date_to: filters?.dateTo ?? null,
    p_guest_name: filters?.guestName ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getAipifyHostsBookingCenterCard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_hosts_booking_center_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function performAipifyHostsBookingAction(
  supabase: RpcClient,
  params: {
    actionType: string;
    reservationId?: string | null;
    notes?: string | null;
  },
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("perform_aipify_hosts_booking_action", {
    p_action_type: params.actionType,
    p_reservation_id: params.reservationId ?? null,
    p_notes: params.notes ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}
