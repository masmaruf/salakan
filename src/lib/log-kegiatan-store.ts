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

function isMissingLogTableError(error: unknown) {
  if (!(error instanceof Error)) return false;

  const message = error.message.toLowerCase();
  return (
    message.includes('logkegiatandukuh') &&
    (message.includes('no such table') ||
      message.includes('does not exist') ||
      message.includes('sqlite_error') ||
      message.includes('sqlite_unknown'))
  );
}

export async function getAdminLogKegiatan() {
  try {
    const items = await db
      .select()
      .from(LogKegiatanDukuh)
      .orderBy(desc(LogKegiatanDukuh.tanggal), desc(LogKegiatanDukuh.created_at));

    return items.map(serializeLog);
  } catch (error) {
    if (isMissingLogTableError(error)) {
      return [];
    }

    throw error;
  }
}

export async function getPublicLogKegiatan() {
  try {
    const items = await db
      .select()
      .from(LogKegiatanDukuh)
      .where(eq(LogKegiatanDukuh.status_publikasi, 'publish'))
      .orderBy(desc(LogKegiatanDukuh.urutan_tampil), desc(LogKegiatanDukuh.tanggal), desc(LogKegiatanDukuh.created_at));

    return items.map(serializeLog);
  } catch (error) {
    if (isMissingLogTableError(error)) {
      return [];
    }

    throw error;
  }
}

export async function getLogKegiatanById(id: number) {
  try {
    const items = await db
      .select()
      .from(LogKegiatanDukuh)
      .where(eq(LogKegiatanDukuh.id, id));

    return items[0] ? serializeLog(items[0]) : null;
  } catch (error) {
    if (isMissingLogTableError(error)) {
      return null;
    }

    throw error;
  }
}
