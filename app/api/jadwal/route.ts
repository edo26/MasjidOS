import { NextRequest, NextResponse } from "next/server";

import { fetchTodayTomorrow } from "@/services/myquran";

/**
 * API route: jadwal hari ini + besok (JSON) agar klien tidak bergantung CORS eksternal.
 */
export async function GET(req: NextRequest) {
  const kota = req.nextUrl.searchParams.get("kota");
  const kotaId = kota ? parseInt(kota, 10) : 1301;
  if (Number.isNaN(kotaId) || kotaId < 1) {
    return NextResponse.json(
      { error: "kota tidak valid" },
      { status: 400 }
    );
  }
  try {
    const data = await fetchTodayTomorrow(kotaId);
    return NextResponse.json(
      { status: true, data },
      { headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=300" } }
    );
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Gagal memuat" },
      { status: 502 }
    );
  }
}
