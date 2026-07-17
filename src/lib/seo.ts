/**
 * SEO utilities for salakan.id
 * Provides structured data (JSON-LD), meta tags, and SEO helpers.
 */
import type { Thing, WithContext } from 'schema-dts';
import { siteMeta, toAbsoluteUrl } from './site';

export type JsonLdSchema = WithContext<Thing>;

function asJsonLd<T extends object>(schema: T): JsonLdSchema {
  return schema as unknown as JsonLdSchema;
}

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
} as const;

/**
 * Generate GovernmentOrganization structured data for Google.
 * Improves local search results and Google Knowledge Panel.
 */
export function generateLocalBusinessSchema(): JsonLdSchema {
  return asJsonLd({
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
    ...(localSeo.contact.phone ? { telephone: localSeo.contact.phone } : {}),
    ...(localSeo.contact.email ? { email: localSeo.contact.email } : {}),
    sameAs: [
      localSeo.social.instagram,
      localSeo.social.facebook,
      localSeo.social.youtube,
    ].filter(Boolean),
  } as const);
}

/**
 * Generate WebSite structured data with site identity.
 */
export function generateWebSiteSchema(): JsonLdSchema {
  return asJsonLd({
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
  } as const);
}

/**
 * Generate BreadcrumbList structured data.
 */
export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>,
): JsonLdSchema {
  return asJsonLd({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  } as const);
}

/**
 * Generate Article structured data for news/berita articles.
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
}): JsonLdSchema {
  return asJsonLd({
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
  } as const);
}

/**
 * Generate Event structured data for agenda/events.
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
}): JsonLdSchema {
  return asJsonLd({
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
  } as const);
}

/**
 * Generate FAQ structured data for FAQ pages.
 */
export function generateFaqSchema(
  faqs: Array<{ question: string; answer: string }>,
): JsonLdSchema {
  return asJsonLd({
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
  } as const);
}

/**
 * Generate Organization structured data for profil/about pages.
 */
export function generateOrganizationSchema(): JsonLdSchema {
  return asJsonLd({
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
  } as const);
}
