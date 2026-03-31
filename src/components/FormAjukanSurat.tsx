import React, { useState, useRef, useEffect } from 'react';
import { actions } from 'astro:actions';

export default function FormAjukanSurat() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<{message: string, ticket: string} | null>(null);
  const [error, setError] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal();
      document.body.style.overflow = 'hidden';
    } else {
      dialogRef.current?.close();
      document.body.style.overflow = 'auto';
      // Reset state after close
      setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 300);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    
    try {
      const { data, error } = await actions.layanan.ajukanSurat(formData);
      
      if (error) {
        setError(error.message || "Terjadi kesalahan saat mengirim pengajuan.");
      } else if (data?.success) {
        setSuccess({ message: data.message, ticket: data.ticket });
      }
    } catch (err) {
      setError("Gagal menghubungi server. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="inline-flex h-12 items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-700 px-8 text-sm font-black text-white shadow-[0_10px_25px_rgba(37,99,235,0.3)] hover:shadow-[0_15px_35px_rgba(37,99,235,0.4)] hover:-translate-y-1 transition-all active:translate-y-0"
      >
        <span className="material-symbols-outlined text-[20px]">add_circle</span> Buat Pengajuan Baru
      </button>

      <dialog
        ref={dialogRef}
        className="backdrop:bg-slate-900/60 p-0 rounded-[2.5rem] w-[95vw] max-w-xl bg-white/90 backdrop-blur-3xl shadow-2xl m-auto fixed inset-0 border border-white/50 overflow-hidden outline-none"
        onClick={(e) => {
          if (e.target === dialogRef.current) setIsOpen(false);
        }}
      >
        <div className="flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white/50">
            <div className="flex items-center gap-3">
               <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <span className="material-symbols-outlined">edit_square</span>
               </div>
               <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Form Pengajuan Surat</h3>
                  <p className="text-label mt-0.5">Layanan Mandiri Warga</p>
               </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="h-10 w-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <div className="overflow-y-auto p-8">
            {success ? (
              <div className="text-center py-8 space-y-6 animate-in fade-in zoom-in duration-300">
                <div className="h-24 w-24 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto shadow-inner">
                  <span className="material-symbols-outlined text-6xl">check_circle</span>
                </div>
                <div className="space-y-2">
                  <h4 className="text-2xl font-black text-slate-900">Berhasil Terkirim!</h4>
                  <p className="text-slate-500 font-medium leading-relaxed">{success.message}</p>
                </div>
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                   <p className="text-label mb-1">Nomor Tiket Anda</p>
                   <strong className="text-3xl font-mono font-black text-blue-600 tracking-tighter">{success.ticket}</strong>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="btn-premium w-full"
                >
                  Tutup Dasbor
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-50 text-red-700 p-4 rounded-2xl border border-red-100 text-sm font-bold flex items-center gap-3">
                    <span className="material-symbols-outlined text-[18px]">error</span>
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-black text-slate-700 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-blue-500">category</span>
                    Pilih Jenis Surat
                  </label>
                  <select 
                    name="jenis_surat" 
                    required
                    disabled={loading}
                    className="select-premium"
                  >
                    <option value="">-- Pilih Surat --</option>
                    <option value="domisili">Surat Pengantar Domisili</option>
                    <option value="sktm">Surat Keterangan Tidak Mampu (SKTM)</option>
                    <option value="kelahiran">Surat Pengantar Akta Kelahiran</option>
                    <option value="kematian">Surat Pengantar Akta Kematian</option>
                    <option value="nikah">Surat Pengantar Numpang Nikah (NA)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-black text-slate-700 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-blue-500">info</span>
                    Tujuan / Keperluan
                  </label>
                  <textarea 
                    name="keperluan" 
                    required
                    disabled={loading}
                    placeholder="Contoh: Untuk persyaratan pendaftaran beasiswa anak sekolah..."
                    rows={4}
                    className="textarea-premium"
                  ></textarea>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-black text-slate-700 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-blue-500">chat</span>
                    Nomor WhatsApp Aktif
                  </label>
                  <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">+62</span>
                    <input 
                      type="tel" 
                      name="whatsapp" 
                      required
                      disabled={loading}
                      placeholder="812xxxxxxx"
                      className="input-premium pl-14"
                    />
                  </div>
                  <p className="text-label mt-2 ml-1">Staf RT/RW akan menghubungi via WA jika ada update.</p>
                </div>

                <div className="pt-4 flex flex-col gap-4">
                  <button 
                    type="submit"
                    disabled={loading}
                    className="btn-premium w-full"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Memproses data...
                      </span>
                    ) : (
                      <>
                        <span className="material-symbols-outlined">send</span> Kirim Pengajuan
                      </>
                    )}
                  </button>
                  <p className="text-[0.7rem] text-center text-slate-400 font-medium leading-relaxed">
                    Dengan mengirimkan form ini, data Anda akan diverifikasi oleh pengurus padukuhan sesuai prosedur yang berlaku.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </dialog>
    </>
  );
}
