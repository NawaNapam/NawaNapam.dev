"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  ArrowLeft,
  Send,
  Globe,
  X,
  RotateCcw,
  Power,
  Users,
  User
} from "lucide-react";

export default function VideoChatPage() {
  const [currentTime, setCurrentTime] = useState("");
  const [messages, setMessages] = useState<{ sender: "self" | "stranger"; text: string }[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [keywords, setKeywords] = useState<string[]>(["Travel", "Music", "Tech"]); // Mock keywords
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  const selfVideoRef = useRef<HTMLVideoElement>(null);
  const strangerVideoRef = useRef<HTMLVideoElement>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);

  // Live time (IST)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const time = now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
      const date = now.toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" });
      setCurrentTime(`${date}, ${time} IST`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Access camera (mock both videos with self camera for now)
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        if (selfVideoRef.current) selfVideoRef.current.srcObject = stream;
        if (strangerVideoRef.current) strangerVideoRef.current.srcObject = stream; // Mock stranger
      })
      .catch((err) => console.error("Camera access error:", err));
  }, []);

  // Toggle mute
  const toggleMute = () => setIsMuted((prev) => !prev);

  // Toggle video
  const toggleVideo = () => setIsVideoOff((prev) => !prev);

  // Send message
  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      setMessages((prev) => [...prev, { sender: "self", text: inputMessage.trim() }]);
      setInputMessage("");
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Remove keyword
  const removeKeyword = (index: number) => {
    setKeywords((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-gray-200">
      {/* Header */}
      <header className="fixed top-0 inset-x-0 z-50 bg-white/10 backdrop-blur-xl border-b border-cyan-500/20">
        <div className="container h-16 flex items-center justify-between px-4 sm:px-6">
          <Link href="/dashboard" className="group flex items-center gap-2 text-cyan-300 hover:text-cyan-200 text-sm font-medium transition-colors">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Dashboard
          </Link>
          <div className="flex items-center gap-1.5 text-xs text-cyan-300">
            <Globe size={14} />
            <span className="font-mono">{currentTime}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8 flex flex-col gap-6">
        {/* Video Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Self Video */}
          <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl overflow-hidden border border-cyan-500/20 shadow-lg">
            <video ref={selfVideoRef} autoPlay muted playsInline className="w-full h-[350px] lg:h-[400px] object-cover" />
            <div className="absolute bottom-4 left-4 bg-slate-800/80 backdrop-blur-md px-3 py-1 rounded-full text-xs text-cyan-300 flex items-center gap-2">
              <User size={14} />
              You
            </div>
            {isVideoOff && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80">
                <VideoOff size={48} className="text-cyan-400" />
              </div>
            )}
          </div>

          {/* Stranger Video */}
          <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl overflow-hidden border border-cyan-500/20 shadow-lg">
            <video ref={strangerVideoRef} autoPlay playsInline className="w-full h-[350px] lg:h-[400px] object-cover" />
            <div className="absolute bottom-4 left-4 bg-slate-800/80 backdrop-blur-md px-3 py-1 rounded-full text-xs text-cyan-300 flex items-center gap-2">
              <Users size={14} />
              Stranger
            </div>
            {isVideoOff && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80">
                <VideoOff size={48} className="text-cyan-400" />
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4">
          <button
            onClick={toggleMute}
            className={`p-3 rounded-full ${isMuted ? "bg-red-500/20" : "bg-cyan-500/20"} hover:bg-cyan-500/30 transition-colors`}
          >
            {isMuted ? <MicOff size={20} className="text-red-400" /> : <Mic size={20} className="text-cyan-400" />}
          </button>
          <button
            onClick={toggleVideo}
            className={`p-3 rounded-full ${isVideoOff ? "bg-red-500/20" : "bg-cyan-500/20"} hover:bg-cyan-500/30 transition-colors`}
          >
            {isVideoOff ? <VideoOff size={20} className="text-red-400" /> : <VideoIcon size={20} className="text-cyan-400" />}
          </button>
        </div>

        {/* Keywords */}
        <div className="flex flex-wrap gap-2 justify-center">
          {keywords.map((kw, i) => (
            <span key={i} className="inline-flex items-center gap-1 px-3 py-1.5 bg-cyan-500/20 text-cyan-300 text-xs font-medium rounded-full">
              {kw}
              <button onClick={() => removeKeyword(i)} className="hover:text-red-400 transition-colors">
                <X size={12} />
              </button>
            </span>
          ))}
        </div>

        {/* Text Chat */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-cyan-500/20 shadow-lg">
          <div className="h-40 overflow-y-auto space-y-2 pr-2" style={{ scrollbarWidth: "thin", scrollbarColor: "cyan-500/50 transparent" }}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender === "self" ? "justify-end" : "justify-start"}`}>
                <span
                  className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
                    msg.sender === "self" ? "bg-cyan-500/50 text-white" : "bg-slate-800/50 text-gray-200"
                  }`}
                >
                  {msg.text}
                </span>
              </div>
            ))}
            <div ref={messageEndRef} />
          </div>
          <form onSubmit={sendMessage} className="mt-4 flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 bg-white/10 border border-cyan-500/30 rounded-lg text-sm text-gray-200 placeholder-gray-400 focus:border-cyan-400 outline-none"
            />
            <button type="submit" className="p-2 bg-cyan-500/20 rounded-lg hover:bg-cyan-500/30 transition-colors">
              <Send size={16} className="text-cyan-400" />
            </button>
          </form>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <button className="px-6 py-3 bg-red-500/20 text-red-400 font-medium rounded-xl hover:bg-red-500/30 transition-all flex items-center gap-2">
            <Power size={18} />
            Stop
          </button>
          <button className="px-6 py-3 bg-cyan-500/20 text-cyan-400 font-medium rounded-xl hover:bg-cyan-500/30 transition-all flex items-center gap-2">
            <RotateCcw size={18} />
            Next
          </button>
        </div>
      </main>
    </div>
  );
}