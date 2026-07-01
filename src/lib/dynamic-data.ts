import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { LogKegiatanDukuhRecord, StatusPublikasiLog } from './log-kegiatan';
import type { PengajuanStatus } from './pengajuan';

export interface PengajuanRecord {
  id: number;
  nomor_surat: string;
  rt_id: string;
  nama: string;
  jenis_kelamin: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  status_kawin: string;
  agama: string;
  pekerjaan: string;
  alamat: string;
  nik: string;
  keperluan: string;
  no_hp: string;
  status: string;
  catatan_rt?: string | null;
  created_at: string | Date;
  updated_at?: string | Date;
}

interface CreatePengajuanInput {
  nomor_surat: string;
  rt_id: string;
  nama: string;
  jenis_kelamin: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  status_kawin: string;
  agama: string;
  pekerjaan: string;
  alamat: string;
  nik: string;
  keperluan: string;
  no_hp: string;
  status: string;
  catatan_rt?: string | null;
}

interface UpdatePengajuanStatusInput {
  id: number;
  status: PengajuanStatus;
  catatan_rt?: string | null;
}

interface CreateLogKegiatanInput {
  judul: string;
  kategori: string;
  tanggal: string;
  waktu_mulai?: string;
  waktu_selesai?: string;
  lokasi?: string;
  ringkasan: string;
  hasil_tindak_lanjut?: string;
  pihak_terlibat?: string;
  foto_dokumentasi?: string;
  status_publikasi: StatusPublikasiLog;
  urutan_tampil: number;
}

interface UpdateLogKegiatanInput extends CreateLogKegiatanInput {
  id: number;
}

function getEnvValue(name: string) {
  const processValue = typeof process !== 'undefined' ? process.env[name] : undefined;
  if (processValue) return processValue;

  const metaEnv =
    typeof import.meta !== 'undefined' &&
    typeof import.meta.env === 'object' &&
    import.meta.env !== null
      ? (import.meta.env as Record<string, string | undefined>)
      : undefined;

  return metaEnv?.[name];
}

function getSupabaseConfig() {
  const url = getEnvValue('SUPABASE_URL') || getEnvValue('PUBLIC_SUPABASE_URL');
  const serviceRoleKey =
    getEnvValue('SUPABASE_SERVICE_ROLE_KEY') ||
    getEnvValue('SUPABASE_KEY') ||
    getEnvValue('PUBLIC_SUPABASE_ANON_KEY');

  if (!url || !serviceRoleKey) return null;
  return { url, serviceRoleKey };
}

