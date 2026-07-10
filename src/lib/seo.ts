/**
 * SEO utilities for salakan.id
 * Provides structured data (JSON-LD), meta tags, and SEO helpers
 */

export const siteMeta = {
  name: 'Padukuhan Salakan',
  title: 'Padukuhan Salakan',
  description:
    'Portal warga Padukuhan Salakan untuk agenda, berita, profil wilayah, galeri, dan informasi kontak.',
  siteUrl: 'https://salakan.pages.dev',
  ogImage: '/images/og-salakan.svg',
  locale: 'id_ID',
  themeColor: '#ffffff',
};

// Local SEO constants
export const localSeo = {
  // Geographic coordinates (Bangunjiwo, Kasihan, Bantul)
  // Update with exact coordinates if available
  latitude: -7.8266,
  longitude: 110.3441,
  
  // Address
  address: {
    street: 'Padukuhan Salakan',
    village: 'Bangunjiwo',
    district: 'Kasihan',
    regency: 'Bantul',
    province: 'Daerah Istimewa Yogyakarta',
    country: 'ID',
    postalCode: '55184',
  },
  
  // Contact (update with real data)
  contact: {
    phone: '',
    whatsapp: '',
    email: '',
  },
  
  // Business hours
  opens: 'Mo-Su 08:00-16:00',
  
  // Social profiles
  social: {
    instagram: '',
    facebook: '',
    youtube: '',
  },
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

/**
 * Generate LocalBusiness structured data for Google
 * Improves local search results and Google Knowledge Panel
 */
export function generateLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'GovernmentOrganization',
    name: siteMeta.name,
    description: siteMeta.description,
    url: siteMeta.siteUrl,
    image: toAbsoluteUrl(siteMeta.ogImage),
    address: {
      '@type': 'PostalAddress',
      streetAddress: localSeo.address.street,
      addressLocality: localSeo.address.village,
      addressRegion: localSeo.address.province,
      postalCode: localSeo.address.postalCode,
      addressCountry: localSeo.address.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: localSeo.latitude,
      longitude: localSeo.longitude,
    },
    areaServed: {
      '@type': 'AdministrativeArea',
      name: 'Kalurahan Bangunjiwo, Kasihan, Bantul',
    },
    ...(localSeo.contact.phone && {
      telephone: localSeo.contact.phone,
    }),
    ...(localSeo.contact.email && {
      email: localSeo.contact.email,
    }),
    sameAs: [
      localSeo.social.instagram,
      localSeo.social.facebook,
      localSeo.social.youtube,
    ].filter(Boolean),
  };
}

/**
 * Generate WebSite structured data with SearchAction
 * Enables Google sitelinks search box
 */
export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteMeta.name,
    url: siteMeta.siteUrl,
    description: siteMeta.description,
    inLanguage: 'id-ID',
    publisher: {
      '@type': 'GovernmentOrganization',
      name: siteMeta.name,
    },
  };
}

/**
 * Generate BreadcrumbList structured data
 * Improves navigation display in search results
 */
export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generate Article structured data
 * For news/berita articles
 */
export function generateArticleSchema({
  title,
  description,
  image,
  publishedTime,
  modifiedTime,
  url,
  author,
}: {
  title: string;
  description: string;
  image?: string;
  publishedTime: string;
  modifiedTime?: string;
  url: string;
  author?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: title,
    description,
    image: image ? [image] : [toAbsoluteUrl(siteMeta.ogImage)],
    datePublished: publishedTime,
    ...(modifiedTime && { dateModified: modifiedTime }),
    mainEntityOfPage: url,
    author: {
      '@type': 'Organization',
      name: author || siteMeta.name,
    },
    publisher: {
      '@type': 'GovernmentOrganization',
      name: siteMeta.name,
      url: siteMeta.siteUrl,
    },
    inLanguage: 'id-ID',
  };
}

/**
 * Generate Event structured data
 * For agenda/events
 */
export function generateEventSchema({
  title,
  description,
  startDate,
  endDate,
  location,
  url,
}: {
  title: string;
  description: string;
  startDate: string;
  endDate?: string;
  location?: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: title,
    description,
    startDate,
    ...(endDate && { endDate }),
    location: {
      '@type': 'Place',
      name: location || siteMeta.name,
      address: {
        '@type': 'PostalAddress',
        addressLocality: localSeo.address.village,
        addressRegion: localSeo.address.province,
        addressCountry: localSeo.address.country,
      },
    },
    organizer: {
      '@type': 'GovernmentOrganization',
      name: siteMeta.name,
      url: siteMeta.siteUrl,
    },
    url,
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
  };
}

/**
 * Generate FAQ structured data
 * For FAQ pages
 */
export function generateFaqSchema(
  faqs: Array<{ question: string; answer: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generate Organization structured data
 * For profil/about pages
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'GovernmentOrganization',
    name: siteMeta.name,
    url: siteMeta.siteUrl,
    description: siteMeta.description,
    logo: toAbsoluteUrl(siteMeta.ogImage),
    address: {
      '@type': 'PostalAddress',
      streetAddress: localSeo.address.street,
      addressLocality: localSeo.address.village,
      addressRegion: localSeo.address.province,
      addressCountry: localSeo.address.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: localSeo.latitude,
      longitude: localSeo.longitude,
    },
    areaServed: {
      '@type': 'AdministrativeArea',
      name: 'Kalurahan Bangunjiwo, Kasihan, Bantul',
    },
    sameAs: [
      localSeo.social.instagram,
      localSeo.social.facebook,
      localSeo.social.youtube,
    ].filter(Boolean),
  };
}

export const navItems = [
  { href: '/', label: 'Beranda' },
  { href: '/profil', label: 'Profil' },
  { href: '/data', label: 'Data' },
  { href: '/berita', label: 'Berita' },
  { href: '/galeri', label: 'Galeri' },
  { href: '/kontak', label: 'Kontak' },
];
