import axios from "axios";
import { ResumeData, TailorResponse } from "./types";

// In browser / Vercel deployment, use relative '/api/v1' to route through Vercel serverless or Next.js rewrites
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api/v1";

export const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});


export const api = {
  // Onboarding & FTUE
  uploadResume: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await axios.post(`${API_BASE}/onboarding/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  loadSampleProfile: async (sampleType: "tech" | "product" | "data" = "tech") => {
    const res = await apiClient.get(`/onboarding/sample/${sampleType}`);
    return res.data;
  },

  // Master Profile
  getMasterProfile: async () => {
    const res = await apiClient.get("/profile/");
    return res.data;
  },

  updateMasterProfile: async (profile: ResumeData) => {
    const res = await apiClient.put("/profile/", profile);
    return res.data;
  },

  // Job Description
  analyzeJD: async (raw_text: string) => {
    const res = await apiClient.post("/jd/analyze", { raw_text });
    return res.data;
  },

  // Auto-Tailoring Multi-Agent Run
  runTailoring: async (payload: {
    master_profile: ResumeData;
    raw_jd_text: string;
    target_role?: string;
    target_company?: string;
  }): Promise<TailorResponse> => {
    const res = await apiClient.post("/tailor/", payload);
    return res.data;
  },

  // Export
  exportHtml: async (resumeData: ResumeData) => {
    const res = await apiClient.post("/export/html", resumeData, {
      responseType: "text",
    });
    return res.data;
  },
};
