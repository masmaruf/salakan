import * as astroDb from 'astro:db';
import type { LogKegiatanDukuhRecord } from './log-kegiatan';

const { db, desc, eq } = astroDb;
const { LogKegiatanDukuh } = astroDb as typeof astroDb & {
  LogKegiatanDukuh: any;
};

function serializeLog(item: any): LogKegiatanDukuhRecord {
  return {
    ...item,
    created_at: item.created_at instanceof Date ? item.created_at.toISOString() : item.created_at,
    updated_at: item.updated_at instanceof Date ? item.updated_at.toISOString() : item.updated_at,
  };
}

export async function getAdminLogKegiatan() {
  const items = await db
    .select()
    .from(LogKegiatanDukuh)
    .orderBy(desc(LogKegiatanDukuh.tanggal), desc(LogKegiatanDukuh.created_at));

  return items.map(serializeLog);
}

export async function getPublicLogKegiatan() {
  const items = await db
    .select()
    .from(LogKegiatanDukuh)
    .where(eq(LogKegiatanDukuh.status_publikasi, 'publish'))
    .orderBy(desc(LogKegiatanDukuh.urutan_tampil), desc(LogKegiatanDukuh.tanggal), desc(LogKegiatanDukuh.created_at));

  return items.map(serializeLog);
}

export async function getLogKegiatanById(id: number) {
  const items = await db
    .select()
    .from(LogKegiatanDukuh)
    .where(eq(LogKegiatanDukuh.id, id));

  return items[0] ? serializeLog(items[0]) : null;
}
