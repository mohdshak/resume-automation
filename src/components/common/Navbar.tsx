"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, FileText, GitCompare, UserCheck, Briefcase, Download, Upload, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavbarProps {
  onOpenUpload?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenUpload }) => {
  const pathname = usePathname();

  const navTabs = [
    { name: "Tailor Studio", href: "/", icon: Sparkles },
    { name: "Master Profile", href: "/profile", icon: UserCheck },
    { name: "Diff Audit", href: "/diff", icon: GitCompare },
    { name: "Pipeline Tracker", href: "/tracker", icon: Briefcase },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#080c14]/90 backdrop-blur-md border-b border-slate-800/80 px-5 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm group-hover:bg-indigo-500 transition-colors">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-sm font-bold text-white tracking-tight">
              ResumeTailor <span className="text-indigo-400 font-normal">Studio</span>
            </span>
          </Link>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 bg-[#0f1523] p-1 rounded-lg border border-slate-800/80">
            {navTabs.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all",
                    isActive
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <Link
            href="/onboarding"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-all"
          >
            <Upload className="w-3.5 h-3.5 text-slate-400" />
            Upload Master
          </Link>
        </div>
      </div>
    </header>
  );
};
