import { collection, config, fields, singleton } from '@keystatic/core';

const keystaticConfig = config({
  storage: {
    kind: 'local',
  },
  ui: {
    brand: {
      name: 'Padukuhan Salakan',
    },
    navigation: {
      Beranda: ['beranda'],
      Editorial: ['pengumuman', 'kegiatan', 'agenda', 'kategoriBerita', 'galeri'],
      'Data Kampung': ['monografi', 'dokumen', 'umkm', 'strukturOrganisasi', 'layananWarga', 'faq'],
      'Profil & Situs': ['profil', 'pengaturan', 'akunAdmin'],
      'E-Surat': ['rt'],
      Referensi: ['laboratoriumFieldApi'],
    },
  },
  collections: {
    pengumuman: collection({
      label: 'Pengumuman',
      slugField: 'judul',
      path: 'src/content/pengumuman/*/',
      entryLayout: 'form',
      columns: ['tanggal', 'ringkasan'],
      schema: {
        judul: fields.slug({
          name: {
            label: 'Judul',
          },
        }),
        tanggal: fields.date({
          label: 'Tanggal',
        }),
        ringkasan: fields.text({
          label: 'Ringkasan',
          multiline: true,
        }),
        isi: fields.text({
          label: 'Isi pengumuman',
          multiline: true,
        }),
        pengaturanTampil: fields.object(
          {
            statusPublikasi: fields.select({
              label: 'Status tayang',
              options: [
                { label: 'Publish / Tayang', value: 'publish' },
                { label: 'Draft / Belum tayang', value: 'draft' },
              ],
              defaultValue: 'publish',
            }),
            unggulan: fields.checkbox({
              label: 'Tandai sebagai pengumuman unggulan',
              defaultValue: false,
            }),
          },
          {
            label: 'Pengaturan tampil',
            layout: [6, 6],
          }
        ),
      },
    }),
    dokumen: collection({
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
    }),
    kegiatan: collection({
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
    }),
    agenda: collection({
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
    }),
    umkm: collection({
      label: 'UMKM',
      slugField: 'namaUsaha',
      path: 'src/content/umkm/*/',
      entryLayout: 'form',
      previewUrl: '/data/umkm/{slug}',
      columns: [],
      schema: {
        namaUsaha: fields.slug({
          name: {
            label: 'Nama usaha',
          },
        }),
        kontenUtama: fields.object(
          {
            pemilik: fields.text({
              label: 'Nama pemilik',
            }),
            ringkasan: fields.text({
              label: 'Ringkasan usaha',
              multiline: true,
            }),
            deskripsi: fields.text({
              label: 'Deskripsi lengkap',
              multiline: true,
            }),
            whatsapp: fields.text({
              label: 'Nomor WhatsApp',
              description: 'Gunakan format nomor Indonesia, misalnya 62812xxxxxxx.',
            }),
            lokasi: fields.text({
              label: 'Lokasi usaha',
            }),
            produkUnggulan: fields.array(fields.text({ label: 'Produk' }), {
              label: 'Produk unggulan',
              itemLabel: (props) => props.value || 'Produk baru',
            }),
          },
          {
            label: 'Konten utama',
          }
        ),
        media: fields.object(
          {
            gambar: fields.image({
              label: 'Foto produk utama',
              directory: 'public/images/umkm',
              publicPath: '/images/umkm/',
            }),
            altGambar: fields.text({
              label: 'Alt text foto produk',
              description: 'Deskripsi singkat foto untuk aksesibilitas.',
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
              description: 'Kosongkan untuk memakai nama usaha secara otomatis.',
            }),
            seoDescription: fields.text({
              label: 'SEO description',
              multiline: true,
              description: 'Kosongkan untuk memakai ringkasan UMKM secara otomatis.',
            }),
            ogImage: fields.text({
              label: 'OG image path',
              description: 'Kosongkan untuk memakai foto produk utama secara otomatis.',
            }),
          },
          {
            label: 'SEO',
          }
        ),
        pengaturanTampil: fields.object(
          {
            kategori: fields.select({
              label: 'Kategori usaha',
              options: [
                { label: 'Kuliner', value: 'kuliner' },
                { label: 'Kerajinan', value: 'kerajinan' },
                { label: 'Jasa', value: 'jasa' },
                { label: 'Perdagangan', value: 'perdagangan' },
              ],
              defaultValue: 'kuliner',
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
              label: 'UMKM unggulan',
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
    }),
    galeri: collection({
      label: 'Galeri',
      slugField: 'judul',
      path: 'src/content/galeri/*/',
      entryLayout: 'form',
      columns: ['tanggal', 'caption'],
      schema: {
        judul: fields.slug({
          name: {
            label: 'Judul',
          },
        }),
        tanggal: fields.date({
          label: 'Tanggal',
        }),
        gambar: fields.image({
          label: 'Foto',
          directory: 'public/images/galeri',
          publicPath: '/images/galeri/',
        }),
        caption: fields.text({
          label: 'Caption',
          multiline: true,
        }),
      },
    }),
    kategoriBerita: collection({
      label: 'Kategori Berita',
      slugField: 'namaKategori',
      path: 'src/content/kategori-berita/*/',
      entryLayout: 'form',
      columns: ['labelTampil'],
      schema: {
        namaKategori: fields.slug({
          name: {
            label: 'Slug kategori',
          },
        }),
        labelTampil: fields.text({
          label: 'Label tampil',
          description: 'Nama kategori yang tampil di website, misalnya Kegiatan Warga atau Pelayanan.',
        }),
        deskripsi: fields.text({
          label: 'Deskripsi singkat',
          multiline: true,
        }),
        pengaturanTampil: fields.object(
          {
            status: fields.select({
              label: 'Status tampil',
              options: [
                { label: 'Tampilkan', value: 'tampil' },
                { label: 'Sembunyikan', value: 'sembunyi' },
              ],
              defaultValue: 'tampil',
            }),
            urutanTampil: fields.integer({
              label: 'Urutan tampil',
              validation: {
                min: 1,
                max: 99,
              },
            }),
          },
          {
            label: 'Pengaturan tampil',
            layout: [6, 6],
          }
        ),
      },
    }),
    strukturOrganisasi: collection({
      label: 'Struktur Organisasi',
      slugField: 'jabatan',
      path: 'src/content/struktur-organisasi/*/',
      entryLayout: 'form',
      columns: [],
      schema: {
        jabatan: fields.slug({
          name: {
            label: 'Nama jabatan',
          },
        }),
        kontenUtama: fields.object(
          {
            namaPejabat: fields.text({
              label: 'Nama pejabat / penanggung jawab',
            }),
            deskripsiTugas: fields.text({
              label: 'Deskripsi tugas',
              multiline: true,
            }),
            kontak: fields.text({
              label: 'Kontak',
            }),
          },
          {
            label: 'Konten utama',
          }
        ),
        pengaturanTampil: fields.object(
          {
            bidang: fields.select({
              label: 'Kelompok organisasi',
              options: [
                { label: 'Pimpinan padukuhan', value: 'pimpinan' },
                { label: 'Koordinator kegiatan warga', value: 'kegiatan' },
                { label: 'Penghubung wilayah', value: 'wilayah' },
              ],
              defaultValue: 'pimpinan',
            }),
            statusPublikasi: fields.select({
              label: 'Status tayang',
              options: [
                { label: 'Publish / Tayang', value: 'publish' },
                { label: 'Draft / Belum tayang', value: 'draft' },
              ],
              defaultValue: 'publish',
            }),
            urutanTampil: fields.integer({
              label: 'Urutan tampil',
              validation: {
                min: 1,
                max: 99,
              },
            }),
          },
          {
            label: 'Pengaturan tampil',
            layout: [6, 6, 12],
          }
        ),
      },
    }),
    layananWarga: collection({
      label: 'Layanan Warga',
      slugField: 'namaLayanan',
      path: 'src/content/layanan-warga/*/',
      entryLayout: 'form',
      columns: ['jamLayanan', 'statusTampil'],
      schema: {
        namaLayanan: fields.slug({
          name: {
            label: 'Nama layanan',
          },
        }),
        ringkasan: fields.text({
          label: 'Ringkasan',
          multiline: true,
        }),
        syarat: fields.array(fields.text({ label: 'Syarat' }), {
          label: 'Syarat',
          itemLabel: (props) => props.value || 'Syarat baru',
        }),
        langkah: fields.array(fields.text({ label: 'Langkah' }), {
          label: 'Langkah',
          itemLabel: (props) => props.value || 'Langkah baru',
        }),
        kontak: fields.text({
          label: 'Kontak',
        }),
        jamLayanan: fields.text({
          label: 'Jam layanan',
        }),
        statusTampil: fields.select({
          label: 'Status tampil',
          options: [
            { label: 'Tampilkan', value: 'tampil' },
            { label: 'Sembunyikan', value: 'sembunyi' },
          ],
          defaultValue: 'tampil',
        }),
      },
    }),
    faq: collection({
      label: 'FAQ',
      slugField: 'pertanyaan',
      path: 'src/content/faq/*/',
      entryLayout: 'form',
      columns: ['kategori', 'urutan', 'statusTampil'],
      schema: {
        pertanyaan: fields.slug({
          name: {
            label: 'Pertanyaan',
          },
        }),
        jawaban: fields.text({
          label: 'Jawaban',
          multiline: true,
        }),
        kategori: fields.text({
          label: 'Kategori',
        }),
        urutan: fields.integer({
          label: 'Urutan',
          validation: {
            min: 1,
            max: 999,
          },
        }),
        statusTampil: fields.select({
          label: 'Status tampil',
          options: [
            { label: 'Tampilkan', value: 'tampil' },
            { label: 'Sembunyikan', value: 'sembunyi' },
          ],
          defaultValue: 'tampil',
        }),
      },
    }),
    rt: collection({
      label: 'Daftar RT',
      path: 'src/content/rt/*',
      format: { data: 'json' },
      slugField: 'rt_id',
      schema: {
        rt_id: fields.slug({
          name: {
            label: 'ID RT',
            description: 'contoh: rt-01, rt-02 — dipakai sebagai slug & kode nomor surat',
          },
        }),
        nomor_rt: fields.text({
          label: 'Nomor RT',
          description: 'contoh: 01, 02, 05',
        }),
        nama_ketua: fields.text({
          label: 'Nama Ketua RT',
          description: 'Nama lengkap ketua RT aktif',
        }),
        no_hp_ketua: fields.text({
          label: 'No. HP/WA Ketua RT',
          description: 'Untuk notifikasi pengajuan masuk',
        }),
        aktif: fields.checkbox({
          label: 'RT Aktif',
          description: 'Centang jika RT ini menerima pengajuan',
          defaultValue: true,
        }),
        catatan: fields.text({
          label: 'Catatan',
          multiline: true,
          description: 'Opsional — misal jam layanan, lokasi sekretariat',
        }),
      },
    }),
  },
  singletons: {
    profil: singleton({
      label: 'Profil Padukuhan',
      path: 'src/content/singletons/profil/',
      entryLayout: 'form',
      schema: {
        namaPadukuhan: fields.text({
          label: 'Nama padukuhan',
        }),
        tagline: fields.text({
          label: 'Tagline',
          multiline: true,
        }),
        hero: fields.object(
          {
            gambar: fields.image({
              label: 'Gambar hero',
              directory: 'public/images/profil',
              publicPath: '/images/profil/',
              description: 'Foto latar hero profil (landscape, min 1200px lebar).',
            }),
            judul: fields.text({
              label: 'Judul overlay hero',
              description: 'Contoh: Salakan: Harmoni Tradisi & Digital',
            }),
            badge: fields.text({
              label: 'Badge hero',
              description: 'Chip kecil di atas judul hero, contoh: Warisan Budaya',
            }),
          },
          { label: 'Hero Profil' }
        ),
        sejarahLabel: fields.text({
          label: 'Label section sejarah',
          description: 'Teks kecil di atas judul sejarah, contoh: Kisah Kami',
        }),
        sejarahJudul: fields.text({
          label: 'Judul section sejarah',
          description: 'Contoh: Sejarah & Filosofi',
        }),
        sejarahSingkat: fields.text({
          label: 'Isi sejarah',
          multiline: true,
        }),
        visi: fields.text({
          label: 'Visi',
          multiline: true,
        }),
        misi: fields.array(fields.text({ label: 'Poin misi' }), {
          label: 'Misi',
          itemLabel: (props) => props.value || 'Poin misi',
        }),
        potensiDesa: fields.array(
          fields.object({
            ikon: fields.text({
              label: 'Nama ikon Material',
              description: 'Contoh: agriculture, self_improvement, palette',
            }),
            judul: fields.text({ label: 'Judul potensi' }),
            deskripsi: fields.text({ label: 'Deskripsi', multiline: true }),
          }),
          {
            label: 'Potensi Desa',
            itemLabel: (props) => props.fields.judul.value || 'Potensi baru',
          }
        ),
        lokasi: fields.object(
          {
            gambarPeta: fields.image({
              label: 'Gambar peta / foto lokasi',
              directory: 'public/images/profil',
              publicPath: '/images/profil/',
            }),
            alamat: fields.text({
              label: 'Alamat lengkap',
              multiline: true,
            }),
            linkPeta: fields.url({
              label: 'Link Google Maps',
            }),
          },
          { label: 'Lokasi & Peta' }
        ),
        dataWilayah: fields.array(
          fields.object({
            label: fields.text({ label: 'Label data' }),
            value: fields.text({ label: 'Nilai' }),
          }),
          {
            label: 'Data wilayah',
            itemLabel: (props) => props.fields.label.value || 'Data wilayah',
          }
        ),
      },
    }),
    pengaturan: singleton({
      label: 'Pengaturan Situs',
      path: 'src/content/singletons/pengaturan/',
      entryLayout: 'form',
      schema: {
        alamat: fields.text({
          label: 'Alamat',
          multiline: true,
        }),
        kontakWhatsApp: fields.text({
          label: 'Nomor WhatsApp',
        }),
        email: fields.text({
          label: 'Email',
        }),
        jamLayanan: fields.text({
          label: 'Jam layanan',
        }),
        linkPeta: fields.url({
          label: 'Link embed peta',
        }),
        sambutanBeranda: fields.text({
          label: 'Sambutan beranda',
          multiline: true,
        }),
        seoHalamanData: fields.object({
          dataUtama: fields.object({
            seoTitle: fields.text({ label: 'SEO title halaman Data' }),
            seoDescription: fields.text({
              label: 'SEO description halaman Data',
              multiline: true,
            }),
            ogImage: fields.text({
              label: 'OG image halaman Data',
            }),
          }),
          pengumuman: fields.object({
            seoTitle: fields.text({ label: 'SEO title halaman Pengumuman' }),
            seoDescription: fields.text({
              label: 'SEO description halaman Pengumuman',
              multiline: true,
            }),
            ogImage: fields.text({
              label: 'OG image halaman Pengumuman',
            }),
          }),
          dokumen: fields.object({
            seoTitle: fields.text({ label: 'SEO title halaman Dokumen' }),
            seoDescription: fields.text({
              label: 'SEO description halaman Dokumen',
              multiline: true,
            }),
            ogImage: fields.text({
              label: 'OG image halaman Dokumen',
            }),
          }),
          umkm: fields.object({
            seoTitle: fields.text({ label: 'SEO title halaman UMKM' }),
            seoDescription: fields.text({
              label: 'SEO description halaman UMKM',
              multiline: true,
            }),
            ogImage: fields.text({
              label: 'OG image halaman UMKM',
            }),
          }),
          strukturOrganisasi: fields.object({
            seoTitle: fields.text({ label: 'SEO title halaman Struktur Organisasi' }),
            seoDescription: fields.text({
              label: 'SEO description halaman Struktur Organisasi',
              multiline: true,
            }),
            ogImage: fields.text({
              label: 'OG image halaman Struktur Organisasi',
            }),
          }),
          agenda: fields.object({
            seoTitle: fields.text({ label: 'SEO title halaman Agenda' }),
            seoDescription: fields.text({
              label: 'SEO description halaman Agenda',
              multiline: true,
            }),
            ogImage: fields.text({
              label: 'OG image halaman Agenda',
            }),
          }),
          layananWarga: fields.object({
            seoTitle: fields.text({ label: 'SEO title halaman Layanan Warga' }),
            seoDescription: fields.text({
              label: 'SEO description halaman Layanan Warga',
              multiline: true,
            }),
            ogImage: fields.text({
              label: 'OG image halaman Layanan Warga',
            }),
          }),
          faq: fields.object({
            seoTitle: fields.text({ label: 'SEO title halaman FAQ' }),
            seoDescription: fields.text({
              label: 'SEO description halaman FAQ',
              multiline: true,
            }),
            ogImage: fields.text({
              label: 'OG image halaman FAQ',
            }),
          }),
          monografi: fields.object({
            seoTitle: fields.text({ label: 'SEO title halaman Monografi' }),
            seoDescription: fields.text({
              label: 'SEO description halaman Monografi',
              multiline: true,
            }),
            ogImage: fields.text({
              label: 'OG image halaman Monografi',
            }),
          }),
        }),
        menuData: fields.object({
          title: fields.text({
            label: 'Judul halaman Data',
          }),
          description: fields.text({
            label: 'Deskripsi halaman Data',
            multiline: true,
          }),
          items: fields.array(
            fields.object({
              label: fields.text({ label: 'Nama menu' }),
              href: fields.text({ label: 'Link menu' }),
              description: fields.text({
                label: 'Deskripsi singkat',
                multiline: true,
              }),
              icon: fields.text({
                label: 'Nama ikon',
                description: 'Gunakan salah satu: campaign, newspaper, grid_view, description, storefront, account_tree, event, contact_support.',
              }),
              status: fields.select({
                label: 'Status tampil',
                options: [
                  { label: 'Tampilkan', value: 'tampil' },
                  { label: 'Sembunyikan', value: 'sembunyi' },
                ],
                defaultValue: 'tampil',
              }),
            }),
            {
              label: 'Sub menu Data',
              itemLabel: (props) => props.fields.label.value || 'Sub menu',
            }
          ),
        }),
      },
    }),
    akunAdmin: singleton({
      label: 'Akun Admin',
      path: 'src/content/singletons/akun-admin/',
      entryLayout: 'form',
      schema: {
        gunakanPengaturanKeystatic: fields.checkbox({
          label: 'Gunakan akun dari Keystatic',
          description: 'Jika aktif, login admin akan membaca daftar akun di bawah ini. Jika nonaktif, sistem fallback ke environment variable.',
          defaultValue: false,
        }),
        catatan: fields.text({
          label: 'Catatan admin',
          multiline: true,
          description: 'Catatan singkat untuk pengelola akun. Misalnya: hanya superadmin yang boleh mengubah password.',
        }),
        users: fields.array(
          fields.object({
            username: fields.text({
              label: 'Username',
            }),
            password: fields.text({
              label: 'Password',
              description: 'Gunakan password yang kuat. Perubahan di sini akan memengaruhi login admin jika mode Keystatic aktif.',
            }),
            role: fields.select({
              label: 'Role',
              options: [
                { label: 'Super Admin', value: 'superadmin' },
                { label: 'Admin', value: 'admin' },
                { label: 'Editor', value: 'editor' },
              ],
              defaultValue: 'editor',
            }),
            status: fields.select({
              label: 'Status akun',
              options: [
                { label: 'Aktif', value: 'aktif' },
                { label: 'Nonaktif', value: 'nonaktif' },
              ],
              defaultValue: 'aktif',
            }),
          }),
          {
            label: 'Daftar akun admin',
            itemLabel: (props) => props.fields.username.value || 'Akun admin',
          }
        ),
      },
    }),
    beranda: singleton({
      label: 'Konten Beranda',
      path: 'src/content/singletons/beranda/',
      entryLayout: 'form',
      schema: {
        hero: fields.object({
          eyebrow: fields.text({
            label: 'Label kecil hero',
          }),
          title: fields.text({
            label: 'Judul hero',
          }),
          intro: fields.text({
            label: 'Deskripsi hero',
            multiline: true,
          }),
          primaryCtaLabel: fields.text({
            label: 'Label tombol utama hero',
          }),
          primaryCtaHref: fields.text({
            label: 'Link tombol utama hero',
          }),
          secondaryCtaLabel: fields.text({
            label: 'Label tombol kedua hero',
          }),
          secondaryCtaHref: fields.text({
            label: 'Link tombol kedua hero',
          }),
          panelLabel: fields.text({
            label: 'Label panel hero',
          }),
          panelTitle: fields.text({
            label: 'Judul panel hero',
          }),
          panelNote: fields.text({
            label: 'Catatan panel hero',
            multiline: true,
          }),
          panelLinks: fields.array(
            fields.object({
              title: fields.text({ label: 'Judul tautan' }),
              description: fields.text({
                label: 'Deskripsi singkat',
                multiline: true,
              }),
              href: fields.text({ label: 'Link tujuan' }),
              icon: fields.text({
                label: 'Nama ikon',
                description: 'Gunakan salah satu: campaign, newspaper, grid_view, description, storefront, account_tree, event, contact_support.',
              }),
              status: fields.select({
                label: 'Status tampil',
                options: [
                  { label: 'Tampilkan', value: 'tampil' },
                  { label: 'Sembunyikan', value: 'sembunyi' },
                ],
                defaultValue: 'tampil',
              }),
            }),
            {
              label: 'Tautan panel hero',
              itemLabel: (props) => props.fields.title.value || 'Tautan hero',
            }
          ),
          stats: fields.object({
            pengumumanLabel: fields.text({
              label: 'Label statistik pengumuman',
            }),
            kegiatanLabel: fields.text({
              label: 'Label statistik berita',
            }),
            galeriLabel: fields.text({
              label: 'Label statistik galeri',
            }),
          }),
        }),
        pengumuman: fields.object({
          title: fields.text({
            label: 'Judul section pengumuman',
          }),
          description: fields.text({
            label: 'Deskripsi section pengumuman',
            multiline: true,
          }),
          ctaLabel: fields.text({
            label: 'Label tombol pengumuman utama',
          }),
        }),
        berita: fields.object({
          title: fields.text({
            label: 'Judul section berita',
          }),
          description: fields.text({
            label: 'Deskripsi section berita',
            multiline: true,
          }),
          ctaLabel: fields.text({
            label: 'Label tombol section berita',
          }),
        }),
        galeri: fields.object({
          title: fields.text({
            label: 'Judul section galeri',
          }),
          description: fields.text({
            label: 'Deskripsi section galeri',
            multiline: true,
          }),
          ctaLabel: fields.text({
            label: 'Label tombol galeri',
          }),
        }),
        penutup: fields.object({
          eyebrow: fields.text({
            label: 'Label kecil CTA penutup',
          }),
          title: fields.text({
            label: 'Judul CTA penutup',
          }),
          description: fields.text({
            label: 'Deskripsi CTA penutup',
            multiline: true,
          }),
          primaryCtaLabel: fields.text({
            label: 'Label tombol utama penutup',
          }),
          primaryCtaHref: fields.text({
            label: 'Link tombol utama penutup',
          }),
          secondaryCtaLabel: fields.text({
            label: 'Label tombol kedua penutup',
          }),
          secondaryCtaHref: fields.text({
            label: 'Link tombol kedua penutup',
          }),
        }),
      },
    }),
    monografi: singleton({
      label: 'Data Monografi',
      path: 'src/content/singletons/monografi/',
      entryLayout: 'form',
      schema: {
        identitasDukuh: fields.object(
          {
            namaDukuh: fields.text({ label: 'Nama Dukuh' }),
            pendidikan: fields.text({ label: 'Pendidikan Terakhir' }),
            alamat: fields.text({ label: 'Alamat Dukuh', multiline: true }),
          },
          { label: 'Identitas Dukuh' }
        ),
        demografi: fields.object(
          {
            luasWilayah: fields.text({ label: 'Luas Wilayah', description: 'Contoh: 12.5 Ha' }),
            jumlahRT: fields.integer({ label: 'Jumlah RT', defaultValue: 3 }),
            totalJiwa: fields.integer({ label: 'Total Jiwa' }),
            totalLakiLaki: fields.integer({ label: 'Jumlah Laki-laki' }),
            totalPerempuan: fields.integer({ label: 'Jumlah Perempuan' }),
            totalKK: fields.integer({ label: 'Total Kepala Keluarga (KK)' }),
            kkLakiLaki: fields.integer({ label: 'KK Laki-laki' }),
            kkPerempuan: fields.integer({ label: 'KK Perempuan' }),
          },
          { label: 'Data Demografi & Kependudukan', layout: [4, 4, 4, 4, 4, 4, 6, 6] }
        ),
        fasilitas: fields.object(
          {
            pendidikan: fields.object(
              {
                tkPaud: fields.text({ label: 'TK dan PAUD', defaultValue: '-' }),
                sd: fields.text({ label: 'SD', defaultValue: '-' }),
                smp: fields.text({ label: 'SMP', defaultValue: '-' }),
                smk: fields.text({ label: 'SMK', defaultValue: '-' }),
                slb: fields.text({ label: 'SLB', defaultValue: '-' }),
                pkbm: fields.text({ label: 'PKBM', defaultValue: '-' }),
                universitas: fields.text({ label: 'Sekolah Tinggi/Univ', defaultValue: '-' }),
              },
              { label: 'Sarana Pendidikan' }
            ),
            kesehatan: fields.object(
              {
                puskesmas: fields.text({ label: 'Puskesmas', defaultValue: '-' }),
                posyanduBalita: fields.text({ label: 'Posyandu Balita', defaultValue: '-' }),
                posyanduLansia: fields.text({ label: 'Posyandu Lansia', defaultValue: '-' }),
              },
              { label: 'Sarana Kesehatan' }
            ),
          },
          { label: 'Fasilitas & Layanan Publik' }
        ),
        potensi: fields.object(
          {
             seniBudaya: fields.array(fields.text({ label: 'Nama Seni/Budaya' }), {
                label: 'Daftar Seni & Budaya',
                itemLabel: (props) => props.value || 'Seni Budaya',
             }),
             umkmIndustri: fields.array(fields.text({ label: 'Nama UMKM/Industri' }), {
                label: 'Daftar UMKM & Industri',
                itemLabel: (props) => props.value || 'UMKM Industri',
             }),
          },
          { label: 'Potensi & Ekonomi Kreatif' }
        ),
      },
    }),
    laboratoriumFieldApi: singleton({
      label: 'Laboratorium Field API',
      path: 'src/keystatic/laboratorium-field-api/',
      entryLayout: 'form',
      schema: {
        teksPendek: fields.text({
          label: 'Text',
        }),
        teksPanjang: fields.text({
          label: 'Text Multiline',
          multiline: true,
        }),
        slugDemo: fields.slug({
          name: {
            label: 'Slug Name',
          },
        }),
        angkaBulat: fields.integer({
          label: 'Integer',
          validation: {
            min: 0,
            max: 9999,
          },
        }),
        angkaDesimal: fields.number({
          label: 'Number',
          step: 0.1,
          validation: {
            min: 0,
            max: 100000,
          },
        }),
        aktif: fields.checkbox({
          label: 'Checkbox',
          defaultValue: true,
        }),
        tanggal: fields.date({
          label: 'Date',
        }),
        tanggalWaktu: fields.datetime({
          label: 'Datetime',
        }),
        kategori: fields.select({
          label: 'Select',
          options: [
            { label: 'Informasi', value: 'informasi' },
            { label: 'Layanan', value: 'layanan' },
            { label: 'Arsip', value: 'arsip' },
          ],
          defaultValue: 'informasi',
        }),
        kanal: fields.multiselect({
          label: 'Multiselect',
          options: [
            { label: 'Website', value: 'website' },
            { label: 'WhatsApp', value: 'whatsapp' },
            { label: 'Poster', value: 'poster' },
            { label: 'Balai padukuhan', value: 'balai' },
          ],
          defaultValue: ['website', 'whatsapp'],
        }),
        tautan: fields.url({
          label: 'URL',
        }),
        gambarUtama: fields.image({
          label: 'Image',
          directory: 'public/images/laboratorium-fields',
          publicPath: '/images/laboratorium-fields/',
        }),
        lampiran: fields.file({
          label: 'File',
          directory: 'public/files/laboratorium-fields',
          publicPath: '/files/laboratorium-fields/',
        }),
        referensiGambar: fields.pathReference({
          label: 'Path Reference',
          pattern: 'public/images/**/*',
        }),
        referensiKegiatan: fields.relationship({
          label: 'Relationship ke kegiatan',
          collection: 'kegiatan',
        }),
        pengaturanLanjutan: fields.object(
          {
            penanggungJawab: fields.text({ label: 'Nama penanggung jawab' }),
            email: fields.text({ label: 'Email penanggung jawab' }),
            prioritas: fields.select({
              label: 'Prioritas',
              options: [
                { label: 'Rendah', value: 'rendah' },
                { label: 'Sedang', value: 'sedang' },
                { label: 'Tinggi', value: 'tinggi' },
              ],
              defaultValue: 'sedang',
            }),
          },
          {
            label: 'Object',
            description: 'Contoh kelompok field object.',
            layout: [6, 6, 12],
          }
        ),
        daftarTag: fields.array(fields.text({ label: 'Tag' }), {
          label: 'Array',
          itemLabel: (props) => props.value || 'Tag baru',
        }),
        daftarKontak: fields.array(
          fields.object({
            nama: fields.text({ label: 'Nama' }),
            jabatan: fields.text({ label: 'Jabatan' }),
            nomor: fields.text({ label: 'Nomor kontak' }),
          }),
          {
            label: 'Array of Object',
            itemLabel: (props) => props.fields.nama.value || 'Kontak baru',
          }
        ),
        blokKonten: fields.blocks(
          {
            ringkasan: {
              label: 'Blok Ringkasan',
              schema: fields.object({
                judul: fields.text({ label: 'Judul blok' }),
                isi: fields.text({ label: 'Isi ringkas', multiline: true }),
              }),
            },
            tautan: {
              label: 'Blok Tautan',
              schema: fields.object({
                label: fields.text({ label: 'Label tautan' }),
                href: fields.text({ label: 'Href' }),
              }),
            },
          },
          {
            label: 'Blocks',
          }
        ),
        modePublikasi: fields.conditional(
          fields.select({
            label: 'Conditional',
            options: [
              { label: 'Tanpa detail tambahan', value: 'ringkas' },
              { label: 'Dengan metadata SEO', value: 'seo' },
            ],
            defaultValue: 'ringkas',
          }),
          {
            ringkas: fields.empty(),
            seo: fields.object({
              seoTitle: fields.text({ label: 'SEO Title' }),
              seoDescription: fields.text({
                label: 'SEO Description',
                multiline: true,
              }),
            }),
          }
        ),
        richText: fields.document({
          label: 'Document',
          formatting: true,
          links: true,
          dividers: true,
          layouts: [[1], [1, 1]],
        }),
      },
    }),
  },
});

export default keystaticConfig;
