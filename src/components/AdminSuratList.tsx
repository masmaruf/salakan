import Icon from './ui/Icon.tsx';
import React, { useState } from 'react';
import { actions } from 'astro:actions';
import { getPengajuanStatusMeta, type PengajuanStatus } from '../lib/pengajuan';

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

  const handleUpdateStatus = async (id: number, newStatus: PengajuanStatus, catatan?: string) => {
    setUpdating(id);
    try {
      const formData = new FormData();
      formData.append('id', id.toString());
      formData.append('status', newStatus);
      if (catatan) formData.append('catatan_rt', catatan);

      const { data: res, error } = await actions.layanan.updateStatusSurat(formData);

      if (res?.success) {
        setData((prev) => prev.map((item) =>
          item.id === id ? { ...item, status: newStatus, catatan_rt: catatan ?? item.catatan_rt } : item
        ));
      } else {
        alert(error?.message || 'Gagal memperbarui status.');
      }
    } catch {
      alert('Terjadi kesalahan koneksi.');
    } finally {
      setUpdating(null);
    }
  };

  const requestRevision = (item: Pengajuan) => {
    const catatan = prompt('Catatan revisi untuk warga:', item.catatan_rt || '');
    if (catatan) handleUpdateStatus(item.id, 'perlu_revisi', catatan);
  };

  const rejectSubmission = (item: Pengajuan) => {
    const catatan = prompt('Alasan penolakan pengajuan:', item.catatan_rt || '');
    if (catatan) handleUpdateStatus(item.id, 'ditolak', catatan);
  };

  const formatTgl = (d: Date | string) => {
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    }).format(new Date(d));
  };

  const counts = {
    menunggu: data.filter((item) => item.status === 'menunggu').length,
    diproses: data.filter((item) => item.status === 'diproses').length,
    revisi: data.filter((item) => item.status === 'perlu_revisi').length,
    selesai: data.filter((item) => item.status === 'selesai').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-black tracking-tight text-slate-900">Daftar Pengajuan Masuk</h2>
        <div className="flex flex-wrap gap-2">
          <span className="badge-amber border border-amber-100 bg-white">{counts.menunggu} Menunggu</span>
          <span className="badge-blue border border-blue-100 bg-white">{counts.diproses} Diproses</span>
          <span className="rounded-full border border-orange-100 bg-white px-3 py-1 text-xs font-bold text-orange-600">{counts.revisi} Perlu Revisi</span>
          <span className="rounded-full border border-emerald-100 bg-white px-3 py-1 text-xs font-bold text-emerald-600">{counts.selesai} Selesai</span>
        </div>
      </div>

      <div className="grid gap-4">
        {data.length === 0 ? (
          <div className="rounded-3xl border border-white/40 bg-white/50 p-12 text-center font-medium text-slate-400">
            Belum ada pengajuan surat yang masuk.
          </div>
        ) : (
          data.map((item) => {
            const statusMeta = getPengajuanStatusMeta(item.status);
            return (
              <div key={item.id} className="group rounded-[2rem] border border-white/50 bg-white/80 p-6 shadow-sm backdrop-blur-xl transition-all hover:shadow-md">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0 flex-1 space-y-3 sm:min-w-[280px]">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full bg-blue-50 px-3 py-1 font-mono text-xs font-black text-blue-600">{item.nomor_surat}</span>
                      <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[0.7rem] font-black uppercase tracking-widest ${statusMeta.badgeClass}`}>
                        <span className={`h-2 w-2 rounded-full ${statusMeta.dotClass}`}></span>
                        {statusMeta.label}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-lg font-black text-slate-900">{item.nama}</h4>
                      <p className="text-xs font-bold text-slate-400">NIK: {item.nik} • RT: {item.rt_id.toUpperCase()}</p>
                    </div>

                    <div className="rounded-2xl border border-slate-100/50 bg-slate-50/50 p-4">
                      <p className="mb-1 text-[0.8rem] font-bold italic text-slate-500">Keperluan:</p>
                      <p className="text-sm font-medium leading-relaxed text-slate-700">{item.keperluan}</p>
                    </div>

                    {item.catatan_rt && (
                      <div className="rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3">
                        <p className="text-[0.7rem] font-black uppercase tracking-widest text-orange-700">Catatan pengurus</p>
                        <p className="mt-1 text-sm font-medium leading-relaxed text-orange-900">{item.catatan_rt}</p>
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-slate-400 sm:gap-4">
                      <span className="flex items-center gap-1.5">
                        <Icon name="schedule" className="text-[16px]" />
                        {formatTgl(item.created_at)}
                      </span>
                      <a href={`https://wa.me/${item.no_hp.replace('+', '')}`} target="_blank" className="flex items-center gap-1.5 text-emerald-600 transition-colors hover:text-emerald-700">
                        <Icon name="chat" className="text-[16px]" />
                        Hubungi WA
                      </a>
                    </div>
                  </div>

                  <div className="w-full min-w-[220px] space-y-3 sm:w-auto">
                    <p className="ml-1 text-[0.65rem] font-black uppercase tracking-widest text-slate-400">Aksi Pengelola</p>
                    <div className="flex flex-col gap-2">
                      {item.status === 'menunggu' && (
                        <button
                          disabled={updating === item.id}
                          onClick={() => handleUpdateStatus(item.id, 'diproses')}
                          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-3 text-xs font-black text-white shadow-lg shadow-blue-200 transition-all hover:-translate-y-0.5 hover:bg-blue-700"
                        >
                          {updating === item.id ? 'Loading...' : <><Icon name="play_arrow" className="text-[18px]" /> Mulai Proses</>}
                        </button>
                      )}

                      {(item.status === 'menunggu' || item.status === 'diproses' || item.status === 'perlu_revisi') && (
                        <button
                          disabled={updating === item.id}
                          onClick={() => requestRevision(item)}
                          className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-orange-100 bg-white py-3 text-xs font-black text-orange-600 transition-all hover:bg-orange-50"
                        >
                          <Icon name="edit_document" className="text-[18px]" /> Minta Revisi
                        </button>
                      )}

                      {(item.status === 'diproses' || item.status === 'perlu_revisi') && (
                        <button
                          disabled={updating === item.id}
                          onClick={() => handleUpdateStatus(item.id, 'selesai')}
                          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3 text-xs font-black text-white shadow-lg shadow-emerald-200 transition-all hover:-translate-y-0.5 hover:bg-emerald-700"
                        >
                          {updating === item.id ? 'Loading...' : <><Icon name="check" className="text-[18px]" /> Tandai Selesai</>}
                        </button>
                      )}

                      {(item.status === 'menunggu' || item.status === 'diproses' || item.status === 'perlu_revisi') && (
                        <button
                          disabled={updating === item.id}
                          onClick={() => rejectSubmission(item)}
                          className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-rose-100 bg-white py-3 text-xs font-black text-rose-600 transition-all hover:bg-rose-50"
                        >
                          <Icon name="close" className="text-[18px]" /> Tolak Pengajuan
                        </button>
                      )}

                      {item.status === 'selesai' && (
                        <div className="rounded-2xl border border-emerald-100/50 bg-emerald-50 p-3 text-center text-[0.7rem] font-bold text-emerald-700">
                          Surat siap ditindaklanjuti warga
                        </div>
                      )}

                      {item.status === 'ditolak' && (
                        <div className="rounded-2xl border border-rose-100/50 bg-rose-50 p-3 text-center text-[0.7rem] font-bold text-rose-700">
                          Pengajuan ditolak. Warga perlu ajukan ulang bila diperlukan.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
