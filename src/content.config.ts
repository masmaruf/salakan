import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const tanggalSchema = z
  .union([z.string(), z.date()])
  .transform((value) => (value instanceof Date ? value.toISOString().slice(0, 10) : value));


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
      waktuMulai: z.string().default(''),
      waktuSelesai: z.string().default(''),
      lokasi: z.string().default(''),
      ringkasan: z.string().min(1),
      deskripsi: z.string().min(1),
      kontakPic: z.string().default(''),
    }),
    media: z.object({
      gambarUtama: z.string().optional(),
      altGambarUtama: z.string().default('Poster agenda Padukuhan Salakan'),
    }),
    pengaturanTampil: z.object({
      label: z.string().default('Agenda'),
      tag: z.array(z.string().min(1)).default([]),
      unggulan: z.boolean().default(false),
    }),
  }),
});

const program = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/program' }),
  schema: z.object({
    judul: z.string().min(1),
    tanggalUpdate: tanggalSchema,
    statusPublikasi: z.enum(['draft', 'publish']).default('publish'),
    kontenUtama: z.object({
      ringkasan: z.string().min(1),
      deskripsi: z.string().min(1),
      lokasi: z.string().min(1),
      periode: z.string().min(1),
      penanggungJawab: z.string().min(1),
      sumberDana: z.string().default('Swadaya warga'),
      anggaran: z.string().default(''),
      manfaat: z.array(z.string().min(1)).default([]),
    }),
    pengaturanTampil: z.object({
      kategori: z.enum(['infrastruktur', 'pelayanan', 'pemberdayaan', 'lingkungan']),
      statusProgram: z.enum(['rencana', 'berjalan', 'selesai']).default('rencana'),
      unggulan: z.boolean().default(false),
      urutanTampil: z.number().int().default(0),
    }),
  }),
});

const kasRt = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/kas-rt' }),
  schema: z.object({
    periode: z.string().min(1),
    tanggalUpdate: tanggalSchema,
    ringkasan: z.string().min(1),
    pemasukan: z.number().nonnegative(),
    pengeluaran: z.number().nonnegative(),
    saldoAkhir: z.number().nonnegative(),
    sumberDana: z.array(z.string().min(1)).default([]),
    catatan: z.string().default(''),
    statusPublikasi: z.enum(['draft', 'publish']).default('publish'),
    unggulan: z.boolean().default(false),
  }),
});

