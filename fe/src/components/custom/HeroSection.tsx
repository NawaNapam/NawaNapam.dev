"use client";

import Link from "next/link";
import { Video, Zap, Users, Globe, Sparkles, Shield, EyeOff } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useEffect, useState } from "react";

export default function HeroSection() {
  const { isAuthenticated, user, isLoading } = useAuthStore();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <>
      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Animated Golden-Green Blobs */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div
            className="absolute w-96 h-96 bg-amber-600/40 rounded-full blur-3xl -top-48 -left-48 animate-pulse"
            style={{ transform: `translate(${mousePos.x * 0.02}px, ${mousePos.y * 0.02}px)` }}
          />
          <div
            className="absolute w-80 h-80 bg-emerald-700/50 rounded-full blur-3xl -bottom-40 -right-40 animate-pulse delay-700"
            style={{ transform: `translate(${mousePos.x * -0.015}px, ${mousePos.y * -0.015}px)` }}
          />
        </div>

        {/* Floating Golden Sparkles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(7)].map((_, i) => (
            <Sparkles
              key={i}
              size={18}
              className="absolute text-amber-400/30 animate-float"
              style={{
                top: `${15 + i * 14}%`,
                left: i % 2 === 0 ? "8%" : "78%",
                animationDelay: `${i * 0.6}s`,
              }}
            />
          ))}
        </div>

        {/* Main Content */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center py-8">
          <div className="max-w-5xl mx-auto space-y-10">

            {/* Badge */}
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-xl border border-amber-500/30 rounded-full px-6 py-2.5 text-sm font-medium text-amber-100 tracking-wider shadow-lg">
              <Zap size={16} className="animate-pulse text-amber-400" />
              <span>Instant • Anonymous • Global</span>
              <Globe size={16} className="animate-pulse delay-300 text-amber-400" />
            </div>

            {/* Heading */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-amber-50 leading-tight">
              Meet Strangers
            </h1>
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extralight text-amber-100 tracking-wider -mt-7">
              <span className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-300 bg-clip-text text-transparent font-bold">
                In One Click
              </span>
            </h2>

            {/* Description */}
            <p className="max-w-3xl mx-auto text-lg sm:text-xl text-amber-100/80 leading-relaxed font-light">
              Skip the small talk. Connect instantly with souls across Bharat and the world.{" "}
              <span className="text-amber-300 font-medium">Just you, them, and the moment.</span>
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center mt-12">
              {isLoading ? (
                <div className="w-full sm:w-72 h-14 bg-white/10 backdrop-blur-md rounded-2xl animate-pulse" />
              ) : isAuthenticated ? (
                <>
                  <Link
                    href="/chat"
                    className="group w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-amber-500 to-yellow-600 text-gray-900 font-bold text-xl rounded-2xl transition-all hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/40 flex items-center justify-center gap-3 shadow-xl"
                  >
                    <Video size={26} className="group-hover:rotate-12 transition-transform" />
                    Start Video Chat
                    <Zap size={22} className="group-hover:scale-110 transition-transform" />
                  </Link>
                  <Link
                    href="/dashboard"
                    className="w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur-xl border border-amber-500/30 text-amber-100 font-medium rounded-2xl hover:bg-white/20 hover:border-amber-400 transition-all flex items-center justify-center gap-2"
                  >
                    <Users size={20} />
                    Dashboard
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/chat"
                    className="group w-full sm:w-auto px-12 py-5 bg-gradient-to-r from-amber-500 to-yellow-600 text-gray-900 font-bold text-xl rounded-2xl transition-all hover:shadow-2xl hover:shadow-amber-500/50 flex items-center justify-center gap-4 shadow-2xl"
                  >
                    <Video size={28} className="group-hover:rotate-12 transition-transform hidden sm:block" />
                    Start Chatting Now
                    <Zap size={24} className="group-hover:scale-110 transition-transform hidden sm:block" />
                  </Link>
                  <Link
                    href="/login"
                    className="w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur-xl border border-amber-500/30 text-amber-100 font-medium rounded-2xl hover:bg-white/20 hover:border-amber-400 transition-all flex items-center justify-center gap-2"
                  >
                    <Users size={22} />
                    Sign In
                  </Link>
                </>
              )}
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-8 mt-16 text-amber-100/70 text-sm font-medium">
              <div className="flex items-center gap-2"><Globe size={18} className="text-amber-400" /><span>190+ Countries</span></div>
              <div className="flex items-center gap-2"><Users size={18} className="text-amber-400" /><span>Live Now: <span className="text-amber-300 font-bold">12.4K</span></span></div>
              <div className="flex items-center gap-2"><Zap size={18} className="text-amber-400" /><span>&lt; 3s Connect</span></div>
            </div>
          </div>
        </div>

        {/* Scroll Hint
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-7 h-12 border-2 border-amber-500/50 rounded-full flex justify-center">
            <div className="w-1.5 h-4 bg-amber-400 rounded-full mt-3 animate-pulse" />
          </div>
        </div> */}
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-20 lg:py-28 bg-black/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-amber-50 mb-6">
              Why Choose{" "}
              <span className="bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
                Nawa Napam?
              </span>
            </h2>
            <p className="text-amber-100/70 text-lg max-w-3xl mx-auto">
              Rooted in culture, built for the world — anonymous, instant, and truly human.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">
            {WHY_CHOOSE_US.map((f, i) => (
              <article
                key={f.title}
                className="group bg-white/8 backdrop-blur-xl rounded-2xl p-8 shadow-xl hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-500 hover:-translate-y-2 border border-amber-500/20"
              >
                <div className="flex flex-col items-center space-y-5">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-600 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <f.icon size={28} />
                  </div>
                  <h3 className="font-bold text-xl text-amber-100 group-hover:text-amber-300 transition-colors">
                    {f.title}
                  </h3>
                  <p className="text-amber-100/70 text-sm leading-relaxed text-center">{f.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

/* Updated Why Choose Us with matching golden-green tones */
const WHY_CHOOSE_US = [
  {
    title: "100% Anonymous",
    desc: "No names, no profiles, no trace. Just you and the moment.",
    icon: EyeOff,
  },
  {
    title: "Instant Match",
    desc: "Connected in under 3 seconds — no waiting, no queues.",
    icon: Zap,
  },
  {
    title: "Global Reach",
    desc: "Chat with anyone, anytime, anywhere on Earth.",
    icon: Globe,
  },
  {
    title: "End-to-End Encrypted",
    desc: "Your video & audio are protected at all times.",
    icon: Shield,
  },
];