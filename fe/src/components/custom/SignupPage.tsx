"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import "@/styles/hero.css";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

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

      // Auto-login after successful signup
      const loginResult = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (loginResult?.error) {
        toast.success("Account created. Please sign in.");
        window.location.href = "/login";
      } else {
        toast.success("Welcome! Redirecting to dashboard...");
        // Small delay to ensure session is established
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 100);
      }
    } catch (err) {
      console.error("Signup error:", err);
      const msg = "An error occurred. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    await signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-rose-900/90 via-pink-800/85 to-purple-900/90">
      <Card className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md h-[60%]">
        <h1 className="text-4xl mb-6 text-center vfont">Sign Up</h1>

        {error && (
          <Alert className="mb-4" role="alert">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Username"
              className="w-full mt-2"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength={3}
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Email"
              className="w-full mt-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Password (min 6 characters)"
              className="w-full mt-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <div>
            <Label htmlFor="confirm">Confirm Password</Label>
            <Input
              id="confirm"
              type="password"
              placeholder="Confirm Password"
              className="w-full mt-2"
              required
              minLength={6}
            />
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Creating Account..." : "Sign Up"}
          </Button>
        </form>

        <div className="my-4 flex items-center">
          <hr className="flex-grow border-t border-gray-300" />
          <span className="mx-4 text-gray-500">OR</span>
          <hr className="flex-grow border-t border-gray-300" />
        </div>

        <Button
          onClick={handleGoogleSignup}
          className="w-full bg-red-600 text-white p-3 rounded-lg hover:bg-red-700 transition"
        >
          Sign Up with Google
        </Button>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Sign In
          </Link>
        </p>

        {/* Sonner Toaster for notifications */}
        <Toaster />
      </Card>
    </div>
  );
}
