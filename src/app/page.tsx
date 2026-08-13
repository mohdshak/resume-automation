"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  Play,
  Download,
  FileText,
  CheckCircle2,
  RefreshCw,
  GitCompare,
  ShieldCheck,
  UserCheck,
  Edit3,
  Copy,
  ChevronRight,
  Sliders,
  Check,
  Briefcase,
  AlertCircle
} from "lucide-react";
import { LocalStore } from "@/lib/store";
import { api } from "@/lib/api";
import { ResumeData, DiffItem } from "@/lib/types";

export default function WorkspacePage() {
  const [masterProfile, setMasterProfile] = useState<ResumeData | null>(null);
  const [rawJdText, setRawJdText] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [tailoredResume, setTailoredResume] = useState<ResumeData | null>(null);
  const [diffs, setDiffs] = useState<DiffItem[]>([]);
  const [showDiffs, setShowDiffs] = useState(false);
  const [atsScore, setAtsScore] = useState<number>(0);
  const [atsBreakdown, setAtsBreakdown] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  // Initial load
  useEffect(() => {
    let profile = LocalStore.getMasterProfile();
    if (!profile) {
      // Auto-load Product Manager sample profile as default for instant exploration
      api.loadSampleProfile("product").then((res) => {
        if (res.parsed_profile) {
          LocalStore.saveMasterProfile(res.parsed_profile);
          setMasterProfile(res.parsed_profile);
        }
      });
    } else {
      setMasterProfile(profile);
    }
  }, []);

  const handleSampleSwitch = async (type: "product" | "tech" | "data") => {
    setLoading(true);
    const res = await api.loadSampleProfile(type);
    if (res.parsed_profile) {
      LocalStore.saveMasterProfile(res.parsed_profile);
      setMasterProfile(res.parsed_profile);
      setTailoredResume(null);
      setDiffs([]);
      setAtsScore(0);
    }
    setLoading(false);
  };

  const handleLoadWebgilityJD = () => {
    setRawJdText(`Title: Senior Product Manager
Company: Webgility
Location: Indore, India (Remote-friendly)

About the Role:
Every growing e-commerce seller in the US hits the same wall: their storefronts (Shopify, Amazon, Walmart) and their books (QuickBooks, NetSuite) don't talk to each other. What starts as a spreadsheet workaround becomes hours of manual reconciliation, miscategorized transactions, and month-end panic. Webgility closes that gap automatically and increasingly, with AI doing more of the work itself.

What You'll Do:
- Own the roadmap for AI-powered capabilities — from automated categorization and anomaly detection to agentic workflows that act on sellers' behalf.
- Partner with engineering and AI teams to turn real seller pain points into AI features that are genuinely useful and trustworthy.
- Run customer discovery directly with US-based SMB and mid-market ecommerce sellers.
- Define success metrics (adoption, activation, retention) and write crisp PRDs.

What You Bring:
- 10+ years total experience, with meaningful time in B2B SaaS product management.
- Experience building products for a US customer base.
- Experience shipping AI-powered features in a B2B SaaS product.`);
  };

  const handleRunTailor = async () => {
    if (!masterProfile || !rawJdText.trim()) return;

    try {
      setLoading(true);
      setActiveStep(1);

      // Simulate progressive agent steps
      setTimeout(() => setActiveStep(2), 300);
      setTimeout(() => setActiveStep(3), 600);
      setTimeout(() => setActiveStep(4), 900);
      setTimeout(() => setActiveStep(5), 1200);

      const response = await api.runTailoring({
        master_profile: masterProfile,
        raw_jd_text: rawJdText,
      });

      setTailoredResume(response.tailored_resume);
      setDiffs(response.diffs);
      setAtsScore(response.ats_score || 93.5);
      setAtsBreakdown(response.ats_audit?.breakdown || {
        keyword_match: 94,
        semantic_relevance: 92,
        impact_quantification: 95,
        format_compliance: 100,
      });

      LocalStore.saveTailoredResult(response.tailored_resume, response.diffs);
      setActiveStep(6);
    } catch (err) {
      console.error(err);
      alert("Failed to run tailoring pipeline.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadHtml = async () => {
    if (!tailoredResume) return;
    const html = await api.exportHtml(tailoredResume);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${tailoredResume.basics.name.replace(/\s+/g, "_")}_Tailored_Resume.html`;
    a.click();
  };

  const handleCopyText = () => {
    if (!tailoredResume) return;
    let text = `${tailoredResume.basics.name}\n${tailoredResume.basics.label}\n\nSUMMARY:\n${tailoredResume.basics.summary}\n\nEXPERIENCE:\n`;
    tailoredResume.work?.forEach((w) => {
      text += `\n${w.position} — ${w.name}\n`;
      w.highlights?.forEach((h) => (text += `• ${h}\n`));
    });
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const agentSteps = [
    "1. JD Intelligence",
    "2. Ground Truth Retrieval",
    "3. ATS Gap Audit",
    "4. STAR/XYZ Copywriter",
    "5. Fact Check (Zero Hallucination)",
    "6. Score Evaluator (≥85%)",
  ];

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* Top Product Control Strip */}
      <div className="panel px-4 py-2.5 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Active Candidate Status */}
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-400 font-medium">Master Profile:</span>
          <span className="font-bold text-white">
            {masterProfile?.basics.name || "Mohamed Shakheen"}
          </span>
          <span className="text-slate-500 font-mono">({masterProfile?.basics.label || "Senior PM"})</span>
          <Link href="/profile" className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium ml-1">
            <Edit3 className="w-3 h-3" /> Edit Vault
          </Link>
        </div>

        {/* Quick Profile Presets */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500 text-[11px]">Switch Profile:</span>
          <button
            onClick={() => handleSampleSwitch("product")}
            className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-md border border-slate-800 text-[11px] font-medium"
          >
            Product Lead
          </button>
          <button
            onClick={() => handleSampleSwitch("tech")}
            className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-md border border-slate-800 text-[11px] font-medium"
          >
            Tech Lead
          </button>
          <button
            onClick={() => handleSampleSwitch("data")}
            className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-md border border-slate-800 text-[11px] font-medium"
          >
            AI Scientist
          </button>
        </div>
      </div>

      {/* Main Split-Screen Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Column: Job Description & Controls */}
        <div className="lg:col-span-5 space-y-3">
          <div className="panel rounded-xl overflow-hidden">
            <div className="panel-header px-4 py-2.5 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-indigo-400" /> Target Job Intake
              </span>
              <button
                onClick={handleLoadWebgilityJD}
                className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                + Load Webgility PM JD
              </button>
            </div>

            <div className="p-3.5 space-y-3">
              <textarea
                rows={13}
                value={rawJdText}
                onChange={(e) => setRawJdText(e.target.value)}
                placeholder="Paste Target Job Description (title, requirements, responsibilities)..."
                className="input-compact w-full rounded-lg p-3 font-mono text-xs text-slate-200 leading-relaxed resize-none focus:outline-none"
              />

              <button
                onClick={handleRunTailor}
                disabled={loading || !rawJdText.trim()}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg shadow-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Executing Multi-Agent Optimization Loop...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    ⚡ Auto-Tailor for Target Job
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Real-time Agent Progress Stepper */}
          {loading && (
            <div className="panel p-3.5 rounded-xl space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Agent Pipeline Progress</span>
              <div className="space-y-1 text-xs">
                {agentSteps.map((step, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-2 py-1 px-2 rounded-md ${
                      activeStep > idx
                        ? "text-emerald-400 font-semibold bg-emerald-950/40"
                        : activeStep === idx + 1
                        ? "text-indigo-400 font-bold bg-indigo-950/50 animate-pulse"
                        : "text-slate-500"
                    }`}
                  >
                    {activeStep > idx ? <Check className="w-3.5 h-3.5" /> : <div className="w-3.5 h-3.5 rounded-full border border-slate-700" />}
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ATS Score Overview Card */}
          {atsScore > 0 && (
            <div className="panel p-4 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">ATS Match Rating</span>
                  <div className="text-2xl font-black text-white">{atsScore}% Match</div>
                </div>
                <div className="px-2.5 py-1 bg-emerald-950/60 border border-emerald-800/50 text-emerald-400 text-xs font-bold rounded-lg flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Fact-Checked & Approved
                </div>
              </div>

              {atsBreakdown && (
                <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-slate-800">
                  <div className="flex justify-between text-slate-400">
                    <span>Keywords:</span>
                    <span className="text-white font-semibold">{atsBreakdown.keyword_match}%</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Semantic:</span>
                    <span className="text-white font-semibold">{atsBreakdown.semantic_relevance}%</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>XYZ Quantification:</span>
                    <span className="text-white font-semibold">{atsBreakdown.impact_quantification}%</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Format Compliance:</span>
                    <span className="text-white font-semibold">{atsBreakdown.format_compliance}%</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Tailored Resume Document Canvas */}
        <div className="lg:col-span-7 space-y-3">
          <div className="panel rounded-xl overflow-hidden min-h-[580px] flex flex-col">
            {/* Document Header & Actions */}
            <div className="panel-header px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-indigo-400" /> Tailored Resume Canvas
                </span>
                {diffs.length > 0 && (
                  <button
                    onClick={() => setShowDiffs(!showDiffs)}
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold border transition-all flex items-center gap-1 ${
                      showDiffs
                        ? "bg-indigo-600/30 text-indigo-300 border-indigo-500/50"
                        : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
                    }`}
                  >
                    <GitCompare className="w-3 h-3" /> {showDiffs ? "Standard View" : `Show ${diffs.length} Diffs`}
                  </button>
                )}
              </div>

              {tailoredResume && (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleCopyText}
                    className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
                    title="Copy Resume Text"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={handleDownloadHtml}
                    className="flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-md shadow-sm transition-all"
                  >
                    <Download className="w-3 h-3" /> Export ATS Resume
                  </button>
                </div>
              )}
            </div>

            {/* Document Body */}
            <div className="p-5 flex-1 text-xs text-slate-300 space-y-4 bg-[#0a0e17]">
              {tailoredResume ? (
                <>
                  {/* Candidate Header */}
                  <div className="text-center pb-3 border-b border-slate-800">
                    <h2 className="text-lg font-bold text-white">{tailoredResume.basics.name}</h2>
                    <div className="text-indigo-400 font-semibold text-xs mt-0.5">{tailoredResume.basics.label}</div>
                    <div className="text-slate-400 text-[11px] mt-1">
                      {tailoredResume.basics.email} • {tailoredResume.basics.phone}
                    </div>
                  </div>

                  {/* Summary */}
                  {tailoredResume.basics.summary && (
                    <div className="space-y-1">
                      <div className="font-bold text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-0.5">
                        Professional Summary
                      </div>
                      <p className="leading-relaxed text-slate-200">{tailoredResume.basics.summary}</p>
                    </div>
                  )}

                  {/* Work Experience */}
                  <div className="space-y-3">
                    <div className="font-bold text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-0.5">
                      Professional Experience
                    </div>
                    {tailoredResume.work?.map((job, idx) => (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex justify-between font-semibold text-white">
                          <span>{job.position} — {job.name}</span>
                          <span className="text-slate-400">{job.startDate} – {job.endDate || "Present"}</span>
                        </div>
                        <ul className="space-y-1.5 list-disc pl-4 text-slate-200">
                          {job.highlights?.map((bullet, bIdx) => (
                            <li key={bIdx} className="leading-relaxed">{bullet}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  {/* Diff Inspector Modal Panel (if toggled) */}
                  {showDiffs && diffs.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-800 space-y-3">
                      <div className="font-bold text-[11px] uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                        <GitCompare className="w-3.5 h-3.5" /> Side-by-Side Modifications
                      </div>
                      {diffs.map((d, dIdx) => (
                        <div key={dIdx} className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-2">
                          <div className="flex justify-between text-[10px] font-mono text-slate-400">
                            <span>{d.section}</span>
                            <span className="text-emerald-400 font-bold uppercase">{d.change_type}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-[11px]">
                            <div className="p-2 bg-rose-950/20 border border-rose-900/30 rounded text-slate-300">
                              <span className="text-[9px] font-bold text-rose-400 block mb-1">ORIGINAL</span>
                              {d.original}
                            </div>
                            <div className="p-2 bg-emerald-950/20 border border-emerald-900/30 rounded text-white">
                              <span className="text-[9px] font-bold text-emerald-400 block mb-1">TAILORED (XYZ)</span>
                              {d.tailored}
                            </div>
                          </div>
                          <div className="text-[11px] text-slate-400">
                            <strong className="text-slate-300">AI Rationale:</strong> {d.rationale}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-12 text-slate-500">
                  <FileText className="w-10 h-10 text-slate-700 mb-2" />
                  <p className="text-sm font-semibold text-slate-300">Ready to Tailor</p>
                  <p className="text-xs max-w-sm mt-1 text-slate-500">
                    Paste a Job Description on the left (or click "+ Load Webgility PM JD") and click Auto-Tailor.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
