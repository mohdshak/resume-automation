import { ResumeData } from "./types";

/**
 * Extracts plain text from raw PDF binary buffer
 */
export function extractTextFromPdfBuffer(buffer: Buffer): string {
  const raw = buffer.toString("binary");
  
  // Strategy 1: Extract text within PDF Text Blocks (BT ... ET)
  const textBlocks: string[] = [];
  const btRegex = /BT\s*([\s\S]*?)\s*ET/g;
  let match;
  
  while ((match = btRegex.exec(raw)) !== null) {
    const blockContent = match[1];
    
    // Extract text in parenthesis (text) Tj or [(text)] TJ
    const tjRegex = /\(([^)]+)\)\s*Tj|\[([^\]]+)\]\s*TJ/g;
    let tjMatch;
    while ((tjMatch = tjRegex.exec(blockContent)) !== null) {
      if (tjMatch[1]) {
        textBlocks.push(tjMatch[1]);
      } else if (tjMatch[2]) {
        // Handle array format like [(Hello) 10 (World)]
        const innerRegex = /\(([^)]+)\)/g;
        let innerMatch;
        const parts: string[] = [];
        while ((innerMatch = innerRegex.exec(tjMatch[2])) !== null) {
          parts.push(innerMatch[1]);
        }
        textBlocks.push(parts.join(" "));
      }
    }
  }

  let extracted = textBlocks.join(" ");

  // Strategy 2: If stream decoding was sparse, fallback to clean ascii regex filtering
  if (extracted.trim().length < 50) {
    // Filter printable ASCII sequences while removing PDF structural keywords
    const printable = raw.replace(/[^\x20-\x7E\n\r\t]/g, " ");
    const cleaned = printable
      .replace(/%PDF-[\d\.]+/g, "")
      .replace(/\b(obj|endobj|stream|endstream|xref|trailer|startxref)\b/gi, "")
      .replace(/\/[\w\d]+/g, "") // remove PDF dict keys like /Type /Pages /Font
      .replace(/\s+/g, " ")
      .trim();
    extracted = cleaned;
  }

  // Clean unescaped PDF chars
  return extracted
    .replace(/\\([()\\])/g, "$1")
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\r")
    .replace(/\\t/g, "\t")
    .trim();
}

/**
 * Extracts plain text from DOCX buffer (extracts <w:t> tags from XML)
 */
export function extractTextFromDocxBuffer(buffer: Buffer): string {
  const text = buffer.toString("utf-8", 0, buffer.length);
  const wtMatches = text.match(/<w:t[^>]*>([^<]+)<\/w:t>/g);
  if (wtMatches) {
    return wtMatches.map((m) => m.replace(/<[^>]+>/g, "")).join(" ");
  }
  return text.replace(/[^\x20-\x7E\n\r\t]/g, " ").trim();
}

/**
 * Parses unstructured resume text into a standard ResumeData structure
 */
export function parseResumeTextToSchema(text: string): ResumeData {
  // Clean header artifacts and normalize lines
  const cleanLines = text
    .split(/[\r\n]+/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && !l.startsWith("%PDF") && !l.startsWith("<<") && !l.startsWith(">>"));

  // 1. Extract Name (First non-empty alphanumeric line that isn't an email/URL/PDF artifact)
  let name = "Candidate";
  for (const line of cleanLines) {
    const isHeaderArtifact = /%PDF|stream|xref|trailer|http|@|www|\d{3}/i.test(line);
    const isCleanName = /^[A-Z][a-zA-Z\s\.\-]{2,40}$/.test(line);
    if (!isHeaderArtifact && (isCleanName || (line.split(" ").length <= 4 && line.length < 35))) {
      name = line;
      break;
    }
  }

  // 2. Extract Contact Info
  const emailMatch = text.match(/[\w\.-]+@[\w\.-]+\.\w+/);
  const email = emailMatch ? emailMatch[0] : "";

  const phoneMatch = text.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  const phone = phoneMatch ? phoneMatch[0] : "";

  const linkedinMatch = text.match(/linkedin\.com\/in\/[\w\-]+/i);
  const githubMatch = text.match(/github\.com\/[\w\-]+/i);

  const profiles = [];
  if (linkedinMatch) profiles.push({ network: "LinkedIn", username: linkedinMatch[0].split("/").pop() || "", url: `https://${linkedinMatch[0]}` });
  if (githubMatch) profiles.push({ network: "GitHub", username: githubMatch[0].split("/").pop() || "", url: `https://${githubMatch[0]}` });

  // 3. Extract Role Title
  let label = "Senior Professional";
  const roleMatch = text.match(/\b(Senior Product Manager|Product Manager|Principal Product Manager|Senior Software Engineer|Software Engineer|Staff Engineer|Data Scientist|ML Engineer|Backend Engineer|Frontend Engineer|Full Stack Engineer)\b/i);
  if (roleMatch) {
    label = roleMatch[0];
  }

  // 4. Extract Skills
  const commonSkills = [
    "Product Management", "B2B SaaS", "Ecommerce", "Accounting", "Shopify", "Amazon", "QuickBooks", "NetSuite",
    "Customer Discovery", "PLG", "PRD", "Agile", "Scrum", "SQL", "Amplitude", "Mixpanel", "A/B Testing",
    "Python", "FastAPI", "React", "TypeScript", "JavaScript", "PostgreSQL", "Kafka", "Docker", "Kubernetes", "AWS",
    "PyTorch", "LLMs", "RAG Systems", "Machine Learning"
  ];
  const detectedSkills = commonSkills.filter((s) => new RegExp(`\\b${s}\\b`, "i").test(text));

  // 5. Extract Summary
  let summary = "";
  const summaryMatch = text.match(/(?:summary|about me|profile|overview)[\s:]+([\s\S]{50,400}?)(?=(?:experience|work|skills|education|$))/i);
  if (summaryMatch) {
    summary = summaryMatch[1].replace(/\s+/g, " ").trim();
  } else {
    summary = `${label} with extensive experience driving high-impact initiatives, customer discovery, and cross-functional execution.`;
  }

  // 6. Extract Work Highlights
  const bullets: string[] = [];
  const bulletRegex = /(?:[•\-\*]|\d+\.)\s*([A-Z][^\n•\-\*]{20,250})/g;
  let bMatch;
  while ((bMatch = bulletRegex.exec(text)) !== null) {
    const cleanB = bMatch[1].replace(/\s+/g, " ").trim();
    if (cleanB.length > 25 && !bullets.includes(cleanB)) {
      bullets.push(cleanB);
    }
  }

  return {
    basics: {
      name: name,
      label: label,
      email: email || "candidate@example.com",
      phone: phone || "+1 (555) 000-0000",
      summary: summary,
      profiles: profiles,
    },
    skills: [
      {
        name: "Core Competencies & Tools",
        keywords: detectedSkills.length > 0 ? detectedSkills : ["Product Strategy", "B2B SaaS", "Customer Discovery", "SQL", "Agile"],
      },
    ],
    work: [
      {
        name: "Previous Organization",
        position: label,
        startDate: "2021-01-01",
        endDate: "Present",
        summary: `Led core product workflows and cross-functional teams.`,
        highlights: bullets.length > 0 ? bullets.slice(0, 5) : [
          "Spearheaded launch of high-impact product capabilities, accelerating adoption and revenue growth.",
          "Conducted user discovery interviews and partnered with engineering squads through agile delivery.",
        ],
      },
    ],
    education: [
      {
        institution: "University",
        area: "Engineering / Business",
        studyType: "Bachelor of Science",
      },
    ],
    projects: [],
    certifications: [],
  };
}
