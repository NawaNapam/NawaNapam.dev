"use client";

import { useEffect, useRef, useState, useCallback } from "react";
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
} from "lucide-react";
import { useSignaling, onAuthOk } from "@/lib/SocketProvider";
import { useGetUser } from "@/hooks/use-getuser";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function VideoChatPage() {
  // UI state
  const [currentTime, setCurrentTime] = useState("");
  const [messages, setMessages] = useState<
    { sender: "self" | "stranger"; text: string }[]
  >([]);
  const [inputMessage, setInputMessage] = useState("");
  const [keywords, setKeywords] = useState<string[]>([
    "Music",
    "Travel",
    "Food",
    "Cricket",
  ]);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  // media refs
  const selfVideoRef = useRef<HTMLVideoElement | null>(null);
  const strangerVideoRef = useRef<HTMLVideoElement | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  // auth / user
  const user = useGetUser();
  const userId = user?.id ?? null;
  const username = user?.username ?? undefined;

  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();

  // Guard: require authenticated userId
  // useEffect(() => {
  //   if (sessionStatus === "loading") return;
  //   if (!session?.user?.email || !userId) {
  //     toast.error("Sign in to join video chat.");
  //     router.replace("/api/auth/signin");
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [sessionStatus, session, userId]);

  // Signaling hook (no region)
  const { status, peer, roomId, start, next, end, teardown } = useSignaling({
    userId: userId ?? "",
    username,
  });

  // First auto-start: only after `auth:ok`
  useEffect(() => {
    if (!userId) return;
    const off = onAuthOk(() => {
      if (status === "idle" || status === "ended") start();
    });
    return () => off?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // Live IST Time
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }) + " IST"
      );
    };
    update();
    const int = setInterval(update, 1000);
    return () => clearInterval(int);
  }, []);

  // Local camera/mic preview
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        if (!mounted) {
          // stop tracks if unmounted before attach
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        localStreamRef.current = stream;
        if (selfVideoRef.current) {
          selfVideoRef.current.srcObject = stream;
          selfVideoRef.current.muted = true;
        }
        // placeholder preview until WebRTC wiring is done
        if (strangerVideoRef.current)
          strangerVideoRef.current.srcObject = stream;
      } catch {
        // ignore for now; could show a toast
      }
    })();

    return () => {
      mounted = false;
      // stop local tracks
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((t) => t.stop());
        localStreamRef.current = null;
      }
    };
  }, []);

  // Mute/unmute actually toggles audio tracks
  const toggleMute = useCallback(() => {
    const stream = localStreamRef.current;
    if (stream) {
      stream.getAudioTracks().forEach((t) => (t.enabled = !t.enabled));
      setIsMuted((p) => !p);
    } else {
      setIsMuted((p) => !p);
    }
  }, []);

  // Video on/off actually toggles video tracks
  const toggleVideo = useCallback(() => {
    const stream = localStreamRef.current;
    if (stream) {
      stream.getVideoTracks().forEach((t) => (t.enabled = !t.enabled));
      setIsVideoOff((p) => !p);
    } else {
      setIsVideoOff((p) => !p);
    }
  }, []);

  // scroll messages
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // cleanup on unmount
  useEffect(() => {
    return () => {
      try {
        teardown(); // closes socket
      } catch {}
    };
  }, [teardown]);

  const connectedOnceRef = useRef(false);
  useEffect(() => {
    if (status === "matched" && peer && !connectedOnceRef.current) {
      setMessages((p) => [
        ...p,
        {
          sender: "self",
          text: `Connected to ${peer.username ?? peer.userId}`,
        },
      ]);
      connectedOnceRef.current = true;
    }
    if (status !== "matched") {
      connectedOnceRef.current = false; // reset when leaving matched (end/next)
    }
  }, [status, peer]);

  // Chat (local-only placeholder)
  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    setMessages((p) => [...p, { sender: "self", text: inputMessage.trim() }]);
    setInputMessage("");
  };
  const removeKeyword = (i: number) =>
    setKeywords((p) => p.filter((_, idx) => idx !== i));

  // Start matching (button)
  const handleStart = () => {
    if (!userId) {
      toast.error("Sign in to start matching.");
      router.push("/api/auth/signin");
      return;
    }
    if (status === "matched") return;
    start(); // -> status becomes "searching"
  };

  // NEXT: end current room then search again
  const handleNext = () => {
    if (status === "matched" && roomId) {
      next(); // your signaling.next() ends then re-requests match
      setMessages((p) => [
        ...p,
        { sender: "self", text: "Skipped. Searching for new partner..." },
      ]);
    } else {
      start(); // not matched? just (re)start searching
      setMessages((p) => [
        ...p,
        { sender: "self", text: "Searching for a partner..." },
      ]);
    }
  };

  // END: end and stop searching
  const handleEnd = () => {
    end(); // ends room if exists, sets status "ended" (does NOT auto-requeue)
    setMessages((p) => [...p, { sender: "self", text: "Ended chat." }]);
  };

  return (
    <div className="min-h-screen bg-[#0a0f0d] flex flex-col font-sans">
      {/* Header */}
      <header className="fixed top-0 inset-x-0 z-50 h-16 bg-black/40 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6 text-white/80">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-sm hover:text-white transition"
        >
          <ArrowLeft size={16} />
          <span className="hidden sm:inline">Dashboard</span>
        </Link>
        <div className="flex items-center gap-2 text-xs font-medium">
          <Globe size={14} className="text-amber-400" />
          <span className="font-mono">{currentTime}</span>
        </div>
      </header>

      {/* Main */}
      <div className="flex-1 flex flex-col pt-16">
        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 flex-1 gap-4 p-4">
          {/* Self */}
          <div className="relative rounded-lg overflow-hidden bg-black/50 border border-white/10">
            <video
              ref={selfVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-3 left-3 text-white bg-black/70 px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-2 border border-white/20">
              <User size={12} /> You
            </div>
            {isVideoOff && (
              <div className="absolute inset-0 bg-black/90 flex items-center justify-center">
                <VideoOff size={48} className="text-white/60" />
              </div>
            )}
          </div>

          {/* Stranger */}
          <div className="relative rounded-lg overflow-hidden bg-black/50 border border-white/10">
            {/* SEARCHING OVERLAY */}
            {status === "searching" && (
              <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-4 z-20">
                <div className="w-16 h-16 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm text-white/80 font-medium">
                  Searching for a partner...
                </p>
              </div>
            )}

            <video
              ref={strangerVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-3 left-3 bg-black/70 text-white px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-2 border border-white/20">
              <Users size={12} />
              <span>{peer?.username ?? peer?.userId}</span>
            </div>
          </div>
        </div>

        {/* Bottom Panel */}
        <div className="bg-gradient-to-t from-black/80 via-black/40 to-transparent grid grid-cols-1 md:grid-cols-2 p-4">
          {/* Chat */}
          <div>
            <div className="bg-white/5 backdrop-blur-xl rounded-xl p-5 border border-white/10 w-full mx-auto">
              <div className="h-32 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-white/20">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${
                      msg.sender === "self" ? "justify-end" : "justify-start"
                    }`}
                  >
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
                  className="p-3.5 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-lg hover:shadow-lg hover:shadow-amber-500/30"
                >
                  <Send size={20} className="text-black" />
                </button>
              </form>
            </div>
          </div>

          {/* Right panel */}
          <div className="p-6 space-y-6">
            {/* Keywords */}
            <div className="flex flex-wrap justify-center gap-3">
              {keywords.map((kw, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-black text-xs font-bold px-4 py-2 rounded-full shadow-lg"
                >
                  <span>{kw}</span>
                  <button
                    onClick={() => removeKeyword(i)}
                    className="ml-1 w-4 h-4 rounded-full flex items-center justify-center bg-black/50"
                  >
                    <X size={10} className="text-white" />
                  </button>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-6">
              <button
                onClick={handleEnd}
                className="flex items-center gap-3 px-8 py-4 bg-red-500/20 border border-red-500/40 text-red-400 rounded-full hover:bg-red-500/30"
              >
                <Power size={22} /> End Chat
              </button>

              {status === "matched" ? (
                <button
                  onClick={handleNext}
                  className="flex items-center gap-3 px-8 py-4 bg-white/10 border border-white/30 text-white rounded-full hover:bg-white/20"
                >
                  <RotateCcw size={22} /> Next
                </button>
              ) : (
                <button
                  onClick={handleStart}
                  className="flex items-center gap-3 px-8 py-4 bg-white/10 border border-white/30 text-white rounded-full hover:bg-white/20"
                >
                  <RotateCcw size={22} /> Start Video Chat
                </button>
              )}
            </div>

            {/* Controls */}
            <div className="flex justify-center items-center gap-8">
              <button
                onClick={toggleMute}
                className={`p-4 rounded-full ${
                  isMuted
                    ? "bg-red-500/30 border border-red-500/50"
                    : "bg-white/10 border border-white/20 hover:bg-white/20"
                }`}
              >
                {isMuted ? (
                  <MicOff size={24} className="text-red-400" />
                ) : (
                  <Mic size={24} className="text-white" />
                )}
              </button>

              <button
                onClick={toggleVideo}
                className={`p-4 rounded-full ${
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
