type Props = {
  message: string;
};

export function TrustAccessDenied({ message }: Props) {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900">
      {message}
    </div>
  );
}
