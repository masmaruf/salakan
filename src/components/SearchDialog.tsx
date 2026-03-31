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
        className="flex h-12 w-10 items-center justify-center rounded-2xl bg-slate-50/50 border border-slate-100 text-slate-400 hover:bg-white hover:text-blue-600 hover:border-blue-100 hover:shadow-lg hover:-translate-y-0.5 transition-all lg:w-56 lg:justify-between lg:px-4 group"
        aria-label="Cari di website"
      >
        <div className="flex items-center gap-3">
           <span className="material-symbols-outlined text-[20px] transition-transform group-hover:scale-110">search</span>
           <span className="hidden text-[0.8rem] font-black lg:block uppercase tracking-widest text-slate-400 group-hover:text-slate-600">Cari sesuatu...</span>
        </div>
        <div className="hidden lg:flex items-center gap-1.5 font-sans text-[0.6rem] font-black text-slate-300 border border-slate-100 rounded-lg px-2 py-1 bg-white group-hover:text-blue-500 group-hover:border-blue-100 shadow-sm transition-all">
           <span className="opacity-50">CTRL</span> K
        </div>
      </button>

      <dialog
        ref={dialogRef}
        className="backdrop:bg-slate-900/40 backdrop:backdrop-blur-md p-0 rounded-[2.5rem] w-[95vw] max-w-3xl bg-white shadow-[0_32px_80px_rgba(15,23,42,0.2)] m-auto open:animate-in open:fade-in open:zoom-in-95 duration-300 top-20 bottom-auto fixed border border-slate-100 overflow-hidden"
        onClick={(e) => {
          if (e.target === dialogRef.current) setIsOpen(false);
        }}
      >
        <div className="flex flex-col max-h-[85vh]">
          {/* Header Dialog */}
          <div className="relative flex items-center px-8 py-6 bg-slate-50/50 border-b border-slate-100">
             <span className="material-symbols-outlined text-blue-600 text-3xl shrink-0">manage_search</span>
             <input
               ref={inputRef}
               className="w-full flex-1 bg-transparent px-6 text-slate-900 placeholder:text-slate-400 focus:outline-none text-xl font-bold"
               placeholder="Apa yang ingin Anda cari hari ini?"
               value={query}
               onChange={(e) => setQuery(e.target.value)}
             />
             <div className="flex items-center gap-3 shrink-0">
                <button
                   type="button"
                   className="hidden sm:inline-flex h-10 items-center gap-2 px-4 rounded-xl border border-slate-200 bg-white text-[0.65rem] font-black text-slate-400 uppercase tracking-widest hover:bg-slate-50 transition"
                   onClick={() => setIsOpen(false)}
                >
                   Tutup <span className="text-[10px] opacity-40 border border-slate-200 px-1 rounded">ESC</span>
                </button>
             </div>
          </div>

          <div className="overflow-y-auto p-6 scroll-smooth">
            {loading && (
              <div className="p-12 text-center animate-pulse">
                  <div className="flex justify-center mb-4">
                     <span className="material-symbols-outlined text-5xl text-blue-100">hourglass_empty</span>
                  </div>
                  <p className="text-sm font-black text-slate-300 uppercase tracking-[0.2em]">Menyiapkan Basis Data...</p>
              </div>
            )}
            
            {!loading && query.trim() !== '' && results.length === 0 && (
              <div className="py-20 text-center">
                 <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-slate-50 text-slate-200 mb-6">
                    <span className="material-symbols-outlined text-4xl">search_off</span>
                 </div>
                 <p className="text-xl font-black text-slate-900 leading-none">Hasil Tidak Ditemukan</p>
                 <p className="text-[0.95rem] font-bold text-slate-400 mt-3">Gunakan kata kunci yang lebih spesifik atau sederhana.</p>
              </div>
            )}

            {!loading && query.trim() === '' && (
              <div className="py-12 px-4 text-center">
                <div className="max-w-xs mx-auto space-y-6">
                   <div className="h-20 w-20 mx-auto rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner">
                      <span className="material-symbols-outlined text-4xl">travel_explore</span>
                   </div>
                   <div>
                      <p className="text-lg font-black text-slate-900">Mulai Menjelajah</p>
                      <p className="text-sm font-bold text-slate-400 mt-2">Ketik layanan, liputan berita, atau dokumen publik yang Anda perlukan.</p>
                   </div>
                </div>
              </div>
            )}

             {!loading && results.length > 0 && (
               <div className="space-y-4 pb-4">
                 <p className="text-[0.65rem] font-black text-slate-400 uppercase tracking-[0.2em] px-4 mb-2">Ditemukan {results.length} Referensi</p>
                 <ul className="grid gap-3">
                   {results.map((item, idx) => (
                      <li key={idx}>
                         <a href={item.url} className="group flex items-center gap-6 rounded-3xl p-5 border border-transparent hover:border-blue-100 hover:bg-blue-50/50 transition-all duration-300">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm border border-slate-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-lg transition-all duration-300">
                               <span className="material-symbols-outlined text-2xl">
                                  {item.type === 'berita' ? 'newspaper' : 
                                   item.type === 'dokumen' ? 'description' : 
                                   item.type === 'pengumuman' ? 'campaign' : 
                                   item.type === 'layanan' ? 'support_agent' : 'arrow_outward'}
                               </span>
                            </div>
                            <div className="flex-1 min-w-0">
                               <div className="flex items-center gap-3 mb-1">
                                  <span className="text-[0.6rem] font-black text-slate-400 uppercase tracking-widest group-hover:text-blue-500 transition-colors">{item.type}</span>
                               </div>
                               <h4 className="text-lg font-black text-slate-900 group-hover:text-blue-700 transition-colors leading-tight truncate">{item.title}</h4>
                               <p className="text-sm font-bold text-slate-400 mt-1 line-clamp-1 group-hover:text-slate-500">{item.description}</p>
                            </div>
                            <span className="material-symbols-outlined text-slate-200 group-hover:text-blue-400 transition-transform group-hover:translate-x-1">chevron_right</span>
                         </a>
                      </li>
                   ))}
                 </ul>
               </div>
             )}
          </div>
        </div>
      </dialog>
    </>
  );
}
