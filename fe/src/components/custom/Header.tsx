"use client";

import Link from "next/link";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { useAuthStore } from "@/stores/authStore";

export default function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Use Zustand store instead of useSession
  const { user, isAuthenticated, isLoading } = useAuthStore();

  // Loading state
  if (isLoading) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/40">
        <div className="container h-16 flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden shadow-lg ring-2 ring-primary/20">
              <Image
                src="/images/logo.jpg"
                alt="Nawa Napam Logo"
                width={40}
                height={40}
                className="object-cover"
              />
            </div>
            <Link href="/">
              <span
                className="text-xl font-bold font-playfair bg-clip-text text-transparent"
                style={{ backgroundImage: "var(--gradient-romantic)" }}
              >
                Nawa Napam
              </span>
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <div className="w-20 h-8 bg-gray-200 animate-pulse rounded"></div>
          </nav>
        </div>
      </header>
    );
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/40">
      <div className="container h-16 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden shadow-lg ring-2 ring-primary/20">
            <Image
              src="/images/logo.jpg"
              alt="Nawa Napam Logo"
              width={40}
              height={40}
              className="object-cover"
            />
          </div>
          <Link href="/">
            <span
              className="text-xl font-bold font-playfair bg-clip-text text-transparent"
              style={{ backgroundImage: "var(--gradient-romantic)" }}
            >
              Nawa Napam
            </span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          {!isAuthenticated && (
            <>
              <Link
                href="#"
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                About
              </Link>
              <Link
                href="#"
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                Features
              </Link>
            </>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated && user ? (
            // Authenticated user - show avatar dropdown
            <div className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="overflow-hidden rounded-full border border-gray-300 shadow-inner focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <span className="sr-only">Toggle user menu</span>
                <Image
                  src={
                    user.image ||
                    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  }
                  alt="User Avatar"
                  width={40}
                  height={40}
                  className="size-10 object-cover"
                />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 z-10 mt-2 w-56 divide-y divide-gray-100 rounded-md border border-gray-100 bg-white shadow-lg">
                  <div className="p-2">
                    <div className="px-4 py-2 text-sm text-gray-700">
                      <div className="font-medium">
                        {user.name || user.username || "User"}
                      </div>
                      <div className="text-gray-500">{user.email}</div>
                    </div>
                  </div>
                  <div className="p-2">
                    <Link
                      href="/dashboard"
                      className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/settings"
                      className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Settings
                    </Link>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        signOut({ callbackUrl: "/" });
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="size-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
                        />
                      </svg>
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Non-authenticated user - show Login and Join now buttons
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="hidden sm:inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring h-9 px-4 py-2 bg-accent hover:bg-accent hover:text-accent-foreground border border-input"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring h-9 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Join now
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
