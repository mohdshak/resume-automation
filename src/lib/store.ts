import { ResumeData, DiffItem } from "./types";

const MASTER_PROFILE_KEY = "resumetailor_master_profile";
const CURRENT_TAILORED_KEY = "resumetailor_tailored";
const DIFFS_KEY = "resumetailor_diffs";

export const LocalStore = {
  saveMasterProfile: (profile: ResumeData) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(MASTER_PROFILE_KEY, JSON.stringify(profile));
    }
  },

  getMasterProfile: (): ResumeData | null => {
    if (typeof window !== "undefined") {
      const data = localStorage.getItem(MASTER_PROFILE_KEY);
      return data ? JSON.parse(data) : null;
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
