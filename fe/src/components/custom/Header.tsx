"use client";

import Link from "next/link";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { Menu, X, LogOut, Settings, LayoutDashboard, Globe, ArrowLeft } from "lucide-react";

export default function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { user, isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <header className="fixed top-0 inset-x-0 z-50 bg-white/5 backdrop-blur-xl border-b border-amber-500/20">
        <div className="container h-16 flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-amber-600/20 rounded-full animate-pulse" />
            <div className="h-7 w-40 bg-amber-500/10 rounded animate-pulse" />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-gradient-to-b from-black/40 via-[#0f1a0f]/90 to-transparent backdrop-blur-2xl border-b border-amber-500/20 flex items-center justify-center">
      <div className="container h-16 flex items-center justify-between px-4 sm:px-6">

        {/* Logo + Brand Name */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-amber-500/40 shadow-lg transition-all group-hover:ring-amber-400 group-hover:scale-110">
            <Image
              src="/images/logo.jpg"
              alt="Nawa Napam"
              width={40}
              height={40}
              className="object-cover"
            />
          </div>
          <span
            className="text-xl font-bold tracking-wide"
            style={{ fontFamily: "var(--font-cinzel), serif" }}
          >
            <span className="bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-300 bg-clip-text text-transparent">
              Nawa Napam
            </span>
          </span>
        </Link>

        {/* Right Side */}
        <div className="flex items-center gap-4">

          {/* Authenticated User */}
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 p-2 rounded-full hover:bg-white/10 transition-all group"
              >
                <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-amber-500/50 shadow-md group-hover:ring-amber-400">
                  <Image
                    src={user.image || "/default-avatar.png"}
                    alt="User"
                    width={36}
                    height={36}
                    className="object-cover"
                  />
                </div>
                <span className="hidden sm:block text-sm font-medium text-amber-100">
                  {user.name?.split(" ")[0] || "User"}
                </span>
              </button>

              {/* Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-64 origin-top-right rounded-2xl bg-black/70 backdrop-blur-2xl border border-amber-500/30 shadow-2xl overflow-hidden">
                  <div className="p-4 border-b border-amber-500/20">
                    <p className="text-sm font-bold text-amber-100" style={{ fontFamily: "'Cinzel Decorative', serif" }}>
                      {user.name || user.username}
                    </p>
                    <p className="text-xs text-amber-300 truncate">{user.email}</p>
                  </div>
                  <div className="py-2">
                    <Link
                      href="/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-5 py-3 text-amber-100 hover:bg-amber-500/10 transition-colors"
                    >
                      <LayoutDashboard size={18} />
                      Dashboard
                    </Link>
                    <Link
                      href="/settings"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-5 py-3 text-amber-100 hover:bg-amber-500/10 transition-colors"
                    >
                      <Settings size={18} />
                      Settings
                    </Link>
                  </div>
                  <div className="border-t border-amber-500/20 pt-2">
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="flex w-full items-center gap-3 px-5 py-3 text-rose-400 hover:bg-rose-500/10 transition-colors"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Guest Buttons */
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="hidden sm:inline-flex h-10 px-6 rounded-xl text-sm font-medium text-amber-100 border border-amber-500/40 hover:border-amber-400 hover:bg-amber-500/10 transition-all items-center"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="hidden sm:inline-flex h-10 px-6 rounded-xl text-sm font-bold bg-gradient-to-r from-amber-500 to-yellow-600 text-black shadow-lg hover:shadow-amber-500/40 transition-all items-center"
              >
                Join Now
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-amber-300 hover:bg-white/10 transition-all"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 inset-x-0 bg-black/95 backdrop-blur-2xl border-b border-amber-500/30 shadow-2xl">
          <div className="container px-6 py-6 space-y-5">
            {!isAuthenticated && (
              <>
                <Link href="#features" onClick={() => setMobileMenuOpen(false)} className="block py-3 text-amber-100 text-lg font-medium">
                  Features
                </Link>
                <Link href="#about" onClick={() => setMobileMenuOpen(false)} className="block py-3 text-amber-100 text-lg font-medium">
                  About
                </Link>
              </>
            )}
            <div className="pt-4 border-t border-amber-500/30 space-y-3">
              <Link href="/login" className="block text-amber-300 font-bold text-lg">Login</Link>
              <Link href="/signup" className="block text-amber-300 font-bold text-lg">Join Now</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}