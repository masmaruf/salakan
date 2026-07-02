import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import {
  KATEGORI_DOKUMEN,
  KATEGORI_INVENTARIS,
  KATEGORI_LOG_KEGIATAN,
  KATEGORI_PROGRAM,
  KATEGORI_UMKM,
  KONDISI_INVENTARIS,
  STATUS_PINJAM_INVENTARIS,
  STATUS_PROGRAM,
  STATUS_PUBLIKASI_LOG,
  STATUS_PUBLIKASI_OPTIONS,
} from './lib/content-taxonomy';
import { pageCopyDefaults } from './lib/page-copy';

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
      kategori: z.enum(KATEGORI_DOKUMEN),
      statusPublikasi: z.enum(STATUS_PUBLIKASI_OPTIONS).default('publish'),
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
    statusPublikasi: z.enum(STATUS_PUBLIKASI_OPTIONS).default('publish'),
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
    statusPublikasi: z.enum(STATUS_PUBLIKASI_OPTIONS).default('publish'),
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

const logKegiatan = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/log-kegiatan' }),
  schema: z.object({
    judul: z.string().min(1),
    tanggal: tanggalSchema,
    kategori: z.enum(KATEGORI_LOG_KEGIATAN),
    statusPublikasi: z.enum(STATUS_PUBLIKASI_LOG).default('publish'),
    kontenUtama: z.object({
      waktuMulai: z.string().default(''),
      waktuSelesai: z.string().default(''),
      lokasi: z.string().default(''),
      ringkasan: z.string().min(1),
      hasilTindakLanjut: z.string().default(''),
      pihakTerlibat: z.string().default(''),
    }),
    media: z.object({
      fotoDokumentasi: z.string().optional(),
    }).default({}),
    pengaturanTampil: z.object({
      tag: z.array(z.string().min(1)).default([]),
      urutanTampil: z.number().int().default(0),
    }).default({ tag: [], urutanTampil: 0 }),
  }),
});

const program = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/program' }),
  schema: z.object({
    judul: z.string().min(1),
    tanggalUpdate: tanggalSchema,
    statusPublikasi: z.enum(STATUS_PUBLIKASI_OPTIONS).default('publish'),
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
      kategori: z.enum(KATEGORI_PROGRAM),
      statusProgram: z.enum(STATUS_PROGRAM).default('rencana'),
      tag: z.array(z.string().min(1)).default([]),
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
    statusPublikasi: z.enum(STATUS_PUBLIKASI_OPTIONS).default('publish'),
    unggulan: z.boolean().default(false),
  }),
});

