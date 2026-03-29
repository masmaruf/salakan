export const siteMeta = {
  name: 'Padukuhan Salakan',
  title: 'Padukuhan Salakan',
  description:
    'Portal warga Padukuhan Salakan untuk pengumuman, berita, agenda, profil wilayah, galeri, dan informasi kontak.',
  siteUrl: 'https://padukuhansalakan.vercel.app',
  ogImage: '/images/og-salakan.svg',
  locale: 'id_ID',
  themeColor: '#ffffff',
};

export function toAbsoluteUrl(path = '/') {
  return new URL(path, siteMeta.siteUrl).toString();
}

export function getSeoImage(image?: string) {
  if (!image) {
    return toAbsoluteUrl(siteMeta.ogImage);
  }

  return image.startsWith('http://') || image.startsWith('https://')
    ? image
    : toAbsoluteUrl(image);
}

export function withSiteTitle(title: string) {
  return `${title} | ${siteMeta.name}`;
}

export function resolveSeoText(primary?: string, fallback?: string) {
  const value = primary?.trim();
  if (value) return value;
  return fallback ?? '';
}

export function resolveSeoImage(primary?: string, fallback?: string) {
  const value = primary?.trim();
  if (value) return value;
  return fallback;
}

export const navItems = [
  { href: '/', label: 'Beranda' },
  { href: '/profil', label: 'Profil' },
  { href: '/data', label: 'Data' },
  { href: '/berita', label: 'Berita' },
  { href: '/agenda', label: 'Agenda' },
  { href: '/galeri', label: 'Galeri' },
  { href: '/kontak', label: 'Kontak' },
];
