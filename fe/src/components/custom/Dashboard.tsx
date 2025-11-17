"use client";

import { useGetUser } from "@/hooks/use-getuser";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Edit3,
  Video,
  User,
  Users,
  Clock,
  ThumbsUp,
  LogOut,
  Sparkles,
  X,
  Filter,
  Globe,
} from "lucide-react";
import Image from "next/image";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const user = useGetUser();

  const [stats] = useState({
    strangersConnected: 47,
    timeSpent: "3h 24m",
    likesReceived: 12,
  });

  const [keywords, setKeywords] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      if (!keywords.includes(inputValue.trim())) {
        setKeywords((prev) => [...prev, inputValue.trim()]);
      }
      setInputValue("");
    }
  };

  const removeKeyword = (index: number) => {
    setKeywords((prev) => prev.filter((_, i) => i !== index));
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-lg text-cyan-300">Loading dashboard...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-lg text-cyan-300">Please sign in to access the dashboard.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-xl border-b border-cyan-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-cyan-400/30">
                  <Image
                    src="/images/logo.jpg"
                    alt="Logo"
                    width={36}
                    height={36}
                    className="object-cover"
                  />
                </div>
              </Link>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Dashboard
              </h1>
            </div>
            <div className="flex items-center gap-4">
              {/* <div className="hidden sm:flex items-center gap-2 text-sm text-cyan-300">
                <Globe size={14} />
                <span className="font-mono">{currentTime}</span>
              </div> */}
              <span className="hidden sm:block text-sm text-gray-300">
                Hey, <span className="font-medium text-cyan-300">{session.user?.name?.split(" ")[0] || "User"}</span>
              </span>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-cyan-300 hover:bg-white/10 rounded-lg transition-all"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Profile Card */}
          <div className="group bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-cyan-500/20">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-gray-200">Your Profile</h2>
              <div className="p-2 bg-cyan-500/20 rounded-lg group-hover:bg-cyan-500/30 transition-colors">
                <User size={18} className="text-cyan-400" />
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Email</span>
                <span className="font-medium text-gray-200 truncate max-w-[180px]">{session.user?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Username</span>
                <span className="font-medium text-gray-200">{user?.username || "Not set"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Name</span>
                <span className="font-medium text-gray-200">{session.user?.name || "Not set"}</span>
              </div>
            </div>

            <Link
              href="/settings/update"
              className="mt-5 w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium text-sm rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all"
            >
              <Edit3 size={16} />
              Edit Profile
            </Link>
          </div>

          {/* Stats Card */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-cyan-500/20">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-gray-200">Your Stats</h2>
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Sparkles size={18} className="text-blue-400" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Users size={20} className="text-cyan-400" />
                  <span className="text-sm text-gray-400">Strangers Connected</span>
                </div>
                <span className="font-bold text-xl text-gray-200">{stats.strangersConnected}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock size={20} className="text-blue-400" />
                  <span className="text-sm text-gray-400">Time Spent</span>
                </div>
                <span className="font-bold text-xl text-gray-200">{stats.timeSpent}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ThumbsUp size={20} className="text-emerald-400" />
                  <span className="text-sm text-gray-400">Likes Received</span>
                </div>
                <span className="font-bold text-xl text-gray-200">{stats.likesReceived}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions - Updated */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-cyan-500/20">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-gray-200">Quick Actions</h2>
              <div className="p-2 bg-emerald-500/20 rounded-lg">
                <Video size={18} className="text-emerald-400" />
              </div>
            </div>

            <div className="space-y-4">
              {/* Video Chat Button */}
              <Link
                href="/chat"
                className="w-full text-center py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
              >
                <Video size={18} />
                Start Video Chat
              </Link>

              {/* Keyword Input */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-400">Filter by interests</label>
                <div className="flex flex-wrap gap-2 p-3 bg-white/5 rounded-xl border border-cyan-500/30 min-h-[48px]">
                  {keywords.map((kw, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-medium rounded-full"
                    >
                      {kw}
                      <button
                        onClick={() => removeKeyword(i)}
                        className="ml-1 hover:bg-white/20 rounded-full p-0.5 transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={keywords.length === 0 ? "Type interest + Enter" : ""}
                    className="flex-1 bg-transparent text-sm text-gray-300 placeholder-gray-500 outline-none min-w-[120px]"
                  />
                </div>
              </div>

              {/* Filter Button */}
              <button
                disabled={keywords.length === 0}
                className="w-full py-3 bg-white/10 border border-cyan-500/50 text-cyan-300 font-medium rounded-xl hover:bg-white/20 hover:border-cyan-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Filter size={16} />
                Apply Filters ({keywords.length})
              </button>

              {/* History Link */}
              <Link
                href="/history"
                className="block w-full text-center py-3 bg-white/5 border border-cyan-500/30 text-cyan-300 font-medium rounded-xl hover:bg-white/10 hover:border-cyan-400 transition-all"
              >
                View Chat History
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-cyan-500/20">
          <h3 className="text-lg font-semibold text-gray-200 mb-4">Recent Activity</h3>
          <div className="text-sm text-gray-400 italic text-center py-8">
            Your chat history will appear here after your first connection.
          </div>
        </div>
      </main>
    </div>
  );
}