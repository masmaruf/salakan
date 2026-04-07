import { collection, fields } from '@keystatic/core';

export const kegiatan = collection({
  label: 'Berita & Kegiatan',
  slugField: 'judul',
  path: 'src/content/kegiatan/*/',
  entryLayout: 'content',
  previewUrl: '/berita/{slug}',
  format: {
    data: 'yaml',
    contentField: ['editorArtikel', 'kontenUtama', 'isi'],
  },
  columns: ['statusPublikasi', 'tanggal'],
  schema: {
    judul: fields.slug({
      name: {
        label: 'Judul',
      },
    }),
    tanggal: fields.date({
      label: 'Tanggal',
    }),
    statusPublikasi: fields.select({
      label: 'Status artikel',
      options: [
        { label: 'Publish / Tayang', value: 'publish' },
        { label: 'Draft / Belum tayang', value: 'draft' },
      ],
      defaultValue: 'publish',
      description: 'Status ini akan tampil lebih jelas di daftar entry admin dan dipakai untuk menentukan apakah artikel tampil di website.',
    }),
    editorArtikel: fields.object(
      {
        kontenUtama: fields.object(
          {
            ringkasan: fields.text({
              label: 'Ringkasan',
              multiline: true,
            }),
            isi: fields.mdx({
              label: 'Isi artikel',
              description:
                'Ruang tulis utama artikel. Gunakan editor rich text untuk menulis isi, heading, dan menyisipkan gambar di dalam artikel.',
              extension: 'md',
              options: {
                heading: [1, 2, 3, 4, 5, 6],
                bold: true,
                italic: true,
                strikethrough: true,
                code: true,
                blockquote: true,
                orderedList: true,
                unorderedList: true,
                table: true,
                link: true,
                divider: true,
                codeBlock: true,
                image: {
                  directory: 'public/images/kegiatan/artikel',
                  publicPath: '/images/kegiatan/artikel/',
                },
              },
            }),
          },
          {
            label: 'Konten utama',
          }
        ),
        sidebar: fields.object(
          {
            jenisKonten: fields.select({
              label: 'Jenis konten',
              options: [
                { label: 'Berita', value: 'berita' },
                { label: 'Artikel', value: 'artikel' },
              ],
              defaultValue: 'berita',
            }),
            kategori: fields.relationship({
              label: 'Kategori berita',
              collection: 'kategoriBerita',
              description: 'Pilih kategori dari daftar kategori berita yang sudah diatur di panel editorial.',
            }),
            penulis: fields.text({
              label: 'Penulis',
              description: 'Nama penulis atau pengelola konten.',
            }),
            unggulan: fields.checkbox({
              label: 'Konten unggulan',
              defaultValue: false,
            }),
            gambarUtama: fields.image({
              label: 'Gambar utama',
              directory: 'public/images/kegiatan',
              publicPath: '/images/kegiatan/',
            }),
            altGambarUtama: fields.text({
              label: 'Alt text gambar utama',
              description: 'Deskripsi singkat gambar utama untuk aksesibilitas.',
            }),
            tag: fields.array(fields.text({ label: 'Tag' }), {
              label: 'Tag artikel',
              itemLabel: (props) => props.value || 'Tag baru',
            }),
          },
          {
            label: 'Sidebar',
          }
        ),
        seo: fields.object(
          {
            seoTitle: fields.text({
              label: 'SEO title',
              description: 'Kosongkan untuk memakai judul artikel secara otomatis.',
            }),
            seoDescription: fields.text({
              label: 'SEO description',
              multiline: true,
              description: 'Kosongkan untuk memakai ringkasan artikel secara otomatis.',
            }),
            ogImage: fields.text({
              label: 'OG image path',
              description: 'Kosongkan untuk memakai gambar utama artikel secara otomatis.',
            }),
          },
          {
            label: 'SEO',
          }
        ),
      },
      {
        label: 'Pengaturan artikel',
        description:
          'Mode editor konten menempatkan isi artikel sebagai area utama, sementara ringkasan dan metadata tetap mudah diatur dari panel samping.',
      }
    ),
  },
});
