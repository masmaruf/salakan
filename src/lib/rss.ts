import { siteMeta, toAbsoluteUrl } from './site';

type RssItem = {
  title: string;
  link: string;
  description?: string;
  pubDate?: string | Date;
  guid?: string;
};

function escapeXml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function formatRssDate(value?: string | Date) {
  if (!value) return undefined;
  return new Date(value).toUTCString();
}

export function createRssXml(params: {
  title: string;
  description: string;
  pathname: string;
  items: RssItem[];
}) {
  const { title, description, pathname, items } = params;
  const feedUrl = toAbsoluteUrl(pathname);

  const itemXml = items
    .map((item) => {
      const pubDate = formatRssDate(item.pubDate);
      const guid = item.guid ?? item.link;

      return `<item>
  <title>${escapeXml(item.title)}</title>
  <link>${escapeXml(item.link)}</link>
  <guid>${escapeXml(guid)}</guid>
  ${item.description ? `<description>${escapeXml(item.description)}</description>` : ''}
  ${pubDate ? `<pubDate>${escapeXml(pubDate)}</pubDate>` : ''}
</item>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>${escapeXml(title)}</title>
  <description>${escapeXml(description)}</description>
  <link>${escapeXml(siteMeta.siteUrl)}</link>
  <language>id-ID</language>
  <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" xmlns:atom="http://www.w3.org/2005/Atom" />
  ${itemXml}
</channel>
</rss>`;
}
