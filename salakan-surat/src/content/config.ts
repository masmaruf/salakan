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

const pengaturan = defineCollection({
  type: 'data',
  schema: z.object({
    nama_dukuh: z.string(),
    kalurahan:  z.string(),
    kapanewon:  z.string(),
    kabupaten:  z.string(),
    provinsi:   z.string(),
    kode_dukuh: z.string(),
  }),
});

export const collections = { rt, pengaturan };
