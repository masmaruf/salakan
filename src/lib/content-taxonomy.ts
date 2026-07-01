export const STATUS_PUBLIKASI_OPTIONS = ['draft', 'publish'] as const;

export const KATEGORI_DOKUMEN = ['layanan', 'arsip', 'kegiatan', 'regulasi'] as const;
export const kategoriLabelsDokumen = {
  layanan: 'Layanan Warga',
  arsip: 'Arsip Publik',
  kegiatan: 'Dokumen Kegiatan',
  regulasi: 'Regulasi',
} as const satisfies Record<(typeof KATEGORI_DOKUMEN)[number], string>;

export const KATEGORI_PROGRAM = ['infrastruktur', 'pelayanan', 'pemberdayaan', 'lingkungan'] as const;
export const kategoriLabelsProgram = {
  infrastruktur: 'Infrastruktur',
  pelayanan: 'Pelayanan',
  pemberdayaan: 'Pemberdayaan',
  lingkungan: 'Lingkungan',
} as const satisfies Record<(typeof KATEGORI_PROGRAM)[number], string>;

export const STATUS_PROGRAM = ['rencana', 'berjalan', 'selesai'] as const;
export const statusProgramLabels = {
  rencana: 'Rencana',
  berjalan: 'Berjalan',
  selesai: 'Selesai',
} as const satisfies Record<(typeof STATUS_PROGRAM)[number], string>;

export const KATEGORI_KAS_RT = ['kasRt'] as const;
export const kategoriLabelsKasRt = {
  kasRt: 'Transparansi Kas RT',
} as const satisfies Record<(typeof KATEGORI_KAS_RT)[number], string>;

export const KATEGORI_INVENTARIS = ['acara', 'kebersihan', 'dokumentasi', 'logistik'] as const;
export const kategoriLabelsInventaris = {
  acara: 'Perlengkapan Acara',
  kebersihan: 'Peralatan Kebersihan',
  dokumentasi: 'Dokumentasi',
  logistik: 'Logistik',
} as const satisfies Record<(typeof KATEGORI_INVENTARIS)[number], string>;

export const KONDISI_INVENTARIS = ['baik', 'perlu-perawatan', 'terbatas'] as const;
export const kondisiInventarisLabels = {
  baik: 'Baik',
  'perlu-perawatan': 'Perlu Perawatan',
  terbatas: 'Terbatas',
} as const satisfies Record<(typeof KONDISI_INVENTARIS)[number], string>;

export const STATUS_PINJAM_INVENTARIS = ['tersedia', 'dipinjam', 'perawatan'] as const;
export const statusPinjamInventarisLabels = {
  tersedia: 'Tersedia',
  dipinjam: 'Dipinjam',
  perawatan: 'Perawatan',
} as const satisfies Record<(typeof STATUS_PINJAM_INVENTARIS)[number], string>;

export const KATEGORI_UMKM = ['kuliner', 'kerajinan', 'jasa', 'perdagangan'] as const;
export const kategoriLabelsUmkm = {
  kuliner: 'Kuliner',
  kerajinan: 'Kerajinan',
  jasa: 'Jasa',
  perdagangan: 'Perdagangan',
} as const satisfies Record<(typeof KATEGORI_UMKM)[number], string>;

export const KATEGORI_LOG_KEGIATAN = [
  'pelayanan',
  'administrasi',
  'rapat',
  'undangan',
  'lainnya',
] as const;

export const STATUS_PUBLIKASI_LOG = STATUS_PUBLIKASI_OPTIONS;

export const kategoriLogLabels = {
  pelayanan: 'Pelayanan',
  administrasi: 'Administrasi',
  rapat: 'Rapat',
  undangan: 'Undangan',
  lainnya: 'Lainnya',
} as const satisfies Record<(typeof KATEGORI_LOG_KEGIATAN)[number], string>;

export const statusPublikasiLogLabels = {
  draft: 'Draft',
  publish: 'Publish',
} as const satisfies Record<(typeof STATUS_PUBLIKASI_LOG)[number], string>;
