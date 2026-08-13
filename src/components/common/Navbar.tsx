"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, FileText, LayoutDashboard, GitCompare, Briefcase, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export const Navbar = () => {
  const pathname = usePathname();

  const navItems = [
    { name: "Tailor Studio", href: "/tailor", icon: Sparkles },
    { name: "Master Profile", href: "/profile", icon: UserCheck },
    { name: "Diff Inspector", href: "/diff", icon: GitCompare },
    { name: "Pipeline Tracker", href: "/tracker", icon: Briefcase },
  ];

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-slate-800/80 px-6 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
            ResumeTailor <span className="text-indigo-400 font-semibold">AI</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1.5 bg-slate-900/60 p-1 rounded-xl border border-slate-800">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all",
                  isActive
                    ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                )}
              >
                <Icon className={cn("w-4 h-4", isActive ? "text-indigo-400" : "text-slate-400")} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/onboarding"
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 rounded-lg transition-colors"
          >
            Re-Upload Master
          </Link>
        </div>
      </div>
    </header>
  );
};
