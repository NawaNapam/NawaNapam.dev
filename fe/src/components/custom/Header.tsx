"use client";

import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/40">
      <div className="container h-16 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden shadow-lg ring-2 ring-primary/20">
            {/* Logo: pinkish tint via gradient SVG */}
            <Image
              src="/logo.jpg"
              alt="Nawa Napam Logo"
              width={40}
              height={40}
              className="object-cover"
            />
          </div>
          <span
            className="text-xl font-bold font-playfair bg-clip-text text-transparent"
            style={{ backgroundImage: "var(--gradient-romantic)" }}
          >
            Nawa Napam
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/profiles"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            Profiles
          </Link>
          <Link
            href="/dashboard"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/admin"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            Admin
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden sm:inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring h-9 px-4 py-2 hover:bg-accent hover:text-accent-foreground"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring h-9 px-4 py-2 bg-primary text-primary-foreground shadow hover:bg-primary/90"
          >
            Join Now
          </Link>
        </div>
      </div>
    </header>
  );
}
