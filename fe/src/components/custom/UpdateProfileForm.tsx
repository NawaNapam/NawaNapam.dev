"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useUpdateUser } from "@/hooks/use-update-user";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Toaster } from "@/components/ui/sonner";
import {
  User,
  Mail,
  Lock,
  Image as ImageIcon,
  Globe,
  ArrowLeft,
  Sparkles,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";

export default function UpdateProfileForm() {
  const { data: session } = useSession();
  const { updateUser, isLoading, error } = useUpdateUser();

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    image: "",
  });

  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  // Initialize form
  useEffect(() => {
    if (session?.user) {
      setFormData({
        name: session.user.name || "",
        username: session.user.username || "",
        email: session.user.email || "",
        password: "",
        image: session.user.image || "",
      });
    }
  }, [session]);

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (formData.name.trim() && formData.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
    }

    if (formData.username && formData.username !== session?.user?.username) {
      if (formData.username.length < 3) errors.username = "Min 3 characters";
      else if (formData.username.length > 20) errors.username = "Max 20 characters";
      else if (!/^[a-zA-Z0-9_-]+$/.test(formData.username))
        errors.username = "Only letters, numbers, _, -";
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Invalid email";
    }

    if (formData.password && formData.password.length < 6) {
      errors.password = "Min 6 characters";
    }

    if (formData.image && formData.image.trim()) {
      try { new URL(formData.image); } catch { errors.image = "Invalid URL"; }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const updateData: Record<string, string> = {};
    if (formData.name.trim() !== (session?.user?.name || "")) updateData.name = formData.name.trim();
    if (formData.username !== (session?.user?.username || "")) updateData.username = formData.username;
    if (formData.email !== (session?.user?.email || "")) updateData.email = formData.email;
    if (formData.password) updateData.password = formData.password;
    if (formData.image !== (session?.user?.image || "")) updateData.image = formData.image;

    if (Object.keys(updateData).length === 0) {
      // toast("No changes to save", { icon: "ℹ️" });
      return;
    }

    const result = await updateUser(updateData);
    if (result) {
      setFormData((prev) => ({ ...prev, password: "" }));
      setValidationErrors({});
      // toast.success("Profile updated!");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute w-96 h-96 bg-cyan-500 rounded-full blur-3xl -top-48 -left-48 animate-pulse" />
        <div className="absolute w-80 h-80 bg-purple-600 rounded-full blur-3xl -bottom-40 -right-40 animate-pulse delay-700" />
      </div>

      {/* Floating Sparkles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <Sparkles
            key={i}
            size={16}
            className="absolute text-cyan-400/30 animate-float"
            style={{
              top: `${15 + i * 14}%`,
              left: i % 2 === 0 ? "10%" : "70%",
              animationDelay: `${i * 0.4}s`,
            }}
          />
        ))}
      </div>

      {/* Top Bar: Back + Time */}
      <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-20">
        <div className="flex gap-3">
          <Link
            href="/dashboard"
            className="group flex items-center gap-2 text-cyan-300 hover:text-cyan-200 text-sm font-medium transition-colors"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Dashboard
          </Link>
          {/* <span className="text-cyan-400/50">|</span>
          <Link
            href="/"
            className="group flex items-center gap-2 text-cyan-300 hover:text-cyan-200 text-sm font-medium transition-colors"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Home
          </Link> */}
        </div>
        {/* <div className="flex items-center gap-1.5 text-cyan-300 text-xs">
          <Globe size={14} />
          <span className="font-mono">{currentTime}</span>
        </div> */}
      </div>

      {/* Profile Card */}
      <Card className="relative z-10 w-full max-w-lg bg-white/80 backdrop-blur-xl border border-cyan-500/20 rounded-2xl shadow-2xl p-8 mt-16">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
            Update Profile
          </h1>
          <p className="text-sm text-gray-500 mt-2">Keep your info fresh</p>
        </div>

        {/* Avatar */}
        <div className="flex justify-center mb-8">
          <div className="relative group">
            <Avatar className="w-28 h-28 ring-4 ring-cyan-400/30 shadow-xl">
              <AvatarImage src={formData.image ?? session?.user?.image ?? undefined} />
              <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white text-2xl">
                {(session?.user?.name || "U").charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 w-9 h-9 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
              <ImageIcon size={16} className="text-white" />
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div className="relative">
            <User className="absolute left-3 top-3 w-5 h-5 text-cyan-500" />
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              className={`pl-10 h-12 bg-white/50 border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500/20 ${
                validationErrors.name ? "border-red-400" : ""
              }`}
            />
            {validationErrors.name && (
              <p className="text-xs text-red-400 mt-1 pl-10">{validationErrors.name}</p>
            )}
          </div>

          {/* Username */}
          <div className="relative">
            <User className="absolute left-3 top-3 w-5 h-5 text-cyan-500" />
            <Input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              className={`pl-10 h-12 bg-white/50 border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500/20 ${
                validationErrors.username ? "border-red-400" : ""
              }`}
            />
            {validationErrors.username && (
              <p className="text-xs text-red-400 mt-1 pl-10">{validationErrors.username}</p>
            )}
          </div>

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-3 w-5 h-5 text-cyan-500" />
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className={`pl-10 h-12 bg-white/50 border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500/20 ${
                validationErrors.email ? "border-red-400" : ""
              }`}
            />
            {validationErrors.email && (
              <p className="text-xs text-red-400 mt-1 pl-10">{validationErrors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-3 w-5 h-5 text-cyan-500" />
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="New password (optional)"
              className={`pl-10 h-12 bg-white/50 border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500/20 ${
                validationErrors.password ? "border-red-400" : ""
              }`}
            />
            {validationErrors.password && (
              <p className="text-xs text-red-400 mt-1 pl-10">{validationErrors.password}</p>
            )}
          </div>

          {/* Image URL */}
          <div className="relative">
            <ImageIcon className="absolute left-3 top-3 w-5 h-5 text-cyan-500" />
            <Input
              id="image"
              name="image"
              type="url"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/avatar.jpg"
              className={`pl-10 h-12 bg-white/50 border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500/20 ${
                validationErrors.image ? "border-red-400" : ""
              }`}
            />
            {validationErrors.image && (
              <p className="text-xs text-red-400 mt-1 pl-10">{validationErrors.image}</p>
            )}
          </div>

          {/* Server Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              {error}
            </div>
          )}

          {/* Submit */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-cyan-500/30 transition-all disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                Updating...
              </>
            ) : (
              <>
                <CheckCircle size={18} className="mr-2" />
                Update Profile
              </>
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-500">
          Your data is encrypted and secure
        </p>
      </Card>

      <Toaster position="top-center" />
    </div>
  );
}