// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google"; // renamed for clarity
import { Cinzel_Decorative } from "next/font/google";   // ← ADD THIS
import "./globals.css";
import Provider from "./Provider";

// Your existing fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ADD THIS: Cinzel Decorative (perfect for "Nawa Napam")
const cinzelDecorative = Cinzel_Decorative({
  weight: ["700", "900"],        
  subsets: ["latin"],
  variable: "--font-cinzel",     // CSS variable to use anywhere
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nawa Napam – Meet Strangers in One Click",
  description: "Instant, anonymous, global video chat rooted in culture.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${cinzelDecorative.variable} antialiased font-sans`}
      >
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}