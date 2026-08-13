import { NextRequest, NextResponse } from "next/server";
import { parseResumeTextToSchema } from "@/lib/resume-parser";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawText = body.raw_text || "";

    if (!rawText.trim()) {
      return NextResponse.json({ error: "raw_text is required" }, { status: 400 });
    }

    const parsedProfile = parseResumeTextToSchema(rawText);

    return NextResponse.json({
      status: "success",
      parsed_profile: parsedProfile,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
