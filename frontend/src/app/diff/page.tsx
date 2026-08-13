"use client";

import React, { useEffect, useState } from "react";
import { VisualDiffViewer } from "@/components/diff-viewer/VisualDiffViewer";
import { LocalStore } from "@/lib/store";
import { DiffItem } from "@/lib/types";
import { GitCompare, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function DiffPage() {
  const [diffs, setDiffs] = useState<DiffItem[]>([]);

  useEffect(() => {
    const data = LocalStore.getTailoredResult();
    setDiffs(data.diffs || []);
  }, []);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
            <GitCompare className="w-4 h-4" /> Visual Diff Inspector
          </div>
          <h1 className="text-2xl font-black text-white">Side-by-Side Modification Audit</h1>
          <p className="text-xs text-slate-400">
            Review every bullet adapted by the Copywriter Agent along with the exact AI rationale and injected keywords.
          </p>
        </div>
        <Link
          href="/tailor"
          className="px-4 py-2 glass-card hover:bg-slate-800 text-slate-300 font-semibold text-xs rounded-xl border border-slate-800 flex items-center gap-1.5 transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Studio
        </Link>
      </div>

      <VisualDiffViewer diffs={diffs} />
    </div>
  );
}
