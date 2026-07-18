import Icon from './ui/Icon.tsx';
import { useState } from 'react';
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

  const handleSubmit = async (e: { preventDefault(): void; currentTarget: HTMLFormElement }) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const nik = String(formData.get('nik') || '').replace(/\D/g, '');
    const whatsapp = String(formData.get('whatsapp') || '').replace(/\D/g, '').replace(/^0+/, '');

    if (nik.length !== 16) {
      setError('NIK harus berisi tepat 16 digit angka.');
      form.querySelector<HTMLInputElement>('input[name="nik"]')?.focus();
      return;
    }

    if (whatsapp.length < 9 || whatsapp.length > 15) {
      setError('Nomor WhatsApp harus berisi 9–15 digit setelah kode +62.');
      form.querySelector<HTMLInputElement>('input[name="whatsapp"]')?.focus();
      return;
    }

    formData.set('nik', nik);
    formData.set('whatsapp', whatsapp);
    setLoading(true);
    setError(null);
    
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

  const labelClass = "ml-1 text-xs font-black uppercase tracking-[0.14em] text-base-content/55";
  const fieldClass = "input input-bordered w-full rounded-2xl bg-base-100";
  const selectClass = "select select-bordered w-full rounded-2xl bg-base-100";
  const textareaClass = "textarea textarea-bordered w-full rounded-2xl bg-base-100";

  return (
    <div className="card mx-auto mb-10 max-w-2xl overflow-hidden border border-base-300/70 bg-base-100/90 shadow-sm backdrop-blur-xl">
      {/* Header */}
      <div className="sticky top-20 z-10 flex items-center gap-3 border-b border-base-300/70 bg-base-100/80 px-6 py-5 backdrop-blur-md sm:px-8">
         <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Icon name="edit_square" />
         </div>
         <div>
            <h3 className="text-xl font-black tracking-tight text-base-content">Formulir Pengajuan</h3>
            <p className="mt-0.5 text-sm font-medium text-base-content/60">Layanan Mandiri Warga Salakan</p>
         </div>
      </div>

      <div className="card-body p-6 sm:p-8">
        {success ? (
          <div className="space-y-6 py-8 text-center animate-in fade-in zoom-in duration-300">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-success/10 text-success shadow-inner">
              <Icon name="check_circle" className="text-6xl" />
            </div>
            <div className="space-y-2">
              <h4 className="text-2xl font-black text-base-content">Berhasil Terkirim!</h4>
              <p className="font-medium leading-relaxed text-base-content/65">{success.message}</p>
            </div>
            <div className="rounded-2xl border border-base-300 bg-base-200/70 p-5">
               <p className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-base-content/50">Nomor Pengajuan / Tiket</p>
               <strong className="font-mono text-2xl font-black tracking-tighter text-primary">{success.ticket}</strong>
            </div>
            <a 
              href="/dasbor"
              className="btn btn-primary w-full rounded-full"
            >
              Kembali ke Dasbor
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8" aria-describedby="form-privacy-note" noValidate>
            <ul className="steps steps-vertical w-full rounded-3xl bg-base-200/50 p-4 text-xs sm:steps-horizontal">
              <li className="step step-primary">Wilayah</li>
              <li className="step step-primary">Identitas</li>
              <li className="step step-primary">Kontak</li>
            </ul>

            {error && (
              <div className="alert alert-error border-error/20 bg-error/10 text-error">
                <Icon name="error" className="text-[18px]" />
                <span className="text-sm font-semibold">{error}</span>
              </div>
            )}

            {/* Bagian 1: Tujuan & Wilayah */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-primary">
                <Icon name="map" className="text-[20px]" />
                <h4 className="text-sm font-black uppercase tracking-widest">Wilayah & Tujuan</h4>
              </div>
              
              <div className="space-y-2">
                <label className={labelClass}>Pilih RT Domisili</label>
                <select name="rt_id" required disabled={loading} className={selectClass} defaultValue="">
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
                <label htmlFor="keperluan" className={labelClass}>Uraian Keperluan</label>
                <textarea 
                  id="keperluan"
                  name="keperluan" 
                  required 
                  disabled={loading}
                  placeholder="Jelaskan secara detail maksud pengajuan surat Anda..."
                  rows={3}
                  className={textareaClass}
                ></textarea>
              </div>
            </div>

            {/* Bagian 2: Identitas Diri */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-primary">
                <Icon name="person" className="text-[20px]" />
                <h4 className="text-sm font-black uppercase tracking-widest">Identitas Pemohon</h4>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="nama" className={labelClass}>Nama Lengkap</label>
                  <input id="nama" type="text" name="nama" required disabled={loading} autoComplete="name" placeholder="Sesuai KTP" className={fieldClass} />
                </div>
                <div className="space-y-2">
                  <label htmlFor="nik" className={labelClass}>NIK (16 Digit)</label>
                  <input id="nik" type="text" name="nik" required disabled={loading} inputMode="numeric" pattern="[0-9]{16}" minLength={16} maxLength={16} autoComplete="off" placeholder="3404XXXXXXXXXXXX" className={fieldClass} aria-describedby="nik-help" />
                  <p id="nik-help" className="text-[11px] font-medium text-base-content/45">Hanya angka, tepat 16 digit.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className={labelClass}>Jenis Kelamin</label>
                  <select name="jenis_kelamin" required disabled={loading} className={selectClass} defaultValue="">
                    <option value="" disabled>-- Pilih --</option>
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className={labelClass}>Agama</label>
                  <select name="agama" required disabled={loading} className={selectClass} defaultValue="">
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

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className={labelClass}>Tempat Lahir</label>
                  <input type="text" name="tempat_lahir" required disabled={loading} placeholder="Kota/Kabupaten" className={fieldClass} />
                </div>
                <div className="space-y-2">
                  <label className={labelClass}>Tanggal Lahir</label>
                  <input type="date" name="tanggal_lahir" required disabled={loading} className={fieldClass} />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className={labelClass}>Pekerjaan</label>
                  <input type="text" name="pekerjaan" required disabled={loading} placeholder="Contoh: Karyawan Swasta" className={fieldClass} />
                </div>
                <div className="space-y-2">
                  <label className={labelClass}>Status Perkawinan</label>
                  <select name="status_kawin" required disabled={loading} className={selectClass} defaultValue="">
                    <option value="" disabled>-- Pilih --</option>
                    <option value="Belum Kawin">Belum Kawin</option>
                    <option value="Kawin">Kawin</option>
                    <option value="Cerai Hidup">Cerai Hidup</option>
                    <option value="Cerai Mati">Cerai Mati</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="alamat" className={labelClass}>Alamat Domisili</label>
                <textarea 
                  id="alamat"
                  name="alamat" 
                  required 
                  disabled={loading}
                  placeholder="Alamat lengkap di wilayah Salakan..."
                  rows={2}
                  className={textareaClass}
                ></textarea>
              </div>
            </div>

            {/* Bagian 3: Kontak */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-primary">
                <Icon name="contact_phone" className="text-[20px]" />
                <h4 className="text-sm font-black uppercase tracking-widest">Kontak Notifikasi</h4>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="whatsapp" className={labelClass}>Nomor WhatsApp Aktif</label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-sm font-bold text-base-content/45">+62</span>
                  <input 
                    id="whatsapp"
                    type="tel" 
                    name="whatsapp" 
                    required 
                    disabled={loading}
                    inputMode="numeric"
                    pattern="[0-9]{9,15}"
                    minLength={9}
                    maxLength={15}
                    autoComplete="tel"
                    placeholder="812xxxxxxx"
                    className={`${fieldClass} pl-14`}
                    aria-describedby="whatsapp-help"
                  />
                </div>
                <p id="whatsapp-help" className="mt-2 ml-1 text-xs font-medium text-base-content/60">Tulis tanpa angka 0 di depan. Pastikan nomor aktif untuk menerima kabar update, revisi data, atau konfirmasi dari Ketua RT.</p>
              </div>
            </div>

            <div className="flex flex-col gap-4 pt-4">
              <button 
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full rounded-full gap-2"
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    <span>Memproses Data...</span>
                  </>
                ) : (
                  <>
                    <Icon name="send" /> <span>Kirim Pengajuan</span>
                  </>
                )}
              </button>
              <p id="form-privacy-note" className="text-center text-[0.65rem] font-bold uppercase tracking-widest text-base-content/45">
                Data Anda aman dan hanya digunakan untuk kepentingan administrasi Padukuhan.
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
