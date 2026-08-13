"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, FileText, Sparkles, Check, ArrowRight, RefreshCw, AlertCircle } from "lucide-react";
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
      alert("Failed to parse resume file. Please ensure it is a readable PDF, DOCX, or TXT document.");
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

  const handlePasteSubmit = async () => {
    if (!rawText.trim()) return;
    try {
      setLoading(true);
      const res = await api.pasteResume(rawText);
      if (res.parsed_profile) {
        onParsed(res.parsed_profile);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to parse resume text.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto panel p-6 rounded-2xl shadow-xl">
      <div className="text-center mb-5">
        <h2 className="text-xl font-black text-white">Career Ground Truth Vault</h2>
        <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
          Upload your complete resume to extract all work achievements, roles, and technical skills into your Master Ground Truth.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 p-1 bg-[#090d16] rounded-xl border border-slate-800 mb-5 text-xs">
        <button
          onClick={() => setTab("file")}
          className={`flex-1 py-1.5 rounded-lg font-semibold transition-all ${
            tab === "file" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
          }`}
        >
          Upload PDF / DOCX
        </button>
        <button
          onClick={() => setTab("paste")}
          className={`flex-1 py-1.5 rounded-lg font-semibold transition-all ${
            tab === "paste" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
          }`}
        >
          Paste Raw Resume Text
        </button>
        <button
          onClick={() => setTab("sample")}
          className={`flex-1 py-1.5 rounded-lg font-semibold transition-all ${
            tab === "sample" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
          }`}
        >
          Try Sample Profile
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
          className={`border border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all ${
            dragActive
              ? "border-indigo-500 bg-indigo-500/10"
              : "border-slate-800 hover:border-indigo-500/50 bg-[#090d16] hover:bg-[#0c121f]"
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
          <div className="w-12 h-12 rounded-xl bg-indigo-600/10 text-indigo-400 flex items-center justify-center mb-2.5 border border-indigo-500/20">
            {loading ? <RefreshCw className="w-6 h-6 animate-spin" /> : <UploadCloud className="w-6 h-6" />}
          </div>
          <span className="text-xs font-bold text-white">
            {loading ? "Decompressing & Parsing All Sections..." : "Click or drag & drop your resume"}
          </span>
          <span className="text-[11px] text-slate-500 mt-1">Supports PDF (including Canva/LaTeX), DOCX, TXT, and JSON Resume</span>
        </div>
      )}

      {/* Paste Tab */}
      {tab === "paste" && (
        <div className="space-y-3">
          <textarea
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            rows={10}
            placeholder="Paste your complete resume text or Markdown here (including Summary, Experience bullets, Education, Skills)..."
            className="input-compact w-full rounded-xl p-3 font-mono text-xs text-slate-200 leading-relaxed resize-none focus:outline-none"
          />
          <button
            onClick={handlePasteSubmit}
            disabled={loading || !rawText.trim()}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg shadow-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Parsing Resume Text...
              </>
            ) : (
              <>
                Parse & Extract 100% Content <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      )}

      {/* Sample Profile Tab */}
      {tab === "sample" && (
        <div className="grid grid-cols-3 gap-2.5">
          {[
            { type: "product" as const, title: "Product Manager", desc: "B2B SaaS, Ecommerce, Amplitude" },
            { type: "tech" as const, title: "Software Engineer", desc: "Distributed Systems, Python, Kafka" },
            { type: "data" as const, title: "Data Scientist", desc: "LLMs, PyTorch, RAG Pipelines" },
          ].map((s) => (
            <button
              key={s.type}
              onClick={() => handleSampleLoad(s.type)}
              disabled={loading}
              className="panel p-3 rounded-xl text-left hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all group"
            >
              <FileText className="w-4 h-4 text-indigo-400 mb-1.5 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold text-white">{s.title}</div>
              <div className="text-[10px] text-slate-400 mt-0.5 leading-snug">{s.desc}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
