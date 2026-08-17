'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { toast } from 'sonner';

interface RejectReasonModalProps {
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void>;
}

export default function RejectReasonModal({
  onClose,
  onConfirm,
}: RejectReasonModalProps) {
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleConfirm() {
    if (reason.trim().length < 5) {
      toast.error('Alasan penolakan wajib diisi, minimal 5 karakter');
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
    <div className="fixed inset-0 z-110 flex items-center justify-center bg-black/70 p-4">
      <div className="relative w-full max-w-md rounded-2xl border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg border-2 border-black bg-white hover:bg-gray-100"
        >
          <X className="h-4 w-4 stroke-3" />
        </button>

        <h2 className="mb-2 text-2xl font-black uppercase text-black">
          Tolak Klip Ini?
        </h2>
        <p className="mb-4 text-sm font-bold text-gray-600">
          Kasih alasan yang jelas biar Clipper tahu apa yang perlu diperbaiki.
        </p>

        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={4}
          placeholder="Misal: Kualitas video kurang jelas, format bukan 9:16..."
          className="mb-4 w-full resize-none rounded-xl border-3 border-black bg-[#F4F4F5] p-3.5 text-sm font-bold text-black focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
        />

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border-3 border-black bg-white py-3 text-sm font-black uppercase text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all hover:bg-gray-50 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
          >
            Batal
          </button>
          <button
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="flex-1 rounded-xl border-3 border-black bg-[#FF4848] py-3 text-sm font-black uppercase text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all hover:bg-[#ff6060] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:opacity-50"
          >
            {isSubmitting ? 'Lagi Proses...' : 'Ya, Tolak'}
          </button>
        </div>
      </div>
    </div>
  );
}
