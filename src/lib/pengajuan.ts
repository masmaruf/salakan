import type { BadgeTone, BadgeVariant } from './ui-badge';
import { getBadgeClasses } from './ui-badge';

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
  tone: BadgeTone;
  variant: BadgeVariant;
  icon: string;
  badgeClass: string;
  dotClass: string;
};

const statusBadgeClass = (tone: BadgeTone) =>
  getBadgeClasses({ tone, className: 'gap-2 rounded-[var(--radius-selector)] px-4 py-2 text-sm font-bold' });

const STATUS_META: Record<PengajuanStatus, StatusMeta> = {
  menunggu: {
    label: 'Menunggu RT',
    shortLabel: 'Menunggu',
    description: 'Pengajuan sudah masuk dan sedang menunggu pemeriksaan awal dari pengurus RT.',
    tone: 'warning',
    variant: 'outline',
    icon: 'schedule',
    badgeClass: statusBadgeClass('warning'),
    dotClass: 'status status-warning',
  },
  diproses: {
    label: 'Sedang Diproses',
    shortLabel: 'Diproses',
    description: 'Data sedang diverifikasi dan surat sedang disiapkan.',
    tone: 'info',
    variant: 'outline',
    icon: 'autorenew',
    badgeClass: statusBadgeClass('info'),
    dotClass: 'status status-info',
  },
  perlu_revisi: {
    label: 'Perlu Revisi',
    shortLabel: 'Revisi',
    description: 'Ada data yang perlu diperbaiki sebelum pengajuan bisa dilanjutkan.',
    tone: 'warning',
    variant: 'outline',
    icon: 'edit_note',
    badgeClass: statusBadgeClass('warning'),
    dotClass: 'status status-warning',
  },
  selesai: {
    label: 'Siap Diambil',
    shortLabel: 'Selesai',
    description: 'Pengajuan selesai diproses dan surat siap ditindaklanjuti warga.',
    tone: 'success',
    variant: 'outline',
    icon: 'check_circle',
    badgeClass: statusBadgeClass('success'),
    dotClass: 'status status-success',
  },
  ditolak: {
    label: 'Ditolak',
    shortLabel: 'Ditolak',
    description: 'Pengajuan tidak dapat diproses dan membutuhkan pengajuan ulang bila diperlukan.',
    tone: 'error',
    variant: 'outline',
    icon: 'cancel',
    badgeClass: statusBadgeClass('error'),
    dotClass: 'status status-error',
  },
};

export function getPengajuanStatusMeta(status: string): StatusMeta {
  return STATUS_META[(PENGAJUAN_STATUS as readonly string[]).includes(status) ? (status as PengajuanStatus) : 'menunggu'];
}

export function getPublicTicketLabel(ticket: string) {
  return ticket.trim().toUpperCase();
}
