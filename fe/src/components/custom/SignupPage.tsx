"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { User, Mail, Lock, Loader2, Sparkles, ArrowLeft, Globe } from "lucide-react";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const time = now.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      const date = now.toLocaleDateString("en-IN", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
      setCurrentTime(`${date}, ${time} IST`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      toast.error("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      toast.error("Password too short");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, username }),
      });

      const data = await res.json();
      if (!res.ok) {
        const msg = data.error || "Signup failed";
        setError(msg);
        toast.error(msg);
        return;
      }

      const loginResult = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (loginResult?.error) {
        toast.success("Account created! Please sign in.");
        setTimeout(() => {
          window.location.href = "/login";
        }, 100);
      } else {
        toast.success("Welcome! Redirecting...");
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 100);
      }
    } catch (err) {
      const msg = "Something went wrong. Try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProvider = (provider: "google" | "instagram") => {
    signIn(provider, { callbackUrl: "/dashboard" });
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute w-96 h-96 bg-cyan-500 rounded-full blur-3xl -top-48 -left-48 animate-pulse" />
        <div className="absolute w-80 h-80 bg-purple-600 rounded-full blur-3xl -bottom-40 -right-40 animate-pulse delay-700" />
      </div>

      {/* Sparkles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(5)].map((_, i) => (
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

      {/* Back + Time */}
      <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-20">
        <Link
          href="/"
          className="group flex items-center gap-2 text-cyan-300 hover:text-cyan-200 text-sm font-medium transition-colors"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>
        <div className="flex items-center gap-1.5 text-cyan-300 text-xs">
          <Globe size={14} />
          <span className="font-mono">{currentTime}</span>
        </div>
      </div>

      {/* Signup Card */}
      <Card className="relative z-10 w-full max-w-md bg-white/80 backdrop-blur-xl border border-cyan-500/20 rounded-2xl shadow-2xl p-8 mt-16">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
            Create Account
          </h1>
          <p className="text-sm text-gray-500 mt-2">Join the global chat network</p>
        </div>

        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50 text-red-700 text-sm">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSignup} className="space-y-5">
          <div className="relative">
            <User className="absolute left-3 top-3 w-5 h-5 text-cyan-500" />
            <Input
              id="username"
              type="text"
              placeholder="Choose a username"
              className="pl-10 h-12 bg-white/50 border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500/20"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength={3}
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-3 top-3 w-5 h-5 text-cyan-500" />
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="pl-10 h-12 bg-white/50 border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500/20"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3 w-5 h-5 text-cyan-500" />
            <Input
              id="password"
              type="password"
              placeholder="Create a password"
              className="pl-10 h-12 bg-white/50 border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500/20"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3 w-5 h-5 text-cyan-500" />
            <Input
              id="confirm"
              type="password"
              placeholder="Confirm password"
              className="pl-10 h-12 bg-white/50 border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500/20"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-cyan-500/30 transition-all disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              "Sign Up"
            )}
          </Button>
        </form>

        <div className="my-6 flex items-center">
          <hr className="flex-grow border-t border-cyan-200/50" />
          <span className="mx-4 text-xs text-gray-500 font-medium">OR</span>
          <hr className="flex-grow border-t border-cyan-200/50" />
        </div>

        <div className="space-y-3">
          <Button
            onClick={() => handleProvider("google")}
            variant="outline"
            className="w-full h-11 border-cyan-200 hover:bg-cyan-50 text-gray-700 font-medium rounded-xl transition-all"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Sign Up with Google
          </Button>

          <Button
            onClick={() => handleProvider("instagram")}
            variant="outline"
            className="w-full h-11 border-cyan-200 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 text-gray-700 font-medium rounded-xl transition-all"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="url(#ig-signup)">
              <defs>
                <linearGradient id="ig-signup" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f9ce34" />
                  <stop offset="50%" stopColor="#ee2a7b" />
                  <stop offset="100%" stopColor="#6228d7" />
                </linearGradient>
              </defs>
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.698.272.272 2.698.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z"/>
            </svg>
            Sign Up with Instagram
          </Button>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-cyan-600 hover:text-cyan-700 font-medium hover:underline">
            Sign In
          </Link>
        </p>
      </Card>

      <Toaster position="top-center" />
    </div>
  );
}