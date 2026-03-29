import type { Config } from '@keystatic/core';
import baseConfig from '../../keystatic.config';
import type { AdminRole } from './admin-auth';

export const EDITOR_ALLOWED_COLLECTION_KEYS = [
  'pengumuman',
  'kegiatan',
  'agenda',
  'kategoriBerita',
  'galeri',
  'dokumen',
  'umkm',
  'strukturOrganisasi',
  'layananWarga',
  'faq',
] as const;

const EDITOR_ALLOWED_COLLECTION_SET = new Set<string>(EDITOR_ALLOWED_COLLECTION_KEYS);

const EDITOR_NAVIGATION = {
  Editorial: ['pengumuman', 'kegiatan', 'agenda', 'kategoriBerita', 'galeri'],
  'Data Kampung': ['dokumen', 'umkm', 'strukturOrganisasi', 'layananWarga', 'faq'],
} as const;

export function isEditorAllowedCollectionKey(key: string) {
  return EDITOR_ALLOWED_COLLECTION_SET.has(key);
}

export function getKeystaticConfigForRole(role: AdminRole): Config<any, any> {
  if (role !== 'editor') {
    return baseConfig;
  }

  const filteredCollections = Object.fromEntries(
    Object.entries(baseConfig.collections ?? {}).filter(([key]) =>
      EDITOR_ALLOWED_COLLECTION_SET.has(key)
    )
  );

  return {
    ...baseConfig,
    collections: filteredCollections,
    singletons: {},
    ui: {
      ...baseConfig.ui,
      navigation: EDITOR_NAVIGATION,
    },
  };
}
