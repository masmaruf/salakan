import { collection, fields } from '@keystatic/core';

export const agenda = collection({
  label: 'Agenda',
  slugField: 'judul',
  path: 'src/content/agenda/*/',
  entryLayout: 'form',
  previewUrl: '/agenda/{slug}',
  columns: ['statusPublikasi', 'tanggal'],
  schema: {
    judul: fields.slug({
      name: {
        label: 'Judul agenda',
      },
    }),
    tanggal: fields.date({
      label: 'Tanggal agenda',
    }),
    statusPublikasi: fields.select({
      label: 'Status agenda',
      options: [
        { label: 'Publish / Tayang', value: 'publish' },
        { label: 'Draft / Belum tayang', value: 'draft' },
      ],
      defaultValue: 'publish',
      description: 'Status ini tampil jelas di daftar agenda admin dan menentukan apakah agenda muncul di website.',
    }),
    kontenUtama: fields.object(
      {
        waktuMulai: fields.text({
          label: 'Waktu mulai',
          description: 'Contoh: 08.00 WIB',
        }),
        waktuSelesai: fields.text({
          label: 'Waktu selesai',
          description: 'Contoh: 11.30 WIB',
        }),
        lokasi: fields.text({
          label: 'Lokasi kegiatan',
        }),
        ringkasan: fields.text({
          label: 'Ringkasan agenda',
          multiline: true,
        }),
        deskripsi: fields.text({
          label: 'Deskripsi lengkap',
          multiline: true,
        }),
        kontakPic: fields.text({
          label: 'Kontak / PIC',
        }),
      },
      {
        label: 'Konten utama',
      }
    ),
    media: fields.object(
      {
        gambarUtama: fields.image({
          label: 'Gambar agenda',
          directory: 'public/images/agenda',
          publicPath: '/images/agenda/',
        }),
        altGambarUtama: fields.text({
          label: 'Alt text gambar agenda',
        }),
      },
      {
        label: 'Media',
      }
    ),
    pengaturanTampil: fields.object(
      {
        unggulan: fields.checkbox({
          label: 'Agenda unggulan',
          defaultValue: false,
        }),
      },
      {
        label: 'Pengaturan tampil',
        layout: [12],
      }
    ),
  },
});
