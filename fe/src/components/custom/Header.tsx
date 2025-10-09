"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";

export default function Header() {
  const { data: session, status } = useSession();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/40">
      <div className="container h-16 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden shadow-lg ring-2 ring-primary/20">
            <Image
              src="/logo.jpg"
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
          {session ? (
            // Authenticated user links
            <>
              <Link
                href="/dashboard"
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/profiles"
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                Profiles
              </Link>
              <Link
                href="/chat"
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                Chat
              </Link>
            </>
          ) : (
            // Non-authenticated user links
            <>
              <Link
                href="/about"
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                About
              </Link>
              <Link
                href="/features"
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                Features
              </Link>
            </>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {status === "loading" ? (
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          ) : session ? (
            // Authenticated user actions
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline text-sm text-muted-foreground">
                Hi, {session.user?.name || session.user?.username}!
              </span>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring h-9 px-4 py-2 bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Sign Out
              </button>
            </div>
          ) : (
            // Non-authenticated user actions
            <>
              <Link
                href="/login"
                className="hidden sm:inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring h-9 px-4 py-2 hover:bg-accent hover:text-accent-foreground"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring h-9 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
