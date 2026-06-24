import { NextResponse } from "next/server";

// POST /api/client-approvals
// Stage 7 will implement the full approval storage logic.
export async function POST() {
  return NextResponse.json({ ok: true, message: "Approval endpoint stub — Stage 7" });
}
