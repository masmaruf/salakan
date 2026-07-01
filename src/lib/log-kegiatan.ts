import {
  KATEGORI_LOG_KEGIATAN,
  STATUS_PUBLIKASI_LOG,
  kategoriLogLabels,
  statusPublikasiLogLabels,
} from './content-taxonomy';

export {
  KATEGORI_LOG_KEGIATAN,
  STATUS_PUBLIKASI_LOG,
  kategoriLogLabels,
  statusPublikasiLogLabels,
};

export type KategoriLogKegiatan = (typeof KATEGORI_LOG_KEGIATAN)[number];
export type StatusPublikasiLog = (typeof STATUS_PUBLIKASI_LOG)[number];
export type FilterPeriodeLog = 'semua' | 'bulan-ini' | 'tahun-ini';

export interface LogKegiatanDukuhRecord {
  id: number;
  judul: string;
  kategori: KategoriLogKegiatan;
  tanggal: string;
  waktu_mulai?: string | null;
  waktu_selesai?: string | null;
  lokasi?: string | null;
  ringkasan: string;
  hasil_tindak_lanjut?: string | null;
  pihak_terlibat?: string | null;
  foto_dokumentasi?: string | null;
  status_publikasi: StatusPublikasiLog;
  urutan_tampil: number;
  created_at: Date | string;
  updated_at: Date | string;
}

export function formatTanggalLog(dateValue: string | Date) {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateValue));
}

export function formatWaktuLog(
  waktuMulai?: string | null,
  waktuSelesai?: string | null,
) {
  if (waktuMulai && waktuSelesai) return `${waktuMulai} - ${waktuSelesai} WIB`;
  if (waktuMulai) return `${waktuMulai} WIB`;
  if (waktuSelesai) return `Selesai ${waktuSelesai} WIB`;
  return null;
}

export function isValidKategoriLog(value: string): value is KategoriLogKegiatan {
  return KATEGORI_LOG_KEGIATAN.includes(value as KategoriLogKegiatan);
}

export function isValidPeriodeLog(value: string): value is FilterPeriodeLog {
  return ['semua', 'bulan-ini', 'tahun-ini'].includes(value);
}

export function matchesPeriodeLog(tanggal: string, periode: FilterPeriodeLog, now = new Date()) {
  if (periode === 'semua') return true;

  const date = new Date(`${tanggal}T00:00:00`);
  if (Number.isNaN(date.getTime())) return false;

  const sameYear = date.getFullYear() === now.getFullYear();
  if (periode === 'tahun-ini') return sameYear;

  return sameYear && date.getMonth() === now.getMonth();
}

export function excerptLog(value: string, maxLength = 180) {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength).trim()}...`;
}
