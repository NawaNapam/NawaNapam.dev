import Image from "next/image";
import Link from "next/link";
import { ArrowUp, Instagram, Twitter, MessageCircle, Globe } from "lucide-react";
import { useEffect, useState } from "react";

export default function Footer() {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const time = now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
      const date = now.toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" });
      setCurrentTime(`${date}, ${time} IST`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="relative bg-gradient-to-b from-slate-900/50 via-slate-900/80 to-slate-900 backdrop-blur-xl border-t border-cyan-500/10">
      <div className="container px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">

          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-cyan-400/30 shadow-lg">
                <Image src="/images/logo.jpg" alt="Logo" width={40} height={40} className="object-cover" />
              </div>
              <h4 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent tracking-tight">
                Nawa Napam
              </h4>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Connect instantly with strangers worldwide. Anonymous, encrypted, and real-time — just one click away.
            </p>
            <div className="flex items-center gap-1.5 mt-4 text-xs text-cyan-300">
              <Globe size={14} />
              <span className="font-mono">{currentTime}</span>
            </div>
          </div>

          {/* Explore */}
          <nav className="space-y-3">
            <h5 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Explore</h5>
            <ul className="space-y-2">
              {["Safety", "Features", "Help Center", "Blog"].map((item) => (
                <li key={item}>
                  <Link href={`#${item.toLowerCase().replace(" ", "-")}`} className="text-sm text-gray-400 hover:text-cyan-300 transition-colors flex items-center gap-1 group">
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Legal */}
          <nav className="space-y-3">
            <h5 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Legal</h5>
            <ul className="space-y-2">
              {["Privacy Policy", "Terms of Service", "Cookie Policy", "Community Rules"].map((item) => (
                <li key={item}>
                  <Link href={`/${item.toLowerCase().replace(/\s+/g, "-")}`} className="text-sm text-gray-400 hover:text-cyan-300 transition-colors flex items-center gap-1 group">
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Social */}
          <div className="flex flex-col justify-between">
            <div>
              <h5 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3">Connect</h5>
              <div className="flex gap-3">
                <a href="https://instagram.com" target="_blank" rel="noopener" className="w-9 h-9 rounded-lg bg-white/5 backdrop-blur-sm border border-cyan-500/20 flex items-center justify-center text-cyan-300 hover:bg-cyan-500/10 hover:border-cyan-400 transition-all">
                  <Instagram size={16} />
                </a>
                <a href="https://x.com" target="_blank" rel="noopener" className="w-9 h-9 rounded-lg bg-white/5 backdrop-blur-sm border border-cyan-500/20 flex items-center justify-center text-cyan-300 hover:bg-cyan-500/10 hover:border-cyan-400 transition-all">
                  <Twitter size={16} />
                </a>
                <a href="https://discord.gg" target="_blank" rel="noopener" className="w-9 h-9 rounded-lg bg-white/5 backdrop-blur-sm border border-cyan-500/20 flex items-center justify-center text-cyan-300 hover:bg-cyan-500/10 hover:border-cyan-400 transition-all">
                  <MessageCircle size={16} />
                </a>
              </div>
            </div>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="mt-6 flex items-center gap-2 text-xs text-cyan-300 hover:text-cyan-200 transition-colors group"
            >
              <ArrowUp size={14} className="group-hover:-translate-y-1 transition-transform" />
              Back to Top
            </button>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 border-t border-cyan-500/10 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Nawa Napam. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>Made with</span>
            <span className="text-cyan-400">love</span>
            <span>in</span>
            <span className="font-medium text-cyan-300">India</span>
          </p>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
    </footer>
  );
}