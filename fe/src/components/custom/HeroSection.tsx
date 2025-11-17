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
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <div
            className="absolute w-96 h-96 bg-cyan-500 rounded-full blur-3xl -top-48 -left-48 animate-pulse"
            style={{ transform: `translate(${mousePos.x * 0.02}px, ${mousePos.y * 0.02}px)` }}
          />
          <div
            className="absolute w-80 h-80 bg-purple-600 rounded-full blur-3xl -bottom-40 -right-40 animate-pulse delay-700"
            style={{ transform: `translate(${mousePos.x * -0.015}px, ${mousePos.y * -0.015}px)` }}
          />
        </div>

        {/* Floating Sparkles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <Sparkles
              key={i}
              size={16}
              className="absolute text-cyan-400/30 animate-float"
              style={{
                top: `${20 + i * 15}%`,
                left: i % 2 === 0 ? "10%" : "75%",
                animationDelay: `${i * 0.5}s`,
              }}
            />
          ))}
        </div>

        {/* Main Content */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center py-8">
          <div className="max-w-5xl mx-auto space-y-8">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full px-5 py-2 text-xs sm:text-sm font-medium text-cyan-200 tracking-wider">
              <Zap size={14} className="animate-pulse" />
              <span>Instant • Anonymous • Global</span>
              <Globe size={14} className="animate-pulse delay-300" />
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
              Meet Strangers
            </h1>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-cyan-200 tracking-wide">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-300 bg-clip-text text-transparent">
                In One Click
              </span>
            </h2>

            {/* Description */}
            <p className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-300 leading-relaxed font-light">
              Skip the small talk. Jump into real-time video chats with people around the world. Just{" "}
              <span className="text-cyan-300 font-medium">you and them</span>.
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-10">
              {isLoading ? (
                <div className="w-full sm:w-64 h-14 bg-white/20 backdrop-blur-md rounded-2xl animate-pulse" />
              ) : isAuthenticated ? (
                <>
                  <Link
                    href="/chat"
                    className="group w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-lg rounded-2xl transition-all hover:scale-105 hover:shadow-2xl flex items-center justify-center gap-3 shadow-xl"
                  >
                    <Video size={22} className="group-hover:rotate-12 transition-transform" />
                    Start Video Chat
                    <Zap size={18} className="group-hover:scale-110 transition-transform" />
                  </Link>
                  <Link
                    href="/dashboard"
                    className="w-full sm:w-auto px-8 py-3.5 bg-white/10 backdrop-blur-md border border-white/30 text-white font-medium rounded-2xl hover:bg-white/20 transition-all flex items-center justify-center gap-2"
                  >
                    <Users size={18} />
                    Dashboard
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/chat"
                    className="group w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xl rounded-2xl transition-all hover:scale-105 hover:shadow-2xl flex items-center justify-center gap-3 shadow-xl"
                  >
                    <Video size={24} className="group-hover:rotate-12 transition-transform" />
                    Start Chatting Now
                    <Zap size={20} className="group-hover:scale-110 transition-transform" />
                  </Link>
                  <Link
                    href="/login"
                    className="w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur-md border border-white/30 text-white font-medium rounded-2xl hover:bg-white/20 hover:border-white/40 transition-all flex items-center justify-center gap-2"
                  >
                    <Users size={20} />
                    Sign In
                  </Link>
                </>
              )}
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-6 mt-12 text-gray-400 text-sm">
              <div className="flex items-center gap-2"><Globe size={16} /><span>190+ Countries</span></div>
              <div className="flex items-center gap-2"><Users size={16} /><span>Live Now: <span className="text-cyan-300 font-medium">12.4K</span></span></div>
              <div className="flex items-center gap-2"><Zap size={16} /><span>&lt; 3s Connect</span></div>
            </div>
          </div>
        </div>

        {/* Scroll Hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-cyan-400/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-cyan-400 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-transparent via-slate-900/50 to-slate-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Why Choose{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Us?
              </span>
            </h2>
            <p className="text-gray-400 text-base sm:text-lg max-w-3xl mx-auto">
              Simple, fast, and built for real spontaneous conversations.
            </p>
          </div>

          <div className="grid gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">
            {WHY_CHOOSE_US.map((f, i) => (
              <article
                key={f.title}
                className="group bg-white/5 backdrop-blur-xl rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-cyan-500/20"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="flex flex-col items-start space-y-4">
                  <div
                    className={`p-3 rounded-xl bg-gradient-to-r ${f.gradient} text-white shadow-md group-hover:scale-110 transition-transform duration-300`}
                  >
                    <f.icon size={24} />
                  </div>
                  <h3 className="font-semibold text-lg text-gray-200 group-hover:text-cyan-300 transition-colors">
                    {f.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

/* WHY CHOOSE US DATA */
const WHY_CHOOSE_US = [
  {
    title: "100% Anonymous",
    desc: "No names, no profiles, no trace. Just you and the moment.",
    icon: EyeOff,
    gradient: "from-cyan-500 to-blue-600",
  },
  {
    title: "Instant Match",
    desc: "Connected in under 3 seconds – no waiting, no queues.",
    icon: Zap,
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    title: "Global Reach",
    desc: "Chat with anyone, anytime, anywhere.",
    icon: Globe,
    gradient: "from-purple-500 to-indigo-600",
  },
  {
    title: "End-to-End Encrypted",
    desc: "Your video & audio are protected at all times.",
    icon: Shield,
    gradient: "from-rose-500 to-pink-600",
  },
];