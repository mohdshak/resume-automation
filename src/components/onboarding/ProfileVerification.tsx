"use client";

import React, { useState } from "react";
import { Check, Edit3, ArrowRight, User, Briefcase, GraduationCap, Wrench, Plus, Trash2, FileText, Eye, CheckCircle2 } from "lucide-react";
import { ResumeData } from "@/lib/types";
import { LocalStore } from "@/lib/store";
import { parseResumeTextToSchema } from "@/lib/resume-parser";

interface ProfileVerificationProps {
  initialProfile: ResumeData;
  onConfirmed: () => void;
}

export const ProfileVerification: React.FC<ProfileVerificationProps> = ({ initialProfile, onConfirmed }) => {
  const [profile, setProfile] = useState<ResumeData>(initialProfile);
  const [viewMode, setViewMode] = useState<"structured" | "raw">("structured");
  const [rawDocumentText, setRawDocumentText] = useState<string>(initialProfile.raw_text || "");
  const [newSkill, setNewSkill] = useState("");

  const handleConfirm = () => {
    LocalStore.saveMasterProfile({ ...profile, raw_text: rawDocumentText });
    onConfirmed();
  };

  const handleRawTextChange = (text: string) => {
    setRawDocumentText(text);
    // Real-time re-parse from updated raw text
    try {
      const updated = parseResumeTextToSchema(text);
      setProfile(updated);
    } catch (e) {
      // Keep existing profile if typing incomplete text
    }
  };

  const handleAddBullet = (workIdx: number) => {
    const updated = { ...profile };
    if (!updated.work[workIdx].highlights) {
      updated.work[workIdx].highlights = [];
    }
    updated.work[workIdx].highlights.push("Spearheaded key initiative, delivering measurable outcomes.");
    setProfile(updated);
  };

  const handleRemoveBullet = (workIdx: number, bulletIdx: number) => {
    const updated = { ...profile };
    updated.work[workIdx].highlights.splice(bulletIdx, 1);
    setProfile(updated);
  };

  const handleAddRole = () => {
    const updated = { ...profile };
    if (!updated.work) updated.work = [];
    updated.work.unshift({
      name: "New Organization",
      position: "Product / Engineering Role",
      startDate: "2022-01-01",
      endDate: "Present",
      highlights: ["Drove core technical and product milestones."],
    });
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
    <div className="w-full max-w-4xl mx-auto panel p-6 rounded-2xl shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">Step 3 of 3 • Master Ground Truth</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950/60 border border-emerald-800/50 text-emerald-400">
              100% Exact Capture
            </span>
          </div>
          <h2 className="text-xl font-black text-white mt-0.5">Verify & Ground Your Complete Resume</h2>
        </div>

        <div className="flex items-center gap-2">
          {/* Dual Mode Switcher */}
          <div className="flex bg-[#090d16] p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setViewMode("structured")}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                viewMode === "structured" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
              }`}
            >
              Structured Ground Truth
            </button>
            <button
              onClick={() => setViewMode("raw")}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                viewMode === "raw" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
              }`}
            >
              Exact Raw Document
            </button>
          </div>

          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg shadow-sm flex items-center gap-1.5 transition-all"
          >
            Confirm & Save Vault <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Raw Document View (100% Exact Match) */}
      {viewMode === "raw" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Verbatim extracted text stream (Line-for-line un-truncated match):</span>
            <span className="text-emerald-400 font-semibold">{rawDocumentText.length} characters captured</span>
          </div>
          <textarea
            rows={18}
            value={rawDocumentText}
            onChange={(e) => handleRawTextChange(e.target.value)}
            className="input-compact w-full rounded-xl p-4 font-mono text-xs text-slate-200 leading-relaxed resize-none focus:outline-none"
            placeholder="Complete resume text stream..."
          />
        </div>
      )}

      {/* Structured View */}
      {viewMode === "structured" && (
        <div className="space-y-4 max-h-[62vh] overflow-y-auto pr-1">
          {/* Contact & Basics */}
          <div className="panel p-4 rounded-xl space-y-3">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs">
              <User className="w-3.5 h-3.5" /> Personal Info & Executive Summary
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs">
              <div>
                <label className="text-slate-400 text-[11px] font-medium">Candidate Name</label>
                <input
                  type="text"
                  value={profile.basics.name}
                  onChange={(e) => setProfile({ ...profile, basics: { ...profile.basics, name: e.target.value } })}
                  className="input-compact w-full mt-1 rounded-lg p-2 font-semibold text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 text-[11px] font-medium">Target Role / Headline</label>
                <input
                  type="text"
                  value={profile.basics.label || ""}
                  onChange={(e) => setProfile({ ...profile, basics: { ...profile.basics, label: e.target.value } })}
                  className="input-compact w-full mt-1 rounded-lg p-2 text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 text-[11px] font-medium">Email Address</label>
                <input
                  type="text"
                  value={profile.basics.email || ""}
                  onChange={(e) => setProfile({ ...profile, basics: { ...profile.basics, email: e.target.value } })}
                  className="input-compact w-full mt-1 rounded-lg p-2 text-white"
                />
              </div>
            </div>
            <div>
              <label className="text-slate-400 text-[11px] font-medium">Executive Summary</label>
              <textarea
                rows={3}
                value={profile.basics.summary || ""}
                onChange={(e) => setProfile({ ...profile, basics: { ...profile.basics, summary: e.target.value } })}
                className="input-compact w-full mt-1 rounded-lg p-2 text-xs text-slate-200 leading-relaxed resize-none"
              />
            </div>
          </div>

          {/* Work History */}
          <div className="panel p-4 rounded-xl space-y-3">
            <div className="flex items-center justify-between text-indigo-400 font-bold text-xs">
              <span className="flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5" /> Career History & Achievements ({profile.work?.length || 0} Roles)
              </span>
              <button
                onClick={handleAddRole}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Add Role
              </button>
            </div>

            <div className="space-y-3">
              {profile.work?.map((w, idx) => (
                <div key={idx} className="p-3 bg-[#090d16] rounded-lg border border-slate-800/80 space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-xs">
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
                        className="input-compact w-full rounded-md p-1.5 text-white font-semibold"
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
                        className="input-compact w-full rounded-md p-1.5 text-white font-semibold"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Bullet Points ({w.highlights?.length || 0})
                      </span>
                      <button
                        onClick={() => handleAddBullet(idx)}
                        className="text-[10px] text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Add Bullet
                      </button>
                    </div>

                    {w.highlights?.map((h, hIdx) => (
                      <div key={hIdx} className="flex items-start gap-1.5">
                        <textarea
                          rows={2}
                          value={h}
                          onChange={(e) => {
                            const updated = { ...profile };
                            updated.work[idx].highlights[hIdx] = e.target.value;
                            setProfile(updated);
                          }}
                          className="input-compact flex-1 rounded-md p-1.5 text-xs text-slate-200 leading-relaxed resize-none"
                        />
                        <button
                          onClick={() => handleRemoveBullet(idx, hIdx)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
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
          <div className="panel p-4 rounded-xl space-y-2.5">
            <div className="flex items-center gap-1.5 text-indigo-400 font-bold text-xs">
              <Wrench className="w-3.5 h-3.5" /> Technical Skills & Tools Matrix
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add skill (e.g. B2B SaaS, NetSuite, Kafka)..."
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddSkill()}
                className="input-compact flex-1 rounded-lg px-2.5 py-1 text-xs text-white"
              />
              <button
                onClick={handleAddSkill}
                className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-lg transition-all"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {profile.skills?.flatMap((s) => s.keywords).map((kw, kwIdx) => (
                <span
                  key={kwIdx}
                  className="group inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#090d16] border border-slate-800 text-indigo-300 rounded-md text-xs font-medium"
                >
                  {kw}
                  <button
                    onClick={() => handleRemoveSkill(kw)}
                    className="text-indigo-400/50 hover:text-rose-400 transition-colors"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
