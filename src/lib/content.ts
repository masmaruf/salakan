import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import { pageCopyDefaults } from './page-copy';

type EntryWithSlug<T> = {
  slug: string;
  entry: T;
};

type DatedValue = string | Date;

function normalizeEntryId(id: string) {
  return id.replace(/\/index$/, '');
}

function toEntryWithSlug<T>(items: Array<{ id: string; data: T }>): EntryWithSlug<T>[] {
  return items.map(({ id, data }) => ({
    slug: normalizeEntryId(id),
    entry: data,
  }));
}

function getDateValue(item: unknown): DatedValue | undefined {
  if (typeof item !== 'object' || item === null) return undefined;

  if ('entry' in item && typeof item.entry === 'object' && item.entry && 'tanggal' in item.entry) {
    return item.entry.tanggal as DatedValue;
  }

  if ('tanggal' in item) {
    return item.tanggal as DatedValue;
  }

  return undefined;
}

function normalizeAgendaText(value?: string) {
  return value?.trim().toLowerCase() ?? '';
}

function isAgendaAnnouncementLike(item: { label?: string; tag?: string[] }) {
  const labels = [item.label, ...(item.tag ?? [])].map(normalizeAgendaText).filter(Boolean);
  return labels.some((label) => ['pengumuman', 'informasi'].includes(label));
}

export async function getPengumuman() {
  const items = await getAgenda();

  return items
    .filter((item) => isAgendaAnnouncementLike(item.entry))
    .map((item) => ({
      slug: item.slug,
      entry: {
        judul: item.entry.judul,
        tanggal: item.entry.tanggal,
        ringkasan: item.entry.ringkasan,
        isi: item.entry.deskripsi,
        label: item.entry.label,
        tag: item.entry.tag,
        statusPublikasi: item.entry.statusPublikasi,
        unggulan: item.entry.unggulan,
      },
    }));
}

export async function getDokumen() {
  const items = await getCollection('dokumen');

  return items.map(({ id, data }) => ({
    slug: normalizeEntryId(id),
    entry: {
      judul: data.judul,
      tanggalUpdate: data.tanggalUpdate,
      ringkasan: data.kontenUtama?.ringkasan,
      deskripsi: data.kontenUtama?.deskripsi,
      fileDokumen: data.media?.fileDokumen,
      seoTitle: data.seo?.seoTitle,
      seoDescription: data.seo?.seoDescription,
      ogImage: data.seo?.ogImage,
      kategori: data.pengaturanTampil?.kategori,
      statusPublikasi: data.pengaturanTampil?.statusPublikasi,
      unggulan: data.pengaturanTampil?.unggulan,
      urutanTampil: data.pengaturanTampil?.urutanTampil,
    },
  }));
}

export async function getKegiatan() {
  const items = await getCollection('kegiatan');

  return items.map(({ id, data, body }) => ({
    slug: normalizeEntryId(id),
    entry: {
      judul: data.judul,
      tanggal: data.tanggal,
      kategori: data.editorArtikel?.sidebar?.kategori,
      jenisKonten: data.editorArtikel?.sidebar?.jenisKonten,
      penulis: data.editorArtikel?.sidebar?.penulis,
      statusPublikasi: data.statusPublikasi,
      gambarUtama: data.editorArtikel?.sidebar?.gambarUtama,
      altGambarUtama: data.editorArtikel?.sidebar?.altGambarUtama,
      ringkasan: data.editorArtikel?.kontenUtama?.ringkasan,
      tag: data.editorArtikel?.sidebar?.tag,
      unggulan: data.editorArtikel?.sidebar?.unggulan,
      kontenTerkait: data.editorArtikel?.sidebar?.kontenTerkait ?? [],
      seoTitle: data.editorArtikel?.seo?.seoTitle,
      seoDescription: data.editorArtikel?.seo?.seoDescription,
      ogImage: data.editorArtikel?.seo?.ogImage,
      isi: body,
    },
  }));
}

export async function getAgenda() {
  const items = await getCollection('agenda');

  return items.map(({ id, data }) => ({
    slug: normalizeEntryId(id),
    entry: {
      judul: data.judul,
      tanggal: data.tanggal,
      statusPublikasi: data.statusPublikasi,
      waktuMulai: data.kontenUtama?.waktuMulai,
      waktuSelesai: data.kontenUtama?.waktuSelesai,
      lokasi: data.kontenUtama?.lokasi,
      ringkasan: data.kontenUtama?.ringkasan,
      deskripsi: data.kontenUtama?.deskripsi,
      kontakPic: data.kontenUtama?.kontakPic,
      gambarUtama: data.media?.gambarUtama,
      altGambarUtama: data.media?.altGambarUtama,
      label: data.pengaturanTampil?.label,
      tag: data.pengaturanTampil?.tag,
      unggulan: data.pengaturanTampil?.unggulan,
      kontenTerkait: data.pengaturanTampil?.kontenTerkait ?? [],
    },
  }));
}

