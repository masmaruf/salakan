import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const tanggalSchema = z
  .union([z.string(), z.date()])
  .transform((value) => (value instanceof Date ? value.toISOString().slice(0, 10) : value));

const pengumuman = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/pengumuman' }),
  schema: z.object({
    judul: z.string().min(1),
    tanggal: tanggalSchema,
    ringkasan: z.string().min(1),
    isi: z.string().min(1),
    pengaturanTampil: z.object({
      statusPublikasi: z.enum(['draft', 'publish']).default('publish'),
      unggulan: z.boolean().default(false),
    }),
  }),
});

const dokumen = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/dokumen' }),
  schema: z.object({
    judul: z.string().min(1),
    tanggalUpdate: tanggalSchema,
    kontenUtama: z.object({
      ringkasan: z.string().min(1),
      deskripsi: z.string().min(1),
    }),
    media: z.object({
      fileDokumen: z.string().optional(),
    }),
    seo: z.object({
      seoTitle: z.string().default(''),
      seoDescription: z.string().default(''),
      ogImage: z.string().default(''),
    }).default({
      seoTitle: '',
      seoDescription: '',
      ogImage: '',
    }),
    pengaturanTampil: z.object({
      kategori: z.enum(['layanan', 'arsip', 'kegiatan', 'regulasi']),
      statusPublikasi: z.enum(['draft', 'publish']).default('publish'),
      unggulan: z.boolean().default(false),
      urutanTampil: z.number().int(),
    }),
  }),
});

const kegiatan = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/kegiatan' }),
  schema: z.object({
    judul: z.string().min(1),
    tanggal: tanggalSchema,
    statusPublikasi: z.enum(['draft', 'publish']).default('publish'),
    editorArtikel: z.object({
      kontenUtama: z.object({
        ringkasan: z.string().min(1),
      }),
      sidebar: z.object({
        kategori: z.string().min(1),
        jenisKonten: z.enum(['berita', 'artikel']).default('berita'),
        penulis: z.string().default('Admin Padukuhan'),
        gambarUtama: z.string().optional(),
        altGambarUtama: z.string().default('Dokumentasi kegiatan Padukuhan Salakan'),
        tag: z.array(z.string().min(1)).default([]),
        unggulan: z.boolean().default(false),
      }),
      seo: z.object({
        seoTitle: z.string().default(''),
        seoDescription: z.string().default(''),
        ogImage: z.string().default(''),
      }).default({
        seoTitle: '',
        seoDescription: '',
        ogImage: '',
      }),
    }),
  }),
});

const agenda = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/agenda' }),
  schema: z.object({
    judul: z.string().min(1),
    tanggal: tanggalSchema,
    statusPublikasi: z.enum(['draft', 'publish']).default('publish'),
    kontenUtama: z.object({
      waktuMulai: z.string().min(1),
      waktuSelesai: z.string().min(1),
      lokasi: z.string().min(1),
      ringkasan: z.string().min(1),
      deskripsi: z.string().min(1),
      kontakPic: z.string().min(1),
    }),
    media: z.object({
      gambarUtama: z.string().optional(),
      altGambarUtama: z.string().default('Poster agenda Padukuhan Salakan'),
    }),
    pengaturanTampil: z.object({
      unggulan: z.boolean().default(false),
    }),
  }),
});

const umkm = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/umkm' }),
  schema: z.object({
    namaUsaha: z.string().min(1),
    kontenUtama: z.object({
      pemilik: z.string().min(1),
      ringkasan: z.string().min(1),
      deskripsi: z.string().min(1),
      whatsapp: z.string().min(1),
      lokasi: z.string().min(1),
      produkUnggulan: z.array(z.string().min(1)).default([]),
    }),
    media: z.object({
      gambar: z.string().optional(),
      altGambar: z.string().default('Foto produk UMKM Padukuhan Salakan'),
    }),
    seo: z.object({
      seoTitle: z.string().default(''),
      seoDescription: z.string().default(''),
      ogImage: z.string().default(''),
    }).default({
      seoTitle: '',
      seoDescription: '',
      ogImage: '',
    }),
    pengaturanTampil: z.object({
      kategori: z.enum(['kuliner', 'kerajinan', 'jasa', 'perdagangan']),
      statusPublikasi: z.enum(['draft', 'publish']).default('publish'),
      unggulan: z.boolean().default(false),
      urutanTampil: z.number().int(),
    }),
  }),
});

const galeri = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/galeri' }),
  schema: z.object({
    judul: z.string().min(1),
    tanggal: tanggalSchema,
    gambar: z.string().optional(),
    caption: z.string().min(1),
  }),
});

const kategoriBerita = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/kategori-berita' }),
  schema: z.object({
    namaKategori: z.string().min(1),
    labelTampil: z.string().min(1),
    deskripsi: z.string().min(1),
    pengaturanTampil: z.object({
      status: z.enum(['tampil', 'sembunyi']).default('tampil'),
      urutanTampil: z.number().int(),
    }),
  }),
});

const strukturOrganisasi = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/struktur-organisasi' }),
  schema: z.object({
    jabatan: z.string().min(1),
    kontenUtama: z.object({
      namaPejabat: z.string().min(1),
      deskripsiTugas: z.string().min(1),
      kontak: z.string().min(1),
    }),
    pengaturanTampil: z.object({
      bidang: z.enum(['pimpinan', 'kegiatan', 'wilayah']),
      statusPublikasi: z.enum(['draft', 'publish']).default('publish'),
      urutanTampil: z.number().int(),
    }),
  }),
});

