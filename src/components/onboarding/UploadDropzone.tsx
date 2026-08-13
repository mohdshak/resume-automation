"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, FileText, Sparkles, Check, ArrowRight } from "lucide-react";
import { api } from "@/lib/api";
import { ResumeData } from "@/lib/types";

interface UploadDropzoneProps {
  onParsed: (profile: ResumeData) => void;
}

export const UploadDropzone: React.FC<UploadDropzoneProps> = ({ onParsed }) => {
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [rawText, setRawText] = useState("");
  const [tab, setTab] = useState<"file" | "paste" | "sample">("file");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    try {
      setLoading(true);
      const res = await api.uploadResume(file);
      if (res.parsed_profile) {
        onParsed(res.parsed_profile);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to parse resume. Please check file format.");
    } finally {
      setLoading(false);
    }
  };

  const handleSampleLoad = async (type: "tech" | "product" | "data") => {
    try {
      setLoading(true);
      const res = await api.loadSampleProfile(type);
      if (res.parsed_profile) {
        onParsed(res.parsed_profile);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePasteSubmit = () => {
    if (!rawText.trim()) return;
    // Simple client fallback parsing or API call
    const lines = rawText.split("\n").filter((l) => l.trim().length > 0);
    const mockParsed: ResumeData = {
      basics: {
        name: lines[0] || "Candidate",
        summary: rawText.slice(0, 300),
      },
      work: [
        {
          name: "Previous Company",
          position: "Software Engineer",
          highlights: lines.slice(1, 4),
        },
      ],
      education: [
        {
          institution: "University",
          studyType: "Bachelor of Science",
        },
      ],
      skills: [
        {
          name: "Core Skills",
          keywords: ["Python", "FastAPI", "React", "PostgreSQL", "Docker"],
        },
      ],
    };
    onParsed(mockParsed);
  };

  return (
    <div className="w-full max-w-2xl mx-auto glass-panel p-8 rounded-3xl border border-slate-800 shadow-2xl">
      <div className="text-center mb-6">
        <div className="inline-flex p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 mb-3 border border-indigo-500/20">
          <Sparkles className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-extrabold text-white">Create Your Master Career Vault</h2>
        <p className="text-sm text-slate-400 mt-1 max-w-md mx-auto">
          Upload your resume once. Our Candidate Archivist agent extracts your experience into your permanent ground truth.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-slate-900/80 rounded-xl border border-slate-800 mb-6">
        <button
          onClick={() => setTab("file")}
          className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
            tab === "file" ? "bg-indigo-600 text-white shadow" : "text-slate-400 hover:text-white"
          }`}
        >
          Upload PDF / DOCX
        </button>
        <button
          onClick={() => setTab("sample")}
          className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
            tab === "sample" ? "bg-indigo-600 text-white shadow" : "text-slate-400 hover:text-white"
          }`}
        >
          Try Sample Profile
        </button>
        <button
          onClick={() => setTab("paste")}
          className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
            tab === "paste" ? "bg-indigo-600 text-white shadow" : "text-slate-400 hover:text-white"
          }`}
        >
          Paste Raw Text
        </button>
      </div>

      {/* Dropzone Tab */}
      {tab === "file" && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            if (e.dataTransfer.files?.[0]) {
              handleFileUpload(e.dataTransfer.files[0]);
            }
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all ${
            dragActive
              ? "border-indigo-500 bg-indigo-500/10"
              : "border-slate-700/80 hover:border-indigo-500/50 bg-slate-900/40 hover:bg-slate-900/70"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.txt,.json"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
            }}
          />
          <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mb-3">
            <UploadCloud className="w-7 h-7" />
          </div>
          <span className="text-sm font-semibold text-white">
            {loading ? "Archivist parsing resume..." : "Click or drag & drop your resume"}
          </span>
          <span className="text-xs text-slate-500 mt-1">Supports PDF, DOCX, TXT, and JSON Resume</span>
        </div>
      )}

      {/* Sample Profile Tab */}
      {tab === "sample" && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { type: "tech" as const, title: "Software Engineer", desc: "Distributed Systems, Python, Kafka" },
            { type: "product" as const, title: "Product Manager", desc: "PLG, Enterprise AI, Amplitude" },
            { type: "data" as const, title: "Data Scientist", desc: "LLMs, PyTorch, RAG Pipelines" },
          ].map((s) => (
            <button
              key={s.type}
              onClick={() => handleSampleLoad(s.type)}
              disabled={loading}
              className="glass-card p-4 rounded-xl text-left border border-slate-800 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all group"
            >
              <FileText className="w-5 h-5 text-indigo-400 mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-sm font-bold text-white">{s.title}</div>
              <div className="text-[11px] text-slate-400 mt-1 leading-snug">{s.desc}</div>
            </button>
          ))}
        </div>
      )}

      {/* Paste Tab */}
      {tab === "paste" && (
        <div>
          <textarea
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            rows={7}
            placeholder="Paste your resume text or Markdown here..."
            className="w-full bg-slate-900/80 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
          />
          <button
            onClick={handlePasteSubmit}
            className="mt-3 w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
          >
            Parse Text Resume <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
