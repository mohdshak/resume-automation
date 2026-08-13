"use client";

import React from "react";
import { DiffItem } from "@/lib/types";
import { Sparkles, ArrowRight, CheckCircle, HelpCircle } from "lucide-react";

interface VisualDiffViewerProps {
  diffs: DiffItem[];
}

export const VisualDiffViewer: React.FC<VisualDiffViewerProps> = ({ diffs }) => {
  if (!diffs || diffs.length === 0) {
    return (
      <div className="glass-card p-12 rounded-3xl border border-slate-800 text-center">
        <Sparkles className="w-8 h-8 text-indigo-400 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-white">No Modifications Recorded</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
          Run the Auto-Tailor pipeline in the Tailor Studio to view side-by-side green/red bullet point optimizations.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {diffs.map((d, idx) => (
        <div key={idx} className="glass-card p-5 rounded-2xl border border-slate-800 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-mono text-indigo-400 bg-indigo-950/60 px-2.5 py-0.5 rounded-md border border-indigo-800/40">
              Section: {d.section}
            </span>
            <span className="text-xs font-semibold uppercase text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-800/40">
              {d.change_type}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Original */}
            <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-900/30">
              <div className="text-[11px] font-bold text-rose-400 mb-1">ORIGINAL MASTER BULLET</div>
              <p className="text-slate-300 leading-relaxed">{d.original || "None"}</p>
            </div>

            {/* Tailored */}
            <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-900/30">
              <div className="text-[11px] font-bold text-emerald-400 mb-1">OPTIMIZED XYZ BULLET</div>
              <p className="text-white font-medium leading-relaxed">{d.tailored || "None"}</p>
            </div>
          </div>

          {/* AI Rationale */}
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-start gap-2 text-xs">
            <Sparkles className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-200">AI Tailoring Rationale: </span>
              <span className="text-slate-400">{d.rationale}</span>
            </div>
          </div>

          {d.keywords_injected && d.keywords_injected.length > 0 && (
            <div className="mt-2 flex items-center gap-1.5 flex-wrap text-[11px]">
              <span className="text-slate-500 font-medium">Keywords Integrated:</span>
              {d.keywords_injected.map((kw, kwIdx) => (
                <span key={kwIdx} className="px-2 py-0.5 bg-indigo-900/40 text-indigo-300 rounded border border-indigo-700/40 font-mono">
                  +{kw}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
