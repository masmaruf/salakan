import Icon from './ui/Icon.tsx';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import {
  SEARCH_TYPE_META,
  SEARCH_TYPE_ORDER,
  buildSearchHaystack,
  normalizeSearchText,
  type SearchRecord,
} from '../lib/search';

type SearchTypeFilter = (typeof SEARCH_TYPE_ORDER)[number];

function formatSearchDate(date?: string) {
  if (!date) return null;
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));
}

export default function SearchDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeType, setActiveType] = useState<SearchTypeFilter>('semua');
  const [data, setData] = useState<SearchRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (!isOpen || data.length > 0) return;
    setLoading(true);
    fetch('/api/search.json')
      .then((res) => res.json())
      .then((json: SearchRecord[]) => {
        setData(json);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [data.length, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      return;
    }

    setQuery('');
    setActiveType('semua');
  }, [isOpen]);

  const quickSuggestions = useMemo(() => {
    return [...data]
      .sort((a, b) => {
        const priorityScore = (value?: string) => (value === 'high' ? 1 : 0);
        return priorityScore(b.priority) - priorityScore(a.priority);
      })
      .slice(0, 5);
  }, [data]);

  const results = useMemo(() => {
    const normalizedQuery = normalizeSearchText(query);
    const queryFiltered = normalizedQuery
      ? data.filter((item) => buildSearchHaystack(item).includes(normalizedQuery))
      : quickSuggestions;

    return queryFiltered
      .filter((item) => activeType === 'semua' || item.type === activeType)
      .sort((a, b) => {
        const priorityScore = (value?: string) => (value === 'high' ? 1 : 0);
        const dateScore = (value?: string) => (value ? new Date(value).getTime() : 0);
        return priorityScore(b.priority) - priorityScore(a.priority) || dateScore(b.date) - dateScore(a.date);
      })
      .slice(0, 10);
  }, [activeType, data, query, quickSuggestions]);

  const typeCounts = useMemo(() => {
    return SEARCH_TYPE_ORDER.reduce<Record<string, number>>((acc, type) => {
      if (type === 'semua') {
        acc.semua = data.length;
        return acc;
      }
      acc[type] = data.filter((item) => item.type === type).length;
      return acc;
    }, {});
  }, [data]);

  const empty = !loading && results.length === 0;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors"
        aria-label="Cari di website"
      >
        <Icon name="search" className="text-[22px]" />
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-h-[85vh] max-w-3xl gap-0 overflow-hidden p-0 sm:max-h-[80vh]">
          <DialogTitle className="sr-only">Pencarian</DialogTitle>

          <div className="border-b border-outline-variant/40 px-5 py-4">
            <div className="flex items-center gap-3">
              <Icon name="search" className="shrink-0 text-[24px] text-m3-primary" />
              <Input
                ref={inputRef}
                className="h-auto border-0 bg-transparent p-0 text-base font-semibold text-on-surface placeholder:text-outline focus-visible:ring-0"
                placeholder="Cari agenda, berita, layanan, atau dokumen"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <kbd className="hidden h-6 items-center rounded-md border border-outline-variant bg-surface-container-low px-1.5 text-[10px] font-semibold text-outline sm:inline-flex">
                ESC
              </kbd>
            </div>
            <div className="mt-4 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {SEARCH_TYPE_ORDER.map((type) => {
                const active = activeType === type;
                const meta = SEARCH_TYPE_META[type === 'semua' ? 'agenda' : type] || SEARCH_TYPE_META.berita;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setActiveType(type)}
                    className={[
                      'inline-flex min-h-[38px] items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors',
                      active
                        ? 'bg-primary-container text-on-primary-container shadow-sm'
                        : 'border border-outline-variant bg-white text-on-surface-variant hover:bg-surface-container-low',
                    ].join(' ')}
                  >
                    <Icon name={type === 'semua' ? 'travel_explore' : meta.icon} className="text-[16px]" />
                    {type === 'semua' ? 'Semua' : meta.label}
                    <span className="text-[11px] opacity-70">{typeCounts[type] ?? 0}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <ScrollArea className="max-h-[calc(85vh-8rem)] sm:max-h-[64vh]">
            <div className="p-4">
              {loading && (
                <div className="py-12 text-center">
                  <div className="mx-auto grid h-16 w-16 place-items-center rounded-xl bg-surface-container-low text-outline animate-pulse">
                    <Icon name="hourglass_empty" className="text-[32px]" />
                  </div>
                  <p className="mt-3 text-[12px] font-semibold uppercase tracking-wider text-outline">Memuat data...</p>
                </div>
              )}

              {!loading && query.trim() === '' && (
                <div className="mb-4 rounded-2xl border border-outline-variant bg-surface-container-low/60 p-4">
                  <p className="text-[12px] font-semibold uppercase tracking-wider text-outline">Akses cepat warga</p>
                  <p className="mt-1 text-sm text-on-surface-variant">Mulai dari agenda penting, informasi terbaru, atau layanan yang paling sering dicari.</p>
                </div>
              )}

              {empty && (
                <div className="py-16 text-center">
                  <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-surface-container-low text-outline">
                    <Icon name="search_off" className="text-[32px]" />
                  </div>
                  <p className="mt-4 text-base font-bold text-on-surface">Tidak ditemukan</p>
                  <p className="mt-1 text-sm text-on-surface-variant">Coba kata kunci lain atau ubah tipe pencarian.</p>
                </div>
              )}

              {!loading && results.length > 0 && (
                <div className="space-y-1">
                  <p className="mb-2 px-2 text-[12px] font-semibold uppercase tracking-wider text-outline">
                    {query.trim() === '' ? 'Saran cepat' : `${results.length} hasil ditemukan`}
                  </p>
                  {results.map((item) => {
                    const meta = SEARCH_TYPE_META[item.type] || { label: item.type, icon: 'arrow_outward' };
                    const formattedDate = formatSearchDate(item.date);
                    return (
                      <a
                        key={`${item.url}-${item.type}`}
                        href={item.url}
                        className="group flex items-start gap-4 rounded-xl p-3 transition-colors hover:bg-surface-container-low"
                      >
                        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary-container/30 text-m3-primary transition-colors group-hover:bg-m3-primary group-hover:text-on-primary">
                          <Icon name={meta.icon} className="text-[20px]" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-outline">
                            <span>{meta.label}</span>
                            {item.priority === 'high' && (
                              <span className="rounded-full bg-error-container px-2 py-0.5 text-[10px] text-on-error-container">Penting</span>
                            )}
                            {formattedDate && <span className="normal-case tracking-normal">{formattedDate}</span>}
                          </div>
                          <h4 className="truncate text-sm font-bold leading-tight text-on-surface transition-colors group-hover:text-m3-primary">
                            {item.title}
                          </h4>
                          <p className="mt-0.5 line-clamp-2 text-[12px] text-on-surface-variant">{item.description}</p>
                        </div>
                        <Icon name="chevron_right" className="text-[18px] text-outline transition-transform group-hover:translate-x-0.5 group-hover:text-m3-primary" />
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}

