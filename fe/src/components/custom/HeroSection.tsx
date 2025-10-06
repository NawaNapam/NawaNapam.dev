"use client";
import Link from "next/link";
import { Heart, Sparkles, Users } from "lucide-react";
import "@/styles/hero.css";
import { WHY_CHOOSE_US } from "@/constants/hero";

export default function Home() {
  return (
    <>
      <header className="relative min-h-[100svh] flex items-center justify-center overflow-hidden pt-16">
        {/* Enhanced Romantic Background with Couple Silhouette */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 transform transition-transform duration-700 hover:scale-110"
          style={{
            backgroundImage:
              'url("https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1280&fit=crop")',
          }}
        />

        {/* Multi-layered Gradient Overlay for Perfect Romance Feel */}
        <div className="absolute inset-0 bg-gradient-to-br from-rose-900/90 via-pink-800/85 to-purple-900/90" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-rose-600/20 via-transparent to-pink-600/20" />

        {/* Enhanced Floating Hearts and Sparkles Animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-16 left-8 md:top-20 md:left-16 text-rose-300/40 animate-pulse">
            <Heart size={24} className="md:w-8 md:h-8" />
          </div>
          <div className="absolute top-32 right-12 md:top-40 md:right-20 text-pink-300/35 animate-pulse delay-1000">
            <Sparkles size={20} className="md:w-7 md:h-7" />
          </div>
          <div className="absolute bottom-40 left-12 md:bottom-48 md:left-20 text-rose-300/30 animate-pulse delay-500">
            <Heart size={18} className="md:w-6 md:h-6" />
          </div>
          <div className="absolute top-48 right-1/4 md:top-60 md:right-1/3 text-pink-300/25 animate-pulse delay-700">
            <Sparkles size={16} className="md:w-5 md:h-5" />
          </div>
          <div className="absolute bottom-28 right-16 md:bottom-32 md:right-24 text-rose-300/35 animate-pulse delay-300">
            <Heart size={20} className="md:w-6 md:h-6" />
          </div>
          <div className="absolute top-36 left-1/4 md:top-44 md:left-1/3 text-pink-300/30 animate-pulse delay-1200">
            <Sparkles size={18} className="md:w-5 md:h-5" />
          </div>
        </div>

        {/* Main Content with Enhanced Typography */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center py-6 sm:py-10 lg:py-12">
          <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8 lg:space-y-10">
            {/* Elegant Subtitle Badge */}
            <div className="inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-white/10 to-white/20 backdrop-blur-md rounded-full px-4 sm:px-6 lg:px-8 py-2 sm:py-2.5 border border-white/20 shadow-xl hover:border-white/30 transition-all duration-300 group">
              <Heart
                size={14}
                className="sm:w-4 sm:h-4 text-rose-300 animate-pulse group-hover:scale-110 transition-transform duration-300"
              />
              <span className="text-white/95 text-xs sm:text-sm font-medium tracking-wider">
                Where Hearts Unite Forever
              </span>
              <Sparkles
                size={14}
                className="sm:w-4 sm:h-4 text-rose-300 animate-pulse delay-500 group-hover:scale-110 transition-transform duration-300"
              />
            </div>

            {/* Enhanced Main Heading with Better Font Hierarchy */}
            <div className="animate-fade-in-up space-y-2 sm:space-y-3">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light text-white leading-tight tracking-wide font-serif">
                Welcome to
              </h1>
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-bold leading-tight lg:leading-none font-serif">
                <span className="relative inline-block">
                  <span className="absolute inset-0 bg-gradient-to-r from-rose-400/20 via-pink-400/20 to-rose-400/20 blur-3xl transform scale-150 animate-pulse"></span>
                  <span className="vfont font-semibold relative bg-gradient-to-r from-rose-200 via-pink-100 to-rose-200 bg-clip-text text-transparent drop-shadow-2xl tracking-tight">
                    Nawa Napam
                  </span>
                </span>
              </h2>
            </div>

            {/* Refined Description with Better Mobile Hierarchy */}
            <div className="space-y-3 sm:space-y-4 animate-fade-in-up delay-200 max-w-4xl mx-auto">
              <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white/95 font-light vfont leading-snug tracking-wide">
                Discover meaningful connections and find your perfect match
              </p>
              <div className="space-y-2 sm:space-y-3">
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 vfont leading-relaxed max-w-3xl mx-auto">
                  Join thousands who found love in our safe, vibrant community
                </p>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/85 vfont leading-relaxed max-w-2xl mx-auto">
                  where authentic relationships bloom and hearts connect for
                  life
                </p>
              </div>
            </div>
            {/* Enhanced CTA Buttons with Better Mobile Layout */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center items-center mt-8 sm:mt-10">
              <Link
                href="/signup"
                className="group relative vfont w-full sm:w-auto px-8 sm:px-10 py-3.5 sm:py-4 bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white font-semibold rounded-full hover:from-rose-600 hover:via-pink-600 hover:to-rose-700 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl shadow-lg shadow-rose-500/20 min-w-[200px] sm:min-w-[220px] text-xl"
              >
                <span className="relative  z-10 flex items-center justify-center gap-2">
                  <Heart
                    size={18}
                    className="group-hover:scale-110 transition-transform duration-300"
                  />
                  Start Your Journey
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-rose-400 via-pink-400 to-rose-500 rounded-full blur-xl opacity-60 group-hover:opacity-90 transition-opacity duration-500 scale-110" />
              </Link>

              <Link
                href="/login"
                className="group vfont text-xl relative w-full sm:w-auto px-8 sm:px-10 py-3.5 sm:py-4 bg-white/10 backdrop-blur-md text-white font-semibold rounded-full border border-white/30 hover:bg-white/20 hover:border-white/50 transition-all duration-300 hover:scale-105 min-w-[200px] sm:min-w-[220px] flex items-center justify-center gap-2  shadow-lg"
              >
                <Users
                  size={18}
                  className="group-hover:scale-110 transition-transform duration-300"
                />
                Sign In
                <div className="absolute inset-0 bg-white/5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            </div>

            {/* Enhanced Stats with Better Mobile Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6 lg:gap-12 max-w-5xl mx-auto mt-12 sm:mt-16">
              {[
                { number: "50K+", label: "Happy Couples", icon: Heart },
                { number: "1M+", label: "Active Members", icon: Users },
                { number: "95%", label: "Success Rate", icon: Sparkles },
              ].map((stat) => (
                <div key={stat.label} className="text-center group relative">
                  <div className="absolute inset-0 bg-white/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative">
                    <div className="mb-4 sm:mb-5">
                      <div className="inline-flex p-3 rounded-xl bg-white/10 backdrop-blur-sm">
                        <stat.icon
                          size={28}
                          className="text-rose-300 group-hover:scale-125 transition-transform duration-500"
                        />
                      </div>
                    </div>
                    <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-3 group-hover:text-rose-200 transition-colors duration-300 font-serif">
                      {stat.number}
                    </div>
                    <div className="text-white/90 text-sm sm:text-base uppercase tracking-wider font-medium">
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Scroll Indicator */}
        <div className="absolute bottom-8 sm:bottom-10 lg:bottom-12 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 sm:w-7 h-10 sm:h-12 border-2 border-white/40 rounded-full flex justify-center shadow-lg backdrop-blur-sm">
            <div className="w-1 sm:w-1.5 h-3 sm:h-4 bg-gradient-to-b from-rose-300 to-pink-300 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </header>

      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-rose-50 via-pink-25 to-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 text-rose-300">
            <Heart size={32} className="sm:w-10 sm:h-10" />
          </div>
          <div className="absolute bottom-20 right-16 text-pink-300">
            <Sparkles size={28} className="sm:w-8 sm:h-8" />
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 sm:mb-6 leading-tight font-serif">
              Why Choose{" "}
              <span className="bg-gradient-to-r vfont from-rose-600 to-pink-600 bg-clip-text text-transparent">
                Nawa Napam?
              </span>
            </h2>
            <p className="text-gray-600 text-base sm:text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed">
              Experience love like never before with our innovative features
              designed for meaningful connections
            </p>
          </div>

          <div className="flex flex-wrap justify-center max-w-7xl mx-auto px-4 sm:px-6">
            {WHY_CHOOSE_US.map((feature) => (
              <article
                key={feature.title}
                className="group w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)] p-3 sm:p-4"
              >
                <div className="h-full bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 sm:hover:-translate-y-2 border border-gray-100/80 hover:border-rose-200/80 relative overflow-hidden">
                  {/* Background Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-rose-50/50 to-pink-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative z-10 flex flex-col min-h-[180px] sm:min-h-[200px]">
                    <div
                      className={`inline-flex p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gradient-to-r ${feature.gradient} text-white mb-4 sm:mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500 self-start`}
                    >
                      <feature.icon size={20} className="sm:w-6 sm:h-6" />
                    </div>
                    <h3 className="font-bold text-lg sm:text-xl text-gray-800 mb-3 sm:mb-4 group-hover:text-rose-600 transition-colors duration-300 font-serif">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-sm sm:text-base group-hover:text-gray-700 transition-colors duration-300 flex-grow">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
