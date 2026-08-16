'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { createDispute } from '@/lib/api/dispute';

interface DisputeModalProps {
  clipId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function DisputeModal({
  clipId,
  onClose,
  onSuccess,
}: DisputeModalProps) {
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    if (reason.trim().length < 10) {
      toast.error('Alasan minimal 10 karakter, jelasin yang jelas ya');
      return;
    }

    setIsSubmitting(true);
    try {
      await createDispute(clipId, reason);
      toast.success('Dispute berhasil diajukan! Admin bakal review.');
      onSuccess();
      onClose();
    } catch (error: any) {
      const message =
        error?.response?.data?.message || 'Gagal mengajukan dispute';
      toast.error(Array.isArray(message) ? message[0] : message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 p-4">
      <div className="relative w-full max-w-md bg-white border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center border-2 border-black rounded-lg bg-white hover:bg-gray-100"
        >
          <X className="h-4 w-4 stroke-3" />
        </button>

        <h2 className="mb-2 text-2xl font-black uppercase text-black">
          Gak Terima Nih?
        </h2>
        <p className="mb-4 text-sm font-bold text-gray-600">
          Jelasin kenapa klip lu ditolak sepihak. Admin bakal review ulang.
        </p>

        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={4}
          placeholder="Misal: Video ini sudah dipakai Creator di Instagram-nya, kok masih ditolak..."
          className="w-full bg-[#F4F4F5] border-3 border-black rounded-xl p-3.5 text-sm font-bold text-black focus:outline-none focus:bg-white focus:ring-2 focus:ring-black transition-all resize-none mb-4"
        />

        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full bg-[#FF66C4] hover:bg-[#ff7fd0] text-white font-black text-sm py-3.5 rounded-xl border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all uppercase disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Lagi Ngirim...' : 'Ajukan Dispute'}
        </button>
      </div>
    </div>
  );
}