const inventarisWarga = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/inventaris-warga' }),
  schema: z.object({
    namaItem: z.string().min(1),
    kategori: z.enum(KATEGORI_INVENTARIS),
    kondisi: z.enum(KONDISI_INVENTARIS).default('baik'),
    statusPinjam: z.enum(STATUS_PINJAM_INVENTARIS).default('tersedia'),
    lokasiSimpan: z.string().min(1),
    penanggungJawab: z.string().min(1),
    ringkasan: z.string().min(1),
    catatan: z.string().default(''),
    statusPublikasi: z.enum(STATUS_PUBLIKASI_OPTIONS).default('publish'),
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
      kategori: z.enum(KATEGORI_UMKM),
      statusPublikasi: z.enum(STATUS_PUBLIKASI_OPTIONS).default('publish'),
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
      ringkasan: z.string().default(''),
      deskripsiTugas: z.string().min(1),
      kontak: z.string().min(1),
      jadwalRutin: z.string().default(''),
      lokasiKegiatan: z.string().default(''),
      fokusKegiatan: z.array(z.string().min(1)).default([]),
      layananUtama: z.array(z.string().min(1)).default([]),
    }),
    pengaturanTampil: z.object({
      bidang: z.enum(['pimpinan', 'kegiatan', 'wilayah']),
      statusPublikasi: z.enum(STATUS_PUBLIKASI_OPTIONS).default('publish'),
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
    embedPetaHtml: z.string().default(''),
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

const halaman = defineCollection({
  loader: glob({ pattern: 'index.yaml', base: './src/content/singletons/halaman' }),
  schema: z.object({
    profil: z.object({
      layoutTitle: z.string().default(pageCopyDefaults.profil.layoutTitle),
      layoutDescription: z.string().default(pageCopyDefaults.profil.layoutDescription),
      storyEyebrow: z.string().default(pageCopyDefaults.profil.storyEyebrow),
      storyTitle: z.string().default(pageCopyDefaults.profil.storyTitle),
      visionTitle: z.string().default(pageCopyDefaults.profil.visionTitle),
      missionTitle: z.string().default(pageCopyDefaults.profil.missionTitle),
      potentialEyebrow: z.string().default(pageCopyDefaults.profil.potentialEyebrow),
      potentialTitle: z.string().default(pageCopyDefaults.profil.potentialTitle),
      statsEyebrow: z.string().default(pageCopyDefaults.profil.statsEyebrow),
      statsTitle: z.string().default(pageCopyDefaults.profil.statsTitle),
      locationEyebrow: z.string().default(pageCopyDefaults.profil.locationEyebrow),
      locationTitle: z.string().default(pageCopyDefaults.profil.locationTitle),
      addressLabel: z.string().default(pageCopyDefaults.profil.addressLabel),
      openMapLabel: z.string().default(pageCopyDefaults.profil.openMapLabel),
      mapEmptyTitle: z.string().default(pageCopyDefaults.profil.mapEmptyTitle),
      mapEmptyDescription: z.string().default(pageCopyDefaults.profil.mapEmptyDescription),
    }).default(pageCopyDefaults.profil),
    kontak: z.object({
      layoutTitle: z.string().default(pageCopyDefaults.kontak.layoutTitle),
      layoutDescription: z.string().default(pageCopyDefaults.kontak.layoutDescription),
      heroEyebrow: z.string().default(pageCopyDefaults.kontak.heroEyebrow),
      heroTitle: z.string().default(pageCopyDefaults.kontak.heroTitle),
      heroDescription: z.string().default(pageCopyDefaults.kontak.heroDescription),
      addressTitle: z.string().default(pageCopyDefaults.kontak.addressTitle),
      addressFallback: z.string().default(pageCopyDefaults.kontak.addressFallback),
      whatsappTitle: z.string().default(pageCopyDefaults.kontak.whatsappTitle),
      whatsappActionLabel: z.string().default(pageCopyDefaults.kontak.whatsappActionLabel),
      whatsappPendingLabel: z.string().default(pageCopyDefaults.kontak.whatsappPendingLabel),
      emailTitle: z.string().default(pageCopyDefaults.kontak.emailTitle),
      workingHoursTitle: z.string().default(pageCopyDefaults.kontak.workingHoursTitle),
    }).default(pageCopyDefaults.kontak),
    layananWarga: z.object({
      pageTitle: z.string().default(pageCopyDefaults.layananWarga.pageTitle),
      pageDescription: z.string().default(pageCopyDefaults.layananWarga.pageDescription),
      primaryCtaLabel: z.string().default(pageCopyDefaults.layananWarga.primaryCtaLabel),
      secondaryCtaLabel: z.string().default(pageCopyDefaults.layananWarga.secondaryCtaLabel),
      quickAccessLabel: z.string().default(pageCopyDefaults.layananWarga.quickAccessLabel),
      features: z.array(z.object({
        title: z.string().min(1),
        icon: z.string().min(1),
        description: z.string().min(1),
      })).default(() => pageCopyDefaults.layananWarga.features.map((feature) => ({ ...feature }))),
      listTitle: z.string().default(pageCopyDefaults.layananWarga.listTitle),
      listDescription: z.string().default(pageCopyDefaults.layananWarga.listDescription),
      listCountSuffix: z.string().default(pageCopyDefaults.layananWarga.listCountSuffix),
    }).default(() => ({
      ...pageCopyDefaults.layananWarga,
      features: pageCopyDefaults.layananWarga.features.map((feature) => ({ ...feature })),
    })),
    agendaIndex: z.object({
      layoutTitle: z.string().default(pageCopyDefaults.agendaIndex.layoutTitle),
      layoutDescription: z.string().default(pageCopyDefaults.agendaIndex.layoutDescription),
      heroEyebrow: z.string().default(pageCopyDefaults.agendaIndex.heroEyebrow),
      heroTitle: z.string().default(pageCopyDefaults.agendaIndex.heroTitle),
      heroDescription: z.string().default(pageCopyDefaults.agendaIndex.heroDescription),
      stats: z.object({
        totalLabel: z.string().default(pageCopyDefaults.agendaIndex.stats.totalLabel),
        totalDescription: z.string().default(pageCopyDefaults.agendaIndex.stats.totalDescription),
        weeklyLabel: z.string().default(pageCopyDefaults.agendaIndex.stats.weeklyLabel),
        weeklyDescription: z.string().default(pageCopyDefaults.agendaIndex.stats.weeklyDescription),
        distributionLabel: z.string().default(pageCopyDefaults.agendaIndex.stats.distributionLabel),
        distributionTitle: z.string().default(pageCopyDefaults.agendaIndex.stats.distributionTitle),
        distributionDescription: z.string().default(pageCopyDefaults.agendaIndex.stats.distributionDescription),
      }).default(pageCopyDefaults.agendaIndex.stats),
      emptyMessage: z.string().default(pageCopyDefaults.agendaIndex.emptyMessage),
    }).default(pageCopyDefaults.agendaIndex),
    inventaris: z.object({
      title: z.string().default(pageCopyDefaults.inventaris.title),
      description: z.string().default(pageCopyDefaults.inventaris.description),
      stats: z.object({
        total: z.string().default(pageCopyDefaults.inventaris.stats.total),
        available: z.string().default(pageCopyDefaults.inventaris.stats.available),
        maintenance: z.string().default(pageCopyDefaults.inventaris.stats.maintenance),
      }).default(pageCopyDefaults.inventaris.stats),
      sectionTitle: z.string().default(pageCopyDefaults.inventaris.sectionTitle),
      sectionEyebrow: z.string().default(pageCopyDefaults.inventaris.sectionEyebrow),
      labels: z.object({
        condition: z.string().default(pageCopyDefaults.inventaris.labels.condition),
        location: z.string().default(pageCopyDefaults.inventaris.labels.location),
        owner: z.string().default(pageCopyDefaults.inventaris.labels.owner),
        note: z.string().default(pageCopyDefaults.inventaris.labels.note),
        priority: z.string().default(pageCopyDefaults.inventaris.labels.priority),
      }).default(pageCopyDefaults.inventaris.labels),
    }).default(pageCopyDefaults.inventaris),
    dokumen: z.object({
      title: z.string().default(pageCopyDefaults.dokumen.title),
      descriptionSuffix: z.string().default(pageCopyDefaults.dokumen.descriptionSuffix),
      detailLabel: z.string().default(pageCopyDefaults.dokumen.detailLabel),
      downloadLabel: z.string().default(pageCopyDefaults.dokumen.downloadLabel),
      unavailableLabel: z.string().default(pageCopyDefaults.dokumen.unavailableLabel),
    }).default(pageCopyDefaults.dokumen),
    umkm: z.object({
      title: z.string().default(pageCopyDefaults.umkm.title),
      descriptionSuffix: z.string().default(pageCopyDefaults.umkm.descriptionSuffix),
      featuredLabel: z.string().default(pageCopyDefaults.umkm.featuredLabel),
      detailLabel: z.string().default(pageCopyDefaults.umkm.detailLabel),
      whatsappLabel: z.string().default(pageCopyDefaults.umkm.whatsappLabel),
      whatsappMessagePrefix: z.string().default(pageCopyDefaults.umkm.whatsappMessagePrefix),
    }).default(pageCopyDefaults.umkm),
    programDetail: z.object({
      priorityLabel: z.string().default(pageCopyDefaults.programDetail.priorityLabel),
      summaryTitle: z.string().default(pageCopyDefaults.programDetail.summaryTitle),
      periodTitle: z.string().default(pageCopyDefaults.programDetail.periodTitle),
      fundingTitle: z.string().default(pageCopyDefaults.programDetail.fundingTitle),
      budgetTitle: z.string().default(pageCopyDefaults.programDetail.budgetTitle),
      budgetFallback: z.string().default(pageCopyDefaults.programDetail.budgetFallback),
      benefitsTitle: z.string().default(pageCopyDefaults.programDetail.benefitsTitle),
      backToProgramsLabel: z.string().default(pageCopyDefaults.programDetail.backToProgramsLabel),
      openDataCenterLabel: z.string().default(pageCopyDefaults.programDetail.openDataCenterLabel),
      updatedPrefix: z.string().default(pageCopyDefaults.programDetail.updatedPrefix),
    }).default(pageCopyDefaults.programDetail),
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
  logKegiatan,
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
  halaman,
  dashboard,
  beranda,
  monografi,
  rt,
};
 




