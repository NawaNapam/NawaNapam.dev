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
  User,
  Sparkles,
} from "lucide-react";

export default function VideoChatPage() {
  const [currentTime, setCurrentTime] = useState("");
  const [messages, setMessages] = useState<{ sender: "self" | "stranger"; text: string }[]>([
    { sender: "stranger", text: "Namaste" },
    { sender: "self", text: "Namaste! Kaisa hai?" },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [keywords, setKeywords] = useState<string[]>(["Music", "Travel", "Food", "Cricket"]);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  const selfVideoRef = useRef<HTMLVideoElement>(null);
  const strangerVideoRef = useRef<HTMLVideoElement>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);

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

  // Camera Access (Mock)
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        if (selfVideoRef.current) {
          selfVideoRef.current.srcObject = stream;
          selfVideoRef.current.muted = true;
        }
        if (strangerVideoRef.current) strangerVideoRef.current.srcObject = stream;
      })
      .catch(() => {});
  }, []);

  const toggleMute = () => setIsMuted(p => !p);
  const toggleVideo = () => setIsVideoOff(p => !p);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    setMessages(prev => [...prev, { sender: "self", text: inputMessage.trim() }]);
    setInputMessage("");
    setTimeout(() => messageEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const removeKeyword = (i: number) => {
    setKeywords(prev => prev.filter((_, idx) => idx !== i));
  };

  return (
    <div className="min-h-screen bg-[#0a0f0d] flex flex-col font-sans">
      {/* Minimal Header */}
      <header className="fixed top-0 inset-x-0 z-50 h-16 bg-black/40 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6 text-white/80">
        <Link href="/dashboard" className="flex items-center gap-2 text-sm hover:text-white transition">
          <ArrowLeft size={16} />
          <span className="hidden sm:inline">Dashboard</span>
        </Link>
        <div className="flex items-center gap-2 text-xs font-medium">
          <Globe size={14} className="text-amber-400" />
          <span className="font-mono">{currentTime}</span>
        </div>
      </header>

      {/* Main Layout - Full Viewport */}
      <div className="flex-1 flex flex-col pt-16">
        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 flex-1 gap-4 p-4">
          {/* Self Video */}
          <div className="relative rounded-lg overflow-hidden bg-black/50 border border-white/10">
            <video ref={selfVideoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
            <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-2 border border-white/20">
              <User size={12} />
              You
            </div>
            {isVideoOff && (
              <div className="absolute inset-0 bg-black/90 flex items-center justify-center">
                <VideoOff size={48} className="text-white/60" />
              </div>
            )}
          </div>

          {/* Stranger Video */}
          <div className="relative rounded-lg overflow-hidden bg-black/50 border border-white/10">
            <video ref={strangerVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
            <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-2 border border-white/20">
              <Users size={12} />
              Stranger
            </div>
          </div>
        </div>

        {/* Bottom Panel */}
        <div className="bg-gradient-to-t from-black/80 via-black/40 to-transparent grid grid-cols-1 md:grid-cols-2 p-4">

        {/* Left Panel */}

          {/* Chat */}
          <div>
          <div className="bg-white/5 backdrop-blur-xl rounded-xl p-5 border border-white/10 w-full mx-auto">
            <div className="h-32 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-white/20">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.sender === "self" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] px-4 py-2.5 rounded-lg text-sm font-medium ${
                      msg.sender === "self"
                        ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-black"
                        : "bg-white/10 text-white/90"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={messageEndRef} />
            </div>

            <form onSubmit={sendMessage} className="mt-4 flex gap-3">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Send a message..."
                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-5 py-3 text-white placeholder-white/50 focus:border-amber-400 focus:outline-none transition text-sm"
              />
              <button
                type="submit"
                className="p-3.5 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-lg hover:shadow-lg hover:shadow-amber-500/30 transition-all"
              >
                <Send size={20} className="text-black" />
              </button>
            </form>
          </div>

          </div>

        {/* Right Panel */}
          
        <div className="p-6 space-y-6">
          {/* Keywords - Minimal Golden Pills */}
          <div className="flex flex-wrap justify-center gap-3">
            {keywords.map((kw, i) => (
              <div
                key={i}
                className="group flex items-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-black text-xs font-bold px-4 py-2 rounded-full shadow-lg transition-all hover:shadow-amber-400/50"
              >
                <span>{kw}</span>
                <button
                  onClick={() => removeKeyword(i)}
                  className="ml-1 w-4 h-4 rounded-full flex items-center justify-center transition-all bg-black/50"
                >
                  <X size={10} className="text-white" />
                </button>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-6">
            <button className="flex items-center gap-3 px-8 py-4 bg-red-500/20 border border-red-500/40 text-red-400 font-medium rounded-full hover:bg-red-500/30 transition-all">
              <Power size={22} />
              End Chat
            </button>
            <button className="flex items-center gap-3 px-8 py-4 bg-white/10 border border-white/30 text-white font-medium rounded-full hover:bg-white/20 transition-all">
              <RotateCcw size={22} />
              Next
            </button>
          </div>

          {/* Controls */}
          <div className="flex justify-center items-center gap-8">
            <button
              onClick={toggleMute}
              className={`p-4 rounded-full transition-all ${
                isMuted
                  ? "bg-red-500/30 border border-red-500/50"
                  : "bg-white/10 border border-white/20 hover:bg-white/20"
              }`}
            >
              {isMuted ? <MicOff size={24} className="text-red-400" /> : <Mic size={24} className="text-white" />}
            </button>

            <button
              onClick={toggleVideo}
              className={`p-4 rounded-full transition-all ${
                isVideoOff
                  ? "bg-red-500/30 border border-red-500/50"
                  : "bg-white/10 border border-white/20 hover:bg-white/20"
              }`}
            >
              {isVideoOff ? (
                <VideoOff size={24} className="text-red-400" />
              ) : (
                <VideoIcon size={24} className="text-white" />
              )}
            </button>
          </div>

          </div>

        </div>
      </div>
    </div>
  );
}