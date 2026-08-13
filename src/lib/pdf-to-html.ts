import mammoth from "mammoth";

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
 * Converts PDF binary buffer into structured semantic HTML using pdf2json & line grouping
 */
export async function convertPdfToHtml(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const PDFParser = require("pdf2json");
      const pdfParser = new PDFParser();

      pdfParser.on("pdfParser_dataError", (errData: any) => {
        console.warn("pdf2json error, falling back to basic HTML:", errData);
        resolve(fallbackBufferToHtml(buffer));
      });

      pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
        try {
          const html = renderPdfJsonToHtml(pdfData);
          resolve(html);
        } catch (renderErr) {
          console.error("PDF JSON rendering error:", renderErr);
          resolve(fallbackBufferToHtml(buffer));
        }
      });

      pdfParser.parseBuffer(buffer);
    } catch (err) {
      console.error("PDF to HTML error:", err);
      resolve(fallbackBufferToHtml(buffer));
    }
  });
}

/**
 * Groups PDF text elements into lines, headings, paragraphs, and list items
 */
function renderPdfJsonToHtml(pdfData: any): string {
  const pages = pdfData.Pages || [];
  let html = `<div class="resume-document">\n`;

  for (const page of pages) {
    const texts = page.Texts || [];
    if (texts.length === 0) continue;

    // Group text items by vertical Y coordinate (within threshold of ~0.35)
    const lineMap = new Map<number, any[]>();
    for (const t of texts) {
      const y = Math.round(t.y * 2) / 2; // snap to nearest half unit
      if (!lineMap.has(y)) {
        lineMap.set(y, []);
      }
      lineMap.get(y)!.push(t);
    }

    // Sort lines from top to bottom
    const sortedY = Array.from(lineMap.keys()).sort((a, b) => a - b);
    let inList = false;

    for (const y of sortedY) {
      const lineItems = lineMap.get(y)!;
      // Sort items left to right
      lineItems.sort((a, b) => a.x - b.x);

      // Decode and concatenate text fragments
      const rawLine = lineItems
        .map((item) => {
          const textVal = item.R?.map((r: any) => decodeURIComponent(r.T)).join("") || "";
          const isBold = item.R?.some((r: any) => r.TS?.[2] === 1 || r.TS?.[1] > 14);
          return isBold ? `<strong>${textVal}</strong>` : textVal;
        })
        .join(" ")
        .trim();

      if (!rawLine || rawLine.length === 0) continue;

      // Detect section headings
      const isHeading = /^(PROFESSIONAL SUMMARY|SUMMARY|WORK EXPERIENCE|EXPERIENCE|EMPLOYMENT HISTORY|EDUCATION|SKILLS|TECHNICAL SKILLS|PROJECTS|CERTIFICATIONS)$/i.test(
        rawLine.replace(/<[^>]+>/g, "").trim()
      );

      // Detect list items / bullet points
      const isBullet = /^[•\-\*▪–\d\.]\s*/.test(rawLine.replace(/<[^>]+>/g, "").trim());

      if (isHeading) {
        if (inList) {
          html += `  </ul>\n`;
          inList = false;
        }
        html += `  <h2 class="section-title">${rawLine}</h2>\n`;
      } else if (isBullet) {
        if (!inList) {
          html += `  <ul>\n`;
          inList = true;
        }
        const cleanItem = rawLine.replace(/^[•\-\*▪–\d\.]\s*/, "").trim();
        html += `    <li>${cleanItem}</li>\n`;
      } else {
        if (inList) {
          html += `  </ul>\n`;
          inList = false;
        }
        html += `  <p>${rawLine}</p>\n`;
      }
    }

    if (inList) {
      html += `  </ul>\n`;
      inList = false;
    }
  }

  html += `</div>`;
  return html;
}

function fallbackBufferToHtml(buffer: Buffer): string {
  const text = buffer.toString("utf-8").replace(/[^\x20-\x7E\n\r\t]/g, " ");
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0);
  return `<div class="resume-document">\n${lines.map((l) => `<p>${l}</p>`).join("\n")}\n</div>`;
}
