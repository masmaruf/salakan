export const PENGAJUAN_STATUS = [
  'menunggu',
  'diproses',
  'perlu_revisi',
  'selesai',
  'ditolak',
] as const;

export type PengajuanStatus = (typeof PENGAJUAN_STATUS)[number];

type StatusMeta = {
  label: string;
  shortLabel: string;
  description: string;
  tone: string;
  badgeClass: string;
  dotClass: string;
};

const STATUS_META: Record<PengajuanStatus, StatusMeta> = {
  menunggu: {
    label: 'Menunggu RT',
    shortLabel: 'Menunggu',
    description: 'Pengajuan sudah masuk dan sedang menunggu pemeriksaan awal dari pengurus RT.',
    tone: 'warning',
    badgeClass: 'bg-amber-50 text-amber-700 border border-amber-100',
    dotClass: 'bg-amber-500',
  },
  diproses: {
    label: 'Sedang Diproses',
    shortLabel: 'Diproses',
    description: 'Data sedang diverifikasi dan surat sedang disiapkan.',
    tone: 'info',
    badgeClass: 'bg-blue-50 text-blue-700 border border-blue-100',
    dotClass: 'bg-blue-500',
  },
  perlu_revisi: {
    label: 'Perlu Revisi',
    shortLabel: 'Revisi',
    description: 'Ada data yang perlu diperbaiki sebelum pengajuan bisa dilanjutkan.',
    tone: 'warning',
    badgeClass: 'bg-orange-50 text-orange-700 border border-orange-100',
    dotClass: 'bg-orange-500',
  },
  selesai: {
    label: 'Siap Diambil',
    shortLabel: 'Selesai',
    description: 'Pengajuan selesai diproses dan surat siap ditindaklanjuti warga.',
    tone: 'success',
    badgeClass: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
    dotClass: 'bg-emerald-500',
  },
  ditolak: {
    label: 'Ditolak',
    shortLabel: 'Ditolak',
    description: 'Pengajuan tidak dapat diproses dan membutuhkan pengajuan ulang bila diperlukan.',
    tone: 'danger',
    badgeClass: 'bg-rose-50 text-rose-700 border border-rose-100',
    dotClass: 'bg-rose-500',
  },
};

export function getPengajuanStatusMeta(status: string): StatusMeta {
  return STATUS_META[(PENGAJUAN_STATUS as readonly string[]).includes(status) ? (status as PengajuanStatus) : 'menunggu'];
}

export function getPublicTicketLabel(ticket: string) {
  return ticket.trim().toUpperCase();
}
