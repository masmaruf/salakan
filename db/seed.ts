import { db, LogKegiatanDukuh } from 'astro:db';

export default async function seed() {
  await db.insert(LogKegiatanDukuh).values([
    {
      id: 1,
      judul: 'Pelayanan surat keterangan domisili warga RT 01',
      kategori: 'pelayanan',
      tanggal: '2026-06-28',
      waktu_mulai: '08:30',
      waktu_selesai: '10:00',
      lokasi: 'Rumah Dukuh Salakan',
      ringkasan:
        'Pelayanan administrasi untuk verifikasi data dan penerbitan surat keterangan domisili bagi warga yang membutuhkan pengurusan sekolah dan pekerjaan.',
      hasil_tindak_lanjut:
        'Berkas lengkap dan diteruskan untuk proses penandatanganan akhir pada hari yang sama.',
      pihak_terlibat: 'Dukuh Salakan, Ketua RT 01, warga pemohon',
      status_publikasi: 'publish',
      urutan_tampil: 3,
      created_at: new Date('2026-06-28T10:00:00+07:00'),
      updated_at: new Date('2026-06-28T10:00:00+07:00'),
    },
    {
      id: 2,
      judul: 'Rekap administrasi data bantuan warga semester pertama',
      kategori: 'administrasi',
      tanggal: '2026-06-24',
      waktu_mulai: '13:00',
      waktu_selesai: '15:15',
      lokasi: 'Balai Padukuhan Salakan',
      ringkasan:
        'Penyusunan ulang data dasar warga penerima bantuan untuk memastikan kesesuaian alamat, anggota keluarga, dan status dokumen pendukung.',
      hasil_tindak_lanjut:
        'Perlu konfirmasi tambahan dari dua RT sebelum data final dikirim ke kelurahan.',
      pihak_terlibat: 'Dukuh Salakan, perwakilan RT 01-03',
      status_publikasi: 'publish',
      urutan_tampil: 2,
      created_at: new Date('2026-06-24T15:15:00+07:00'),
      updated_at: new Date('2026-06-24T15:15:00+07:00'),
    },
    {
      id: 3,
      judul: 'Rapat koordinasi persiapan kerja bakti lingkungan',
      kategori: 'rapat',
      tanggal: '2026-06-20',
      waktu_mulai: '19:30',
      waktu_selesai: '21:00',
      lokasi: 'Pos ronda Salakan',
      ringkasan:
        'Rapat malam untuk membagi area kerja bakti, menyiapkan kebutuhan alat, serta menyepakati jadwal pelaksanaan antar-RT.',
      hasil_tindak_lanjut:
        'Pembagian sektor kerja disepakati dan pengumuman lanjutan akan diteruskan melalui grup warga.',
      pihak_terlibat: 'Dukuh Salakan, Ketua RT, Jaga Warga, pemuda',
      status_publikasi: 'publish',
      urutan_tampil: 1,
      created_at: new Date('2026-06-20T21:00:00+07:00'),
      updated_at: new Date('2026-06-20T21:00:00+07:00'),
    },
    {
      id: 4,
      judul: 'Menghadiri undangan musyawarah kelurahan',
      kategori: 'undangan',
      tanggal: '2026-06-17',
      waktu_mulai: '09:00',
      waktu_selesai: '11:30',
      lokasi: 'Aula Kelurahan',
      ringkasan:
        'Kehadiran dukuh dalam musyawarah undangan kelurahan terkait sinkronisasi agenda wilayah dan tindak lanjut usulan warga.',
      hasil_tindak_lanjut:
        'Catatan hasil musyawarah masih dirangkum sebelum dipublikasikan kepada warga.',
      pihak_terlibat: 'Dukuh Salakan, perangkat kelurahan, perwakilan wilayah',
      status_publikasi: 'draft',
      urutan_tampil: 0,
      created_at: new Date('2026-06-17T11:30:00+07:00'),
      updated_at: new Date('2026-06-17T11:30:00+07:00'),
    },
    {
      id: 5,
      judul: 'Monitoring tindak lanjut aduan lampu jalan padam',
      kategori: 'lainnya',
      tanggal: '2026-06-12',
      waktu_mulai: '20:00',
      waktu_selesai: '20:45',
      lokasi: 'Jalan utama Padukuhan Salakan',
      ringkasan:
        'Pengecekan lapangan atas laporan warga mengenai lampu jalan padam pada akses utama yang cukup sering dilalui pada malam hari.',
      hasil_tindak_lanjut:
        'Titik lampu yang bermasalah sudah dicatat dan diajukan untuk penanganan teknis lanjutan.',
      pihak_terlibat: 'Dukuh Salakan, warga pelapor, perwakilan linmas',
      status_publikasi: 'draft',
      urutan_tampil: 0,
      created_at: new Date('2026-06-12T20:45:00+07:00'),
      updated_at: new Date('2026-06-12T20:45:00+07:00'),
    },
  ]);
}
