import Image from "next/image";
import Link from "next/link";
import { ArrowUp, Instagram, Twitter, MessageCircle, Globe, Heart } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-t from-black via-[#0f1a0f]/95 to-[#0f1a0f]/90 backdrop-blur-2xl border-t border-amber-500/20 overflow-hidden">
      {/* Subtle Golden Glow Line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />

      <div className="container px-4 sm:px-6 py-16 sm:py-20 m-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 lg:gap-16">

          {/* Brand Section */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full overflow-hidden ring-4 ring-amber-500/30 shadow-2xl shadow-amber-500/20">
                <Image
                  src="/images/logo.jpg"
                  alt="Nawa Napam"
                  width={48}
                  height={48}
                  className="object-cover"
                />
              </div>
              <h4
                className="text-2xl font-black tracking-tight"
                style={{ fontFamily: "var(--font-cinzel), serif" }}
              >
                <span className="bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-300 bg-clip-text text-transparent">
                  Nawa Napam
                </span>
              </h4>
            </div>
            <p className="text-sm text-amber-100/70 leading-relaxed max-w-xs">
              Connecting souls across Bharat and beyond — instantly, anonymously, and with respect.
            </p>
            <p className="text-xs text-amber-200/60 mt-4 font-medium">
              Rooted in culture. Built for the world.
            </p>
          </div>

          {/* Explore */}
          <nav className="space-y-4">
            <h5 className="text-xs font-bold text-amber-400 uppercase tracking-widest">Explore</h5>
            <ul className="space-y-3">
              {["Safety First", "How It Works", "Our Story", "Blog"].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-sm text-amber-100/70 hover:text-amber-300 transition-all flex items-center gap-2 group"
                  >
                    <span className="text-amber-500 group-hover:translate-x-2 transition-transform text-xs">→</span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Legal */}
          <nav className="space-y-4">
            <h5 className="text-xs font-bold text-amber-400 uppercase tracking-widest">Legal</h5>
            <ul className="space-y-3">
              {["Privacy Policy", "Terms of Service", "Community Guidelines", "Data Safety"].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-sm text-amber-100/70 hover:text-amber-300 transition-all flex items-center gap-2 group"
                  >
                    <span className="text-amber-500 group-hover:translate-x-2 transition-transform text-xs">→</span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Connect & Back to Top */}
          <div className="flex flex-col justify-between">
            <div>
              <h5 className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-5">Connect With Us</h5>
              <div className="flex gap-4">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener"
                  className="w-11 h-11 rounded-md bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-300 hover:bg-amber-500/20 hover:border-amber-400 hover:scale-110 transition-all shadow-lg"
                >
                  <Instagram size={18} />
                </a>
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noopener"
                  className="w-11 h-11 rounded-md bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-300 hover:bg-amber-500/20 hover:border-amber-400 hover:scale-110 transition-all shadow-lg"
                >
                  <Twitter size={18} />
                </a>
                <a
                  href="https://discord.gg"
                  target="_blank"
                  rel="noopener"
                  className="w-11 h-11 rounded-md bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-300 hover:bg-amber-500/20 hover:border-amber-400 hover:scale-110 transition-all shadow-lg"
                >
                  <MessageCircle size={18} />
                </a>
              </div>
            </div>

            {/* Back to Top */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="mt-10 flex items-center gap-2 text-sm font-medium text-amber-300 hover:text-amber-100 transition-all group"
            >
              <div className="p-2 rounded-full bg-amber-500/10 border border-amber-500/30 group-hover:bg-amber-500/20 transition-all">
                <ArrowUp size={16} className="group-hover:-translate-y-1 transition-transform" />
              </div>
              Back to Top
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-amber-500/20 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-amber-200/60">
          <p>© {currentYear} Nawa Napam. Crafted with passion in India</p>
          <p className="flex items-center gap-1.5 font-medium">
            Made with
            <Heart size={14} className="text-amber-400 fill-amber-400" />
            in
            <span className="text-amber-300">Bharat</span>
          </p>
        </div>
      </div>

      {/* Final Golden Accent Line */}
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
    </footer>
  );
}