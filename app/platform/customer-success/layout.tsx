export default function PlatformCustomerSuccessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="w-full max-w-none space-y-6 p-4 sm:p-6 lg:px-8">{children}</div>;
}
