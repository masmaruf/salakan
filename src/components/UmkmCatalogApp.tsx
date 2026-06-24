import React, { useState, useMemo } from 'react';

interface UmkmEntry {
  namaUsaha: string;
  kategori: 'kuliner' | 'kerajinan' | 'jasa' | 'perdagangan';
  pemilik: string;
  ringkasan: string;
  deskripsi: string;
  whatsapp: string;
  lokasi: string;
  produkUnggulan: string[];
  gambar?: string;
  altGambar?: string;
}

export interface UmkmItem {
  slug: string;
  entry: UmkmEntry;
}

const kategoriLabels: Record<string, string> = {
  kuliner: 'Kuliner',
  kerajinan: 'Kerajinan',
  jasa: 'Jasa',
  perdagangan: 'Perdagangan',
};

function normalizeWhatsapp(value: string) {
  return value.replace(/[^\d]/g, '');
}

function getWhatsappUrl(value: string, businessName: string) {
  const number = normalizeWhatsapp(value);
  const text = encodeURIComponent(`Halo, saya ingin mengetahui informasi UMKM ${businessName}.`);
  return `https://wa.me/${number}?text=${text}`;
}

export default function UmkmCatalogApp({ initialItems }: { initialItems: UmkmItem[] }) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 6;

  const filteredItems = useMemo(() => {
    let result = initialItems;
    if (activeCategory !== 'all') {
      result = result.filter((item) => item.entry.kategori === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((item) => 
        item.entry.namaUsaha.toLowerCase().includes(q) ||
        item.entry.ringkasan.toLowerCase().includes(q) ||
        item.entry.pemilik.toLowerCase().includes(q) ||
        (item.entry.produkUnggulan && item.entry.produkUnggulan.some(p => p.toLowerCase().includes(q)))
      );
    }
    return result;
  }, [initialItems, activeCategory, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE));
  const paginatedItems = filteredItems.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // Jika hasil filter berubah, kembalikan ke page 1
  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, searchQuery]);

  return (
    <div className="space-y-10">
      {/* Header & Filter */}
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[20px] text-slate-400">search</span>
            <input 
              type="text" 
              placeholder="Cari nama usaha atau produk..." 
              className="w-full rounded-full bg-white pl-12 pr-5 py-3 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setActiveCategory('all')} 
            className={`text-sm px-5 py-2 rounded-full font-bold transition-all ${activeCategory === 'all' ? 'bg-blue-600 text-white shadow-[0_4px_12px_rgb(37,99,235,0.3)]' : 'bg-white text-slate-600 shadow-sm hover:shadow-md hover:-translate-y-0.5'}`}
          >
            Semua
          </button>
          {Object.entries(kategoriLabels).map(([key, label]) => (
            <button 
              key={key}
              onClick={() => setActiveCategory(key)} 
              className={`text-sm px-5 py-2 rounded-full font-bold transition-all ${activeCategory === key ? 'bg-blue-600 text-white shadow-[0_4px_12px_rgb(37,99,235,0.3)]' : 'bg-white text-slate-600 shadow-sm hover:shadow-md hover:-translate-y-0.5'}`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-slate-400">
            Menampilkan <span className="text-slate-900">{filteredItems.length}</span> usaha
          </p>
          <div className="flex items-center gap-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-slate-600 shadow-sm transition hover:shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <span className="text-sm font-bold text-slate-500 px-2">{currentPage} / {totalPages}</span>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-slate-600 shadow-sm transition hover:shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Card Grid */}
      <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
        {paginatedItems.map(({ slug, entry }) => (
          <article key={slug} className="group rounded-[2rem] bg-white overflow-hidden shadow-[0_4px_20px_rgb(0,0,0,0.04)] transition-all hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-2" id={slug}>
            <div className="aspect-[16/10] bg-gradient-to-br from-slate-50 to-blue-50 overflow-hidden relative">
              {entry.gambar ? (
                <img className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" src={entry.gambar} alt={entry.altGambar || entry.namaUsaha} loading="lazy" />
              ) : (
                <div className="grid h-full place-items-center text-slate-300">
                  <span className="material-symbols-outlined text-5xl">storefront</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="absolute bottom-3 left-3 inline-flex items-center rounded-full bg-blue-600/90 px-3 py-1 text-[0.65rem] font-bold text-white uppercase tracking-wider backdrop-blur shadow-sm">
                {kategoriLabels[entry.kategori] || entry.kategori}
              </span>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-400">{entry.pemilik}</span>
              </div>
              <h2 className="text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-blue-700 transition-colors">
                <a href={`/data/umkm/${slug}`}>{entry.namaUsaha}</a>
              </h2>
              <p className="text-sm font-medium leading-relaxed text-slate-500 line-clamp-2">{entry.ringkasan}</p>
              
              <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                <span className="material-symbols-outlined text-[16px] text-blue-400">location_on</span>
                {entry.lokasi}
              </div>

              {entry.produkUnggulan && entry.produkUnggulan.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {entry.produkUnggulan.slice(0, 3).map((item: string, idx: number) => (
                    <span key={idx} className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">{item}</span>
                  ))}
                </div>
              )}

              <div className="grid gap-3 pt-2">
                <a className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-50 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-blue-600 hover:text-white hover:shadow-md" href={`/data/umkm/${slug}`}>
                  <span className="material-symbols-outlined text-[18px]">visibility</span> Lihat Detail
                </a>
                <a
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-50 px-5 py-3 text-sm font-bold text-emerald-700 transition hover:bg-emerald-600 hover:text-white hover:shadow-md"
                  href={getWhatsappUrl(entry.whatsapp, entry.namaUsaha)}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="material-symbols-outlined text-[18px]">chat</span> Hubungi WhatsApp
                </a>
              </div>
            </div>
          </article>
        ))}
        {paginatedItems.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center p-16 rounded-[2rem] bg-white/60 backdrop-blur shadow-sm">
            <span className="material-symbols-outlined text-5xl text-slate-300 mb-4">search_off</span>
            <p className="text-slate-500 font-bold text-lg">Tidak ada UMKM yang sesuai pencarian/filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
