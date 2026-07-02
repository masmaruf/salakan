export const STATUS_PUBLIKASI_OPTIONS = ['draft', 'publish'] as const;

export const KONTEN_RELASI_TYPES = [
  'agenda',
  'berita',
  'program',
  'log-kegiatan',
  'lembaga',
  'galeri',
] as const;

export const kontenRelasiLabels = {
  agenda: 'Agenda',
  berita: 'Berita',
  program: 'Program',
  'log-kegiatan': 'Log Kegiatan',
  lembaga: 'Lembaga',
  galeri: 'Galeri',
} as const satisfies Record<(typeof KONTEN_RELASI_TYPES)[number], string>;

export const TAG_UMUM_KONTEN = [
  'administrasi',
  'agenda-warga',
  'anak',
  'balita',
  'balares',
  'budaya',
  'digital',
  'dokumentasi',
  'drainase',
  'gotong-royong',
  'ibadah',
  'infrastruktur',
  'karang-taruna',
  'kebersihan',
  'keamanan',
  'kesehatan',
  'kerja-bakti',
  'layanan-surat',
  'lingkungan',
  'lpmk',
  'musyawarah',
  'pasar-alam',
  'paud',
  'pajak',
  'pbb',
  'pembangunan',
  'pemberdayaan',
  'pendidikan',
  'pelatihan',
  'pelayanan',
  'pengajian',
  'pkk',
  'posyandu',
  'rapat-warga',
  'rt-01',
  'rt-02',
  'rt-03',
  'stunting',
  'syawalan',
  'umkm',
  'undangan',
  'warga',
] as const;

export const tagUmumLabels = {
  administrasi: 'Administrasi',
  'agenda-warga': 'Agenda Warga',
  anak: 'Anak',
  balita: 'Balita',
  balares: 'Balares',
  budaya: 'Budaya',
  digital: 'Digital',
  dokumentasi: 'Dokumentasi',
  drainase: 'Drainase',
  'gotong-royong': 'Gotong Royong',
  ibadah: 'Ibadah',
  infrastruktur: 'Infrastruktur',
  'karang-taruna': 'Karang Taruna',
  kebersihan: 'Kebersihan',
  keamanan: 'Keamanan',
  kesehatan: 'Kesehatan',
  'kerja-bakti': 'Kerja Bakti',
  'layanan-surat': 'Layanan Surat',
  lingkungan: 'Lingkungan',
  lpmk: 'LPMK',
  musyawarah: 'Musyawarah',
  'pasar-alam': 'Pasar Alam',
  paud: 'PAUD',
  pajak: 'Pajak',
  pbb: 'PBB',
  pembangunan: 'Pembangunan',
  pemberdayaan: 'Pemberdayaan',
  pendidikan: 'Pendidikan',
  pelatihan: 'Pelatihan',
  pelayanan: 'Pelayanan',
  pengajian: 'Pengajian',
  pkk: 'PKK',
  posyandu: 'Posyandu',
  'rapat-warga': 'Rapat Warga',
  'rt-01': 'RT 01',
  'rt-02': 'RT 02',
  'rt-03': 'RT 03',
  stunting: 'Stunting',
  syawalan: 'Syawalan',
  umkm: 'UMKM',
  undangan: 'Undangan',
  warga: 'Warga',
} as const satisfies Record<(typeof TAG_UMUM_KONTEN)[number], string>;

export const FOKUS_LEMBAGA = [
  'dukungan-acara-kampung',
  'kesehatan-keluarga',
  'kegiatan-sosial',
  'keamanan-lingkungan',
  'kolaborasi-pemuda',
  'komunikasi-keluarga',
  'koordinasi-pembangunan',
  'layanan-pendidikan-anak',
  'pendataan-lingkungan',
  'pemberdayaan-keluarga',
  'respons-darurat-lokal',
  'ruang-belajar-anak',
  'gotong-royong-lapangan',
] as const;

