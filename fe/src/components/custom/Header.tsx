"use client";

import Link from "next/link";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import { Menu, X, LogOut, Settings, LayoutDashboard, Globe } from "lucide-react";

export default function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { user, isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <header className="fixed top-0 inset-x-0 z-50 bg-white/10 backdrop-blur-xl border-b border-cyan-500/20">
        <div className="container h-16 flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-cyan-500/20 rounded-full animate-pulse" />
            <div className="h-6 w-28 bg-cyan-400/20 rounded animate-pulse" />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/10 backdrop-blur-xl border-b border-cyan-500/20 flex items-center justify-center">
      <div className="container h-16 flex items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-cyan-400/30 shadow-lg transition-all group-hover:ring-cyan-400/60">
            <Image src="/images/logo.jpg" alt="Logo" width={36} height={36} className="object-cover" />
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent tracking-tight">
            Nawa Napam
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {!isAuthenticated && (
            <>
              <Link href="/#features" className="text-sm font-medium text-gray-300 hover:text-cyan-300 transition-colors">
                Features
              </Link>
              <Link href="/#about" className="text-sm font-medium text-gray-300 hover:text-cyan-300 transition-colors">
                About
              </Link>
            </>
          )}
        </nav>

        {/* Right: Time + Auth */}
        <div className="flex items-center gap-3">

          {/* Auth */}
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 rounded-full hover:bg-white/10 transition-all group"
              >
                <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-cyan-400/40 shadow-md group-hover:ring-cyan-300">
                  <Image
                    src={user.image || "/default-avatar.png"}
                    alt="User"
                    width={36}
                    height={36}
                    className="object-cover"
                  />
                </div>
                <span className="hidden sm:block text-sm font-medium text-gray-200">
                  {user.name?.split(" ")[0] || "User"}
                </span>
              </button>

              {/* Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl bg-slate-800/95 backdrop-blur-xl border border-cyan-500/20 shadow-2xl">
                  <div className="p-3 border-b border-cyan-500/10">
                    <p className="text-sm font-semibold text-white">{user.name || user.username}</p>
                    <p className="text-xs text-cyan-300 truncate">{user.email}</p>
                  </div>
                  <div className="py-1">
                    <Link
                      href="/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-200 hover:bg-cyan-500/10 hover:text-cyan-300 transition-colors"
                    >
                      <LayoutDashboard size={16} />
                      Dashboard
                    </Link>
                    <Link
                      href="/settings/update"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-200 hover:bg-cyan-500/10 hover:text-cyan-300 transition-colors"
                    >
                      <Settings size={16} />
                      Settings
                    </Link>
                  </div>
                  <div className="border-t border-cyan-500/10 py-1">
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-rose-400 hover:bg-rose-500/10 transition-colors"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="hidden sm:inline-flex h-9 px-5 rounded-lg text-sm font-medium text-gray-300 border border-cyan-500/30 hover:border-cyan-400 hover:text-cyan-300 transition-all"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="inline-flex h-9 px-5 rounded-lg text-sm font-medium bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg hover:shadow-cyan-500/30 transition-all"
              >
                Join Now
              </Link>
            </div>
          )}

          {/* Mobile Menu */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-400 hover:text-cyan-300 hover:bg-white/10 transition-all"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 inset-x-0 bg-slate-900/95 backdrop-blur-xl border-b border-cyan-500/20 shadow-2xl">
          <div className="container px-4 py-4 space-y-3">
            {!isAuthenticated && (
              <>
                <Link href="/#features" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-gray-300 hover:text-cyan-300">
                  Features
                </Link>
                <Link href="/#about" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-gray-300 hover:text-cyan-300">
                  About
                </Link>
              </>
            )}
            <div className="pt-2 border-t border-cyan-500/10">
              <Link href="/login" className="block py-2 text-cyan-300 font-medium">Login</Link>
              <Link href="/signup" className="block py-2 text-cyan-300 font-medium">Join Now</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}