export async function getLogKegiatan() {
  const items = await getCollection('logKegiatan');

  return items.map(({ id, data }) => ({
    slug: normalizeEntryId(id),
    entry: {
      judul: data.judul,
      tanggal: data.tanggal,
      kategori: data.kategori,
      statusPublikasi: data.statusPublikasi,
      waktuMulai: data.kontenUtama?.waktuMulai,
      waktuSelesai: data.kontenUtama?.waktuSelesai,
      lokasi: data.kontenUtama?.lokasi,
      ringkasan: data.kontenUtama?.ringkasan,
      hasilTindakLanjut: data.kontenUtama?.hasilTindakLanjut,
      pihakTerlibat: data.kontenUtama?.pihakTerlibat,
      fotoDokumentasi: data.media?.fotoDokumentasi,
      tag: data.pengaturanTampil?.tag ?? [],
      urutanTampil: data.pengaturanTampil?.urutanTampil ?? 0,
      kontenTerkait: data.pengaturanTampil?.kontenTerkait ?? [],
    },
  }));
}

export async function getProgram() {
  const items = await getCollection('program');

  return items.map(({ id, data }) => ({
    slug: normalizeEntryId(id),
    entry: {
      judul: data.judul,
      tanggalUpdate: data.tanggalUpdate,
      statusPublikasi: data.statusPublikasi,
      ringkasan: data.kontenUtama.ringkasan,
      deskripsi: data.kontenUtama.deskripsi,
      lokasi: data.kontenUtama.lokasi,
      periode: data.kontenUtama.periode,
      penanggungJawab: data.kontenUtama.penanggungJawab,
      sumberDana: data.kontenUtama.sumberDana,
      anggaran: data.kontenUtama.anggaran,
      targetHasilSingkat: data.kontenUtama.targetHasilSingkat,
      manfaat: data.kontenUtama.manfaat,
      kategori: data.pengaturanTampil.kategori,
      statusProgram: data.pengaturanTampil.statusProgram,
      tahapProgram: data.pengaturanTampil.tahapProgram,
      tag: data.pengaturanTampil.tag ?? [],
      unggulan: data.pengaturanTampil.unggulan,
      urutanTampil: data.pengaturanTampil.urutanTampil,
      kontenTerkait: data.pengaturanTampil.kontenTerkait ?? [],
    },
  }));
}

export async function getKasRt() {
  const items = await getCollection('kasRt');

  return items.map(({ id, data }) => ({
    slug: normalizeEntryId(id),
    entry: {
      periode: data.periode,
      tanggalUpdate: data.tanggalUpdate,
      ringkasan: data.ringkasan,
      pemasukan: data.pemasukan,
      pengeluaran: data.pengeluaran,
      saldoAkhir: data.saldoAkhir,
      sumberDana: data.sumberDana,
      catatan: data.catatan,
      statusPublikasi: data.statusPublikasi,
      unggulan: data.unggulan,
    },
  }));
}

export async function getInventarisWarga() {
  const items = await getCollection('inventarisWarga');

  return items.map(({ id, data }) => ({
    slug: normalizeEntryId(id),
    entry: {
      namaItem: data.namaItem,
      kategori: data.kategori,
      kondisi: data.kondisi,
      statusPinjam: data.statusPinjam,
      lokasiSimpan: data.lokasiSimpan,
      penanggungJawab: data.penanggungJawab,
      ringkasan: data.ringkasan,
      catatan: data.catatan,
      statusPublikasi: data.statusPublikasi,
      unggulan: data.unggulan,
      urutanTampil: data.urutanTampil,
    },
  }));
}

export async function getUmkm() {
  const items = await getCollection('umkm');

  return items.map(({ id, data }) => ({
    slug: normalizeEntryId(id),
    entry: {
      namaUsaha: data.namaUsaha,
      pemilik: data.kontenUtama?.pemilik,
      ringkasan: data.kontenUtama?.ringkasan,
      deskripsi: data.kontenUtama?.deskripsi,
      whatsapp: data.kontenUtama?.whatsapp,
      lokasi: data.kontenUtama?.lokasi,
      produkUnggulan: data.kontenUtama?.produkUnggulan,
      gambar: data.media?.gambar,
      altGambar: data.media?.altGambar,
      seoTitle: data.seo?.seoTitle,
      seoDescription: data.seo?.seoDescription,
      ogImage: data.seo?.ogImage,
      kategori: data.pengaturanTampil?.kategori,
      statusLayanan: data.pengaturanTampil?.statusLayanan,
      statusPublikasi: data.pengaturanTampil?.statusPublikasi,
      unggulan: data.pengaturanTampil?.unggulan,
      urutanTampil: data.pengaturanTampil?.urutanTampil,
    },
  }));
}

