import type { APIRoute } from 'astro';
import { db, Pengajuan, eq } from 'astro:db';

// PATCH /api/pengajuan/[id] — update status
export const PATCH: APIRoute = async ({ params, request }) => {
  const id = Number(params.id);
  if (!id) {
    return new Response(JSON.stringify({ ok: false, message: 'ID tidak valid.' }), { status: 400 });
  }

  const body = await request.json();
  const validStatus = ['menunggu', 'diproses', 'selesai', 'ditolak'];
  if (!validStatus.includes(body.status)) {
    return new Response(JSON.stringify({ ok: false, message: 'Status tidak valid.' }), { status: 400 });
  }

  await db
    .update(Pengajuan)
    .set({ status: body.status, catatan_rt: body.catatan_rt ?? undefined, updated_at: new Date() })
    .where(eq(Pengajuan.id, id));

  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
