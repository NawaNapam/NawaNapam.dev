"use client";

import Header from "@/components/custom/Header";
import HeroSection from "@/components/custom/HeroSection";
import Footer from "@/components/custom/Footer";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f1a0f] via-[#1a2d1a] to-[#0f1a0f]">
      <Header />
      <HeroSection />
      <Footer />
    </div>
  );
}