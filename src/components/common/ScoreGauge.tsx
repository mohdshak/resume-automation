"use client";

import React from "react";
import { CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";

interface ScoreGaugeProps {
  score: number;
  breakdown?: {
    keyword_match: number;
    semantic_relevance: number;
    impact_quantification: number;
    format_compliance: number;
  };
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score, breakdown }) => {
  const isPassed = score >= 85;
  const strokeDashoffset = 283 - (283 * score) / 100;

  return (
    <div className="glass-card p-5 rounded-2xl border border-slate-800 flex flex-col items-center">
      <div className="flex items-center justify-between w-full mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">ATS Match Gauge</span>
        {isPassed ? (
          <span className="flex items-center gap-1 text-xs font-medium text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/40">
            <ShieldCheck className="w-3.5 h-3.5" /> ≥85% Compliant
          </span>
        ) : (
          <span className="flex items-center gap-1 text-xs font-medium text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-800/40">
            <AlertTriangle className="w-3.5 h-3.5" /> Optimization Needed
          </span>
        )}
      </div>

      <div className="relative w-36 h-36 flex items-center justify-center my-2">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            className="text-slate-800/80"
            fill="transparent"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            strokeDasharray="283"
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={isPassed ? "text-emerald-500 transition-all duration-1000" : "text-amber-500 transition-all duration-1000"}
            fill="transparent"
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-3xl font-extrabold tracking-tight text-white">{Math.round(score)}%</span>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider">ATS Score</span>
        </div>
      </div>

      {breakdown && (
        <div className="w-full grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-800 text-xs">
          <div className="flex justify-between text-slate-400">
            <span>Keywords (40%)</span>
            <span className="text-slate-200 font-semibold">{breakdown.keyword_match}%</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Semantic (35%)</span>
            <span className="text-slate-200 font-semibold">{breakdown.semantic_relevance}%</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>XYZ Impact (15%)</span>
            <span className="text-slate-200 font-semibold">{breakdown.impact_quantification}%</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Format (10%)</span>
            <span className="text-slate-200 font-semibold">{breakdown.format_compliance}%</span>
          </div>
        </div>
      )}
    </div>
  );
};
