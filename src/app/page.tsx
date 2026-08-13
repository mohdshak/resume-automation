"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck, Cpu, Zap, FileText, CheckCircle2 } from "lucide-react";
import { LocalStore } from "@/lib/store";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    const profile = LocalStore.getMasterProfile();
    setHasProfile(!!profile);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
      {/* Hero Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-6 shadow-lg shadow-indigo-500/10">
        <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" /> Powered by 7 Collaborative AI Agents
      </div>

      {/* Main Title */}
      <h1 className="text-5xl md:text-6xl font-black tracking-tight max-w-4xl bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent leading-[1.15]">
        Tailor Your Resume for Any Job Posting with <span className="text-indigo-400">Zero Hallucinations</span>.
      </h1>

      <p className="text-slate-400 text-base md:text-lg max-w-2xl mt-4 leading-relaxed">
        Upload your master resume once. Our autonomous recruiter, copywriter, and fact-checking agents audit ATS gaps, rewrite bullets using the Google XYZ formula, and guarantee $\ge 85\%$ match score.
      </p>

      {/* CTA Buttons */}
      <div className="flex items-center gap-4 mt-8">
        <Link
          href={hasProfile ? "/tailor" : "/onboarding"}
          className="px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm rounded-2xl shadow-xl shadow-indigo-500/25 flex items-center gap-2 hover:scale-[1.02] transition-all"
        >
          {hasProfile ? "Open Tailoring Studio" : "Start 30s Guided Onboarding"} <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/onboarding"
          className="px-6 py-3.5 glass-card hover:bg-slate-800 text-slate-300 hover:text-white font-semibold text-sm rounded-2xl border border-slate-800 transition-all"
        >
          Upload / Replace Master
        </Link>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mt-16 text-left">
        <div className="glass-panel p-6 rounded-2xl border border-slate-800/80">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4 border border-blue-500/20">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white mb-1">7-Agent Reflection Loop</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Collaborative agents autonomously simulate ATS algorithms, draft XYZ bullets, and review quality in a cyclic loop.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-800/80">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4 border border-emerald-500/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white mb-1">Anti-Hallucination Guard</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Strict Fact-Checking Agent rejects any synthetic metrics, unverified dates, or fake technologies.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-800/80">
          <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center mb-4 border border-violet-500/20">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white mb-1">ATS-Tested PDF Export</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Exports pristine single-column documents formatted for 100% parseability by Workday, Greenhouse, and Lever.
          </p>
        </div>
      </div>
    </div>
  );
}
