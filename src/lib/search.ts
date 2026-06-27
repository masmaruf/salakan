type SearchPriority = 'high' | 'normal';

export type SearchRecord = {
  title: string;
  description: string;
  url: string;
  type: string;
  date?: string;
  priority?: SearchPriority;
  keywords?: string[];
};

export const SEARCH_TYPE_META: Record<string, { label: string; icon: string }> = {
  berita: { label: 'Berita', icon: 'newspaper' },
  agenda: { label: 'Agenda', icon: 'event' },
  pengumuman: { label: 'Pengumuman', icon: 'campaign' },
  program: { label: 'Program', icon: 'timeline' },
  kas: { label: 'Kas RT', icon: 'account_balance_wallet' },
  inventaris: { label: 'Inventaris', icon: 'inventory_2' },
  dokumen: { label: 'Dokumen', icon: 'description' },
  layanan: { label: 'Layanan', icon: 'support_agent' },
};

export const SEARCH_TYPE_ORDER = ['semua', 'pengumuman', 'agenda', 'program', 'kas', 'inventaris', 'berita', 'layanan', 'dokumen'] as const;

export function normalizeSearchText(value: string) {
  return value.toLowerCase().trim();
}

export function buildSearchHaystack(item: SearchRecord) {
  return normalizeSearchText(
    [item.title, item.description, item.type, ...(item.keywords ?? [])].join(' ')
  );
}
