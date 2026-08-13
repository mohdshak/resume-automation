import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const resume = await req.json();
    const basics = resume.basics || {};
    const skills = resume.skills || [];
    const work = resume.work || [];
    const education = resume.education || [];

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${basics.name || "Resume"} - ATS Resume</title>
  <style>
    @page { size: letter portrait; margin: 0.55in 0.6in; }
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 10pt; line-height: 1.35; color: #111827; margin: 0; padding: 0; }
    .header { text-align: center; margin-bottom: 12px; border-bottom: 1.5px solid #1f2937; padding-bottom: 8px; }
    .name { font-size: 19pt; font-weight: 700; margin: 0; color: #0f172a; }
    .headline { font-size: 11pt; font-weight: 600; color: #334155; margin: 3px 0 5px 0; }
    .contact-info { font-size: 9pt; color: #475569; }
    .section-title { font-size: 11pt; font-weight: 700; text-transform: uppercase; border-bottom: 1px solid #cbd5e1; padding-bottom: 2px; margin-top: 10px; margin-bottom: 6px; }
    ul { margin: 2px 0 4px 0; padding-left: 18px; }
    li { margin-bottom: 3px; text-align: justify; }
  </style>
</head>
<body>
  <div class="header">
    <h1 class="name">${basics.name || "Candidate"}</h1>
    <div class="headline">${basics.label || ""}</div>
    <div class="contact-info">${basics.email || ""} • ${basics.phone || ""} • ${basics.url || ""}</div>
  </div>
  ${basics.summary ? `<div class="section-title">Professional Summary</div><p>${basics.summary}</p>` : ""}
  ${skills.length > 0 ? `<div class="section-title">Technical Skills & Competencies</div>${skills.map((s: any) => `<div><strong>${s.name}:</strong> ${(s.keywords || []).join(", ")}</div>`).join("")}` : ""}
  ${work.length > 0 ? `<div class="section-title">Professional Experience</div>${work.map((w: any) => `<div><strong>${w.position}</strong> — ${w.name} (${w.startDate} - ${w.endDate || "Present"})<ul>${(w.highlights || []).map((h: string) => `<li>${h}</li>`).join("")}</ul></div>`).join("")}` : ""}
  ${education.length > 0 ? `<div class="section-title">Education</div>${education.map((e: any) => `<div><strong>${e.institution}</strong> - ${e.studyType || ""} in ${e.area || ""}</div>`).join("")}` : ""}
</body>
</html>`;

    return new NextResponse(html, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
