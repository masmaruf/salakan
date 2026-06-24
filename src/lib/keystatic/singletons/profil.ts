import { singleton, fields } from '@keystatic/core';

export const profilSingleton = singleton({
  label: 'Profil Padukuhan',
  path: 'src/content/singletons/profil/',
  entryLayout: 'form',
  schema: {
    namaPadukuhan: fields.text({
      label: 'Nama padukuhan',
    }),
    tagline: fields.text({
      label: 'Tagline',
      multiline: true,
    }),
    sejarahSingkat: fields.text({
      label: 'Sejarah singkat',
      multiline: true,
    }),
    visi: fields.text({
      label: 'Visi',
      multiline: true,
    }),
    misi: fields.array(fields.text({ label: 'Poin misi' }), {
      label: 'Misi',
      itemLabel: (props) => props.value || 'Poin misi',
    }),
    dataWilayah: fields.array(
      fields.object({
        label: fields.text({ label: 'Label data' }),
        value: fields.text({ label: 'Nilai' }),
      }),
      {
        label: 'Data wilayah',
        itemLabel: (props) => props.fields.label.value || 'Data wilayah',
      }
    ),
  },
});
