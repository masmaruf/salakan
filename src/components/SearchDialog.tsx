import React, { useState, useEffect, useRef } from 'react';

type SearchResult = {
  title: string;
  description: string;
  url: string;
  type: string;
};

export default function SearchDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [data, setData] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
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
    if (isOpen) {
      dialogRef.current?.showModal();
      inputRef.current?.focus();
      if (data.length === 0) {
        setLoading(true);
        fetch('/api/search.json')
          .then((res) => res.json())
          .then((json) => {
            setData(json);
            setLoading(false);
          })
          .catch(() => setLoading(false));
      }
    } else {
      dialogRef.current?.close();
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const lowercaseQuery = query.toLowerCase();
    const filtered = data.filter((item) => {
      return (
        item.title.toLowerCase().includes(lowercaseQuery) ||
        item.description.toLowerCase().includes(lowercaseQuery) ||
        item.type.toLowerCase().includes(lowercaseQuery)
      );
    });
    setResults(filtered.slice(0, 8)); // limit ke 8 teratas
  }, [query, data]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="btn btn-ghost w-10 h-10 min-h-10 p-0 rounded-[var(--radius-md)] flex items-center justify-center border border-slate-200 shadow-none bg-white lg:w-48 lg:justify-between lg:px-3 text-slate-500 hover:text-blue-700 hover:border-blue-200 hover:bg-blue-50 transition-all group"
        aria-label="Cari di website"
      >
        <div className="flex items-center gap-2">
           <span className="material-symbols-outlined text-[18px]">search</span>
           <span className="hidden text-sm font-medium lg:block">Cari sesuatu...</span>
        </div>
        <kbd className="hidden lg:flex items-center gap-1 font-sans text-[0.65rem] font-bold text-slate-400 border border-slate-200 rounded px-1.5 py-0.5 bg-slate-50 group-hover:bg-white group-hover:text-blue-500 group-hover:border-blue-200">
           <abbr title="Control" className="no-underline">Ctrl</abbr>K
        </kbd>
      </button>

      <dialog
        ref={dialogRef}
        className="backdrop:bg-slate-900/60 p-0 rounded-2xl w-[90vw] max-w-2xl bg-white shadow-2xl backdrop:backdrop-blur-sm m-auto open:animate-in open:fade-in-90 open:zoom-in-95 duration-200 top-16 bottom-auto fixed"
        onClick={(e) => {
          if (e.target === dialogRef.current) setIsOpen(false);
        }}
      >
        <div className="flex flex-col max-h-[80vh] overflow-hidden">
          <div className="flex items-center border-b border-slate-100 px-4">
             <span className="material-symbols-outlined text-blue-500">search</span>
             <input
               ref={inputRef}
               className="w-full flex-1 bg-transparent px-4 py-4 text-slate-900 placeholder:text-slate-400 focus:outline-none text-lg"
               placeholder="Cari layanan, peraturan, atau jadwal warga..."
               value={query}
               onChange={(e) => setQuery(e.target.value)}
             />
             <button
                type="button"
                className="text-[0.75rem] font-semibold text-slate-500 hover:text-slate-900 border border-slate-200 px-2.5 py-1 rounded bg-slate-50"
                onClick={() => setIsOpen(false)}
             >
                Esc
             </button>
          </div>

          <div className="overflow-y-auto p-2">
            {loading && (
              <div className="p-8 text-center text-slate-500">
                 Memuat data...
              </div>
            )}
            
            {!loading && query.trim() !== '' && results.length === 0 && (
              <div className="py-12 text-center">
                 <p className="text-slate-950 font-semibold text-lg">Tidak ada hasil ditemukan.</p>
                 <p className="text-slate-500 mt-1">Gunakan kata kunci yang lebih umum.</p>
              </div>
            )}

             {!loading && results.length > 0 && (
               <ul className="space-y-1">
                 {results.map((item, idx) => (
                    <li key={idx}>
                       <a href={item.url} className="block group rounded-xl p-3 hover:bg-blue-50 transition-colors">
                          <div className="flex gap-3 justify-between items-start">
                             <div>
                                <h4 className="font-bold text-slate-900 group-hover:text-blue-700">{item.title}</h4>
                                <p className="text-sm text-slate-500 mt-1 line-clamp-1">{item.description}</p>
                             </div>
                             <span className="shrink-0 text-[0.65rem] uppercase tracking-wider font-bold text-slate-500 border border-slate-200 px-2 py-0.5 rounded bg-white mt-0.5">
                                {item.type}
                             </span>
                          </div>
                       </a>
                    </li>
                 ))}
               </ul>
             )}
          </div>
        </div>
      </dialog>
    </>
  );
}