function getSupabaseAdminClient(): SupabaseClient | null {
  const config = getSupabaseConfig();
  if (!config) return null;

  return createClient(config.url, config.serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

function normalizeTimestamp(value: unknown) {
  if (value instanceof Date) return value.toISOString();
  return typeof value === 'string' ? value : new Date().toISOString();
}

function normalizeTimeValue(value: unknown) {
  if (typeof value !== 'string') return value ?? null;
  return value.length >= 5 ? value.slice(0, 5) : value;
}

async function getAstroDbContext() {
  const mod = await import('./astro-db-fallback');
  return mod.getAstroDbContext();
}

function serializePengajuan(item: any): PengajuanRecord {
  return {
    ...item,
    created_at: item.created_at instanceof Date ? item.created_at.toISOString() : item.created_at,
    updated_at: item.updated_at instanceof Date ? item.updated_at.toISOString() : item.updated_at,
  };
}

function serializeLog(item: any): LogKegiatanDukuhRecord {
  return {
    ...item,
    waktu_mulai: normalizeTimeValue(item.waktu_mulai),
    waktu_selesai: normalizeTimeValue(item.waktu_selesai),
    created_at: normalizeTimestamp(item.created_at),
    updated_at: normalizeTimestamp(item.updated_at),
  };
}

function isMissingTableError(error: unknown, tableName: string) {
  const message =
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as { message?: unknown }).message === 'string'
      ? (error as { message: string }).message.toLowerCase()
      : error instanceof Error
        ? error.message.toLowerCase()
        : '';

  return (
    message.includes(tableName.toLowerCase()) &&
    (message.includes('no such table') ||
      message.includes('does not exist') ||
      message.includes('schema cache') ||
      message.includes('relation') ||
      message.includes('sqlite_error') ||
      message.includes('sqlite_unknown'))
  );
}

export function isSupabaseConfigured() {
  return !!getSupabaseConfig();
}

export async function generateNomorPengajuan(rtId: string, nomorRt: string) {
  const tahun = new Date().getFullYear();
  const supabase = getSupabaseAdminClient();

  if (supabase) {
    const { data: existing, error } = await supabase
      .from('NomorUrut')
      .select('id, urutan')
      .eq('rt_id', rtId)
      .eq('tahun', tahun)
      .maybeSingle();

    if (error) throw error;

    let urutan = 1;

    if (!existing) {
      const { error: insertError } = await supabase.from('NomorUrut').insert({
        rt_id: rtId,
        tahun,
        urutan,
      });

      if (insertError) throw insertError;
    } else {
      urutan = Number(existing.urutan ?? 0) + 1;
      const { error: updateError } = await supabase
        .from('NomorUrut')
        .update({ urutan })
        .eq('id', existing.id);

      if (updateError) throw updateError;
    }

    return `${String(urutan).padStart(3, '0')}/RT-${nomorRt}/DkV/${tahun}`;
  }

  const { db, eq, and, NomorUrut } = await getAstroDbContext();

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

  return `${String(urutan).padStart(3, '0')}/RT-${nomorRt}/DkV/${tahun}`;
}

export async function createPengajuanRecord(input: CreatePengajuanInput) {
  const payload = {
    ...input,
    catatan_rt: input.catatan_rt ?? null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const supabase = getSupabaseAdminClient();
  if (supabase) {
    const { error } = await supabase.from('Pengajuan').insert(payload);
    if (error) throw error;
    return;
  }

  const { db, Pengajuan } = await getAstroDbContext();

  await db.insert(Pengajuan).values({
    ...input,
    created_at: new Date(),
    updated_at: new Date(),
  });
}

export async function updatePengajuanStatusRecord(input: UpdatePengajuanStatusInput) {
  const payload = {
    status: input.status,
    catatan_rt: input.catatan_rt ?? null,
    updated_at: new Date().toISOString(),
  };

  const supabase = getSupabaseAdminClient();
  if (supabase) {
    const { error } = await supabase.from('Pengajuan').update(payload).eq('id', input.id);
    if (error) throw error;
    return;
  }

  const { db, eq, Pengajuan } = await getAstroDbContext();

  await db
    .update(Pengajuan)
    .set({
      status: input.status,
      catatan_rt: input.catatan_rt,
      updated_at: new Date(),
    })
    .where(eq(Pengajuan.id, input.id));
}

export async function findPengajuanByTicketAndNik(nomorSurat: string, nik: string) {
  const supabase = getSupabaseAdminClient();
  if (supabase) {
    const { data, error } = await supabase
      .from('Pengajuan')
      .select('*')
      .eq('nomor_surat', nomorSurat)
      .eq('nik', nik)
      .limit(1);

    if (error) throw error;
    return data?.[0] ? serializePengajuan(data[0]) : null;
  }

  const { db, eq, and, Pengajuan } = await getAstroDbContext();

  const result = await db
    .select()
    .from(Pengajuan)
    .where(and(eq(Pengajuan.nomor_surat, nomorSurat), eq(Pengajuan.nik, nik)));

  return result[0] ? serializePengajuan(result[0]) : null;
}

export async function getAllPengajuanRecords() {
  const supabase = getSupabaseAdminClient();
  if (supabase) {
    const { data, error } = await supabase
      .from('Pengajuan')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data ?? []).map(serializePengajuan);
  }

  const { db, desc, Pengajuan } = await getAstroDbContext();

  const items = await db
    .select()
    .from(Pengajuan)
    .orderBy(desc(Pengajuan.created_at));

  return items.map(serializePengajuan);
}

export async function getRecentPengajuanRecords(limit = 20) {
  const items = await getAllPengajuanRecords();
  return items.slice(0, limit);
}

export async function getAdminLogKegiatanRecords() {
  const supabase = getSupabaseAdminClient();

  if (supabase) {
    const { data, error } = await supabase
      .from('LogKegiatanDukuh')
      .select('*')
      .order('tanggal', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      if (isMissingTableError(error, 'LogKegiatanDukuh')) return [];
      throw error;
    }

    return (data ?? []).map(serializeLog);
  }

  try {
    const { db, desc, LogKegiatanDukuh } = await getAstroDbContext();

    const items = await db
      .select()
      .from(LogKegiatanDukuh)
      .orderBy(desc(LogKegiatanDukuh.tanggal), desc(LogKegiatanDukuh.created_at));

    return items.map(serializeLog);
  } catch (error) {
    if (isMissingTableError(error, 'LogKegiatanDukuh')) return [];
    throw error;
  }
}

export async function getPublicLogKegiatanRecords() {
  const supabase = getSupabaseAdminClient();

  if (supabase) {
    const { data, error } = await supabase
      .from('LogKegiatanDukuh')
      .select('*')
      .eq('status_publikasi', 'publish')
      .order('urutan_tampil', { ascending: false })
      .order('tanggal', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      if (isMissingTableError(error, 'LogKegiatanDukuh')) return [];
      throw error;
    }

    return (data ?? []).map(serializeLog);
  }

  try {
    const { db, eq, desc, LogKegiatanDukuh } = await getAstroDbContext();

    const items = await db
      .select()
      .from(LogKegiatanDukuh)
      .where(eq(LogKegiatanDukuh.status_publikasi, 'publish'))
      .orderBy(desc(LogKegiatanDukuh.urutan_tampil), desc(LogKegiatanDukuh.tanggal), desc(LogKegiatanDukuh.created_at));

    return items.map(serializeLog);
  } catch (error) {
    if (isMissingTableError(error, 'LogKegiatanDukuh')) return [];
    throw error;
  }
}

export async function getLogKegiatanByIdRecord(id: number) {
  const supabase = getSupabaseAdminClient();

  if (supabase) {
    const { data, error } = await supabase
      .from('LogKegiatanDukuh')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      if (isMissingTableError(error, 'LogKegiatanDukuh')) return null;
      throw error;
    }

    return data ? serializeLog(data) : null;
  }

  try {
    const { db, eq, LogKegiatanDukuh } = await getAstroDbContext();

    const items = await db
      .select()
      .from(LogKegiatanDukuh)
      .where(eq(LogKegiatanDukuh.id, id));

    return items[0] ? serializeLog(items[0]) : null;
  } catch (error) {
    if (isMissingTableError(error, 'LogKegiatanDukuh')) return null;
    throw error;
  }
}

