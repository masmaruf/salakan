import Icon from './ui/Icon.tsx';
import React, { useState } from 'react';
import { actions } from 'astro:actions';

interface RT {
  id: string;
  nomor: string;
  nama: string;
}

interface Props {
  daftarRt: RT[];
}

export default function FormAjukanSurat({ daftarRt }: Props) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<{message: string, ticket: string} | null>(null);
  const [error, setError] = useState<string | null>(null);

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
        setSuccess({ 
          message: data.message || "Berhasil!", 
          ticket: data.ticket || "-" 
        });
      } else {
        setError(data?.message || "Gagal memproses pengajuan.");
      }
    } catch (err) {
      setError("Gagal menghubungi server. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-3xl shadow-xl rounded-[2.5rem] border border-white/50 overflow-hidden max-w-2xl mx-auto mb-10">
      {/* Header */}
      <div className="sticky top-20 z-10 flex items-center gap-3 border-b border-slate-100 bg-white/50 px-8 py-6 backdrop-blur-md">
         <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Icon name="edit_square" />
         </div>
         <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Formulir Pengajuan</h3>
            <p className="text-label mt-0.5">Layanan Mandiri Warga Salakan</p>
         </div>
      </div>

      <div className="p-8">
        {success ? (
          <div className="text-center py-8 space-y-6 animate-in fade-in zoom-in duration-300">
            <div className="h-24 w-24 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto shadow-inner">
              <Icon name="check_circle" className="text-6xl" />
            </div>
            <div className="space-y-2">
              <h4 className="text-2xl font-black text-slate-900">Berhasil Terkirim!</h4>
              <p className="text-slate-500 font-medium leading-relaxed">{success.message}</p>
            </div>
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
               <p className="text-label mb-1">Nomor Pengajuan / Tiket</p>
               <strong className="text-2xl font-mono font-black text-blue-600 tracking-tighter">{success.ticket}</strong>
            </div>
            <a 
              href="/dasbor"
              className="btn-premium w-full flex justify-center items-center"
            >
              Kembali ke Dasbor
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-2xl border border-red-100 text-sm font-bold flex items-center gap-3">
                <Icon name="error" className="text-[18px]" />
                {error}
              </div>
            )}

            {/* Bagian 1: Tujuan & Wilayah */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-blue-600">
                <Icon name="map" className="text-[20px]" />
                <h4 className="text-sm font-black uppercase tracking-widest">Wilayah & Tujuan</h4>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase ml-1">Pilih RT Domisili</label>
                <select name="rt_id" required disabled={loading} className="select-premium" defaultValue="">
                  <option value="" disabled>-- Pilih RT --</option>
                  {daftarRt && daftarRt.length > 0 ? (
                    daftarRt.map(rt => (
                      <option key={rt.id} value={rt.id}>RT {rt.nomor} ({rt.nama})</option>
                    ))
                  ) : (
                    <option disabled>Tidak ada data RT</option>
                  )}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase ml-1">Uraian Keperluan</label>
                <textarea 
                  name="keperluan" 
                  required 
                  disabled={loading}
                  placeholder="Jelaskan secara detail maksud pengajuan surat Anda..."
                  rows={3}
                  className="textarea-premium"
                ></textarea>
              </div>
            </div>

            {/* Bagian 2: Identitas Diri */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-blue-600">
                <Icon name="person" className="text-[20px]" />
                <h4 className="text-sm font-black uppercase tracking-widest">Identitas Pemohon</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase ml-1">Nama Lengkap</label>
                  <input type="text" name="nama" required disabled={loading} placeholder="Sesuai KTP" className="input-premium" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase ml-1">NIK (16 Digit)</label>
                  <input type="text" name="nik" required disabled={loading} maxLength={16} placeholder="3404XXXXXXXXXXXX" className="input-premium" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase ml-1">Jenis Kelamin</label>
                  <select name="jenis_kelamin" required disabled={loading} className="select-premium" defaultValue="">
                    <option value="" disabled>-- Pilih --</option>
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase ml-1">Agama</label>
                  <select name="agama" required disabled={loading} className="select-premium" defaultValue="">
                    <option value="" disabled>-- Pilih --</option>
                    <option value="Islam">Islam</option>
                    <option value="Kristen">Kristen</option>
                    <option value="Katolik">Katolik</option>
                    <option value="Hindu">Hindu</option>
                    <option value="Budha">Budha</option>
                    <option value="Khonghucu">Khonghucu</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase ml-1">Tempat Lahir</label>
                  <input type="text" name="tempat_lahir" required disabled={loading} placeholder="Kota/Kabupaten" className="input-premium" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase ml-1">Tanggal Lahir</label>
                  <input type="date" name="tanggal_lahir" required disabled={loading} className="input-premium" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase ml-1">Pekerjaan</label>
                  <input type="text" name="pekerjaan" required disabled={loading} placeholder="Contoh: Karyawan Swasta" className="input-premium" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase ml-1">Status Perkawinan</label>
                  <select name="status_kawin" required disabled={loading} className="select-premium" defaultValue="">
                    <option value="" disabled>-- Pilih --</option>
                    <option value="Belum Kawin">Belum Kawin</option>
                    <option value="Kawin">Kawin</option>
                    <option value="Cerai Hidup">Cerai Hidup</option>
                    <option value="Cerai Mati">Cerai Mati</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase ml-1">Alamat Domisili</label>
                <textarea 
                  name="alamat" 
                  required 
                  disabled={loading}
                  placeholder="Alamat lengkap di wilayah Salakan..."
                  rows={2}
                  className="textarea-premium"
                ></textarea>
              </div>
            </div>

            {/* Bagian 3: Kontak */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-blue-600">
                <Icon name="contact_phone" className="text-[20px]" />
                <h4 className="text-sm font-black uppercase tracking-widest">Kontak Notifikasi</h4>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase ml-1">Nomor WhatsApp Aktif</label>
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
                <p className="text-label mt-2 ml-1">Pastikan nomor aktif untuk menerima kabar update dari Ketua RT.</p>
              </div>
            </div>

            <div className="pt-4 flex flex-col gap-4">
              <button 
                type="submit"
                disabled={loading}
                className="btn-premium w-full flex justify-center items-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Memproses Data...</span>
                  </>
                ) : (
                  <>
                    <Icon name="send" /> <span>Kirim Pengajuan</span>
                  </>
                )}
              </button>
              <p className="text-[0.65rem] text-center text-slate-400 font-bold uppercase tracking-widest">
                Data Anda aman dan hanya digunakan untuk kepentingan administrasi Padukuhan.
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