const layananWarga = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/layanan-warga' }),
  schema: z.object({
    namaLayanan: z.string().min(1),
    ringkasan: z.string().min(1),
    syarat: z.array(z.string().min(1)).default([]),
    langkah: z.array(z.string().min(1)).default([]),
    kontak: z.string().min(1),
    jamLayanan: z.string().min(1),
    statusTampil: z.enum(['tampil', 'sembunyi']).default('tampil'),
  }),
});

const faq = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/faq' }),
  schema: z.object({
    pertanyaan: z.string().min(1),
    jawaban: z.string().min(1),
    kategori: z.string().min(1),
    urutan: z.number().int(),
    statusTampil: z.enum(['tampil', 'sembunyi']).default('tampil'),
  }),
});

const profil = defineCollection({
  loader: glob({ pattern: 'index.yaml', base: './src/content/singletons/profil' }),
  schema: z.object({
    namaPadukuhan: z.string().min(1),
    tagline: z.string().min(1),
    sejarahSingkat: z.string().min(1),
    visi: z.string().min(1),
    misi: z.array(z.string().min(1)).default([]),
    dataWilayah: z.array(
      z.object({
        label: z.string().min(1),
        value: z.string().min(1),
      })
    ),
  }),
});

const pengaturan = defineCollection({
  loader: glob({ pattern: 'index.yaml', base: './src/content/singletons/pengaturan' }),
  schema: z.object({
    alamat: z.string().min(1),
    kontakWhatsApp: z.string().min(1),
    email: z.string().email(),
    jamLayanan: z.string().min(1),
    linkPeta: z.union([z.string().url(), z.literal('')]),
    sambutanBeranda: z.string().min(1),
    seoHalamanData: z.object({
      dataUtama: z.object({
        seoTitle: z.string().default(''),
        seoDescription: z.string().default(''),
        ogImage: z.string().default(''),
      }),
      pengumuman: z.object({
        seoTitle: z.string().default(''),
        seoDescription: z.string().default(''),
        ogImage: z.string().default(''),
      }),
      dokumen: z.object({
        seoTitle: z.string().default(''),
        seoDescription: z.string().default(''),
        ogImage: z.string().default(''),
      }),
      umkm: z.object({
        seoTitle: z.string().default(''),
        seoDescription: z.string().default(''),
        ogImage: z.string().default(''),
      }),
      strukturOrganisasi: z.object({
        seoTitle: z.string().default(''),
        seoDescription: z.string().default(''),
        ogImage: z.string().default(''),
      }),
    }).default({
      dataUtama: { seoTitle: '', seoDescription: '', ogImage: '' },
      pengumuman: { seoTitle: '', seoDescription: '', ogImage: '' },
      dokumen: { seoTitle: '', seoDescription: '', ogImage: '' },
      umkm: { seoTitle: '', seoDescription: '', ogImage: '' },
      strukturOrganisasi: { seoTitle: '', seoDescription: '', ogImage: '' },
    }),
    menuData: z.object({
      title: z.string().min(1),
      description: z.string().min(1),
      items: z.array(
        z.object({
          label: z.string().min(1),
          href: z.string().min(1),
          description: z.string().min(1),
          icon: z.string().min(1),
          status: z.enum(['tampil', 'sembunyi']),
        })
      ),
    }),
  }),
});

const akunAdmin = defineCollection({
  loader: glob({ pattern: 'index.yaml', base: './src/content/singletons/akun-admin' }),
  schema: z.object({
    gunakanPengaturanKeystatic: z.boolean().default(false),
    catatan: z.string().default(''),
    users: z.array(
      z.object({
        username: z.string().min(1),
        password: z.string().min(1),
        role: z.enum(['superadmin', 'admin', 'editor']).default('editor'),
        status: z.enum(['aktif', 'nonaktif']).default('aktif'),
      })
    ).default([]),
  }),
});

const beranda = defineCollection({
  loader: glob({ pattern: 'index.yaml', base: './src/content/singletons/beranda' }),
  schema: z.object({
    hero: z.object({
      eyebrow: z.string().min(1),
      title: z.string().min(1),
      intro: z.string().min(1),
      primaryCtaLabel: z.string().min(1),
      primaryCtaHref: z.string().min(1),
      secondaryCtaLabel: z.string().min(1),
      secondaryCtaHref: z.string().min(1),
      panelLabel: z.string().min(1),
      panelTitle: z.string().min(1),
      panelNote: z.string().min(1),
      panelLinks: z.array(
        z.object({
          title: z.string().min(1),
          description: z.string().min(1),
          href: z.string().min(1),
          icon: z.string().min(1),
          status: z.enum(['tampil', 'sembunyi']).default('tampil'),
        })
      ).default([]),
      stats: z.object({
        pengumumanLabel: z.string().min(1),
        kegiatanLabel: z.string().min(1),
        galeriLabel: z.string().min(1),
      }),
    }),
    pengumuman: z.object({
      title: z.string().min(1),
      description: z.string().min(1),
      ctaLabel: z.string().min(1),
    }),
    berita: z.object({
      title: z.string().min(1),
      description: z.string().min(1),
      ctaLabel: z.string().min(1),
    }),
    galeri: z.object({
      title: z.string().min(1),
      description: z.string().min(1),
      ctaLabel: z.string().min(1),
    }),
    penutup: z.object({
      eyebrow: z.string().min(1),
      title: z.string().min(1),
      description: z.string().min(1),
      primaryCtaLabel: z.string().min(1),
      primaryCtaHref: z.string().min(1),
      secondaryCtaLabel: z.string().min(1),
      secondaryCtaHref: z.string().min(1),
    }),
  }),
});

export const collections = {
  pengumuman,
  dokumen,
  kegiatan,
  agenda,
  umkm,
  galeri,
  kategoriBerita,
  strukturOrganisasi,
  layananWarga,
  faq,
  profil,
  pengaturan,
  akunAdmin,
  beranda,
};