export async function createLogKegiatanRecord(input: CreateLogKegiatanInput) {
  const payload = {
    ...input,
    waktu_mulai: input.waktu_mulai || null,
    waktu_selesai: input.waktu_selesai || null,
    lokasi: input.lokasi || null,
    hasil_tindak_lanjut: input.hasil_tindak_lanjut || null,
    pihak_terlibat: input.pihak_terlibat || null,
    foto_dokumentasi: input.foto_dokumentasi || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const supabase = getSupabaseAdminClient();
  if (supabase) {
    const { error } = await supabase.from('LogKegiatanDukuh').insert(payload);
    if (error) throw error;
    return;
  }

  const { db, LogKegiatanDukuh } = await getAstroDbContext();

  await db.insert(LogKegiatanDukuh).values({
    ...input,
    created_at: new Date(),
    updated_at: new Date(),
  });
}

export async function updateLogKegiatanRecord(input: UpdateLogKegiatanInput) {
  const payload = {
    judul: input.judul,
    kategori: input.kategori,
    tanggal: input.tanggal,
    waktu_mulai: input.waktu_mulai || null,
    waktu_selesai: input.waktu_selesai || null,
    lokasi: input.lokasi || null,
    ringkasan: input.ringkasan,
    hasil_tindak_lanjut: input.hasil_tindak_lanjut || null,
    pihak_terlibat: input.pihak_terlibat || null,
    foto_dokumentasi: input.foto_dokumentasi || null,
    status_publikasi: input.status_publikasi,
    urutan_tampil: input.urutan_tampil,
    updated_at: new Date().toISOString(),
  };

  const supabase = getSupabaseAdminClient();
  if (supabase) {
    const { error } = await supabase.from('LogKegiatanDukuh').update(payload).eq('id', input.id);
    if (error) throw error;
    return;
  }

  const { db, eq, LogKegiatanDukuh } = await getAstroDbContext();

  await db
    .update(LogKegiatanDukuh)
    .set({
      ...payload,
      updated_at: new Date(),
    })
    .where(eq(LogKegiatanDukuh.id, input.id));
}

export async function updateLogKegiatanStatusRecord(id: number, status: StatusPublikasiLog) {
  const payload = {
    status_publikasi: status,
    updated_at: new Date().toISOString(),
  };

  const supabase = getSupabaseAdminClient();
  if (supabase) {
    const { error } = await supabase.from('LogKegiatanDukuh').update(payload).eq('id', id);
    if (error) throw error;
    return;
  }

  const { db, eq, LogKegiatanDukuh } = await getAstroDbContext();

  await db
    .update(LogKegiatanDukuh)
    .set({
      status_publikasi: status,
      updated_at: new Date(),
    })
    .where(eq(LogKegiatanDukuh.id, id));
}

export async function deleteLogKegiatanRecord(id: number) {
  const supabase = getSupabaseAdminClient();
  if (supabase) {
    const { error } = await supabase.from('LogKegiatanDukuh').delete().eq('id', id);
    if (error) throw error;
    return;
  }

  const { db, eq, LogKegiatanDukuh } = await getAstroDbContext();
  await db.delete(LogKegiatanDukuh).where(eq(LogKegiatanDukuh.id, id));
}
