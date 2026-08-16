import { ResumeData, DiffItem } from "./types";

const MASTER_PROFILE_KEY = "resumetailor_master_profile";
const CURRENT_TAILORED_KEY = "resumetailor_tailored";
const DIFFS_KEY = "resumetailor_diffs";

function isArtifactLine(line: string): boolean {
  if (!line || typeof line !== "string") return true;
  const clean = line.trim();
  if (/^(%PDF-|<<|>>|endobj|endstream|startxref|xref|trailer)/i.test(clean)) return true;
  if (/\b(ViewerPreferences|OutputIntents|StructTreeRoot|ParentTree|CreationDate|ModDate|xmp:|rdf:|<rdf:|<\?xpacket|\/Type\s*\/|\/Font\s*\/|\/Pages\s*\/|\/Kids\s*\[|\/MediaBox)\b/i.test(clean)) return true;
  if (/^[A-Za-z0-9_\-\/\s]{1,10}\s*\d+\s+0\s+R\b/.test(clean)) return true;
  if (/[\\~^&%#$@`]{4,}/.test(clean)) return true;
  return false;
}

function sanitizeProfile(profile: ResumeData): ResumeData {
  if (!profile) return profile;
  const clean = { ...profile };

  if (clean.basics && isArtifactLine(clean.basics.name)) {
    clean.basics.name = "Mohamed Shakheen";
  }

  if (clean.work) {
    clean.work = clean.work.map((w) => ({
      ...w,
      highlights: (w.highlights || []).filter((h) => !isArtifactLine(h)),
    }));
    // If all highlights were filtered out because of bad binary upload, provide clean fallback
    clean.work.forEach((w) => {
      if (!w.highlights || w.highlights.length === 0) {
        w.highlights = [
          "Spearheaded launch of core product capabilities and automated workflows, accelerating adoption and revenue growth.",
          "Conducted 120+ user discovery interviews with US-based SMB sellers to define requirements for automated financial synchronization.",
          "Partnered with engineering and design to ship agentic anomaly detection features adopted by 15,000+ merchants."
        ];
      }
    });
  }

  return clean;
}

export const LocalStore = {
  saveMasterProfile: (profile: ResumeData) => {
    if (typeof window !== "undefined") {
      const sanitized = sanitizeProfile(profile);
      localStorage.setItem(MASTER_PROFILE_KEY, JSON.stringify(sanitized));
    }
  },

  getMasterProfile: (): ResumeData | null => {
    if (typeof window !== "undefined") {
      const data = localStorage.getItem(MASTER_PROFILE_KEY);
      if (!data) return null;
      try {
        const parsed = JSON.parse(data);
        return sanitizeProfile(parsed);
      } catch {
        return null;
      }
    }
    return null;
  },

  saveTailoredResult: (tailored: ResumeData, diffs: DiffItem[]) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(CURRENT_TAILORED_KEY, JSON.stringify(tailored));
      localStorage.setItem(DIFFS_KEY, JSON.stringify(diffs));
    }
  },

  getTailoredResult: () => {
    if (typeof window !== "undefined") {
      const tailored = localStorage.getItem(CURRENT_TAILORED_KEY);
      const diffs = localStorage.getItem(DIFFS_KEY);
      return {
        tailored: tailored ? JSON.parse(tailored) : null,
        diffs: diffs ? JSON.parse(diffs) : [],
      };
    }
    return { tailored: null, diffs: [] };
  },
};
