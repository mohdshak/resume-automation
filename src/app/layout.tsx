import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { Navbar } from "@/components/common/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ResumeTailor AI | Multi-Agent ATS Auto-Resume Optimizer",
  description: "Collaborative 7-Agent AI Platform for precision job description matching, XYZ bullet optimization, and ATS >= 85% compliance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-[#090d16] text-slate-100 antialiased selection:bg-indigo-500 selection:text-white`}>
        <Navbar />
        <main className="max-w-7xl mx-auto px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
