import { defineCollection, z } from 'astro:content';

const rt = defineCollection({
  type: 'data',
  schema: z.object({
    rt_id:       z.string(),
    nomor_rt:    z.string(),
    nama_ketua:  z.string(),
    no_hp_ketua: z.string().optional(),
    aktif:       z.boolean().default(true),
    catatan:     z.string().optional(),
  }),
});

// Definisi koleksi lainnya sebagai placeholder agar getCollection tetap bekerja
// (Nanti bisa dilengkapi schema detailnya jika diperlukan)
const pengumuman = defineCollection({ type: 'data', schema: z.any() });
const dokumen = defineCollection({ type: 'data', schema: z.any() });
const kegiatan = defineCollection({ type: 'content', schema: z.any() });
const agenda = defineCollection({ type: 'data', schema: z.any() });
const program = defineCollection({ type: 'data', schema: z.any() });
const kasRt = defineCollection({ type: 'data', schema: z.any() });
const inventarisWarga = defineCollection({ type: 'data', schema: z.any() });
const umkm = defineCollection({ type: 'data', schema: z.any() });
const galeri = defineCollection({ type: 'data', schema: z.any() });
const kategoriBerita = defineCollection({ type: 'data', schema: z.any() });
const strukturOrganisasi = defineCollection({ type: 'data', schema: z.any() });
const layananWarga = defineCollection({ type: 'data', schema: z.any() });
const faq = defineCollection({ type: 'data', schema: z.any() });

// Singletons
const profil = defineCollection({ type: 'data', schema: z.any() });
const pengaturan = defineCollection({ type: 'data', schema: z.any() });
const monografi = defineCollection({ type: 'data', schema: z.any() });
const beranda = defineCollection({ type: 'data', schema: z.any() });

export const collections = {
  rt,
  pengumuman,
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
  monografi,
  beranda,
};
