/**
 * Server-only PDF extraction utility
 */
export async function extractTextFromPdfBuffer(buffer: Buffer): Promise<string> {
  try {
    const pdfParse = require("pdf-parse");
    const data = await pdfParse(buffer);
    if (data && data.text && data.text.trim().length > 10) {
      return data.text.trim();
    }
  } catch (err) {
    console.warn("pdf-parse extraction failed, falling back to raw buffer decode:", err);
  }

  const raw = buffer.toString("utf-8");
  return raw.replace(/[^\x20-\x7E\n\r\t]/g, " ").replace(/\s+/g, " ").trim();
}
