"use client";

import { useState } from "react";

type InviteTeamMemberModalProps = {
  open: boolean;
  onClose: () => void;
  labels: {
    title: string;
    email: string;
    role: string;
    department: string;
    welcomeMessage: string;
    send: string;
    cancel: string;
    success: string;
  };
  roleOptions: Array<{ value: string; label: string }>;
};

export default function InviteTeamMemberModal({
  open,
  onClose,
  labels,
  roleOptions,
}: InviteTeamMemberModalProps) {
  const [sent, setSent] = useState(false);

  if (!open) return null;

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSent(true);
    setTimeout(() => {
      setSent(false);
      onClose();
    }, 1200);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 p-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-gray-900">{labels.title}</h2>
        {sent ? (
          <p className="mt-4 text-sm text-emerald-600">{labels.success}</p>
        ) : (
          <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
            <label className="block text-sm">
              <span className="font-medium text-gray-700">{labels.email}</span>
              <input
                type="email"
                required
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              />
            </label>
            <label className="block text-sm">
              <span className="font-medium text-gray-700">{labels.role}</span>
              <select className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm">
                {roleOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              <span className="font-medium text-gray-700">{labels.department}</span>
              <input
                type="text"
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              />
            </label>
            <label className="block text-sm">
              <span className="font-medium text-gray-700">{labels.welcomeMessage}</span>
              <textarea
                rows={3}
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              />
            </label>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50"
              >
                {labels.cancel}
              </button>
              <button
                type="submit"
                className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700"
              >
                {labels.send}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
