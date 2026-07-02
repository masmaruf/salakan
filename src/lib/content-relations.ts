import {
  bidangLembagaLabels,
  getAgendaLabelTone,
  getBeritaCategoryTone,
  kategoriLabelsProgram,
  kategoriLogLabels,
  kontenRelasiLabels,
} from './content-taxonomy';
import type { ManualRelationRef, RelatableItem } from './related-content';
import { markdownToText } from './rich-text';

type CategoryLabelMap = Record<string, string>;

function normalizeManualRelations(value?: ManualRelationRef[]) {
  return (value ?? []).filter((item) => item?.type && item?.slug);
}

export function createAgendaRelationItem(item: {
  slug: string;
  entry: {
    judul: string;
    label?: string;
    tag?: string[];
    ringkasan?: string;
    deskripsi?: string;
    lokasi?: string;
    kontakPic?: string;
    tanggal?: string;
    kontenTerkait?: ManualRelationRef[];
  };
}): RelatableItem {
  return {
    slug: item.slug,
    title: item.entry.judul,
    type: 'agenda',
    category: item.entry.label,
    tags: item.entry.tag ?? [],
    summary: item.entry.ringkasan,
    extraText: [markdownToText(item.entry.deskripsi ?? ''), item.entry.lokasi ?? '', item.entry.kontakPic ?? ''],
    keywords: [item.entry.label ?? '', item.entry.lokasi ?? '', item.entry.kontakPic ?? ''],
    manualRefs: normalizeManualRelations(item.entry.kontenTerkait),
    date: item.entry.tanggal,
    href: `/agenda/${item.slug}`,
    typeLabel: item.entry.label || kontenRelasiLabels.agenda,
    badgeTone: getAgendaLabelTone(item.entry.label),
  };
}

export function createBeritaRelationItem(
  item: {
    slug: string;
    entry: {
      judul: string;
      kategori?: string;
      jenisKonten?: string;
      penulis?: string;
      ringkasan?: string;
      tag?: string[];
      tanggal?: string;
      isi?: string;
      kontenTerkait?: ManualRelationRef[];
    };
  },
  categoryLabels: CategoryLabelMap,
): RelatableItem {
  return {
    slug: item.slug,
    title: item.entry.judul,
    type: 'berita',
    category: item.entry.kategori,
    tags: item.entry.tag ?? [],
    summary: item.entry.ringkasan,
    extraText: [item.entry.isi ?? '', item.entry.penulis ?? ''],
    keywords: [
      categoryLabels[item.entry.kategori ?? ''] ?? item.entry.kategori ?? '',
      item.entry.jenisKonten ?? '',
      item.entry.penulis ?? '',
    ],
    manualRefs: normalizeManualRelations(item.entry.kontenTerkait),
    date: item.entry.tanggal,
    href: `/berita/${item.slug}`,
    typeLabel: categoryLabels[item.entry.kategori ?? ''] ?? kontenRelasiLabels.berita,
    badgeTone: getBeritaCategoryTone(item.entry.kategori ?? ''),
  };
}

export function createProgramRelationItem(item: {
  slug: string;
  entry: {
    judul: string;
    kategori: string;
    tag?: string[];
    ringkasan?: string;
    deskripsi?: string;
    lokasi?: string;
    penanggungJawab?: string;
    manfaat?: string[];
    tanggalUpdate?: string;
    kontenTerkait?: ManualRelationRef[];
  };
}): RelatableItem {
  return {
    slug: item.slug,
    title: item.entry.judul,
    type: 'program',
    category: item.entry.kategori,
    tags: item.entry.tag ?? [],
    summary: item.entry.ringkasan,
    extraText: [markdownToText(item.entry.deskripsi ?? ''), item.entry.lokasi ?? '', item.entry.penanggungJawab ?? '', ...(item.entry.manfaat ?? [])],
    keywords: [kategoriLabelsProgram[item.entry.kategori as keyof typeof kategoriLabelsProgram] ?? item.entry.kategori, item.entry.lokasi ?? '', item.entry.penanggungJawab ?? ''],
    manualRefs: normalizeManualRelations(item.entry.kontenTerkait),
    date: item.entry.tanggalUpdate,
    href: `/program/${item.slug}`,
    typeLabel: kategoriLabelsProgram[item.entry.kategori as keyof typeof kategoriLabelsProgram] ?? kontenRelasiLabels.program,
    badgeTone: 'surface',
  };
}

