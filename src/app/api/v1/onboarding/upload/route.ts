import { NextRequest, NextResponse } from "next/server";
import { extractTextFromPdfBuffer } from "@/lib/pdf-server";
import { extractTextFromDocxBuffer, parseResumeTextToSchema } from "@/lib/resume-parser";


export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const filename = file.name.toLowerCase();

    let extractedText = "";

    if (filename.endsWith(".json")) {
      try {
        const jsonStr = buffer.toString("utf-8");
        const parsedJson = JSON.parse(jsonStr);
        return NextResponse.json({
          status: "success",
          filename: file.name,
          parsed_profile: parsedJson,
        });
      } catch {
        extractedText = buffer.toString("utf-8");
      }
    } else if (filename.endsWith(".pdf")) {
      extractedText = await extractTextFromPdfBuffer(buffer);
    } else if (filename.endsWith(".docx")) {
      extractedText = extractTextFromDocxBuffer(buffer);
    } else {
      extractedText = buffer.toString("utf-8");
    }

    const parsedProfile = parseResumeTextToSchema(extractedText);

    return NextResponse.json({
      status: "success",
      filename: file.name,
      parsed_profile: parsedProfile,
    });
  } catch (error: any) {
    console.error("Upload parse error:", error);
    return NextResponse.json({ error: error.message || "Failed to parse resume" }, { status: 500 });
  }
}
