import type { APIRoute } from 'astro';
import { getPengumuman } from '../../lib/content';
import { createRssXml } from '../../lib/rss';
import { siteMeta, toAbsoluteUrl } from '../../lib/site';

export const GET: APIRoute = async () => {
  const items = (await getPengumuman())
    .filter((item) => item.entry.statusPublikasi === 'publish')
    .sort(
      (a, b) => new Date(b.entry.tanggal).getTime() - new Date(a.entry.tanggal).getTime()
    )
    .slice(0, 50)
    .map((item) => ({
      title: item.entry.judul,
      link: toAbsoluteUrl('/agenda'),
      description: item.entry.ringkasan || item.entry.isi,
      pubDate: item.entry.tanggal,
      guid: `pengumuman:${item.slug}`,
    }));

  const xml = createRssXml({
    title: `${siteMeta.name} - RSS Pengumuman`,
    description: 'Feed RSS untuk pengumuman terbaru Padukuhan Salakan.',
    pathname: '/rss/pengumuman.xml',
    items,
  });

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  });
};
