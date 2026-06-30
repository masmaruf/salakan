import React, { useState } from 'react';
import { actions } from 'astro:actions';
import Icon from './ui/Icon.tsx';
import {
  KATEGORI_LOG_KEGIATAN,
  STATUS_PUBLIKASI_LOG,
  kategoriLogLabels,
  statusPublikasiLogLabels,
  formatTanggalLog,
  formatWaktuLog,
  type KategoriLogKegiatan,
  type LogKegiatanDukuhRecord,
  type StatusPublikasiLog,
} from '../lib/log-kegiatan';

interface Props {
  initialData: LogKegiatanDukuhRecord[];
}

type FormState = {
  judul: string;
  kategori: KategoriLogKegiatan;
  tanggal: string;
  waktu_mulai: string;
  waktu_selesai: string;
  lokasi: string;
  ringkasan: string;
  hasil_tindak_lanjut: string;
  pihak_terlibat: string;
  foto_dokumentasi: string;
  status_publikasi: StatusPublikasiLog;
  urutan_tampil: string;
};

const defaultFormState: FormState = {
  judul: '',
  kategori: 'pelayanan',
  tanggal: '',
  waktu_mulai: '',
  waktu_selesai: '',
  lokasi: '',
  ringkasan: '',
  hasil_tindak_lanjut: '',
  pihak_terlibat: '',
  foto_dokumentasi: '',
  status_publikasi: 'draft',
  urutan_tampil: '0',
};

function toFormState(item: LogKegiatanDukuhRecord): FormState {
  return {
    judul: item.judul,
    kategori: item.kategori,
    tanggal: item.tanggal,
    waktu_mulai: item.waktu_mulai ?? '',
    waktu_selesai: item.waktu_selesai ?? '',
    lokasi: item.lokasi ?? '',
    ringkasan: item.ringkasan,
    hasil_tindak_lanjut: item.hasil_tindak_lanjut ?? '',
    pihak_terlibat: item.pihak_terlibat ?? '',
    foto_dokumentasi: item.foto_dokumentasi ?? '',
    status_publikasi: item.status_publikasi,
    urutan_tampil: String(item.urutan_tampil ?? 0),
  };
}

function compareLogDesc(a: LogKegiatanDukuhRecord, b: LogKegiatanDukuhRecord) {
  const pinnedDiff = (b.urutan_tampil ?? 0) - (a.urutan_tampil ?? 0);
  if (pinnedDiff !== 0) return pinnedDiff;

  const dateDiff = new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime();
  if (dateDiff !== 0) return dateDiff;

  return new Date(String(b.created_at)).getTime() - new Date(String(a.created_at)).getTime();
}

function toStoredItem(item: LogKegiatanDukuhRecord, formState: FormState): LogKegiatanDukuhRecord {
  return {
    ...item,
    judul: formState.judul.trim(),
    kategori: formState.kategori,
    tanggal: formState.tanggal,
    waktu_mulai: formState.waktu_mulai.trim() || null,
    waktu_selesai: formState.waktu_selesai.trim() || null,
    lokasi: formState.lokasi.trim() || null,
    ringkasan: formState.ringkasan.trim(),
    hasil_tindak_lanjut: formState.hasil_tindak_lanjut.trim() || null,
    pihak_terlibat: formState.pihak_terlibat.trim() || null,
    foto_dokumentasi: formState.foto_dokumentasi.trim() || null,
    status_publikasi: formState.status_publikasi,
    urutan_tampil: Number(formState.urutan_tampil || 0),
    updated_at: new Date().toISOString(),
  };
}

