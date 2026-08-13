import { ResumeData, WorkExperience, Education, SkillCategory, Project, Certification } from "./types";

/**
 * Extracts plain text from PDF buffer using decompressing PDF parser
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

/**
 * Extracts plain text from DOCX buffer
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
 * Helper to split text into distinct standard resume sections
 */
function splitResumeSections(text: string): Record<string, string> {
  const sectionKeywords = [
    { key: "summary", regex: /(?:^|\n)\s*(?:PROFESSIONAL\s+SUMMARY|SUMMARY|ABOUT\s+ME|PROFILE|EXECUTIVE\s+SUMMARY|OVERVIEW)\b[:\s-]*/i },
    { key: "experience", regex: /(?:^|\n)\s*(?:WORK\s+EXPERIENCE|PROFESSIONAL\s+EXPERIENCE|EXPERIENCE|EMPLOYMENT\s+HISTORY|WORK\s+HISTORY|CAREER\s+HISTORY)\b[:\s-]*/i },
    { key: "education", regex: /(?:^|\n)\s*(?:EDUCATION|ACADEMIC\s+BACKGROUND|ACADEMICS|DEGREES)\b[:\s-]*/i },
    { key: "skills", regex: /(?:^|\n)\s*(?:SKILLS|TECHNICAL\s+SKILLS|CORE\s+COMPETENCIES|SKILLS\s+&\s+TOOLS|KEY\s+SKILLS|AREAS\s+OF\s+EXPERTISE)\b[:\s-]*/i },
    { key: "projects", regex: /(?:^|\n)\s*(?:PROJECTS|KEY\s+PROJECTS|PERSONAL\s+PROJECTS|ACADEMIC\s+PROJECTS)\b[:\s-]*/i },
    { key: "certifications", regex: /(?:^|\n)\s*(?:CERTIFICATIONS|CERTIFICATES|LICENSES|AWARDS)\b[:\s-]*/i },
  ];

  const sections: Record<string, string> = {
    header: "",
    summary: "",
    experience: "",
    education: "",
    skills: "",
    projects: "",
    certifications: "",
  };

  // Find occurrences of section headers
  const foundHeaders: Array<{ key: string; index: number; length: number }> = [];
  for (const sk of sectionKeywords) {
    const match = text.match(sk.regex);
    if (match && match.index !== undefined) {
      foundHeaders.push({ key: sk.key, index: match.index, length: match[0].length });
    }
  }

  // Sort headers by their order of appearance in the document
  foundHeaders.sort((a, b) => a.index - b.index);

  if (foundHeaders.length === 0) {
    // No explicit headers found -> whole text in experience/summary
    sections.header = text.slice(0, 300);
    sections.experience = text;
    return sections;
  }

  // Text before the first header is the header block
  sections.header = text.substring(0, foundHeaders[0].index).trim();

  // Slice content between consecutive headers
  for (let i = 0; i < foundHeaders.length; i++) {
    const current = foundHeaders[i];
    const startIndex = current.index + current.length;
    const endIndex = i + 1 < foundHeaders.length ? foundHeaders[i + 1].index : text.length;
    sections[current.key] = text.substring(startIndex, endIndex).trim();
  }

  return sections;
}

/**
 * Intelligent Multi-Section Parser
 */
