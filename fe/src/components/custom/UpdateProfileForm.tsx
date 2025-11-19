"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Pencil, ArrowLeft, Check, Globe, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

export default function ProfileSettingsPage() {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState("");

  const [formData, setFormData] = useState({
    name: session?.user?.name || "",
    username: session?.user?.username || "",
    email: session?.user?.email || "",
    bio: "Lover of chai, cricket, and deep conversations 🌿",
    location: "India",
  });

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

  const handleSave = (field: string) => {
    // In real app: call API to update
    toast.success(`${field.charAt(0).toUpperCase() + field.slice(1)} updated`);
    setIsEditing(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a140a] via-[#0f1a0f] to-[#0a140a] text-amber-100">
      {/* Header */}
      <header className="fixed top-0 inset-x-0 z-50 h-16 bg-white/5 backdrop-blur-2xl border-b border-amber-500/20 flex items-center justify-between px-6">
        <Link href="/dashboard" className="group flex items-center gap-2 text-amber-200 hover:text-amber-100 text-sm font-medium transition-all">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Dashboard
        </Link>
        <div className="flex items-center gap-2 text-amber-200 text-xs font-medium">
          <Globe size={14} className="text-amber-400" />
          <span className="font-mono tracking-wider">{currentTime}</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-10 px-6 max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black tracking-tight" style={{ fontFamily: "var(--font-cinzel), serif" }}>
            <span className="bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-300 bg-clip-text text-transparent">
              Profile Settings
            </span>
          </h1>
          <p className="text-amber-200/70 mt-3">Make your presence truly yours</p>
        </div>

        {/* Avatar */}
        <div className="flex justify-center mb-10">
          <div className="relative group">
            <Avatar className="w-32 h-32 ring-4 ring-amber-500/40 shadow-2xl">
              <AvatarImage src={session?.user?.image || ""} />
              <AvatarFallback className="bg-gradient-to-br from-amber-500 to-yellow-600 text-black text-3xl font-bold">
                {(session?.user?.name || "U").charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <button className="absolute bottom-2 right-2 p-3 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all hover:scale-110">
              <Pencil size={18} className="text-black" />
            </button>
          </div>
        </div>

        {/* Editable Fields */}
        <div className="space-y-6 bg-white/5 backdrop-blur-2xl rounded-xl p-8 border border-amber-500/20 shadow-2xl">
          {[
            { label: "Full Name", key: "name", value: formData.name },
            { label: "Username", key: "username", value: formData.username },
            { label: "Email", key: "email", value: formData.email },
            { label: "Bio", key: "bio", value: formData.bio, multiline: true },
            { label: "Location", key: "location", value: formData.location },
          ].map((field) => (
            <div key={field.key} className="group relative">
              <label className="text-amber-200/70 text-sm font-medium">{field.label}</label>

              {isEditing === field.key ? (
                <div className="mt-2 flex items-center gap-3">
                  {field.multiline ? (
                    <textarea
                      value={field.value}
                      onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                      className="flex-1 bg-white/10 border border-amber-500/40 rounded-lg px-4 py-3 text-amber-100 placeholder-amber-300/60 focus:border-amber-400 outline-none transition-all"
                      rows={3}
                    />
                  ) : (
                    <Input
                      value={field.value}
                      onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                      className="flex-1 bg-white/10 border-amber-500/40 text-amber-100 placeholder-amber-300/60 focus:border-amber-400 rounded-lg h-12"
                    />
                  )}
                  <button
                    onClick={() => handleSave(field.label)}
                    className="p-3 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-lg hover:shadow-lg hover:shadow-amber-500/40 transition-all"
                  >
                    <Check size={18} className="text-black" />
                  </button>
                </div>
              ) : (
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-amber-100 font-medium py-3">{field.value || "(Not set)"}</p>
                  <button
                    onClick={() => setIsEditing(field.key)}
                    className="p-2.5 rounded-full bg-white/10 hover:bg-amber-500/20 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Pencil size={16} className="text-amber-400" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Update All Button */}
        <div className="mt-10 text-center">
          <Button className="px-12 py-6 bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-medium text-lg rounded-lg shadow-xl">
            Save All Changes
          </Button>
        </div>

        <p className="text-center text-xs text-amber-200/50 mt-8">
          Your profile reflects who you are. Make it authentic.
        </p>
      </main>
    </div>
  );
}