import type { Dispute } from './api/dispute';

export function getDisputeStatusMeta(status: Dispute['status']) {
  switch (status) {
    case 'PENDING':
      return { label: 'LAGI DIREVIEW', badgeClass: 'bg-[#FFDE59] text-black' };
    case 'APPROVED':
      return { label: 'MENANG!', badgeClass: 'bg-[#7ED957] text-black' };
    case 'REJECTED':
      return { label: 'DITOLAK ADMIN', badgeClass: 'bg-[#FF4848] text-white' };
  }
}