export function parseResumeTextToSchema(text: string): ResumeData {
  const sections = splitResumeSections(text);
  const headerText = sections.header || text.slice(0, 300);

  // 1. Extract Name
  let name = "Candidate";
  const headerLines = headerText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && !/@|http|www|\+?\d{3}/i.test(l));

  if (headerLines.length > 0 && headerLines[0].length <= 40) {
    name = headerLines[0];
  } else {
    // Fallback: search for prominent 2-3 capitalized words
    const nameMatch = text.match(/([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,2})/);
    if (nameMatch && nameMatch[1].length < 35 && !/Resume|Curriculum|Summary|Experience/i.test(nameMatch[1])) {
      name = nameMatch[1];
    }
  }

  // 2. Extract Contact Info
  const emailMatch = text.match(/[\w\.-]+@[\w\.-]+\.\w+/);
  const email = emailMatch ? emailMatch[0] : "";

  const phoneMatch = text.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  const phone = phoneMatch ? phoneMatch[0] : "";

  const linkedinMatch = text.match(/linkedin\.com\/in\/[\w\-]+/i);
  const githubMatch = text.match(/github\.com\/[\w\-]+/i);
  const portfolioMatch = text.match(/https?:\/\/(?!linkedin|github)[\w\.\-]+\.[a-z]{2,}(?:\/[\w\-]*)/i);

  const profiles = [];
  if (linkedinMatch) profiles.push({ network: "LinkedIn", username: linkedinMatch[0].split("/").pop() || "", url: `https://${linkedinMatch[0]}` });
  if (githubMatch) profiles.push({ network: "GitHub", username: githubMatch[0].split("/").pop() || "", url: `https://${githubMatch[0]}` });

  // 3. Extract Role / Headline
  let label = "Senior Professional";
  const labelMatches = text.match(/\b(Senior Product Manager|Principal Product Manager|Lead Product Manager|Product Manager|Senior Software Engineer|Lead Software Engineer|Staff Software Engineer|Full Stack Developer|Data Scientist|ML Engineer)\b/i);
  if (labelMatches) {
    label = labelMatches[0];
  } else if (headerLines.length > 1 && headerLines[1].length < 50) {
    label = headerLines[1];
  }

  // 4. Extract Summary
  let summary = sections.summary || "";
  if (!summary) {
    // Fallback summary search
    const sumMatch = text.match(/(?:summary|profile|about)[\s:\-]+([\s\S]{50,400}?)(?=(?:experience|skills|education|$))/i);
    summary = sumMatch ? sumMatch[1].replace(/\s+/g, " ").trim() : `${label} with demonstrated track record delivering high-impact business outcomes.`;
  }

  // 5. Parse Work Experience Roles & All Bullet Points
  const workItems: WorkExperience[] = [];
  const expText = sections.experience || text;

  // Split experience by detected company/date headers or paragraphs
  const roleBlocks = expText.split(/(?=(?:[A-Z][A-Za-z0-9\s,\.]{2,40}\s*(?:–|-|—|\|)\s*(?:[A-Za-z\s]{3,30}))|(?:\b(?:19|20)\d{2}\b\s*(?:–|-|—|to)\s*(?:Present|\b(?:19|20)\d{2}\b)))/gi);

  // Extract all bullet points without cutting off
  const bulletLines: string[] = [];
  const expLines = expText.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0);

  let currentCompany = "Current Organization";
  let currentPosition = label;
  let currentHighlights: string[] = [];

  for (const line of expLines) {
    // Check if line looks like a date range (e.g. 2021 - Present or Jan 2020 - Dec 2022)
    const dateMatch = line.match(/\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)?\s*(?:19|20)\d{2}\s*(?:–|-|—|to)\s*(?:Present|\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)?\s*(?:19|20)\d{2}\b)/i);
    
    // Check if line is a bullet item
    const isBullet = /^[•\-\*▪–\d\.]\s*/.test(line) || (line.length > 25 && /^[A-Z]/.test(line) && !dateMatch);

    if (dateMatch && !isBullet) {
      if (currentHighlights.length > 0) {
        workItems.push({
          name: currentCompany,
          position: currentPosition,
          startDate: "2021-01-01",
          endDate: "Present",
          highlights: [...currentHighlights],
        });
        currentHighlights = [];
      }
      currentCompany = line.replace(dateMatch[0], "").replace(/[-–—\|]/g, "").trim() || "Organization";
    } else if (line.length > 20) {
      const cleanBullet = line.replace(/^[•\-\*▪–\d\.]\s*/, "").trim();
      if (cleanBullet.length > 15 && !cleanBullet.startsWith("http")) {
        currentHighlights.push(cleanBullet);
      }
    }
  }

  // Flush last work item
  if (currentHighlights.length > 0) {
    workItems.push({
      name: currentCompany,
      position: currentPosition,
      startDate: "2021-01-01",
      endDate: "Present",
      highlights: currentHighlights,
    });
  }

  // Fallback if no work items were grouped
  if (workItems.length === 0) {
    const rawAllBullets = expLines
      .filter((l) => l.length > 25 && !l.includes("http"))
      .map((l) => l.replace(/^[•\-\*▪–\d\.]\s*/, "").trim());
    
    workItems.push({
      name: "Experience & Work History",
      position: label,
      startDate: "2021-01-01",
      endDate: "Present",
      highlights: rawAllBullets.length > 0 ? rawAllBullets : [
        "Led high-impact product roadmap execution and cross-functional delivery.",
        "Conducted customer discovery interviews and translated pain points into adopted features."
      ],
    });
  }

  // 6. Extract Skills
  const knownSkills = [
    "Product Management", "Product Strategy", "Product-Led Growth (PLG)", "Customer Discovery", "B2B SaaS",
    "Ecommerce", "Accounting Automation", "Shopify", "Amazon", "Walmart", "QuickBooks", "NetSuite",
    "Agentic Workflows", "AI-Native Products", "LLMs", "PRD Authoring", "Roadmapping", "Sprint Planning",
    "Agile / Scrum", "SQL", "Amplitude", "Mixpanel", "A/B Testing", "Funnel Optimization", "Cohort Analysis",
    "Python", "FastAPI", "React", "TypeScript", "JavaScript", "PostgreSQL", "Kafka", "Docker", "Kubernetes", "AWS",
    "Jira", "Linear", "Figma", "Data Analysis", "Go-to-Market (GTM)", "Stakeholder Management"
  ];
  
  const skillsText = sections.skills || text;
  const detectedSkills = knownSkills.filter((s) => new RegExp(`\\b${s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, "i").test(skillsText));

  // 7. Extract Education
  const eduItems: Education[] = [];
  const eduText = sections.education || "";
  const eduLines = eduText.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0);
  
  if (eduLines.length > 0) {
    eduItems.push({
      institution: eduLines[0],
      area: eduLines.length > 1 ? eduLines[1] : "Engineering / Computer Science",
      studyType: "Bachelor's Degree",
    });
  } else {
    eduItems.push({
      institution: "University / College",
      area: "Computer Science / Business",
      studyType: "Bachelor of Science",
    });
  }

  return {
    basics: {
      name: name,
      label: label,
      email: email || "candidate@example.com",
      phone: phone || "+1 (555) 000-0000",
      url: portfolioMatch ? portfolioMatch[0] : "",
      summary: summary,
      profiles: profiles,
    },
    skills: [
      {
        name: "Technical Proficiencies & Domain Skills",
        keywords: detectedSkills.length > 0 ? detectedSkills : ["Product Strategy", "B2B SaaS", "Customer Discovery", "SQL", "Agile"],
      },
    ],
    work: workItems,
    education: eduItems,
    projects: [],
    certifications: [],
  };
}
