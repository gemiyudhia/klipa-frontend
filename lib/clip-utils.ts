import type { Clip } from './api/clip';

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
}

export function getStatusMeta(status: Clip['status']) {
  switch (status) {
    case 'APPROVED':
      return { label: 'MANTAP', badgeClass: 'bg-[#7ED957] text-black' };
    case 'PENDING':
      return { label: 'SABAR YA', badgeClass: 'bg-[#FFDE59] text-black' };
    case 'REJECTED':
      return { label: 'DITOLAK', badgeClass: 'bg-[#FF4848] text-white' };
    case 'REVISION_REQUESTED':
      return { label: 'REVISI DULU', badgeClass: 'bg-[#38B6FF] text-white' };
  }
}
