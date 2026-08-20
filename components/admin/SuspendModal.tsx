'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { toast } from 'sonner';

interface SuspendModalProps {
  userName: string;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void>;
}

export default function SuspendModal({
  userName,
  onClose,
  onConfirm,
}: SuspendModalProps) {
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleConfirm() {
    if (reason.trim().length < 5) {
      toast.error('Alasan wajib diisi, minimal 5 karakter');
      return;
    }
    setIsSubmitting(true);
    try {
      await onConfirm(reason);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/70 p-4">
      <div className="relative w-full max-w-md rounded-2xl border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg border-2 border-black bg-white hover:bg-gray-100"
        >
          <X className="h-4 w-4 stroke-3" />
        </button>

        <h2 className="mb-2 text-xl font-black uppercase text-black">
          Suspend {userName}?
        </h2>
        <p className="mb-4 text-sm font-bold text-gray-600">
          User tidak akan bisa login setelah disuspend.
        </p>

        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={3}
          placeholder="Alasan suspend..."
          className="mb-4 w-full resize-none rounded-xl border-3 border-black bg-[#F4F4F5] p-3 text-sm font-bold text-black focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
        />

        <button
          onClick={handleConfirm}
          disabled={isSubmitting}
          className="w-full rounded-xl border-3 border-black bg-[#FF4848] py-3 text-sm font-black uppercase text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:opacity-50"
        >
          {isSubmitting ? 'Lagi Proses...' : 'Ya, Suspend'}
        </button>
      </div>
    </div>
  );
}
