import type { APIRoute } from 'astro';
import { db, Pengajuan, NomorUrut, eq, and } from 'astro:db';
import { getCollection } from 'astro:content';

// ── Generate nomor surat ────────────────────────────────────────────────────
// Format: 001/RT-01/DkV/2025
async function generateNomor(rtId: string, nomorRt: string): Promise<string> {
  const tahun = new Date().getFullYear();

  // Cari / buat baris counter untuk RT + tahun ini
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

// ── POST /api/pengajuan ────────────────────────────────────────────────────
export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();

    const required = [
      'rt_id','nama','jenis_kelamin','tempat_lahir','tanggal_lahir',
      'status_kawin','agama','pekerjaan','alamat','nik','keperluan','no_hp',
    ];
    for (const key of required) {
      if (!body[key]?.toString().trim()) {
        return new Response(
          JSON.stringify({ ok: false, message: `Field '${key}' wajib diisi.` }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }
    if (body.nik.replace(/\D/g, '').length !== 16) {
      return new Response(
        JSON.stringify({ ok: false, message: 'NIK harus 16 digit.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Ambil data RT dari Keystatic content
    const semuaRt = await getCollection('rt');
    const rtData = semuaRt.find((r) => r.id === body.rt_id);
    if (!rtData || !rtData.data.aktif) {
      return new Response(
        JSON.stringify({ ok: false, message: 'RT tidak ditemukan atau tidak aktif.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const nomor_surat = await generateNomor(body.rt_id, rtData.data.nomor_rt);

    await db.insert(Pengajuan).values({
      nomor_surat,
      rt_id:          body.rt_id,
      nama:           body.nama.trim(),
      jenis_kelamin:  body.jenis_kelamin,
      tempat_lahir:   body.tempat_lahir.trim(),
      tanggal_lahir:  body.tanggal_lahir,
      status_kawin:   body.status_kawin,
      agama:          body.agama,
      pekerjaan:      body.pekerjaan.trim(),
      alamat:         body.alamat.trim(),
      nik:            body.nik.replace(/\D/g, ''),
      keperluan:      body.keperluan.trim(),
      no_hp:          body.no_hp.trim(),
      status:         'menunggu',
      created_at:     new Date(),
      updated_at:     new Date(),
    });

    return new Response(
      JSON.stringify({ ok: true, nomor_surat, message: 'Pengajuan berhasil disimpan.' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (err) {
    console.error('[POST /api/pengajuan]', err);
    return new Response(
      JSON.stringify({ ok: false, message: 'Terjadi kesalahan server.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// ── GET /api/pengajuan?rt_id=rt-01&status=menunggu ────────────────────────
export const GET: APIRoute = async ({ url }) => {
  const rtId    = url.searchParams.get('rt_id');
  const status  = url.searchParams.get('status');

  let query = db.select().from(Pengajuan);
  const filters = [];
  if (rtId)   filters.push(eq(Pengajuan.rt_id, rtId));
  if (status) filters.push(eq(Pengajuan.status, status));
  if (filters.length) query = query.where(and(...filters)) as typeof query;

  const rows = await query;
  return new Response(JSON.stringify({ ok: true, data: rows }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
