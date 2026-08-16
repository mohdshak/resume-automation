import mammoth from "mammoth";

/**
 * Checks whether a line is raw PDF binary/structural metadata
 */
export function isPdfBinaryArtifact(line: string): boolean {
  if (!line || typeof line !== "string") return true;
  const clean = line.trim();
  if (clean.length === 0) return true;
  // Match common PDF structure keywords and binary metadata
  if (/^(%PDF-|<<|>>|endobj|endstream|startxref|xref|trailer)/i.test(clean)) return true;
  if (/\b(ViewerPreferences|OutputIntents|StructTreeRoot|ParentTree|CreationDate|ModDate|xmp:|rdf:|<rdf:|<\?xpacket|\/Type\s*\/|\/Font\s*\/|\/Pages\s*\/|\/Kids\s*\[|\/MediaBox)\b/i.test(clean)) return true;
  if (/^[A-Za-z0-9_\-\/\s]{1,10}\s*\d+\s+0\s+R\b/.test(clean)) return true;
  if (/[\\~^&%#$@`]{4,}/.test(clean)) return true;
  return false;
}

/**
 * Extracts clean plain text from PDF buffer using pdf-parse and artifact filtering
 */
export async function extractTextFromPdfBuffer(buffer: Buffer): Promise<string> {
  try {
    const pdf = require("pdf-parse");
    const data = await pdf(buffer);
    if (data && data.text && data.text.trim().length > 10) {
      const filtered = data.text
        .split(/\r?\n/)
        .map((l: string) => l.trim())
        .filter((l: string) => !isPdfBinaryArtifact(l))
        .join("\n")
        .trim();
      return filtered;
    }
  } catch (err) {
    console.warn("pdf-parse extraction failed:", err);
  }

  return "";
}

/**
 * Converts DOCX binary buffer into clean semantic HTML
 */
export async function convertDocxToHtml(buffer: Buffer): Promise<string> {
  try {
    const result = await mammoth.convertToHtml({ buffer });
    return result.value;
  } catch (err) {
    console.error("Mammoth DOCX to HTML conversion error:", err);
    throw err;
  }
}

/**
 * Converts PDF binary buffer into structured semantic HTML
 */
export async function convertPdfToHtml(buffer: Buffer): Promise<string> {
  const extractedText = await extractTextFromPdfBuffer(buffer);
  if (!extractedText || extractedText.length === 0) {
    return `<div class="resume-document"><p>No text could be extracted from PDF stream.</p></div>`;
  }

  const lines = extractedText.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0 && !isPdfBinaryArtifact(l));
  let html = `<div class="resume-document">\n`;
  let inList = false;

  for (const line of lines) {
    const isHeading = /^(PROFESSIONAL SUMMARY|SUMMARY|WORK EXPERIENCE|EXPERIENCE|EMPLOYMENT HISTORY|EDUCATION|SKILLS|TECHNICAL SKILLS|PROJECTS|CERTIFICATIONS)$/i.test(line);
    const isBullet = /^[•\-\*▪–\d\.]\s*/.test(line);

    if (isHeading) {
      if (inList) {
        html += `  </ul>\n`;
        inList = false;
      }
      html += `  <h2 class="section-title">${line}</h2>\n`;
    } else if (isBullet) {
      if (!inList) {
        html += `  <ul>\n`;
        inList = true;
      }
      const cleanItem = line.replace(/^[•\-\*▪–\d\.]\s*/, "").trim();
      html += `    <li>${cleanItem}</li>\n`;
    } else {
      if (inList) {
        html += `  </ul>\n`;
        inList = false;
      }
      html += `  <p>${line}</p>\n`;
    }
  }

  if (inList) {
    html += `  </ul>\n`;
    inList = false;
  }

  html += `</div>`;
  return html;
}