export default function AdminLogKegiatanManager({ initialData }: Props) {
  const [data, setData] = useState([...initialData].sort(compareLogDesc));
  const [formState, setFormState] = useState<FormState>(defaultFormState);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState<'semua' | StatusPublikasiLog>('semua');
  const [filterKategori, setFilterKategori] = useState<'semua' | KategoriLogKegiatan>('semua');
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<number | null>(null);

  const filteredData = data.filter((item) => {
    if (filterStatus !== 'semua' && item.status_publikasi !== filterStatus) return false;
    if (filterKategori !== 'semua' && item.kategori !== filterKategori) return false;
    return true;
  });

  const counts = {
    total: data.length,
    draft: data.filter((item) => item.status_publikasi === 'draft').length,
    publish: data.filter((item) => item.status_publikasi === 'publish').length,
  };

  const resetForm = () => {
    setFormState(defaultFormState);
    setEditingId(null);
  };

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  const buildFormData = () => {
    const payload = new FormData();
    payload.append('judul', formState.judul);
    payload.append('kategori', formState.kategori);
    payload.append('tanggal', formState.tanggal);
    payload.append('waktu_mulai', formState.waktu_mulai);
    payload.append('waktu_selesai', formState.waktu_selesai);
    payload.append('lokasi', formState.lokasi);
    payload.append('ringkasan', formState.ringkasan);
    payload.append('hasil_tindak_lanjut', formState.hasil_tindak_lanjut);
    payload.append('pihak_terlibat', formState.pihak_terlibat);
    payload.append('foto_dokumentasi', formState.foto_dokumentasi);
    payload.append('status_publikasi', formState.status_publikasi);
    payload.append('urutan_tampil', formState.urutan_tampil || '0');
    return payload;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);

    try {
      const formData = buildFormData();

      if (editingId !== null) {
        formData.append('id', String(editingId));
        const { data: res, error } = await actions.logKegiatan.update(formData);
        if (!res?.success) {
          alert(error?.message || res?.message || 'Gagal memperbarui log kegiatan.');
          return;
        }

        setData((prev) =>
          prev
            .map((item) => (item.id === editingId ? toStoredItem(item, formState) : item))
            .sort(compareLogDesc),
        );
      } else {
        const { data: res, error } = await actions.logKegiatan.create(formData);
        if (!res?.success) {
          alert(error?.message || res?.message || 'Gagal menambahkan log kegiatan.');
          return;
        }

        window.location.reload();
      }

      resetForm();
    } catch {
      alert('Terjadi kesalahan koneksi saat menyimpan data.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item: LogKegiatanDukuhRecord) => {
    setEditingId(item.id);
    setFormState(toFormState(item));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateStatus = async (item: LogKegiatanDukuhRecord, nextStatus: StatusPublikasiLog) => {
    setBusyId(item.id);

    try {
      const formData = new FormData();
      formData.append('id', String(item.id));
      formData.append('status_publikasi', nextStatus);

      const { data: res, error } = await actions.logKegiatan.updateStatus(formData);
      if (!res?.success) {
        alert(error?.message || res?.message || 'Gagal mengubah status publikasi.');
        return;
      }

      setData((prev) =>
        prev
          .map((current) =>
            current.id === item.id
              ? { ...current, status_publikasi: nextStatus, updated_at: new Date().toISOString() }
              : current,
          )
          .sort(compareLogDesc),
      );
    } catch {
      alert('Terjadi kesalahan koneksi saat mengubah status.');
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (item: LogKegiatanDukuhRecord) => {
    const confirmed = window.confirm(`Hapus log "${item.judul}"? Tindakan ini tidak bisa dibatalkan.`);
    if (!confirmed) return;

    setBusyId(item.id);

    try {
      const formData = new FormData();
      formData.append('id', String(item.id));
      const { data: res, error } = await actions.logKegiatan.remove(formData);

      if (!res?.success) {
        alert(error?.message || res?.message || 'Gagal menghapus log kegiatan.');
        return;
      }

      setData((prev) => prev.filter((current) => current.id !== item.id));
      if (editingId === item.id) resetForm();
    } catch {
      alert('Terjadi kesalahan koneksi saat menghapus data.');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-white/50 bg-white/80 p-6 shadow-sm backdrop-blur-xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[0.7rem] font-black uppercase tracking-[0.18em] text-blue-600">Input Log Baru</p>
            <h2 className="mt-2 text-xl font-black tracking-tight text-slate-900">
              {editingId !== null ? 'Perbarui log kegiatan' : 'Catat kegiatan dukuh'}
            </h2>
          </div>
          {editingId !== null && (
            <button
              type="button"
              onClick={resetForm}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs font-black text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
            >
              <Icon name="close" className="text-[16px]" /> Batal Edit
            </button>
          )}
        </div>

        <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 lg:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm font-bold text-slate-700">Judul kegiatan</span>
              <input
                value={formState.judul}
                onChange={(event) => updateField('judul', event.target.value)}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                placeholder="Contoh: Pelayanan surat keterangan domisili"
                required
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-sm font-bold text-slate-700">Kategori</span>
                <select
                  value={formState.kategori}
                  onChange={(event) => updateField('kategori', event.target.value as KategoriLogKegiatan)}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                >
                  {KATEGORI_LOG_KEGIATAN.map((item) => (
                    <option key={item} value={item}>
                      {kategoriLogLabels[item]}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-bold text-slate-700">Status publikasi</span>
                <select
                  value={formState.status_publikasi}
                  onChange={(event) => updateField('status_publikasi', event.target.value as StatusPublikasiLog)}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                >
                  {STATUS_PUBLIKASI_LOG.map((item) => (
                    <option key={item} value={item}>
                      {statusPublikasiLogLabels[item]}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <label className="grid gap-2 md:col-span-2">
              <span className="text-sm font-bold text-slate-700">Tanggal</span>
              <input
                type="date"
                value={formState.tanggal}
                onChange={(event) => updateField('tanggal', event.target.value)}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                required
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-bold text-slate-700">Waktu mulai</span>
              <input
                type="time"
                value={formState.waktu_mulai}
                onChange={(event) => updateField('waktu_mulai', event.target.value)}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-bold text-slate-700">Waktu selesai</span>
              <input
                type="time"
                value={formState.waktu_selesai}
                onChange={(event) => updateField('waktu_selesai', event.target.value)}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
              />
            </label>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <label className="grid gap-2">
              <span className="text-sm font-bold text-slate-700">Lokasi</span>
              <input
                value={formState.lokasi}
                onChange={(event) => updateField('lokasi', event.target.value)}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                placeholder="Contoh: Balai Padukuhan Salakan"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-bold text-slate-700">Urutan tampil</span>
              <input
                type="number"
                min="0"
                value={formState.urutan_tampil}
                onChange={(event) => updateField('urutan_tampil', event.target.value)}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
              />
            </label>
          </div>

          <label className="grid gap-2">
            <span className="text-sm font-bold text-slate-700">Ringkasan kegiatan</span>
            <textarea
              value={formState.ringkasan}
              onChange={(event) => updateField('ringkasan', event.target.value)}
              className="min-h-[120px] rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
              placeholder="Tulis ringkasan singkat kegiatan, layanan, rapat, atau kehadiran undangan."
              required
            />
          </label>

          <div className="grid gap-4 lg:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm font-bold text-slate-700">Hasil / tindak lanjut</span>
              <textarea
                value={formState.hasil_tindak_lanjut}
                onChange={(event) => updateField('hasil_tindak_lanjut', event.target.value)}
                className="min-h-[110px] rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                placeholder="Opsional. Contoh: menunggu tanda tangan, dijadwalkan rapat lanjutan, dst."
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-bold text-slate-700">Pihak terlibat</span>
              <textarea
                value={formState.pihak_terlibat}
                onChange={(event) => updateField('pihak_terlibat', event.target.value)}
                className="min-h-[110px] rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                placeholder="Opsional. Contoh: Dukuh, Ketua RT 02, kader PKK."
              />
            </label>
          </div>

          <label className="grid gap-2">
            <span className="text-sm font-bold text-slate-700">Foto dokumentasi</span>
            <input
              value={formState.foto_dokumentasi}
              onChange={(event) => updateField('foto_dokumentasi', event.target.value)}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
              placeholder="/images/kegiatan/log-rapat-01.jpg atau https://..."
            />
          </label>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:bg-blue-700 disabled:cursor-wait disabled:opacity-70"
            >
              <Icon name="check" className="text-[18px]" />
              {saving ? 'Menyimpan...' : editingId !== null ? 'Simpan Perubahan' : 'Tambah Log Kegiatan'}
            </button>
            <p className="text-xs font-medium text-slate-500">
              Field wajib: judul, kategori, tanggal, ringkasan, dan status publikasi.
            </p>
          </div>
        </form>
      </section>

      <section className="rounded-[2rem] border border-white/50 bg-white/80 p-6 shadow-sm backdrop-blur-xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h3 className="text-xl font-black tracking-tight text-slate-900">Daftar log terbaru</h3>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-500">
              Arsip ini menampung catatan pelayanan, administrasi, rapat, hingga kehadiran undangan yang sudah dicatat dari panel admin.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="badge-blue border border-blue-100 bg-white">{counts.total} Total</span>
            <span className="rounded-full border border-amber-100 bg-white px-3 py-1 text-xs font-bold text-amber-600">{counts.draft} Draft</span>
            <span className="rounded-full border border-emerald-100 bg-white px-3 py-1 text-xs font-bold text-emerald-600">{counts.publish} Publish</span>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">Filter status</span>
            <select
              value={filterStatus}
              onChange={(event) => setFilterStatus(event.target.value as 'semua' | StatusPublikasiLog)}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
            >
              <option value="semua">Semua status</option>
              {STATUS_PUBLIKASI_LOG.map((item) => (
                <option key={item} value={item}>
                  {statusPublikasiLogLabels[item]}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">Filter kategori</span>
            <select
              value={filterKategori}
              onChange={(event) => setFilterKategori(event.target.value as 'semua' | KategoriLogKegiatan)}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
            >
              <option value="semua">Semua kategori</option>
              {KATEGORI_LOG_KEGIATAN.map((item) => (
                <option key={item} value={item}>
                  {kategoriLogLabels[item]}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-6 grid gap-4">
          {filteredData.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50/70 p-12 text-center text-sm font-medium text-slate-400">
              Belum ada log yang cocok dengan filter saat ini.
            </div>
          ) : (
            filteredData.map((item) => {
              const waktuLabel = formatWaktuLog(item.waktu_mulai, item.waktu_selesai);
              const isBusy = busyId === item.id;
              const isPublish = item.status_publikasi === 'publish';

              return (
                <article
                  key={item.id}
                  className="rounded-[1.75rem] border border-slate-100 bg-slate-50/70 p-5 shadow-sm transition hover:shadow-md"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-slate-900 px-3 py-1 text-[0.7rem] font-black uppercase tracking-[0.14em] text-white">
                          {kategoriLogLabels[item.kategori]}
                        </span>
                        <span
                          className={`rounded-full px-3 py-1 text-[0.7rem] font-black uppercase tracking-[0.14em] ${
                            isPublish ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {statusPublikasiLogLabels[item.status_publikasi]}
                        </span>
                        {item.urutan_tampil > 0 && (
                          <span className="rounded-full bg-blue-50 px-3 py-1 text-[0.7rem] font-black uppercase tracking-[0.14em] text-blue-700">
                            Pin {item.urutan_tampil}
                          </span>
                        )}
                      </div>

                      <h4 className="mt-3 text-lg font-black leading-tight text-slate-900">{item.judul}</h4>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.ringkasan}</p>

                      <div className="mt-4 grid gap-3 text-sm text-slate-500 md:grid-cols-2">
                        <div className="rounded-2xl border border-white/70 bg-white/90 p-3">
                          <p className="text-[0.7rem] font-black uppercase tracking-[0.14em] text-slate-400">Jadwal</p>
                          <p className="mt-1 font-semibold text-slate-700">{formatTanggalLog(item.tanggal)}</p>
                          {waktuLabel && <p className="mt-1 text-xs font-medium text-slate-500">{waktuLabel}</p>}
                        </div>

                        <div className="rounded-2xl border border-white/70 bg-white/90 p-3">
                          <p className="text-[0.7rem] font-black uppercase tracking-[0.14em] text-slate-400">Lokasi & pihak</p>
                          <p className="mt-1 font-semibold text-slate-700">{item.lokasi || 'Belum diisi'}</p>
                          {item.pihak_terlibat && <p className="mt-1 text-xs font-medium text-slate-500">{item.pihak_terlibat}</p>}
                        </div>
                      </div>

                      {item.hasil_tindak_lanjut && (
                        <div className="mt-3 rounded-2xl border border-blue-100 bg-blue-50/70 p-3">
                          <p className="text-[0.7rem] font-black uppercase tracking-[0.14em] text-blue-700">Tindak lanjut</p>
                          <p className="mt-1 text-sm leading-relaxed text-blue-950">{item.hasil_tindak_lanjut}</p>
                        </div>
                      )}

                      {item.foto_dokumentasi && (
                        <a
                          href={item.foto_dokumentasi}
                          target="_blank"
                          className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-blue-600 transition hover:text-blue-700"
                        >
                          <Icon name="photo_library" className="text-[18px]" />
                          Lihat foto dokumentasi
                        </a>
                      )}
                    </div>

                    <div className="w-full shrink-0 space-y-2 lg:w-[220px]">
                      <button
                        type="button"
                        onClick={() => handleEdit(item)}
                        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs font-black text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
                      >
                        <Icon name="edit_square" className="text-[16px]" /> Edit Entri
                      </button>

                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => handleUpdateStatus(item, isPublish ? 'draft' : 'publish')}
                        className={`flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-xs font-black text-white transition ${
                          isPublish ? 'bg-amber-500 hover:bg-amber-600' : 'bg-emerald-600 hover:bg-emerald-700'
                        }`}
                      >
                        <Icon name={isPublish ? 'draft' : 'verified'} className="text-[16px]" />
                        {isBusy ? 'Memproses...' : isPublish ? 'Jadikan Draft' : 'Publish Sekarang'}
                      </button>

                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => handleDelete(item)}
                        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-rose-100 bg-white px-4 py-3 text-xs font-black text-rose-600 transition hover:bg-rose-50"
                      >
                        <Icon name="close" className="text-[16px]" /> Hapus
                      </button>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}
