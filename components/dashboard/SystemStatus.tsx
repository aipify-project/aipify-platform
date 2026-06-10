type Service = {
  name: string;
  status: string;
};

type SystemStatusProps = {
  title: string;
  services: Service[];
};

export default function SystemStatus({ title, services }: SystemStatusProps) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md sm:p-8">
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {services.map((service) => (
          <div
            key={service.name}
            className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-3.5 transition hover:border-gray-200 hover:bg-white"
          >
            <span className="text-sm font-medium text-gray-700">
              {service.name}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {service.status}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
