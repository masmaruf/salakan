import { collection, fields } from '@keystatic/core';

export const dokumenCollection = collection({
  label: 'Dokumen',
  slugField: 'judul',
  path: 'src/content/dokumen/*/',
  entryLayout: 'form',
  previewUrl: '/data/dokumen/{slug}',
  columns: ['tanggalUpdate'],
  schema: {
    judul: fields.slug({
      name: {
        label: 'Judul dokumen',
      },
    }),
    tanggalUpdate: fields.date({
      label: 'Tanggal pembaruan',
    }),
    kontenUtama: fields.object(
      {
        ringkasan: fields.text({
          label: 'Ringkasan',
          multiline: true,
        }),
        deskripsi: fields.text({
          label: 'Deskripsi lengkap',
          multiline: true,
        }),
      },
      {
        label: 'Konten utama',
      }
    ),
    media: fields.object(
      {
        fileDokumen: fields.file({
          label: 'File dokumen',
          directory: 'public/files/dokumen',
          publicPath: '/files/dokumen/',
        }),
      },
      {
        label: 'Media',
      }
    ),
    seo: fields.object(
      {
        seoTitle: fields.text({
          label: 'SEO title',
          description: 'Kosongkan untuk memakai judul dokumen secara otomatis.',
        }),
        seoDescription: fields.text({
          label: 'SEO description',
          multiline: true,
          description: 'Kosongkan untuk memakai ringkasan dokumen secara otomatis.',
        }),
        ogImage: fields.text({
          label: 'OG image path',
          description: 'Isi path gambar publik jika ingin override preview sosial, misalnya /images/og-dokumen.jpg.',
        }),
      },
      {
        label: 'SEO',
      }
    ),
    pengaturanTampil: fields.object(
      {
        kategori: fields.select({
          label: 'Kategori dokumen',
          options: [
            { label: 'Layanan warga', value: 'layanan' },
            { label: 'Arsip publik', value: 'arsip' },
            { label: 'Kegiatan', value: 'kegiatan' },
            { label: 'Regulasi', value: 'regulasi' },
          ],
          defaultValue: 'layanan',
        }),
        statusPublikasi: fields.select({
          label: 'Status tayang',
          options: [
            { label: 'Publish / Tayang', value: 'publish' },
            { label: 'Draft / Belum tayang', value: 'draft' },
          ],
          defaultValue: 'publish',
        }),
        unggulan: fields.checkbox({
          label: 'Dokumen unggulan',
          defaultValue: false,
        }),
        urutanTampil: fields.integer({
          label: 'Urutan tampil',
          validation: {
            min: 1,
            max: 999,
          },
        }),
      },
      {
        label: 'Pengaturan tampil',
        layout: [6, 6, 6, 6],
      }
    ),
  },
});
