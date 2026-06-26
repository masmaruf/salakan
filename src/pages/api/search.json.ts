import { getAgenda, getDokumen, getKegiatan, getLayananWarga, getPengumuman } from '../../lib/content';

export async function GET() {
  const [agendas, documents, news, services, announcements] = await Promise.all([
    getAgenda(),
    getDokumen(),
    getKegiatan(),
    getLayananWarga(),
    getPengumuman(),
  ]);

  const searchIndex = [
    ...news.filter(n => n.entry?.statusPublikasi === 'publish').map(n => ({
      title: n.entry.judul,
      description: n.entry.ringkasan || '',
      url: `/berita/${n.slug}`,
      type: 'Berita',
    })),
    ...announcements.filter(a => a.entry?.statusPublikasi === 'publish').map(a => ({
      title: a.entry.judul,
      description: a.entry.ringkasan || '',
      url: `/agenda`,
      type: 'Pengumuman',
    })),
    ...documents.filter(d => d.entry?.statusPublikasi === 'publish').map(d => ({
      title: d.entry.judul,
      description: d.entry.ringkasan || '',
      url: `/data/dokumen/${d.slug}`,
      type: 'Dokumen Publik',
    })),
    ...services.filter(s => s.entry?.statusTampil === 'tampil').map(s => ({
      title: s.entry.namaLayanan,
      description: s.entry.ringkasan,
      url: `/data/layanan-warga#${s.slug}`,
      type: 'Layanan Warga',
    })),
    ...agendas.filter(a => a.entry?.statusPublikasi === 'publish').map(a => ({
      title: a.entry.judul,
      description: a.entry.ringkasan || '',
      url: `/agenda/${a.slug}`,
      type: 'Agenda',
    })),
  ];

  return new Response(JSON.stringify(searchIndex), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
