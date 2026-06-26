import type { APIRoute } from 'astro';
import { getKegiatan } from '../../lib/content';
import { createRssXml } from '../../lib/rss';
import { siteMeta, toAbsoluteUrl } from '../../lib/site';

export const GET: APIRoute = async () => {
  const items = (await getKegiatan())
    .filter((item) => item.entry.statusPublikasi === 'publish')
    .sort(
      (a, b) => new Date(b.entry.tanggal).getTime() - new Date(a.entry.tanggal).getTime()
    )
    .slice(0, 50)
    .map((item) => ({
      title: item.entry.judul,
      link: toAbsoluteUrl(`/berita/${item.slug}`),
      description: item.entry.ringkasan || '',
      pubDate: item.entry.tanggal,
      guid: `berita:${item.slug}`,
    }));

  const xml = createRssXml({
    title: `${siteMeta.name} - RSS Berita`,
    description: 'Feed RSS untuk berita dan artikel terbaru Padukuhan Salakan.',
    pathname: '/rss/berita.xml',
    items,
  });

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  });
};
