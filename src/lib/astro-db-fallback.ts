import * as astroDb from 'astro:db';

export function getAstroDbContext() {
  return {
    db: astroDb.db,
    eq: astroDb.eq,
    and: astroDb.and,
    desc: astroDb.desc,
    Pengajuan: (astroDb as typeof astroDb & { Pengajuan: any }).Pengajuan,
    NomorUrut: (astroDb as typeof astroDb & { NomorUrut: any }).NomorUrut,
    LogKegiatanDukuh: (astroDb as typeof astroDb & { LogKegiatanDukuh: any }).LogKegiatanDukuh,
  };
}
