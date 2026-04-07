import { collection, fields } from '@keystatic/core';

export const pengumumanCollection = collection({
  label: 'Pengumuman',
  slugField: 'judul',
  path: 'src/content/pengumuman/*/',
  entryLayout: 'form',
  columns: ['tanggal', 'ringkasan'],
  schema: {
    judul: fields.slug({
      name: {
        label: 'Judul',
      },
    }),
    tanggal: fields.date({
      label: 'Tanggal',
    }),
    ringkasan: fields.text({
      label: 'Ringkasan',
      multiline: true,
    }),
    isi: fields.text({
      label: 'Isi pengumuman',
      multiline: true,
    }),
    pengaturanTampil: fields.object(
      {
        statusPublikasi: fields.select({
          label: 'Status tayang',
          options: [
            { label: 'Publish / Tayang', value: 'publish' },
            { label: 'Draft / Belum tayang', value: 'draft' },
          ],
          defaultValue: 'publish',
        }),
        unggulan: fields.checkbox({
          label: 'Tandai sebagai pengumuman unggulan',
          defaultValue: false,
        }),
      },
      {
        label: 'Pengaturan tampil',
        layout: [6, 6],
      }
    ),
  },
});
