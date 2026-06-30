import { defineAction } from 'astro:actions';
import { z } from 'zod';
import { getCollection } from 'astro:content';
import { PENGAJUAN_STATUS, getPublicTicketLabel } from '../lib/pengajuan';
import { KATEGORI_LOG_KEGIATAN, STATUS_PUBLIKASI_LOG } from '../lib/log-kegiatan';
import {
  createLogKegiatanRecord,
  createPengajuanRecord,
  deleteLogKegiatanRecord,
  findPengajuanByTicketAndNik,
  generateNomorPengajuan,
  updateLogKegiatanRecord,
  updateLogKegiatanStatusRecord,
  updatePengajuanStatusRecord,
} from '../lib/dynamic-data';

const optionalTrimmedText = z.preprocess(
  (value) => {
    if (typeof value !== 'string') return value;
    const trimmed = value.trim();
    return trimmed === '' ? undefined : trimmed;
  },
  z.string().optional(),
);

const logKegiatanSchema = z.object({
  judul: z.string().trim().min(1, 'Judul wajib diisi'),
  kategori: z.enum(KATEGORI_LOG_KEGIATAN),
  tanggal: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Tanggal wajib diisi'),
  waktu_mulai: optionalTrimmedText,
  waktu_selesai: optionalTrimmedText,
  lokasi: optionalTrimmedText,
  ringkasan: z.string().trim().min(1, 'Ringkasan wajib diisi'),
  hasil_tindak_lanjut: optionalTrimmedText,
  pihak_terlibat: optionalTrimmedText,
  foto_dokumentasi: optionalTrimmedText,
  status_publikasi: z.enum(STATUS_PUBLIKASI_LOG),
  urutan_tampil: z.coerce.number().int().min(0).default(0),
});

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

          const nomor_surat = await generateNomorPengajuan(input.rt_id, rtData.data.nomor_rt);

          await createPengajuanRecord({
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
          await updatePengajuanStatusRecord({
            id: input.id,
            status: input.status,
            catatan_rt: input.catatan_rt,
          });

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
          const item = await findPengajuanByTicketAndNik(nomorSurat, nik);
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
              catatan_rt: item.catatan_rt ?? null,
              created_at: String(item.created_at),
              updated_at: String(item.updated_at),
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
  logKegiatan: {
    create: defineAction({
      accept: 'form',
      input: logKegiatanSchema,
      handler: async (input) => {
        try {
          await createLogKegiatanRecord({
            judul: input.judul,
            kategori: input.kategori,
            tanggal: input.tanggal,
            waktu_mulai: input.waktu_mulai,
            waktu_selesai: input.waktu_selesai,
            lokasi: input.lokasi,
            ringkasan: input.ringkasan,
            hasil_tindak_lanjut: input.hasil_tindak_lanjut,
            pihak_terlibat: input.pihak_terlibat,
            foto_dokumentasi: input.foto_dokumentasi,
            status_publikasi: input.status_publikasi,
            urutan_tampil: input.urutan_tampil,
          });

          return { success: true, message: 'Log kegiatan berhasil ditambahkan.' };
        } catch (err: any) {
          return { success: false, message: err.message || 'Gagal menyimpan log kegiatan.' };
        }
      },
    }),
    update: defineAction({
      accept: 'form',
      input: logKegiatanSchema.extend({
        id: z.coerce.number().int().positive(),
      }),
      handler: async (input) => {
        try {
          await updateLogKegiatanRecord({
            id: input.id,
            judul: input.judul,
            kategori: input.kategori,
            tanggal: input.tanggal,
            waktu_mulai: input.waktu_mulai,
            waktu_selesai: input.waktu_selesai,
            lokasi: input.lokasi,
            ringkasan: input.ringkasan,
            hasil_tindak_lanjut: input.hasil_tindak_lanjut,
            pihak_terlibat: input.pihak_terlibat,
            foto_dokumentasi: input.foto_dokumentasi,
            status_publikasi: input.status_publikasi,
            urutan_tampil: input.urutan_tampil,
          });

          return { success: true, message: 'Log kegiatan berhasil diperbarui.' };
        } catch (err: any) {
          return { success: false, message: err.message || 'Gagal memperbarui log kegiatan.' };
        }
      },
    }),
    updateStatus: defineAction({
      accept: 'form',
      input: z.object({
        id: z.coerce.number().int().positive(),
        status_publikasi: z.enum(STATUS_PUBLIKASI_LOG),
      }),
      handler: async (input) => {
        try {
          await updateLogKegiatanStatusRecord(input.id, input.status_publikasi);

          return { success: true, message: 'Status publikasi berhasil diperbarui.' };
        } catch (err: any) {
          return { success: false, message: err.message || 'Gagal memperbarui status publikasi.' };
        }
      },
    }),
    remove: defineAction({
      accept: 'form',
      input: z.object({
        id: z.coerce.number().int().positive(),
      }),
      handler: async (input) => {
        try {
          await deleteLogKegiatanRecord(input.id);
          return { success: true, message: 'Log kegiatan berhasil dihapus.' };
        } catch (err: any) {
          return { success: false, message: err.message || 'Gagal menghapus log kegiatan.' };
        }
      },
    }),
  },
};
