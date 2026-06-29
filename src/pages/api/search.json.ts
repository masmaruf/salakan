import { getAgenda, getDokumen, getInventarisWarga, getKasRt, getKegiatan, getLayananWarga, getProgram } from '../../lib/content';
import type { SearchRecord } from '../../lib/search';

export async function GET() {
  const [agendas, documents, inventory, cashReports, news, services, programs] = await Promise.all([
    getAgenda(),
    getDokumen(),
    getInventarisWarga(),
    getKasRt(),
    getKegiatan(),
    getLayananWarga(),
    getProgram(),
  ]);

  const searchIndex: SearchRecord[] = [
    ...news.filter((n) => n.entry?.statusPublikasi === 'publish').map((n) => ({ title: n.entry.judul, description: n.entry.ringkasan || '', url: `/berita/${n.slug}`, type: 'berita', date: new Date(n.entry.tanggal).toISOString(), priority: n.entry.unggulan ? 'high' : 'normal', keywords: [n.entry.kategori || '', ...(n.entry.tag || [])].filter(Boolean) })),
    ...documents.filter((d) => d.entry?.statusPublikasi === 'publish').map((d) => ({ title: d.entry.judul, description: d.entry.ringkasan || '', url: `/data/dokumen/${d.slug}`, type: 'dokumen', date: new Date(d.entry.tanggalUpdate).toISOString(), priority: d.entry.unggulan ? 'high' : 'normal', keywords: [d.entry.kategori || '', 'arsip publik'] })),
    ...services.filter((s) => s.entry?.statusTampil === 'tampil').map((s) => ({ title: s.entry.namaLayanan, description: s.entry.ringkasan, url: `/data/layanan-warga#${s.slug}`, type: 'layanan', priority: 'high', keywords: [...(s.entry.syarat || []), ...(s.entry.langkah || [])].filter(Boolean) })),
    ...agendas.filter((a) => a.entry?.statusPublikasi === 'publish').map((a) => ({ title: a.entry.judul, description: a.entry.ringkasan || '', url: `/agenda/${a.slug}`, type: 'agenda', date: new Date(a.entry.tanggal).toISOString(), priority: a.entry.unggulan ? 'high' : 'normal', keywords: [a.entry.label || '', ...(a.entry.tag || []), a.entry.lokasi || '', a.entry.waktuMulai || ''].filter(Boolean) })),
    ...programs.filter((p) => p.entry?.statusPublikasi === 'publish').map((p) => ({ title: p.entry.judul, description: p.entry.ringkasan || '', url: `/program/${p.slug}`, type: 'program', date: new Date(p.entry.tanggalUpdate).toISOString(), priority: p.entry.unggulan ? 'high' : 'normal', keywords: [p.entry.kategori || '', p.entry.statusProgram || '', p.entry.lokasi || '', p.entry.periode || ''].filter(Boolean) })),
    ...cashReports.filter((r) => r.entry?.statusPublikasi === 'publish').map((r) => ({ title: `Laporan Kas ${r.entry.periode}`, description: r.entry.ringkasan, url: '/data/kas-rt', type: 'kas', date: new Date(r.entry.tanggalUpdate).toISOString(), priority: r.entry.unggulan ? 'high' : 'normal', keywords: [...(r.entry.sumberDana || []), 'saldo rt', 'laporan kas warga'] })),
    ...inventory.filter((item) => item.entry?.statusPublikasi === 'publish').map((item) => ({ title: item.entry.namaItem, description: item.entry.ringkasan, url: '/data/inventaris', type: 'inventaris', priority: item.entry.unggulan ? 'high' : 'normal', keywords: [item.entry.kategori || '', item.entry.statusPinjam || '', item.entry.lokasiSimpan || ''].filter(Boolean) })),
  ];

  return new Response(JSON.stringify(searchIndex), { status: 200, headers: { 'Content-Type': 'application/json' } });
}
