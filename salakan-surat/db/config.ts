import { defineDb, defineTable, column } from 'astro:db';

const Pengajuan = defineTable({
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

const NomorUrut = defineTable({
  columns: {
    id:      column.number({ primaryKey: true }),
    rt_id:   column.text(),
    tahun:   column.number(),
    urutan:  column.number({ default: 0 }),
  },
});

export default defineDb({
  tables: { Pengajuan, NomorUrut },
});
