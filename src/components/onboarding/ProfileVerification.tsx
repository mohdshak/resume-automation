"use client";

import React, { useState } from "react";
import { Check, Edit3, ArrowRight, User, Briefcase, GraduationCap, Wrench } from "lucide-react";
import { ResumeData } from "@/lib/types";
import { LocalStore } from "@/lib/store";

interface ProfileVerificationProps {
  initialProfile: ResumeData;
  onConfirmed: () => void;
}

export const ProfileVerification: React.FC<ProfileVerificationProps> = ({ initialProfile, onConfirmed }) => {
  const [profile, setProfile] = useState<ResumeData>(initialProfile);

  const handleConfirm = () => {
    LocalStore.saveMasterProfile(profile);
    onConfirmed();
  };

  return (
    <div className="w-full max-w-4xl mx-auto glass-panel p-8 rounded-3xl border border-slate-800 shadow-2xl">
      <div className="flex items-center justify-between pb-6 border-b border-slate-800 mb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Step 3 of 3 • Verification</span>
          <h2 className="text-2xl font-black text-white mt-0.5">Confirm Your Master Ground Truth</h2>
        </div>
        <button
          onClick={handleConfirm}
          className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-500/20 flex items-center gap-2 transition-all"
        >
          Confirm & Save Vault <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
        {/* Contact & Basics */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm mb-3">
            <User className="w-4 h-4" /> Personal & Summary
          </div>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-slate-400">Full Name</label>
              <input
                type="text"
                value={profile.basics.name}
                onChange={(e) => setProfile({ ...profile, basics: { ...profile.basics, name: e.target.value } })}
                className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-lg p-2 text-white"
              />
            </div>
            <div>
              <label className="text-slate-400">Target Role Title</label>
              <input
                type="text"
                value={profile.basics.label || ""}
                onChange={(e) => setProfile({ ...profile, basics: { ...profile.basics, label: e.target.value } })}
                className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-lg p-2 text-white"
              />
            </div>
          </div>
          <div className="mt-3">
            <label className="text-xs text-slate-400">Master Summary</label>
            <textarea
              rows={3}
              value={profile.basics.summary || ""}
              onChange={(e) => setProfile({ ...profile, basics: { ...profile.basics, summary: e.target.value } })}
              className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white"
            />
          </div>
        </div>

        {/* Experience */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm mb-3">
            <Briefcase className="w-4 h-4" /> Work Experience ({profile.work?.length || 0} Roles)
          </div>
          <div className="space-y-4">
            {profile.work?.map((w, idx) => (
              <div key={idx} className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800/80">
                <div className="flex justify-between font-semibold text-xs text-white">
                  <span>{w.position} at {w.name}</span>
                  <span className="text-slate-400">{w.startDate} - {w.endDate || "Present"}</span>
                </div>
                <ul className="mt-2 space-y-1 text-xs text-slate-300 list-disc pl-4">
                  {w.highlights?.map((h, hIdx) => (
                    <li key={hIdx}>{h}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm mb-3">
            <Wrench className="w-4 h-4" /> Technical Skills & Tools
          </div>
          <div className="flex flex-wrap gap-2">
            {profile.skills?.flatMap((s) => s.keywords).map((kw, kwIdx) => (
              <span key={kwIdx} className="px-2.5 py-1 bg-indigo-950/60 border border-indigo-800/40 text-indigo-300 rounded-lg text-xs font-medium">
                {kw}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
