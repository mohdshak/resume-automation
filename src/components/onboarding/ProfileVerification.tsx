"use client";

import React, { useState } from "react";
import { Check, Edit3, ArrowRight, User, Briefcase, GraduationCap, Wrench, Plus, Trash2 } from "lucide-react";
import { ResumeData } from "@/lib/types";
import { LocalStore } from "@/lib/store";

interface ProfileVerificationProps {
  initialProfile: ResumeData;
  onConfirmed: () => void;
}

export const ProfileVerification: React.FC<ProfileVerificationProps> = ({ initialProfile, onConfirmed }) => {
  const [profile, setProfile] = useState<ResumeData>(initialProfile);
  const [newSkill, setNewSkill] = useState("");

  const handleConfirm = () => {
    LocalStore.saveMasterProfile(profile);
    onConfirmed();
  };

  const handleAddBullet = (workIdx: number) => {
    const updated = { ...profile };
    if (!updated.work[workIdx].highlights) {
      updated.work[workIdx].highlights = [];
    }
    updated.work[workIdx].highlights.push("Spearheaded strategic initiative, delivering measurable business outcomes.");
    setProfile(updated);
  };

  const handleRemoveBullet = (workIdx: number, bulletIdx: number) => {
    const updated = { ...profile };
    updated.work[workIdx].highlights.splice(bulletIdx, 1);
    setProfile(updated);
  };

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    const updated = { ...profile };
    if (!updated.skills || updated.skills.length === 0) {
      updated.skills = [{ name: "Core Skills", keywords: [] }];
    }
    if (!updated.skills[0].keywords.includes(newSkill.trim())) {
      updated.skills[0].keywords.push(newSkill.trim());
    }
    setProfile(updated);
    setNewSkill("");
  };

  const handleRemoveSkill = (skillName: string) => {
    const updated = { ...profile };
    if (updated.skills && updated.skills.length > 0) {
      updated.skills[0].keywords = updated.skills[0].keywords.filter((k) => k !== skillName);
      setProfile(updated);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto glass-panel p-8 rounded-3xl border border-slate-800 shadow-2xl">
      <div className="flex items-center justify-between pb-6 border-b border-slate-800 mb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Step 3 of 3 • Verification & Enrichment</span>
          <h2 className="text-2xl font-black text-white mt-0.5">Confirm Your Master Ground Truth</h2>
          <p className="text-xs text-slate-400 mt-1">Review extracted career data or enrich with additional achievements.</p>
        </div>
        <button
          onClick={handleConfirm}
          className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-500/25 flex items-center gap-2 transition-all hover:scale-105"
        >
          Confirm & Save Vault <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
        {/* Contact & Basics */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm mb-3">
            <User className="w-4 h-4" /> Personal Info & Executive Summary
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="text-slate-400 font-medium">Candidate Name</label>
              <input
                type="text"
                value={profile.basics.name}
                onChange={(e) => setProfile({ ...profile, basics: { ...profile.basics, name: e.target.value } })}
                className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white font-semibold focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-slate-400 font-medium">Target Role / Headline</label>
              <input
                type="text"
                value={profile.basics.label || ""}
                onChange={(e) => setProfile({ ...profile, basics: { ...profile.basics, label: e.target.value } })}
                className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-slate-400 font-medium">Email Address</label>
              <input
                type="text"
                value={profile.basics.email || ""}
                onChange={(e) => setProfile({ ...profile, basics: { ...profile.basics, email: e.target.value } })}
                className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>
          <div className="mt-3">
            <label className="text-xs text-slate-400 font-medium">Master Professional Summary</label>
            <textarea
              rows={3}
              value={profile.basics.summary || ""}
              onChange={(e) => setProfile({ ...profile, basics: { ...profile.basics, summary: e.target.value } })}
              className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 leading-relaxed focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Experience Bank */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-indigo-400 font-bold text-sm mb-3">
            <span className="flex items-center gap-2">
              <Briefcase className="w-4 h-4" /> Work History & Bullet Bank ({profile.work?.length || 0} Roles)
            </span>
          </div>
          <div className="space-y-4">
            {profile.work?.map((w, idx) => (
              <div key={idx} className="p-4 bg-slate-900/90 rounded-xl border border-slate-800/80 space-y-3">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-slate-500 text-[10px] uppercase font-bold">Position Title</label>
                    <input
                      type="text"
                      value={w.position}
                      onChange={(e) => {
                        const updated = { ...profile };
                        updated.work[idx].position = e.target.value;
                        setProfile(updated);
                      }}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-slate-500 text-[10px] uppercase font-bold">Company Name</label>
                    <input
                      type="text"
                      value={w.name}
                      onChange={(e) => {
                        const updated = { ...profile };
                        updated.work[idx].name = e.target.value;
                        setProfile(updated);
                      }}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-semibold"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Achievements & Responsibilities</span>
                    <button
                      onClick={() => handleAddBullet(idx)}
                      className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Add Bullet
                    </button>
                  </div>
                  {w.highlights?.map((h, hIdx) => (
                    <div key={hIdx} className="flex items-start gap-2">
                      <textarea
                        rows={2}
                        value={h}
                        onChange={(e) => {
                          const updated = { ...profile };
                          updated.work[idx].highlights[hIdx] = e.target.value;
                          setProfile(updated);
                        }}
                        className="flex-1 bg-slate-950 border border-slate-800/80 rounded-lg p-2 text-xs text-slate-200 leading-relaxed focus:border-indigo-500 focus:outline-none"
                      />
                      <button
                        onClick={() => handleRemoveBullet(idx, hIdx)}
                        className="p-2 text-slate-500 hover:text-rose-400 transition-colors"
                        title="Remove Bullet"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skills Matrix */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-indigo-400 font-bold text-sm mb-3">
            <span className="flex items-center gap-2">
              <Wrench className="w-4 h-4" /> Technical Skills & Tools Matrix
            </span>
          </div>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              placeholder="Add skill (e.g. B2B SaaS, NetSuite, Kafka)..."
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddSkill()}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
            />
            <button
              onClick={handleAddSkill}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-lg transition-all"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {profile.skills?.flatMap((s) => s.keywords).map((kw, kwIdx) => (
              <span
                key={kwIdx}
                className="group inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-950/60 border border-indigo-800/40 text-indigo-300 rounded-lg text-xs font-medium"
              >
                {kw}
                <button
                  onClick={() => handleRemoveSkill(kw)}
                  className="text-indigo-400/60 hover:text-rose-400 transition-colors"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
