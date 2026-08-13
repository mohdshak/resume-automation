import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { Navbar } from "@/components/common/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ResumeTailor Studio | Precision ATS Tailoring",
  description: "High-utility SaaS workspace for real-time job description tailoring, STAR/XYZ bullet optimization, and ATS verification.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-[#080c14] text-slate-100 antialiased`}>
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-4">{children}</main>
      </body>
    </html>
  );
}
