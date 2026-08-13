export interface Basics {
  name: string;
  label?: string;
  email?: string;
  phone?: string;
  url?: string;
  summary?: string;
  location?: {
    city?: string;
    region?: string;
    countryCode?: string;
  };
  profiles?: Array<{
    network: string;
    username: string;
    url?: string;
  }>;
}

export interface WorkExperience {
  name: string;
  position: string;
  startDate?: string;
  endDate?: string;
  summary?: string;
  highlights: string[];
  location?: string;
}

export interface Education {
  institution: string;
  area?: string;
  studyType?: string;
  startDate?: string;
  endDate?: string;
  score?: string;
  courses?: string[];
}

export interface SkillCategory {
  name: string;
  level?: string;
  keywords: string[];
}

export interface Project {
  name: string;
  description?: string;
  highlights: string[];
  keywords: string[];
  url?: string;
}

export interface Certification {
  name: string;
  issuer?: string;
  date?: string;
}

export interface ResumeData {
  basics: Basics;
  work: WorkExperience[];
  education: Education[];
  skills: SkillCategory[];
  projects?: Project[];
  certifications?: Certification[];
}

export interface DiffItem {
  section: string;
  change_type: "modified" | "added" | "removed" | "reordered";
  original?: string;
  tailored?: string;
  rationale: string;
  keywords_injected?: string[];
}

export interface ATSBreakdown {
  keyword_match: number;
  semantic_relevance: number;
  impact_quantification: number;
  format_compliance: number;
}

export interface TailorResponse {
  job_id: string;
  target_role: string;
  target_company: string;
  ats_score: number;
  is_score_approved: boolean;
  fact_check_passed: boolean;
  tailored_resume: ResumeData;
  diffs: DiffItem[];
  ats_audit?: {
    overall_score: number;
    is_ats_compliant: boolean;
    breakdown: ATSBreakdown;
    matched_keywords?: string[];
    missing_keywords?: string[];
  };
}

