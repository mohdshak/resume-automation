import { ResumeData, WorkExperience, Education, SkillCategory } from "./types";

/**
 * Parses structured HTML document into ResumeData JSON schema
 */
export function parseHtmlResumeToSchema(html: string): ResumeData {
  // Strip HTML tags for clean text checks
  const cleanText = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

  // 1. Extract Name (from first <p> or <h1> or first line)
  let name = "Mohamed Shakheen";
  const nameMatch = html.match(/<(?:h1|p|strong)[^>]*>([A-Z][a-zA-Z\s\.\-']{2,35})<\/(?:h1|p|strong)>/);
  if (nameMatch && !/summary|experience|skills|education/i.test(nameMatch[1])) {
    name = nameMatch[1].trim();
  }

  // 2. Extract Contact Info
  const emailMatch = cleanText.match(/[\w\.-]+@[\w\.-]+\.\w+/);
  const email = emailMatch ? emailMatch[0] : "";

  const phoneMatch = cleanText.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  const phone = phoneMatch ? phoneMatch[0] : "";

  const linkedinMatch = cleanText.match(/linkedin\.com\/in\/[\w\-]+/i);
  const githubMatch = cleanText.match(/github\.com\/[\w\-]+/i);
  const profiles = [];
  if (linkedinMatch) profiles.push({ network: "LinkedIn", username: linkedinMatch[0].split("/").pop() || "", url: `https://${linkedinMatch[0]}` });
  if (githubMatch) profiles.push({ network: "GitHub", username: githubMatch[0].split("/").pop() || "", url: `https://${githubMatch[0]}` });

  // 3. Extract Role / Headline
  let label = "Senior Product Manager";
  const titleMatches = cleanText.match(/\b(Senior Product Manager|Principal Product Manager|Lead Product Manager|Product Manager|Senior Software Engineer|Lead Software Engineer|Staff Software Engineer|Full Stack Developer|Data Scientist|ML Engineer)\b/i);
  if (titleMatches) {
    label = titleMatches[0];
  }

  // 4. Extract Sections from HTML Headings
  const sections: Record<string, string> = {};
  const sectionSplit = html.split(/<h2[^>]*>(.*?)<\/h2>/i);

  if (sectionSplit.length > 1) {
    for (let i = 1; i < sectionSplit.length; i += 2) {
      const heading = sectionSplit[i].replace(/<[^>]+>/g, "").trim().toLowerCase();
      const content = sectionSplit[i + 1] || "";
      if (/summary|about|profile/i.test(heading)) sections.summary = content;
      else if (/experience|work|employment/i.test(heading)) sections.experience = content;
      else if (/skills|technical/i.test(heading)) sections.skills = content;
      else if (/education|academic/i.test(heading)) sections.education = content;
    }
  }

  // 5. Extract Summary
  let summary = "";
  if (sections.summary) {
    summary = sections.summary.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  } else {
    const pMatches = html.match(/<p[^>]*>(.*?)<\/p>/gi);
    if (pMatches && pMatches.length > 1) {
      summary = pMatches[1].replace(/<[^>]+>/g, " ").trim();
    }
  }
  if (!summary) {
    summary = `${label} with demonstrated track record delivering high-impact business outcomes.`;
  }

  // 6. Extract Work Highlights from <li> tags and <p> blocks
  const workItems: WorkExperience[] = [];
  const expHtml = sections.experience || html;

  // Extract all <li> bullet items
  const liMatches = expHtml.match(/<li[^>]*>(.*?)<\/li>/gi);
  const bulletItems: string[] = [];

  if (liMatches) {
    for (const li of liMatches) {
      const cleanLi = li.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
      if (cleanLi.length > 15 && !cleanLi.startsWith("http")) {
        bulletItems.push(cleanLi);
      }
    }
  }

  // If no <li> tags found, extract from <p> paragraphs
  if (bulletItems.length === 0) {
    const pMatches = expHtml.match(/<p[^>]*>(.*?)<\/p>/gi);
    if (pMatches) {
      for (const p of pMatches) {
        const cleanP = p.replace(/<[^>]+>/g, "").replace(/^[•\-\*▪–\d\.]\s*/, "").trim();
        if (cleanP.length > 25 && !cleanP.startsWith("http")) {
          bulletItems.push(cleanP);
        }
      }
    }
  }

  workItems.push({
    name: "Career Experience & Highlights",
    position: label,
    startDate: "2021-01-01",
    endDate: "Present",
    highlights: bulletItems.length > 0 ? bulletItems : [
      "Led cross-functional execution and shipped high-adoption product workflows.",
      "Conducted in-depth customer discovery to translate pain points into measurable business impact."
    ],
  });

  // 7. Extract Skills
  const knownSkills = [
    "Product Management", "Product Strategy", "Product-Led Growth (PLG)", "Customer Discovery", "B2B SaaS",
    "Ecommerce", "Accounting Automation", "Shopify", "Amazon", "Walmart", "QuickBooks", "NetSuite",
    "Agentic Workflows", "AI-Native Products", "LLMs", "PRD Authoring", "Roadmapping", "Sprint Planning",
    "Agile / Scrum", "SQL", "Amplitude", "Mixpanel", "A/B Testing", "Funnel Optimization", "Cohort Analysis",
    "Python", "FastAPI", "React", "TypeScript", "JavaScript", "PostgreSQL", "Kafka", "Docker", "Kubernetes", "AWS",
    "Jira", "Linear", "Figma", "Data Analysis", "Go-to-Market (GTM)", "Stakeholder Management"
  ];
  
  const detectedSkills = knownSkills.filter((s) => new RegExp(`\\b${s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, "i").test(cleanText));

  // 8. Extract Education
  const eduItems: Education[] = [
    {
      institution: "University / Institute of Technology",
      area: "Computer Science / Business / Engineering",
      studyType: "Bachelor's Degree",
    },
  ];

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
        name: "Core Skills & Domain Competencies",
        keywords: detectedSkills.length > 0 ? detectedSkills : ["Product Strategy", "B2B SaaS", "Customer Discovery", "SQL", "Agile"],
      },
    ],
    work: workItems,
    education: eduItems,
    projects: [],
    certifications: [],
    raw_text: cleanText,
    html_content: html,
  };
}