export async function getGaleri() {
  return toEntryWithSlug<CollectionEntry<'galeri'>['data']>(await getCollection('galeri'));
}

export async function getKategoriBerita() {
  const items = await getCollection('kategoriBerita');

  return items.map(({ id, data }) => ({
    slug: normalizeEntryId(id),
    entry: {
      namaKategori: data.namaKategori,
      labelTampil: data.labelTampil,
      deskripsi: data.deskripsi,
      status: data.pengaturanTampil?.status,
      urutanTampil: data.pengaturanTampil?.urutanTampil,
    },
  }));
}

export async function getKategoriBeritaMap() {
  const categories = await getKategoriBerita();

  return categories
    .filter((item) => item.entry.status === 'tampil')
    .sort((a, b) => (a.entry.urutanTampil ?? 0) - (b.entry.urutanTampil ?? 0))
    .reduce<Record<string, string>>((acc, item) => {
      acc[item.slug] = item.entry.labelTampil;
      return acc;
    }, {});
}

export async function getStrukturOrganisasi() {
  const items = await getCollection('strukturOrganisasi');

  return items.map(({ id, data }) => ({
    slug: normalizeEntryId(id),
    entry: {
      jabatan: data.jabatan,
      namaPejabat: data.kontenUtama?.namaPejabat,
      ringkasan: data.kontenUtama?.ringkasan,
      deskripsiTugas: data.kontenUtama?.deskripsiTugas,
      kontak: data.kontenUtama?.kontak,
      jadwalRutin: data.kontenUtama?.jadwalRutin,
      lokasiKegiatan: data.kontenUtama?.lokasiKegiatan,
      fokusKegiatan: data.kontenUtama?.fokusKegiatan,
      layananUtama: data.kontenUtama?.layananUtama,
      dokumentasiTerkait: data.kontenUtama?.dokumentasiTerkait,
      kontenTerkait: data.kontenUtama?.kontenTerkait ?? [],
      bidang: data.pengaturanTampil?.bidang,
      statusPublikasi: data.pengaturanTampil?.statusPublikasi,
      urutanTampil: data.pengaturanTampil?.urutanTampil,
    },
  }));
}

export async function getLayananWarga() {
  const items = await getCollection('layananWarga');

  return items.map(({ id, data }) => ({
    slug: normalizeEntryId(id),
    entry: {
      namaLayanan: data.namaLayanan,
      ringkasan: data.ringkasan,
      syarat: data.syarat,
      langkah: data.langkah,
      kontak: data.kontak,
      jamLayanan: data.jamLayanan,
      statusTampil: data.statusTampil,
    },
  }));
}

export async function getFaq() {
  const items = await getCollection('faq');

  return items.map(({ id, data }) => ({
    slug: normalizeEntryId(id),
    entry: {
      pertanyaan: data.pertanyaan,
      jawaban: data.jawaban,
      kategori: data.kategori,
      urutan: data.urutan,
      statusTampil: data.statusTampil,
    },
  }));
}

export async function getProfil() {
  return (await getEntry('profil', 'index'))?.data ?? null;
}

export async function getPengaturan() {
  return (await getEntry('pengaturan', 'index'))?.data ?? null;
}

export async function getHalamanCopy() {
  return (await getEntry('halaman', 'index'))?.data ?? pageCopyDefaults;
}

export async function getMonografi() {
  return (await getEntry('monografi', 'index'))?.data ?? null;
}

export async function getBeranda() {
  return (await getEntry('beranda', 'index'))?.data ?? null;
}

export async function getDashboardContent() {
  return (await getEntry('dashboard', 'index'))?.data ?? null;
}

export function sortByDateDesc<T>(items: T[]) {
  return [...items].sort((a, b) => {
    const first = getDateValue(a);
    const second = getDateValue(b);

    return new Date(second ?? 0).getTime() - new Date(first ?? 0).getTime();
  });
}

export function formatTanggal(dateValue: DatedValue) {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateValue));
}

export function excerpt(text: string, maxLength = 140) {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}...`;
}

export function normalizeWhatsapp(value: string): string {
  return value.replace(/\D/g, '');
}

export function isPlaceholderWhatsapp(value?: string) {
  if (!value) return true;

  const normalized = normalizeWhatsapp(value);
  if (!normalized || normalized.length < 10) return true;

  const knownPlaceholders = new Set([
    '6281234567890',
    '081234567890',
    '1234567890',
  ]);

  if (knownPlaceholders.has(normalized)) return true;
  if (/^(\d)\1+$/.test(normalized)) return true;

  return false;
}
