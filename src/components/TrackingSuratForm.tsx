import { useEffect, useState } from 'react';
import { actions } from 'astro:actions';
import Icon from './ui/Icon.tsx';
import { getPengajuanStatusMeta, getPublicTicketLabel } from '../lib/pengajuan';

type TrackingResult = {
  nomor_surat: string;
  nama: string;
  rt_id: string;
  status: string;
  keperluan: string;
  catatan_rt: string | null;
  created_at: string;
  updated_at: string;
};

interface Props {
  initialTicket?: string;
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

export default function TrackingSuratForm({ initialTicket = '' }: Props) {
  const [loading, setLoading] = useState(false);
  const [ticket, setTicket] = useState(initialTicket);
  const [nik, setNik] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TrackingResult | null>(null);

  useEffect(() => {
    setTicket(initialTicket);
  }, [initialTicket]);

  const handleSubmit = async (event: { preventDefault(): void }) => {
    event.preventDefault();
    const normalizedTicket = getPublicTicketLabel(ticket).trim();
    const normalizedNik = nik.replace(/\D/g, '');

    if (!normalizedTicket) {
      setResult(null);
      setError('Nomor tiket wajib diisi.');
      return;
    }

    if (normalizedNik.length !== 16) {
      setResult(null);
      setError('NIK pemohon harus berisi tepat 16 digit angka.');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('nomor_surat', normalizedTicket);
    formData.append('nik', normalizedNik);

    try {
      const { data, error: actionError } = await actions.layanan.lacakSurat(formData);
      if (actionError || !data?.success || !data.data) {
        setResult(null);
        setError(actionError?.message || data?.message || 'Status pengajuan tidak ditemukan.');
      } else {
        setResult(data.data);
      }
    } catch {
      setResult(null);
      setError('Gagal memeriksa status pengajuan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const statusMeta = result ? getPengajuanStatusMeta(result.status) : null;

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleSubmit}
        className="card border border-base-300/70 bg-base-100/90 shadow-sm backdrop-blur-xl"
        noValidate
      >
        <div className="card-body grid gap-4 p-5 sm:grid-cols-[1.4fr_1fr_auto] sm:items-end sm:p-6">
          <label className="grid gap-2">
            <span className="text-xs font-black uppercase tracking-widest text-base-content/55">Nomor tiket</span>
            <input
              type="text"
              value={ticket}
              onChange={(event) => setTicket(event.target.value.toUpperCase())}
              placeholder="001/RT-01/DkV/2026"
              className="input input-bordered w-full rounded-2xl bg-base-100"
              autoComplete="off"
              aria-describedby="tracking-help"
              required
            />
          </label>
          <label className="grid gap-2">
            <span className="text-xs font-black uppercase tracking-widest text-base-content/55">NIK pemohon</span>
            <input
              type="text"
              value={nik}
              onChange={(event) => setNik(event.target.value.replace(/\D/g, '').slice(0, 16))}
              placeholder="16 digit NIK"
              className="input input-bordered w-full rounded-2xl bg-base-100"
              inputMode="numeric"
              pattern="[0-9]{16}"
              minLength={16}
              maxLength={16}
              autoComplete="off"
              aria-describedby="tracking-help"
              required
            />
          </label>
          <button type="submit" disabled={loading} className="btn btn-primary h-[52px] rounded-full px-6">
            {loading ? <span className="loading loading-spinner loading-sm"></span> : <Icon name="travel_explore" className="text-[18px]" />}
            {loading ? 'Memeriksa...' : 'Cek Status'}
          </button>
        </div>
        <p id="tracking-help" className="px-5 pb-5 text-xs font-medium text-base-content/60 sm:px-6">
          Gunakan nomor tiket yang diterima setelah pengajuan dan NIK pemohon yang sama. NIK harus tepat 16 digit angka.
        </p>
      </form>

      {error && (
        <div className="alert alert-error border-error/20 bg-error/10 text-error">
          <Icon name="error" className="text-[18px]" />
          <span className="text-sm font-semibold">{error}</span>
        </div>
      )}

      {result && statusMeta && (
        <div className="card border border-base-300/70 bg-base-100/90 shadow-sm backdrop-blur-xl">
          <div className="card-body p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-2">
                <p className="text-xs font-black uppercase tracking-widest text-base-content/55">Status pengajuan</p>
                <h3 className="text-2xl font-black tracking-tight text-base-content">{result.nomor_surat}</h3>
                <p className="text-sm font-medium text-base-content/60">{result.nama} • {result.rt_id.toUpperCase()}</p>
              </div>
              <span className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${statusMeta.badgeClass}`}>
                <span className={`h-2.5 w-2.5 rounded-full ${statusMeta.dotClass}`}></span>
                {statusMeta.label}
              </span>
            </div>

            <div className="mt-5 grid gap-4 rounded-2xl bg-base-200/65 p-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-base-content/45">Keperluan</p>
                <p className="mt-1 text-sm font-medium leading-relaxed text-base-content/75">{result.keperluan}</p>
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-base-content/45">Keterangan status</p>
                <p className="mt-1 text-sm font-medium leading-relaxed text-base-content/75">{statusMeta.description}</p>
              </div>
            </div>

            <div className="mt-4 grid gap-3 text-sm text-base-content/65 sm:grid-cols-2">
              <div className="rounded-xl border border-base-300 bg-base-100 px-4 py-3">
                <p className="text-xs font-black uppercase tracking-widest text-base-content/45">Dibuat</p>
                <p className="mt-1 font-semibold">{formatDateTime(result.created_at)}</p>
              </div>
              <div className="rounded-xl border border-base-300 bg-base-100 px-4 py-3">
                <p className="text-xs font-black uppercase tracking-widest text-base-content/45">Update terakhir</p>
                <p className="mt-1 font-semibold">{formatDateTime(result.updated_at)}</p>
              </div>
            </div>

            {result.catatan_rt && (
              <div className="alert mt-4 border-warning/20 bg-warning/10 text-warning">
                <Icon name="info" className="text-[18px]" />
                <div>
                  <p className="text-xs font-black uppercase tracking-widest">Catatan pengurus</p>
                  <p className="mt-2 text-sm font-medium leading-relaxed text-base-content/75">{result.catatan_rt}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