export function createLogRelationItem(item: {
  slug: string;
  entry: {
    judul: string;
    kategori: string;
    tag?: string[];
    ringkasan?: string;
    lokasi?: string;
    pihakTerlibat?: string;
    hasilTindakLanjut?: string;
    tanggal?: string;
    kontenTerkait?: ManualRelationRef[];
  };
}): RelatableItem {
  return {
    slug: item.slug,
    title: item.entry.judul,
    type: 'log-kegiatan',
    category: item.entry.kategori,
    tags: item.entry.tag ?? [],
    summary: item.entry.ringkasan,
    extraText: [item.entry.lokasi ?? '', item.entry.pihakTerlibat ?? '', item.entry.hasilTindakLanjut ?? ''],
    keywords: [kategoriLogLabels[item.entry.kategori as keyof typeof kategoriLogLabels] ?? item.entry.kategori, item.entry.lokasi ?? '', item.entry.pihakTerlibat ?? ''],
    manualRefs: normalizeManualRelations(item.entry.kontenTerkait),
    date: item.entry.tanggal,
    href: `/log-kegiatan/${item.slug}`,
    typeLabel: kategoriLogLabels[item.entry.kategori as keyof typeof kategoriLogLabels] ?? kontenRelasiLabels['log-kegiatan'],
    badgeTone: 'surface',
  };
}

export function createLembagaRelationItem(item: {
  slug: string;
  entry: {
    jabatan: string;
    bidang?: string;
    fokusKegiatan?: string[];
    layananUtama?: string[];
    ringkasan?: string;
    deskripsiTugas?: string;
    kontak?: string;
    lokasiKegiatan?: string;
    jadwalRutin?: string;
    kontenTerkait?: ManualRelationRef[];
  };
}): RelatableItem {
  return {
    slug: item.slug,
    title: item.entry.jabatan,
    type: 'lembaga',
    category: item.entry.bidang,
    tags: item.entry.fokusKegiatan ?? [],
    summary: item.entry.ringkasan,
    extraText: [
      markdownToText(item.entry.deskripsiTugas ?? ''),
      item.entry.kontak ?? '',
      item.entry.lokasiKegiatan ?? '',
      item.entry.jadwalRutin ?? '',
      ...(item.entry.layananUtama ?? []),
    ],
    keywords: [
      bidangLembagaLabels[item.entry.bidang as keyof typeof bidangLembagaLabels] ?? item.entry.bidang ?? '',
      ...(item.entry.fokusKegiatan ?? []),
    ],
    manualRefs: normalizeManualRelations(item.entry.kontenTerkait),
    href: `/data/lembaga#${item.slug}`,
    typeLabel: bidangLembagaLabels[item.entry.bidang as keyof typeof bidangLembagaLabels] ?? kontenRelasiLabels.lembaga,
    badgeTone: 'info',
  };
}

export function createGaleriRelationItem(item: {
  slug: string;
  entry: {
    judul: string;
    caption: string;
    tanggal: string;
  };
}): RelatableItem {
  return {
    slug: item.slug,
    title: item.entry.judul,
    type: 'galeri',
    tags: [],
    summary: item.entry.caption,
    extraText: [item.entry.caption],
    keywords: ['dokumentasi', 'galeri'],
    date: item.entry.tanggal,
    href: `/galeri#${item.slug}`,
    typeLabel: kontenRelasiLabels.galeri,
    badgeTone: 'primary',
  };
}
