"use client";

import Header from "@/components/custom/Header";
import HeroSection from "@/components/custom/HeroSection";
import Footer from "@/components/custom/Footer";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <Header />
      <HeroSection />
      <Footer />
    </div>
  );
}