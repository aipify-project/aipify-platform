import type { SuperAdminPlatformStatus, SuperAdminSystemService } from "./types";

function serviceStatus(configured: boolean, required = true): SuperAdminPlatformStatus {
  if (configured) return "operational";
  return required ? "pending_setup" : "pending_setup";
}

export function buildSuperAdminSystemServices(): SuperAdminSystemService[] {
  const now = 0;

  const services: Array<{
    id: string;
    configured: boolean;
    response_time_ms?: number | null;
  }> = [
    {
      id: "supabase",
      configured: Boolean(
        process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      ),
      response_time_ms: 42,
    },
    {
      id: "resend",
      configured: Boolean(process.env.RESEND_API_KEY),
    },
    {
      id: "stripe",
      configured: Boolean(process.env.STRIPE_SECRET_KEY),
    },
    {
      id: "klarna",
      configured: Boolean(process.env.KLARNA_API_KEY ?? process.env.KLARNA_USERNAME),
    },
    {
      id: "aipifyApi",
      configured: true,
      response_time_ms: 28,
    },
    {
      id: "webhooks",
      configured: Boolean(process.env.STRIPE_WEBHOOK_SECRET),
    },
  ];

  return services.map((service) => ({
    id: service.id,
    status: serviceStatus(service.configured, service.id !== "klarna"),
    last_check_seconds_ago: now,
    response_time_ms: service.response_time_ms ?? null,
  }));
}
