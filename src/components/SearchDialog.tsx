import Icon from './ui/Icon.tsx';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Dialog, DialogContent, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';

type SearchResult = {
  title: string;
  description: string;
  url: string;
  type: string;
};

const typeIcons: Record<string, string> = {
  berita: 'newspaper',
  dokumen: 'description',
  pengumuman: 'campaign',
  layanan: 'support_agent',
};

export default function SearchDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [data, setData] = useState<SearchResult[]>([]);
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

  const loadData = useCallback(() => {
    if (data.length > 0) return;
    setLoading(true);
    fetch('/api/search.json')
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [data.length]);

  useEffect(() => {
    if (isOpen) {
      loadData();
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen, loadData]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const q = query.toLowerCase();
    const filtered = data.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.type.toLowerCase().includes(q)
    );
    setResults(filtered.slice(0, 8));
  }, [query, data]);

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
        <DialogContent className="max-h-[85vh] max-w-2xl p-0 gap-0 overflow-hidden sm:max-h-[80vh]">
          <DialogTitle className="sr-only">Pencarian</DialogTitle>

          <div className="flex items-center gap-3 px-5 py-4 border-b border-outline-variant/40">
            <Icon name="search" className="text-[24px] text-m3-primary shrink-0" />
            <Input
              ref={inputRef}
              className="border-0 bg-transparent p-0 text-base font-semibold text-on-surface placeholder:text-outline focus-visible:ring-0 h-auto"
              placeholder="Cari berita, dokumen, layanan..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <kbd className="hidden sm:inline-flex h-6 items-center rounded-md border border-outline-variant bg-surface-container-low px-1.5 text-[10px] font-semibold text-outline">
              ESC
            </kbd>
          </div>

          <ScrollArea className="max-h-[calc(85vh-5rem)] sm:max-h-[60vh]">
            <div className="p-4">
              {loading && (
                <div className="py-12 text-center">
                  <Icon name="hourglass_empty" className="text-[40px] text-primary-container animate-pulse" />
                  <p className="text-[12px] font-semibold text-outline uppercase tracking-wider mt-3">Memuat data...</p>
                </div>
              )}

              {!loading && query.trim() !== '' && results.length === 0 && (
                <div className="py-16 text-center">
                  <div className="grid h-16 w-16 mx-auto place-items-center rounded-full bg-surface-container-low text-outline">
                    <Icon name="search_off" className="text-[28px]" />
                  </div>
                  <p className="text-base font-bold text-on-surface mt-4">Tidak ditemukan</p>
                  <p className="text-sm text-on-surface-variant mt-1">Coba kata kunci yang berbeda.</p>
                </div>
              )}

              {!loading && query.trim() === '' && (
                <div className="py-12 text-center">
                  <div className="grid h-16 w-16 mx-auto place-items-center rounded-xl bg-primary-container/30 text-m3-primary">
                    <Icon name="travel_explore" className="text-[28px]" />
                  </div>
                  <p className="text-base font-bold text-on-surface mt-4">Mulai Menjelajah</p>
                  <p className="text-sm text-on-surface-variant mt-1">Ketik untuk mencari berita, dokumen, atau layanan.</p>
                </div>
              )}

              {!loading && results.length > 0 && (
                <div className="space-y-1">
                  <p className="text-[12px] font-semibold text-outline uppercase tracking-wider px-2 mb-2">
                    {results.length} hasil ditemukan
                  </p>
                  {results.map((item, idx) => (
                    <a
                      key={idx}
                      href={item.url}
                      className="group flex items-center gap-4 rounded-xl p-3 transition-colors hover:bg-surface-container-low"
                    >
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary-container/30 text-m3-primary group-hover:bg-m3-primary group-hover:text-on-primary transition-colors">
                        <Icon name="{typeIcons[item.type] || 'arrow_outward'}" className="text-[20px]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[12px] font-semibold text-outline uppercase tracking-wider">{item.type}</span>
                        <h4 className="text-sm font-bold text-on-surface leading-tight truncate group-hover:text-m3-primary transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-[12px] text-on-surface-variant line-clamp-1 mt-0.5">{item.description}</p>
                      </div>
                      <Icon name="chevron_right" className="text-[18px] text-outline group-hover:text-m3-primary transition-transform group-hover:translate-x-0.5" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}
