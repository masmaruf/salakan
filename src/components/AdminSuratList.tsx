import React, { useState } from 'react';
import { actions } from 'astro:actions';

interface Pengajuan {
  id: number;
  nomor_surat: string;
  rt_id: string;
  nama: string;
  nik: string;
  keperluan: string;
  status: string;
  catatan_rt: string | null;
  created_at: Date | string;
  no_hp: string;
}

interface Props {
  initialData: Pengajuan[];
}

export default function AdminSuratList({ initialData }: Props) {
  const [data, setData] = useState(initialData);
  const [updating, setUpdating] = useState<number | null>(null);

  const handleUpdateStatus = async (id: number, newStatus: string, catatan?: string) => {
    setUpdating(id);
    try {
      const formData = new FormData();
      formData.append('id', id.toString());
      formData.append('status', newStatus);
      if (catatan) formData.append('catatan_rt', catatan);

      const { data: res, error } = await actions.layanan.updateStatusSurat(formData);
      
      if (res?.success) {
        setData(prev => prev.map(item => 
          item.id === id ? { ...item, status: newStatus, catatan_rt: catatan || item.catatan_rt } : item
        ));
      } else {
        alert(error?.message || "Gagal memperbarui status.");
      }
    } catch (err) {
      alert("Terjadi kesalahan koneksi.");
    } finally {
      setUpdating(null);
    }
  };

  const formatTgl = (d: Date | string) => {
    return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(d));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-slate-900 tracking-tight">Daftar Pengajuan Masuk</h2>
        <div className="flex gap-2">
          <span className="badge-amber bg-white border border-amber-100">{data.filter(d => d.status === 'menunggu').length} Menunggu</span>
          <span className="badge-blue bg-white border border-blue-100">{data.filter(d => d.status === 'diproses').length} Diproses</span>
        </div>
      </div>

      <div className="grid gap-4">
        {data.length === 0 ? (
          <div className="bg-white/50 border border-white/40 rounded-3xl p-12 text-center text-slate-400 font-medium">
            Belum ada pengajuan surat yang masuk.
          </div>
        ) : (
          data.map((item) => (
            <div key={item.id} className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-6 shadow-sm border border-white/50 hover:shadow-md transition-all group">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-3 flex-1 min-w-[280px]">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{item.nomor_surat}</span>
                    <span className={`text-[0.7rem] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                      item.status === 'selesai' ? 'bg-emerald-50 text-emerald-600' :
                      item.status === 'diproses' ? 'bg-blue-50 text-blue-600' :
                      item.status === 'ditolak' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-black text-slate-900">{item.nama}</h4>
                    <p className="text-xs font-bold text-slate-400">NIK: {item.nik} • RT: {item.rt_id.toUpperCase()}</p>
                  </div>

                  <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100/50">
                    <p className="text-[0.8rem] font-bold text-slate-500 mb-1 italic">Keperluan:</p>
                    <p className="text-sm font-medium text-slate-700 leading-relaxed">{item.keperluan}</p>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">schedule</span>
                      {formatTgl(item.created_at)}
                    </span>
                    <a href={`https://wa.me/${item.no_hp.replace('+','')}`} target="_blank" className="flex items-center gap-1.5 text-emerald-600 hover:text-emerald-700 transition-colors">
                      <span className="material-symbols-outlined text-[16px]">chat</span>
                      Hubungi WA
                    </a>
                  </div>
                </div>

                <div className="space-y-3 w-full sm:w-auto min-w-[180px]">
                   <p className="text-[0.65rem] font-black uppercase tracking-widest text-slate-400 ml-1">Aksi Pengelola</p>
                   <div className="flex flex-col gap-2">
                     {item.status === 'menunggu' && (
                       <button 
                         disabled={updating === item.id}
                         onClick={() => handleUpdateStatus(item.id, 'diproses')}
                         className="flex items-center justify-center gap-2 bg-blue-600 text-white text-xs font-black py-3 rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 transition-all w-full"
                       >
                         {updating === item.id ? 'Loading...' : <><span className="material-symbols-outlined text-[18px]">play_arrow</span> Mulai Proses</>}
                       </button>
                     )}
                     
                     {item.status === 'diproses' && (
                       <button 
                         disabled={updating === item.id}
                         onClick={() => handleUpdateStatus(item.id, 'selesai')}
                         className="flex items-center justify-center gap-2 bg-emerald-600 text-white text-xs font-black py-3 rounded-2xl shadow-lg shadow-emerald-200 hover:bg-emerald-700 hover:-translate-y-0.5 transition-all w-full"
                       >
                         {updating === item.id ? 'Loading...' : <><span className="material-symbols-outlined text-[18px]">check</span> Selesaikan</>}
                       </button>
                     )}

                     {(item.status === 'menunggu' || item.status === 'diproses') && (
                       <button 
                         disabled={updating === item.id}
                         onClick={() => {
                           const catatan = prompt("Alasan penolakan:", item.catatan_rt || "");
                           if (catatan) handleUpdateStatus(item.id, 'ditolak', catatan);
                         }}
                         className="flex items-center justify-center gap-2 bg-white text-rose-600 border-2 border-rose-100 text-xs font-black py-3 rounded-2xl hover:bg-rose-50 transition-all w-full"
                       >
                         <span className="material-symbols-outlined text-[18px]">close</span> Tolak / Revisi
                       </button>
                     )}

                     {item.status === 'selesai' && (
                        <div className="bg-emerald-50 text-emerald-700 text-[0.7rem] font-bold p-3 rounded-2xl border border-emerald-100/50 text-center">
                          Sudah Berhasil Diselesaikan
                        </div>
                     )}

                     {item.status === 'ditolak' && (
                        <div className="bg-rose-50 text-rose-700 text-[0.7rem] font-bold p-3 rounded-2xl border border-rose-100/50 text-center">
                          Pengajuan Ditolak / Dibatalkan
                        </div>
                     )}
                   </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
