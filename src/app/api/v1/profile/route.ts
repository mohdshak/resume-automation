import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ status: "success", message: "Use client-side profile or upload" });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  return NextResponse.json({ status: "success", profile: body });
}