const inventarisWarga = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/inventaris-warga' }),
  schema: z.object({
    namaItem: z.string().min(1),
    kategori: z.enum(['acara', 'kebersihan', 'dokumentasi', 'logistik']),
    kondisi: z.enum(['baik', 'perlu-perawatan', 'terbatas']).default('baik'),
    statusPinjam: z.enum(['tersedia', 'dipinjam', 'perawatan']).default('tersedia'),
    lokasiSimpan: z.string().min(1),
    penanggungJawab: z.string().min(1),
    ringkasan: z.string().min(1),
    catatan: z.string().default(''),
    statusPublikasi: z.enum(['draft', 'publish']).default('publish'),
    unggulan: z.boolean().default(false),
    urutanTampil: z.number().int().default(0),
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
    hero: z.object({
      gambar: z.string().optional(),
      judul: z.string().default(''),
      badge: z.string().default(''),
    }).default({ judul: '', badge: '' }),
    sejarahLabel: z.string().default('Kisah Kami'),
    sejarahJudul: z.string().default('Sejarah & Filosofi'),
    sejarahSingkat: z.string().min(1),
    visi: z.string().min(1),
    misi: z.array(z.string().min(1)).default([]),
    potensiDesa: z.array(
      z.object({
        ikon: z.string().min(1),
        judul: z.string().min(1),
        deskripsi: z.string().min(1),
      })
    ).default([]),
    lokasi: z.object({
      gambarPeta: z.string().optional(),
      alamat: z.string().default(''),
      linkPeta: z.string().default(''),
    }).default({ alamat: '', linkPeta: '' }),
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
    linkPeta: z.string().default(''),
    sambutanBeranda: z.string().min(1),
    seoHalamanData: (() => {
      const seoPageSchema = z.object({ seoTitle: z.string().default(''), seoDescription: z.string().default(''), ogImage: z.string().default('') });
      const seoDefault = { seoTitle: '', seoDescription: '', ogImage: '' } as const;
      return z.object({
        dataUtama: seoPageSchema.default(seoDefault),
        dokumen: seoPageSchema.default(seoDefault),
        umkm: seoPageSchema.default(seoDefault),
        strukturOrganisasi: seoPageSchema.default(seoDefault),
        agenda: seoPageSchema.default(seoDefault),
        program: seoPageSchema.default(seoDefault),
        kasRt: seoPageSchema.default(seoDefault),
        inventaris: seoPageSchema.default(seoDefault),
        layananWarga: seoPageSchema.default(seoDefault),
        faq: seoPageSchema.default(seoDefault),
        monografi: seoPageSchema.default(seoDefault),
      }).default({
        dataUtama: seoDefault,
        dokumen: seoDefault,
        umkm: seoDefault,
        strukturOrganisasi: seoDefault,
        agenda: seoDefault,
        program: seoDefault,
        kasRt: seoDefault,
        inventaris: seoDefault,
        layananWarga: seoDefault,
        faq: seoDefault,
        monografi: seoDefault,
      });
    })(),
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
    gunakanPengaturanCms: z.boolean().default(false),
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

const dashboard = defineCollection({
  loader: glob({ pattern: 'index.yaml', base: './src/content/singletons/dashboard' }),
  schema: z.object({
    kas: z.object({
      intro: z.string().min(1),
      stats: z.object({
        pemasukan: z.string().min(1),
        pengeluaran: z.string().min(1),
        saldo: z.string().min(1),
      }),
      latestTitle: z.string().min(1),
      historyTitle: z.string().min(1),
      emptyMessage: z.string().min(1),
      publicCtaLabel: z.string().min(1),
    }),
    inventaris: z.object({
      intro: z.string().min(1),
      stats: z.object({
        tersedia: z.string().min(1),
        dipinjam: z.string().min(1),
        perawatan: z.string().min(1),
      }),
      highlightTitle: z.string().min(1),
      quickListTitle: z.string().min(1),
      emptyMessage: z.string().min(1),
      publicCtaLabel: z.string().min(1),
    }),
    profil: z.object({
      intro: z.string().min(1),
      stats: z.object({
        totalKk: z.string().min(1),
        totalJiwa: z.string().min(1),
        rtAktif: z.string().min(1),
      }),
      checklistTitle: z.string().min(1),
      checklistItems: z.array(z.string().min(1)).default([]),
      checklistNote: z.string().min(1),
      activeRtTitle: z.string().min(1),
      serviceAddressTitle: z.string().min(1),
    }),
    pengaturan: z.object({
      intro: z.string().min(1),
      channels: z.array(
        z.object({
          title: z.string().min(1),
          status: z.enum(['aktif', 'segera']).default('aktif'),
          description: z.string().min(1),
          href: z.string().min(1),
          label: z.string().min(1),
          icon: z.string().min(1),
        })
      ).default([]),
      principlesTitle: z.string().min(1),
      principles: z.array(z.string().min(1)).default([]),
      quickHelpTitle: z.string().min(1),
      quickLinks: z.array(
        z.object({
          label: z.string().min(1),
          href: z.string().min(1),
        })
      ).default([]),
    }),
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
        agendaLabel: z.string().min(1),
        kegiatanLabel: z.string().min(1),
        galeriLabel: z.string().min(1),
      }),
    }),
    agenda: z.object({
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

const monografi = defineCollection({
  loader: glob({ pattern: 'index.yaml', base: './src/content/singletons/monografi' }),
  schema: z.object({
    identitasDukuh: z.object({
      namaDukuh: z.string().min(1),
      pendidikan: z.string().min(1),
      alamat: z.string().min(1),
    }),
    demografi: z.object({
      luasWilayah: z.string().min(1),
      jumlahRT: z.number().int(),
      totalJiwa: z.number().int(),
      totalLakiLaki: z.number().int(),
      totalPerempuan: z.number().int(),
      totalKK: z.number().int(),
      kkLakiLaki: z.number().int(),
      kkPerempuan: z.number().int(),
    }),
    fasilitas: z.object({
      pendidikan: z.object({
        tkPaud: z.string().default('-'),
        sd: z.string().default('-'),
        smp: z.string().default('-'),
        smk: z.string().default('-'),
        slb: z.string().default('-'),
        pkbm: z.string().default('-'),
        universitas: z.string().default('-'),
      }),
      kesehatan: z.object({
        puskesmas: z.string().default('-'),
        posyanduBalita: z.string().default('-'),
        posyanduLansia: z.string().default('-'),
      }),
    }),
    potensi: z.object({
      seniBudaya: z.array(z.string()).default([]),
      umkmIndustri: z.array(z.string()).default([]),
    }),
  }),
});

const rt = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/rt' }),
  schema: z.object({
    rt_id: z.string(),
    nomor_rt: z.string(),
    nama_ketua: z.string(),
    no_hp_ketua: z.string().optional(),
    aktif: z.boolean().default(false),
  }),
});

export const collections = {
  dokumen,
  kegiatan,
  agenda,
  program,
  kasRt,
  inventarisWarga,
  umkm,
  galeri,
  kategoriBerita,
  strukturOrganisasi,
  layananWarga,
  faq,
  profil,
  pengaturan,
  akunAdmin,
  dashboard,
  beranda,
  monografi,
  rt,
};
 




