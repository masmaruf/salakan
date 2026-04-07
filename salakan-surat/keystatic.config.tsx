import { config, collection, singleton, fields } from '@keystatic/core';

export default config({
  storage: {
    kind: 'local',
  },

  ui: {
    brand: { name: 'Admin Surat — DK V Salakan' },
  },

  // ── Singleton: pengaturan umum desa ─────────────────────────────────────
  singletons: {
    pengaturan: singleton({
      label: 'Pengaturan Umum',
      path: 'src/content/pengaturan',
      schema: {
        nama_dukuh: fields.text({
          label: 'Nama Dukuh',
          defaultValue: 'Dukuh V Salakan',
        }),
        kalurahan: fields.text({
          label: 'Kalurahan',
          defaultValue: 'Bangunjiwo',
        }),
        kapanewon: fields.text({
          label: 'Kapanewon',
          defaultValue: 'Kasihan',
        }),
        kabupaten: fields.text({
          label: 'Kabupaten',
          defaultValue: 'Bantul',
        }),
        provinsi: fields.text({
          label: 'Provinsi',
          defaultValue: 'D.I. Yogyakarta',
        }),
        kode_dukuh: fields.text({
          label: 'Kode Dukuh (untuk nomor surat)',
          defaultValue: 'DkV',
        }),
      },
    }),
  },

  // ── Collection: daftar RT ───────────────────────────────────────────────
  collections: {
    rt: collection({
      label: 'Daftar RT',
      path: 'src/content/rt/*',
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
});
