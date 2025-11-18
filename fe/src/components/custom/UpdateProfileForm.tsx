"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useUpdateUser } from "@/hooks/use-update-user";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
  const [currentTime, setCurrentTime] = useState("");

  // Live IST Time
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }) + " IST"
      );
    };
    update();
    const int = setInterval(update, 1000);
    return () => clearInterval(int);
  }, []);

  // Initialize form with session data
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

    if (formData.name.trim() && formData.name.trim().length < 2)
      errors.name = "Name must be at least 2 characters";

    if (formData.username && formData.username !== session?.user?.username) {
      if (formData.username.length < 3) errors.username = "Min 3 characters";
      else if (formData.username.length > 20) errors.username = "Max 20 characters";
      else if (!/^[a-zA-Z0-9_-]+$/.test(formData.username))
        errors.username = "Only letters, numbers, _, -";
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email))
      errors.email = "Invalid email";

    if (formData.password && formData.password.length < 6)
      errors.password = "Min 6 characters";

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
      // toast("No changes made", { icon: "Info" });
      return;
    }

    const result = await updateUser(updateData);
    if (result) {
      setFormData(prev => ({ ...prev, password: "" }));
      setValidationErrors({});
      // toast.success("Profile updated successfully!");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden bg-gradient-to-br from-[#0a140a] via-[#0f1a0f] to-[#0a140a]">
      {/* Golden Animated Blobs */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute w-96 h-96 bg-amber-600/40 rounded-full blur-3xl -top-48 -left-48 animate-pulse" />
        <div className="absolute w-80 h-80 bg-emerald-700/40 rounded-full blur-3xl -bottom-40 -right-40 animate-pulse delay-700" />
      </div>

      {/* Floating Golden Sparkles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <Sparkles
            key={i}
            size={18}
            className="absolute text-amber-400/30 animate-float"
            style={{
              top: `${15 + i * 14}%`,
              left: i % 2 === 0 ? "8%" : "78%",
              animationDelay: `${i * 0.6}s`,
            }}
          />
        ))}
      </div>

      {/* Top Bar */}
      <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-20">
        <Link
          href="/dashboard"
          className="group flex items-center gap-2 text-amber-200 hover:text-amber-100 text-sm font-medium transition-all"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>
        <div className="flex items-center gap-2 text-amber-200 text-xs font-medium">
          <Globe size={14} className="text-amber-400" />
          <span className="font-mono tracking-wider">{currentTime}</span>
        </div>
      </div>

      {/* Profile Update Card */}
      <Card className="relative z-10 w-full max-w-lg bg-white/8 backdrop-blur-2xl border border-amber-500/30 rounded-3xl shadow-2xl shadow-amber-500/20 p-10">
        <div className="text-center mb-10">
          <h1
            className="text-4xl font-black tracking-tight"
            style={{ fontFamily: "var(--font-cinzel), serif" }}
          >
            <span className="bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-300 bg-clip-text text-transparent">
              Update Profile
            </span>
          </h1>
          <p className="text-amber-100/70 text-sm mt-3">Keep your presence vibrant and true</p>
        </div>

        {/* Avatar */}
        <div className="flex justify-center mb-10">
          <div className="relative group">
            <Avatar className="w-32 h-32 ring-4 ring-amber-500/40 shadow-2xl">
              <AvatarImage src={formData.image ?? session?.user?.image ?? undefined} />
              <AvatarFallback className="bg-gradient-to-br from-amber-500 to-yellow-600 text-black text-3xl font-bold">
                {(session?.user?.name || "U").charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="absolute bottom-0 right-0 w-10 h-10 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-full flex items-center justify-center shadow-xl border-4 border-black/20">
              <ImageIcon size={18} className="text-black" />
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div className="relative">
            <User className="absolute left-3 top-3.5 w-5 h-5 text-amber-400" />
            <Input
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              className={`pl-11 h-12 bg-white/10 border-amber-500/30 text-amber-50 placeholder-amber-200/50 focus:border-amber-400 focus:ring-amber-400/20 rounded-xl ${
                validationErrors.name ? "border-red-500/50" : ""
              }`}
            />
            {validationErrors.name && <p className="text-xs text-red-400 mt-1 pl-11">{validationErrors.name}</p>}
          </div>

          {/* Username */}
          <div className="relative">
            <User className="absolute left-3 top-3.5 w-5 h-5 text-amber-400" />
            <Input
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              className={`pl-11 h-12 bg-white/10 border-amber-500/30 text-amber-50 placeholder-amber-200/50 focus:border-amber-400 focus:ring-amber-400/20 rounded-xl ${
                validationErrors.username ? "border-red-500/50" : ""
              }`}
            />
            {validationErrors.username && <p className="text-xs text-red-400 mt-1 pl-11">{validationErrors.username}</p>}
          </div>

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 w-5 h-5 text-amber-400" />
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className={`pl-11 h-12 bg-white/10 border-amber-500/30 text-amber-50 placeholder-amber-200/50 focus:border-amber-400 focus:ring-amber-400/20 rounded-xl ${
                validationErrors.email ? "border-red-500/50" : ""
              }`}
            />
            {validationErrors.email && <p className="text-xs text-red-400 mt-1 pl-11">{validationErrors.email}</p>}
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 w-5 h-5 text-amber-400" />
            <Input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="New password (leave blank to keep)"
              className={`pl-11 h-12 bg-white/10 border-amber-500/30 text-amber-50 placeholder-amber-200/50 focus:border-amber-400 focus:ring-amber-400/20 rounded-xl ${
                validationErrors.password ? "border-red-500/50" : ""
              }`}
            />
            {validationErrors.password && <p className="text-xs text-red-400 mt-1 pl-11">{validationErrors.password}</p>}
          </div>

          {/* Image URL */}
          <div className="relative">
            <ImageIcon className="absolute left-3 top-3.5 w-5 h-5 text-amber-400" />
            <Input
              name="image"
              type="url"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/avatar.jpg"
              className={`pl-11 h-12 bg-white/10 border-amber-500/30 text-amber-50 placeholder-amber-200/50 focus:border-amber-400 focus:ring-amber-400/20 rounded-xl ${
                validationErrors.image ? "border-red-500/50" : ""
              }`}
            />
            {validationErrors.image && <p className="text-xs text-red-400 mt-1 pl-11">{validationErrors.image}</p>}
          </div>

          {/* Server Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-amber-100 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-14 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-300 hover:to-yellow-700 text-black font-bold text-lg rounded-2xl shadow-xl transition-all disabled:opacity-60"
          >
            {isLoading ? (
              <>Updating Profile...</>
            ) : (
              <>
                <CheckCircle size={20} className="mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </form>

        <p className="mt-8 text-center text-xs text-amber-200/60 font-medium">
          Your data is encrypted • Secure • Private
        </p>
      </Card>

      <Toaster position="top-center" theme="dark" />
    </div>
  );
}