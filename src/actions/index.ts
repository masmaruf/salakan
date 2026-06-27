import { defineAction } from 'astro:actions';
import { z } from 'zod';
import { db, Pengajuan, NomorUrut, eq, and } from 'astro:db';
import { getCollection } from 'astro:content';
import { PENGAJUAN_STATUS, getPublicTicketLabel } from '../lib/pengajuan';

async function generateNomor(rtId: string, nomorRt: string) {
  const tahun = new Date().getFullYear();
  const existing = await db
    .select()
    .from(NomorUrut)
    .where(and(eq(NomorUrut.rt_id, rtId), eq(NomorUrut.tahun, tahun)));

  let urutan: number;
  if (existing.length === 0) {
    urutan = 1;
    await db.insert(NomorUrut).values({ rt_id: rtId, tahun, urutan: 1 });
  } else {
    urutan = existing[0].urutan + 1;
    await db
      .update(NomorUrut)
      .set({ urutan })
      .where(and(eq(NomorUrut.rt_id, rtId), eq(NomorUrut.tahun, tahun)));
  }

  const nomorPad = String(urutan).padStart(3, '0');
  return `${nomorPad}/RT-${nomorRt}/DkV/${tahun}`;
}

export const server = {
  layanan: {
    ajukanSurat: defineAction({
      accept: 'form',
      input: z.object({
        rt_id: z.string().min(1, 'Pilih RT'),
        nama: z.string().min(1, 'Nama wajib diisi'),
        jenis_kelamin: z.string().min(1, 'Pilih jenis kelamin'),
        tempat_lahir: z.string().min(1, 'Tempat lahir wajib diisi'),
        tanggal_lahir: z.string().min(1, 'Tanggal lahir wajib diisi'),
        status_kawin: z.string().min(1, 'Pilih status perkawinan'),
        agama: z.string().min(1, 'Pilih agama'),
        pekerjaan: z.string().min(1, 'Pekerjaan wajib diisi'),
        alamat: z.string().min(1, 'Alamat wajib diisi'),
        nik: z.string().length(16, 'NIK harus 16 digit'),
        keperluan: z.string().min(5, 'Keperluan minimal 5 karakter'),
        whatsapp: z.string().min(10, 'Nomor WhatsApp minimal 10 digit'),
      }),
      handler: async (input) => {
        try {
          const semuaRt = await getCollection('rt');
          const rtData = semuaRt.find((r) => r.id === input.rt_id);

          if (!rtData || !rtData.data.aktif) {
            throw new Error('RT tidak ditemukan atau saat ini tidak aktif.');
          }

          const nomor_surat = await generateNomor(input.rt_id, rtData.data.nomor_rt);

          await db.insert(Pengajuan).values({
            nomor_surat,
            rt_id: input.rt_id,
            nama: input.nama.trim(),
            jenis_kelamin: input.jenis_kelamin,
            tempat_lahir: input.tempat_lahir.trim(),
            tanggal_lahir: input.tanggal_lahir,
            status_kawin: input.status_kawin,
            agama: input.agama,
            pekerjaan: input.pekerjaan.trim(),
            alamat: input.alamat.trim(),
            nik: input.nik.replace(/\D/g, ''),
            keperluan: input.keperluan.trim(),
            no_hp: input.whatsapp.trim(),
            status: 'menunggu',
            created_at: new Date(),
            updated_at: new Date(),
          });

          return {
            success: true,
            message: 'Pengajuan berhasil dikirim. Simpan nomor tiket untuk melacak status.',
            ticket: nomor_surat,
          };
        } catch (err: any) {
          return {
            success: false,
            message: err.message || 'Terjadi kesalahan server.',
          };
        }
      },
    }),
    updateStatusSurat: defineAction({
      accept: 'form',
      input: z.object({
        id: z.number(),
        status: z.enum(PENGAJUAN_STATUS),
        catatan_rt: z.string().optional(),
      }),
      handler: async (input) => {
        try {
          await db
            .update(Pengajuan)
            .set({
              status: input.status,
              catatan_rt: input.catatan_rt,
              updated_at: new Date(),
            })
            .where(eq(Pengajuan.id, input.id));

          return { success: true, message: 'Status berhasil diperbarui.' };
        } catch (err: any) {
          return { success: false, message: err.message || 'Gagal update.' };
        }
      },
    }),
    lacakSurat: defineAction({
      accept: 'form',
      input: z.object({
        nomor_surat: z.string().min(6, 'Nomor tiket wajib diisi'),
        nik: z.string().length(16, 'NIK harus 16 digit'),
      }),
      handler: async (input) => {
        try {
          const nomorSurat = getPublicTicketLabel(input.nomor_surat);
          const nik = input.nik.replace(/\D/g, '');
          const result = await db
            .select()
            .from(Pengajuan)
            .where(and(eq(Pengajuan.nomor_surat, nomorSurat), eq(Pengajuan.nik, nik)));

          const item = result[0];
          if (!item) {
            return {
              success: false,
              message: 'Pengajuan tidak ditemukan. Pastikan nomor tiket dan NIK sesuai.',
            };
          }

          return {
            success: true,
            data: {
              nomor_surat: item.nomor_surat,
              nama: item.nama,
              rt_id: item.rt_id,
              status: item.status,
              keperluan: item.keperluan,
              catatan_rt: item.catatan_rt,
              created_at: item.created_at.toISOString(),
              updated_at: item.updated_at.toISOString(),
            },
          };
        } catch (err: any) {
          return {
            success: false,
            message: err.message || 'Gagal memeriksa status pengajuan.',
          };
        }
      },
    }),
  },
};
