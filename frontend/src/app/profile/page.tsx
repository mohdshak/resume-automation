"use client";

import React, { useEffect, useState } from "react";
import { LocalStore } from "@/lib/store";
import { ResumeData } from "@/lib/types";
import { UserCheck, Save, Plus, Trash2, Briefcase, Wrench } from "lucide-react";

export default function MasterProfilePage() {
  const [profile, setProfile] = useState<ResumeData | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const data = LocalStore.getMasterProfile();
    setProfile(data);
  }, []);

  const handleSave = () => {
    if (profile) {
      LocalStore.saveMasterProfile(profile);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  if (!profile) {
    return (
      <div className="glass-card p-12 rounded-3xl border border-slate-800 text-center max-w-lg mx-auto">
        <UserCheck className="w-8 h-8 text-indigo-400 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-white">No Master Profile Found</h3>
        <p className="text-xs text-slate-400 mt-1">Complete the 30-second onboarding to upload your career ground truth.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
            <UserCheck className="w-4 h-4" /> Master Experience Bank
          </div>
          <h1 className="text-2xl font-black text-white">Permanent Ground Truth Vault</h1>
          <p className="text-xs text-slate-400">All tailoring agents reference this repository as the immutable factual baseline.</p>
        </div>
        <button
          onClick={handleSave}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/25 flex items-center gap-1.5 transition-all"
        >
          <Save className="w-3.5 h-3.5" /> {saved ? "Saved to Vault!" : "Save Changes"}
        </button>
      </div>

      {/* Experience Bank */}
      <div className="space-y-6">
        <div className="glass-panel p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-indigo-400" /> Work History & Bullet Bank
            </h3>
          </div>
          <div className="space-y-4">
            {profile.work?.map((work, wIdx) => (
              <div key={wIdx} className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 space-y-3">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <input
                    type="text"
                    value={work.position}
                    onChange={(e) => {
                      const updated = { ...profile };
                      updated.work[wIdx].position = e.target.value;
                      setProfile(updated);
                    }}
                    className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-semibold"
                  />
                  <input
                    type="text"
                    value={work.name}
                    onChange={(e) => {
                      const updated = { ...profile };
                      updated.work[wIdx].name = e.target.value;
                      setProfile(updated);
                    }}
                    className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                  />
                </div>
                <div className="space-y-2">
                  {work.highlights?.map((h, hIdx) => (
                    <div key={hIdx} className="flex items-start gap-2">
                      <textarea
                        rows={2}
                        value={h}
                        onChange={(e) => {
                          const updated = { ...profile };
                          updated.work[wIdx].highlights[hIdx] = e.target.value;
                          setProfile(updated);
                        }}
                        className="flex-1 bg-slate-950/80 border border-slate-800/80 rounded-lg p-2 text-xs text-slate-200 leading-relaxed"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
