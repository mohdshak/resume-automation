import { NextRequest, NextResponse } from "next/server";
import { convertPdfToHtml, convertDocxToHtml } from "@/lib/pdf-to-html";
import { parseHtmlResumeToSchema } from "@/lib/html-resume-parser";
import { parseResumeTextToSchema } from "@/lib/resume-parser";

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

    let parsedProfile;
    let htmlContent = "";

    if (filename.endsWith(".json")) {
      try {
        const jsonStr = buffer.toString("utf-8");
        parsedProfile = JSON.parse(jsonStr);
      } catch {
        parsedProfile = parseResumeTextToSchema(buffer.toString("utf-8"));
      }
    } else if (filename.endsWith(".docx")) {
      htmlContent = await convertDocxToHtml(buffer);
      parsedProfile = parseHtmlResumeToSchema(htmlContent);
    } else if (filename.endsWith(".pdf")) {
      htmlContent = await convertPdfToHtml(buffer);
      parsedProfile = parseHtmlResumeToSchema(htmlContent);
    } else {
      const text = buffer.toString("utf-8");
      parsedProfile = parseResumeTextToSchema(text);
    }

    return NextResponse.json({
      status: "success",
      filename: file.name,
      html_content: htmlContent || parsedProfile.html_content || "",
      parsed_profile: parsedProfile,
    });
  } catch (error: any) {
    console.error("Upload & HTML parse error:", error);
    return NextResponse.json({ error: error.message || "Failed to parse resume" }, { status: 500 });
  }
}
