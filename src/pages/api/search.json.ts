import { getAgenda, getDokumen, getInventarisWarga, getKasRt, getKegiatan, getLayananWarga, getLogKegiatan, getProgram, getStrukturOrganisasi, getUmkm } from '../../lib/content';
import { kategoriLogLabels, statusLayananUmkmLabels, tahapProgramLabels } from '../../lib/content-taxonomy';
import type { SearchRecord } from '../../lib/search';

function getPriority(isFeatured?: boolean): SearchRecord['priority'] {
  return isFeatured ? 'high' : 'normal';
}

export async function GET() {
  const [agendas, documents, inventory, cashReports, news, services, programs, logs, lembagaItems, umkm] = await Promise.all([
    getAgenda(),
    getDokumen(),
    getInventarisWarga(),
    getKasRt(),
    getKegiatan(),
    getLayananWarga(),
    getProgram(),
    getLogKegiatan(),
    getStrukturOrganisasi(),
    getUmkm(),
  ]);

  const searchIndex: SearchRecord[] = [
    ...news.filter((n) => n.entry?.statusPublikasi === 'publish').map((n) => ({ title: n.entry.judul, description: n.entry.ringkasan || '', url: `/berita/${n.slug}`, type: 'berita', date: new Date(n.entry.tanggal).toISOString(), priority: getPriority(n.entry.unggulan), keywords: [n.entry.kategori || '', ...(n.entry.tag || [])].filter(Boolean) })),
    ...documents.filter((d) => d.entry?.statusPublikasi === 'publish').map((d) => ({ title: d.entry.judul, description: d.entry.ringkasan || '', url: `/data/dokumen/${d.slug}`, type: 'dokumen', date: new Date(d.entry.tanggalUpdate).toISOString(), priority: getPriority(d.entry.unggulan), keywords: [d.entry.kategori || '', 'arsip publik'] })),
    ...services.filter((s) => s.entry?.statusTampil === 'tampil').map((s) => ({ title: s.entry.namaLayanan, description: s.entry.ringkasan, url: `/data/layanan-warga#${s.slug}`, type: 'layanan', priority: getPriority(true), keywords: [...(s.entry.syarat || []), ...(s.entry.langkah || [])].filter(Boolean) })),
    ...agendas.filter((a) => a.entry?.statusPublikasi === 'publish').map((a) => ({ title: a.entry.judul, description: a.entry.ringkasan || '', url: `/agenda/${a.slug}`, type: 'agenda', date: new Date(a.entry.tanggal).toISOString(), priority: getPriority(a.entry.unggulan), keywords: [a.entry.label || '', ...(a.entry.tag || []), a.entry.lokasi || '', a.entry.waktuMulai || ''].filter(Boolean) })),
    ...programs.filter((p) => p.entry?.statusPublikasi === 'publish').map((p) => ({ title: p.entry.judul, description: p.entry.ringkasan || '', url: `/program/${p.slug}`, type: 'program', date: new Date(p.entry.tanggalUpdate).toISOString(), priority: getPriority(p.entry.unggulan), keywords: [p.entry.kategori || '', p.entry.statusProgram || '', tahapProgramLabels[p.entry.tahapProgram], p.entry.lokasi || '', p.entry.periode || '', p.entry.targetHasilSingkat || '', ...(p.entry.tag || [])].filter(Boolean) })),
    ...logs.filter((log) => log.entry?.statusPublikasi === 'publish').map((log) => ({ title: log.entry.judul, description: log.entry.ringkasan || '', url: `/log-kegiatan?kategori=${encodeURIComponent(log.entry.kategori)}`, type: 'log', date: new Date(log.entry.tanggal).toISOString(), priority: getPriority(false), keywords: [kategoriLogLabels[log.entry.kategori], log.entry.lokasi || '', log.entry.pihakTerlibat || '', ...(log.entry.tag || [])].filter(Boolean) })),
    ...lembagaItems.filter((item) => item.entry?.statusPublikasi === 'publish').map((item) => ({ title: item.entry.jabatan, description: item.entry.ringkasan || item.entry.deskripsiTugas || '', url: `/data/lembaga#${item.slug}`, type: 'lembaga', priority: getPriority(item.entry.bidang === 'pimpinan'), keywords: [item.entry.namaPejabat || '', item.entry.bidang || '', item.entry.kontak || '', item.entry.jadwalRutin || '', ...(item.entry.fokusKegiatan || []), ...(item.entry.layananUtama || []), ...(item.entry.dokumentasiTerkait || []).map((doc) => doc.label)].filter(Boolean) })),
    ...cashReports.filter((r) => r.entry?.statusPublikasi === 'publish').map((r) => ({ title: `Laporan Kas ${r.entry.periode}`, description: r.entry.ringkasan, url: '/data/kas-rt', type: 'kas', date: new Date(r.entry.tanggalUpdate).toISOString(), priority: getPriority(r.entry.unggulan), keywords: [...(r.entry.sumberDana || []), 'saldo rt', 'laporan kas warga'] })),
    ...inventory.filter((item) => item.entry?.statusPublikasi === 'publish').map((item) => ({ title: item.entry.namaItem, description: item.entry.ringkasan, url: '/data/inventaris', type: 'inventaris', priority: getPriority(item.entry.unggulan), keywords: [item.entry.kategori || '', item.entry.statusPinjam || '', item.entry.lokasiSimpan || ''].filter(Boolean) })),
    ...umkm.filter((item) => item.entry?.statusPublikasi === 'publish').map((item) => ({ title: item.entry.namaUsaha, description: item.entry.ringkasan || '', url: `/data/umkm/${item.slug}`, type: 'umkm', priority: getPriority(item.entry.unggulan), keywords: [item.entry.pemilik || '', item.entry.kategori || '', statusLayananUmkmLabels[item.entry.statusLayanan], item.entry.lokasi || '', ...(item.entry.produkUnggulan || [])].filter(Boolean) })),
  ];

  return new Response(JSON.stringify(searchIndex), { status: 200, headers: { 'Content-Type': 'application/json' } });
}
