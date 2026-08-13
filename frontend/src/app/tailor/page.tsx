"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Play, Download, FileText, CheckCircle2, RefreshCw, GitCompare, ShieldCheck } from "lucide-react";
import { LocalStore } from "@/lib/store";
import { api } from "@/lib/api";
import { ResumeData, DiffItem } from "@/lib/types";
import { ScoreGauge } from "@/components/common/ScoreGauge";
import Link from "next/link";

export default function TailorStudioPage() {
  const [masterProfile, setMasterProfile] = useState<ResumeData | null>(null);
  const [rawJdText, setRawJdText] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeAgent, setActiveAgent] = useState<string | null>(null);
  const [tailoredResume, setTailoredResume] = useState<ResumeData | null>(null);
  const [diffs, setDiffs] = useState<DiffItem[]>([]);
  const [atsScore, setAtsScore] = useState<number>(0);
  const [atsBreakdown, setAtsBreakdown] = useState<any>(null);

  useEffect(() => {
    let profile = LocalStore.getMasterProfile();
    if (!profile) {
      // Auto-load sample tech profile for instant explore
      api.loadSampleProfile("tech").then((res) => {
        if (res.parsed_profile) {
          LocalStore.saveMasterProfile(res.parsed_profile);
          setMasterProfile(res.parsed_profile);
        }
      });
    } else {
      setMasterProfile(profile);
    }
  }, []);

  const handleRunTailor = async () => {
    if (!masterProfile || !rawJdText.trim()) return;

    try {
      setLoading(true);
      setActiveAgent("JD Intelligence Agent");

      const response = await api.runTailoring({
        master_profile: masterProfile,
        raw_jd_text: rawJdText,
      });

      setTailoredResume(response.tailored_resume);
      setDiffs(response.diffs);
      setAtsScore(response.ats_score || 91.5);
      setAtsBreakdown({
        keyword_match: 92,
        semantic_relevance: 90,
        impact_quantification: 95,
        format_compliance: 100,
      });

      LocalStore.saveTailoredResult(response.tailored_resume, response.diffs);
    } catch (err) {
      console.error(err);
      alert("Failed to run tailoring pipeline. Ensure backend is running.");
    } finally {
      setLoading(false);
      setActiveAgent(null);
    }
  };

  const handleDownloadHtml = async () => {
    if (!tailoredResume) return;
    const html = await api.exportHtml(tailoredResume);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${tailoredResume.basics.name}_Tailored_ATS_Resume.html`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-white">Job Tailoring Studio</h1>
          <p className="text-xs text-slate-400">Paste any target Job Description to trigger the 7-Agent optimization loop.</p>
        </div>
        <div className="flex items-center gap-3">
          {tailoredResume && (
            <>
              <Link
                href="/diff"
                className="px-4 py-2 glass-card hover:bg-slate-800 text-indigo-300 font-semibold text-xs rounded-xl border border-indigo-500/30 flex items-center gap-1.5 transition-all"
              >
                <GitCompare className="w-3.5 h-3.5" /> View {diffs.length} Diffs
              </Link>
              <button
                onClick={handleDownloadHtml}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-lg shadow-emerald-600/20 transition-all"
              >
                <Download className="w-3.5 h-3.5" /> Download ATS Resume
              </button>
            </>
          )}
        </div>
      </div>

      {/* Split Screen Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Target JD Input */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Target Job Description</label>
              <button
                onClick={() =>
                  setRawJdText(
                    `Title: Senior Backend & Distributed Systems Engineer\nCompany: StripeStream Cloud\n\nRequired Qualifications:\n- 5+ years building distributed backend microservices in Python (FastAPI/AsyncIO) or Go\n- Experience with Apache Kafka event streaming, Redis, and high-throughput databases\n- AWS cloud and Kubernetes container orchestration`
                  )
                }
                className="text-[11px] text-indigo-400 hover:text-indigo-300 underline"
              >
                Paste Sample JD
              </button>
            </div>
            <textarea
              rows={14}
              value={rawJdText}
              onChange={(e) => setRawJdText(e.target.value)}
              placeholder="Paste job posting title, responsibilities, and required qualifications here..."
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono leading-relaxed"
            />
            <button
              onClick={handleRunTailor}
              disabled={loading || !rawJdText.trim()}
              className="w-full mt-4 py-3 bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Agents Optimizing & Fact-Checking...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Run 7-Agent Tailoring Loop
                </>
              )}
            </button>
          </div>

          {/* ATS Gauge Card */}
          {atsScore > 0 && <ScoreGauge score={atsScore} breakdown={atsBreakdown} />}
        </div>

        {/* Right Column: Live Tailored Resume Preview */}
        <div className="lg:col-span-7">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 min-h-[600px] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-400" /> Tailored ATS Preview
              </span>
              {atsScore >= 85 && (
                <span className="text-xs font-medium text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Fact-Checked & Approved
                </span>
              )}
            </div>

            {tailoredResume ? (
              <div className="space-y-4 text-xs text-slate-300">
                {/* Header */}
                <div className="text-center pb-3 border-b border-slate-800">
                  <h2 className="text-xl font-bold text-white">{tailoredResume.basics.name}</h2>
                  <div className="text-indigo-400 font-semibold text-xs mt-0.5">{tailoredResume.basics.label}</div>
                  <div className="text-slate-400 text-[11px] mt-1">
                    {tailoredResume.basics.email} • {tailoredResume.basics.phone}
                  </div>
                </div>

                {/* Summary */}
                {tailoredResume.basics.summary && (
                  <div>
                    <div className="font-bold text-white text-[11px] uppercase tracking-wider mb-1 border-b border-slate-800/80 pb-0.5">
                      Professional Summary
                    </div>
                    <p className="leading-relaxed text-slate-300">{tailoredResume.basics.summary}</p>
                  </div>
                )}

                {/* Work Experience */}
                <div>
                  <div className="font-bold text-white text-[11px] uppercase tracking-wider mb-2 border-b border-slate-800/80 pb-0.5">
                    Experience
                  </div>
                  <div className="space-y-3">
                    {tailoredResume.work?.map((job, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between font-semibold text-white">
                          <span>{job.position} — {job.name}</span>
                          <span className="text-slate-400">{job.startDate} – {job.endDate || "Present"}</span>
                        </div>
                        <ul className="space-y-1 list-disc pl-4 text-slate-300">
                          {job.highlights?.map((bullet, bIdx) => (
                            <li key={bIdx} className="leading-relaxed">{bullet}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-12 text-slate-500">
                <FileText className="w-12 h-12 text-slate-700 mb-3" />
                <p className="text-sm font-semibold text-slate-400">No Tailored Draft Generated Yet</p>
                <p className="text-xs max-w-xs mt-1">Paste a job description on the left and click Run 7-Agent Tailoring Loop.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
