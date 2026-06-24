import { NextResponse } from "next/server";

// POST /api/admin/publish
// Stage 5 will implement full publish/unpublish logic.
export async function POST() {
  return NextResponse.json({ ok: true, message: "Publish endpoint stub — Stage 5" });
}