export const fokusLembagaLabels = {
  'dukungan-acara-kampung': 'Dukungan Acara Kampung',
  'gotong-royong-lapangan': 'Gotong Royong Lapangan',
  'kesehatan-keluarga': 'Kesehatan Keluarga',
  'kegiatan-sosial': 'Kegiatan Sosial',
  'keamanan-lingkungan': 'Keamanan Lingkungan',
  'kolaborasi-pemuda': 'Kolaborasi Pemuda',
  'komunikasi-keluarga': 'Komunikasi Keluarga',
  'koordinasi-pembangunan': 'Koordinasi Pembangunan',
  'layanan-pendidikan-anak': 'Layanan Pendidikan Anak',
  'pendataan-lingkungan': 'Pendataan Lingkungan',
  'pemberdayaan-keluarga': 'Pemberdayaan Keluarga',
  'respons-darurat-lokal': 'Respons Darurat Lokal',
  'ruang-belajar-anak': 'Ruang Belajar Anak',
} as const satisfies Record<(typeof FOKUS_LEMBAGA)[number], string>;

export const KATEGORI_BERITA = [
  'kegiatan-warga',
  'pelayanan',
  'gotong-royong',
  'potensi',
  'posyandu',
  'pasar-alam',
  'paud',
] as const;

export const kategoriLabelsBerita = {
  'kegiatan-warga': 'Kegiatan Warga',
  pelayanan: 'Pelayanan',
  'gotong-royong': 'Gotong Royong',
  potensi: 'Potensi Warga',
  posyandu: 'Posyandu',
  'pasar-alam': 'Pasar Alam',
  paud: 'PAUD',
} as const satisfies Record<(typeof KATEGORI_BERITA)[number], string>;

export const JENIS_KONTEN_KEGIATAN = ['berita', 'artikel'] as const;
export const jenisKontenKegiatanLabels = {
  berita: 'Berita',
  artikel: 'Artikel',
} as const satisfies Record<(typeof JENIS_KONTEN_KEGIATAN)[number], string>;

export const LABEL_AGENDA = ['Agenda', 'Pengumuman', 'Informasi', 'Musyawarah', 'Pengajian'] as const;

export const BIDANG_LEMBAGA = ['pimpinan', 'kegiatan', 'wilayah'] as const;
export const bidangLembagaLabels = {
  pimpinan: 'Lembaga Inti Padukuhan',
  kegiatan: 'Layanan Sosial & Pendidikan',
  wilayah: 'Komunitas Warga',
} as const satisfies Record<(typeof BIDANG_LEMBAGA)[number], string>;

export const bidangLembagaIcons = {
  pimpinan: 'account_balance',
  kegiatan: 'volunteer_activism',
  wilayah: 'groups',
} as const satisfies Record<(typeof BIDANG_LEMBAGA)[number], string>;

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

export const TAHAP_PROGRAM = ['inisiasi', 'persiapan', 'pelaksanaan', 'pemantauan', 'tuntas'] as const;
export const tahapProgramLabels = {
  inisiasi: 'Inisiasi',
  persiapan: 'Persiapan',
  pelaksanaan: 'Pelaksanaan',
  pemantauan: 'Pemantauan',
  tuntas: 'Tuntas',
} as const satisfies Record<(typeof TAHAP_PROGRAM)[number], string>;

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

export const STATUS_LAYANAN_UMKM = ['aktif', 'terbatas', 'pendaftaran'] as const;
export const statusLayananUmkmLabels = {
  aktif: 'Aktif Melayani',
  terbatas: 'Layanan Terbatas',
  pendaftaran: 'Kontak Menyusul',
} as const satisfies Record<(typeof STATUS_LAYANAN_UMKM)[number], string>;

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

export function getTagUmumLabel(tag: string) {
  return tagUmumLabels[tag as keyof typeof tagUmumLabels] ?? tag;
}

export function getFokusLembagaLabel(tag: string) {
  return fokusLembagaLabels[tag as keyof typeof fokusLembagaLabels] ?? tag;
}

export function getBeritaCategoryTone(kategori: string): 'primary' | 'error' | 'info' | 'warning' | 'success' | 'surface' {
  const key = kategori.trim().toLowerCase();
  if (key === 'pelayanan') return 'warning';
  if (key === 'potensi' || key === 'pasar-alam') return 'success';
  if (key === 'posyandu' || key === 'paud') return 'primary';
  if (key === 'gotong-royong' || key === 'kegiatan-warga') return 'info';
  return 'surface';
}

export function getAgendaLabelTone(label?: string): 'primary' | 'error' | 'info' | 'surface' {
  const normalized = label?.trim().toLowerCase() ?? '';
  if (normalized === 'pengumuman') return 'error';
  if (normalized === 'informasi') return 'surface';
  if (normalized === 'musyawarah') return 'info';
  return 'primary';
}
