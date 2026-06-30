import { defineDb, defineTable, column } from 'astro:db';

export const Pengajuan = defineTable({
  columns: {
    id:             column.number({ primaryKey: true }),
    nomor_surat:    column.text(),                          // "001/RT-05/DkV/2025"
    rt_id:          column.text(),                          // "rt-05"
    nama:           column.text(),
    jenis_kelamin:  column.text(),
    tempat_lahir:   column.text(),
    tanggal_lahir:  column.text(),
    status_kawin:   column.text(),
    agama:          column.text(),
    pekerjaan:      column.text(),
    alamat:         column.text(),
    nik:            column.text(),
    keperluan:      column.text(),
    no_hp:          column.text(),
    status:         column.text({ default: 'menunggu' }), // menunggu | diproses | selesai | ditolak
    catatan_rt:     column.text({ optional: true }),
    created_at:     column.date({ default: new Date() }),
    updated_at:     column.date({ default: new Date() }),
  },
});

export const NomorUrut = defineTable({
  columns: {
    id:      column.number({ primaryKey: true }),
    rt_id:   column.text(),
    tahun:   column.number(),
    urutan:  column.number({ default: 0 }),
  },
});

export const LogKegiatanDukuh = defineTable({
  columns: {
    id:                    column.number({ primaryKey: true }),
    judul:                 column.text(),
    kategori:              column.text(),
    tanggal:               column.text(),
    waktu_mulai:           column.text({ optional: true }),
    waktu_selesai:         column.text({ optional: true }),
    lokasi:                column.text({ optional: true }),
    ringkasan:             column.text(),
    hasil_tindak_lanjut:   column.text({ optional: true }),
    pihak_terlibat:        column.text({ optional: true }),
    foto_dokumentasi:      column.text({ optional: true }),
    status_publikasi:      column.text({ default: 'draft' }),
    urutan_tampil:         column.number({ default: 0 }),
    created_at:            column.date({ default: new Date() }),
    updated_at:            column.date({ default: new Date() }),
  },
});

export default defineDb({
  tables: { Pengajuan, NomorUrut, LogKegiatanDukuh },
});
