"use client";

import React, { useState } from "react";
import { Briefcase, Plus, CheckCircle, Clock, XCircle, Award } from "lucide-react";

interface Application {
  id: string;
  company: string;
  role: string;
  appliedDate: string;
  status: "Applied" | "Interviewing" | "Offered" | "Rejected";
  atsScore: number;
  notes: string;
}

export default function TrackerPage() {
  const [applications, setApplications] = useState<Application[]>([
    {
      id: "1",
      company: "StripeStream Cloud",
      role: "Senior Backend Engineer",
      appliedDate: "2026-08-10",
      status: "Applied",
      atsScore: 92.5,
      notes: "Tailored Kafka and distributed event streaming bullets",
    },
    {
      id: "2",
      company: "Nexus AI Platform",
      role: "Distributed Systems Lead",
      appliedDate: "2026-08-08",
      status: "Interviewing",
      atsScore: 89.0,
      notes: "First technical round scheduled",
    },
  ]);

  const columns: Array<{ title: string; status: Application["status"]; icon: any; color: string }> = [
    { title: "Applied", status: "Applied", icon: Clock, color: "text-blue-400 border-blue-500/30" },
    { title: "Interviewing", status: "Interviewing", icon: Briefcase, color: "text-indigo-400 border-indigo-500/30" },
    { title: "Offered", status: "Offered", icon: Award, color: "text-emerald-400 border-emerald-500/30" },
    { title: "Archived / Rejected", status: "Rejected", icon: XCircle, color: "text-slate-400 border-slate-700/30" },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Briefcase className="w-4 h-4" /> Pipeline Tracker
          </div>
          <h1 className="text-2xl font-black text-white">Application Pipeline Kanban</h1>
          <p className="text-xs text-slate-400">Track all tailored resume versions mapped to active job submissions.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {columns.map((col) => {
          const Icon = col.icon;
          const items = applications.filter((a) => a.status === col.status);
          return (
            <div key={col.status} className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                  <Icon className={`w-4 h-4 ${col.color.split(" ")[0]}`} />
                  {col.title}
                </div>
                <span className="px-2 py-0.5 bg-slate-800 text-slate-400 text-[10px] font-bold rounded-full">
                  {items.length}
                </span>
              </div>

              <div className="space-y-3 flex-1">
                {items.map((app) => (
                  <div key={app.id} className="glass-card p-3.5 rounded-xl border border-slate-800/80 space-y-2">
                    <div className="flex justify-between items-start">
                      <div className="font-bold text-xs text-white">{app.company}</div>
                      <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/40">
                        {app.atsScore}% ATS
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-300 font-medium">{app.role}</div>
                    <div className="text-[10px] text-slate-400 bg-slate-900/60 p-2 rounded-lg leading-snug">
                      {app.notes}
                    </div>
                  </div>
                ))}
                {items.length === 0 && (
                  <div className="text-center py-8 text-[11px] text-slate-500">No applications</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
