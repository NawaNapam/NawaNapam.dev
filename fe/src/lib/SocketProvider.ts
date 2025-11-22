// src/lib/signaling.ts
import { io, Socket } from "socket.io-client";
import { useEffect, useRef, useState, useCallback } from "react";

export type PeerInfo = { userId: string; username?: string };
export type SignalingStatus = "idle" | "searching" | "matched" | "ended";

let socket: Socket | null = null;
const SIGNALING = process.env.NEXT_PUBLIC_SIGNALING_URL || "http://localhost:8080";

// keep the current identity to re-auth on reconnect
let currentIdentity: { userId: string; username?: string } | null = null;
// last room we acknowledged to suppress duplicate match:found (local emit + pubsub)
let lastMatchedRoomId: string | null = null;
// simple debounce to avoid match spam
let lastMatchRequestAt = 0;

/** Initialize (singleton) socket */
export function initSocket(url = SIGNALING) {
  if (socket) return socket;
  socket = io(url, { transports: ["websocket"], autoConnect: true });

  socket.on("connect_error", (err) => console.error("[signaling] connect_error", err));
  socket.on("connect", () => {
    console.debug("[signaling] connected", socket?.id);
    // re-auth on reconnect if we have identity
    if (currentIdentity) {
      socket!.emit("auth", currentIdentity);
    }
  });
  socket.on("disconnect", (reason) => console.debug("[signaling] disconnected", reason));
  return socket;
}

/** Connect & send auth payload (no region/lat/lon) */
export function connectAuth(userId: string, username?: string) {
  if (!userId) throw new Error("connectAuth requires userId");
  initSocket();
  if (!socket) throw new Error("socket not initialized");
  currentIdentity = { userId, username };
  socket.emit("auth", currentIdentity);
}

/** Disconnect the global socket */
export function disconnectSocket() {
  if (!socket) return;
  try { socket.disconnect(); } finally { socket = null; currentIdentity = null; }
}

/** Safe wrappers */
export function startMatch() {
  initSocket();
  if (!socket) return false;
  const now = Date.now();
  if (now - lastMatchRequestAt < 300) {
    // debounce: ignore bursts under 300ms
    return false;
  }
  lastMatchRequestAt = now;
  socket.emit("match:request");
  return true;
}

export function endRoom(roomId?: string) {
  if (!socket) return;
  if (roomId) socket.emit("end:room", { roomId });
  else socket.emit("end:room", {});
}

export function onMatchFound(cb: (data: { peerId: string; peerUsername?: string; roomId?: string }) => void) {
  initSocket();
  if (!socket) throw new Error("Socket not initialized");
  const handler = (data: { peerId: string; peerUsername?: string; roomId?: string }) => cb(data);
  socket.on("match:found", handler);
  return () => { socket?.off("match:found", handler); };
}

export function onAuthOk(cb: () => void) {
  initSocket();
  if (!socket) throw new Error("Socket not initialized");
  socket.on("auth:ok", cb);
  return () => { socket?.off("auth:ok", cb); };
}

export function onMatchQueued(cb: () => void) {
  initSocket();
  if (!socket) throw new Error("Socket not initialized");
  socket.on("match:queued", cb);
  return () => { socket?.off("match:queued", cb); };
}

export function onMatchError(cb: (err: unknown) => void) {
  initSocket();
  if (!socket) throw new Error("Socket not initialized");
  socket.on("match:error", cb);
  return () => { socket?.off("match:error", cb); };
}

export function onEndOk(cb: () => void) {
  initSocket();
  if (!socket) throw new Error("Socket not initialized");
  socket.on("end:ok", cb);
  return () => { socket?.off("end:ok", cb); };
}


export function useSignaling({ userId, username }: { userId: string; username?: string }) {
  const [status, setStatus] = useState<SignalingStatus>("idle");
  const [peer, setPeer] = useState<PeerInfo | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);

  const socketRef = useRef<Socket | null>(null);
  const statusRef = useRef<SignalingStatus>("idle");
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hbTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => { statusRef.current = status; }, [status]);

  useEffect(() => {
    if (!userId) return;

    const s = initSocket();
    socketRef.current = s;
    currentIdentity = { userId, username };

    const cleanupFns: Array<() => void> = [];

    // Auth on connect & on mount
    const onConnect = () => s.emit("auth", currentIdentity);
    s.on("connect", onConnect);
    cleanupFns.push(() => s.off("connect", onConnect));
    // auth immediately too (if already connected)
    if (s.connected) s.emit("auth", currentIdentity);

    // Heartbeat every 10s to keep lastSeen fresh (TTL safety)
    const startHeartbeat = () => {
      if (hbTimerRef.current) clearInterval(hbTimerRef.current);
      hbTimerRef.current = setInterval(() => {
        if (socketRef.current?.connected) {
          socketRef.current.emit("heartbeat", {});
        }
      }, 10_000);
    };
    startHeartbeat();

    // De-duped match:found
    const onFound = (data: { peerId: string; peerUsername?: string; roomId?: string }) => {
      const rid = data.roomId ?? null;
      if (rid && lastMatchedRoomId === rid) return; // drop duplicate emit
      lastMatchedRoomId = rid;

      setPeer({ userId: data.peerId, username: data.peerUsername });
      setRoomId(rid);
      setStatus("matched");

      // stop auto-retry if running
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current);
        retryTimerRef.current = null;
      }
    };
    s.on("match:found", onFound);
    cleanupFns.push(() => s.off("match:found", onFound));

    // Queued 
    const onQueued = () => {
      setStatus("searching");
      if (retryTimerRef.current) return; // already scheduled
      retryTimerRef.current = setTimeout(() => {
        retryTimerRef.current = null;
        if (statusRef.current !== "matched") {
          const ok = startMatch();
          if (!ok) {
            // fallback simple emit if startMatch got debounced by global singleton
            socketRef.current?.emit("match:request");
          }
        }
      }, 300 + Math.floor(Math.random() * 500));
    };
    s.on("match:queued", onQueued);
    cleanupFns.push(() => s.off("match:queued", onQueued));

    // Errors: only auto-retry for NO_PEER / transient
    const onMatchErr = (err: unknown) => {
      const msg = typeof err === "string" ? err : String(err);
      if (msg.includes("NO_PEER")) {
        onQueued();
      } else {
        console.warn("[signaling] match:error", msg);
      }
    };
    s.on("match:error", onMatchErr);
    cleanupFns.push(() => s.off("match:error", onMatchErr));

    // Finalize
    const onEnd = () => {
      setStatus("ended");
      setPeer(null);
      setRoomId(null);
      lastMatchedRoomId = null;
      // Optionally, auto-requeue: uncomment if you want instant next
      // setTimeout(() => startMatch(), 200);
    };
    s.on("end:ok", onEnd);
    cleanupFns.push(() => s.off("end:ok", onEnd));

    return () => {
      cleanupFns.forEach((fn) => fn());
      if (retryTimerRef.current) { clearTimeout(retryTimerRef.current); retryTimerRef.current = null; }
      if (hbTimerRef.current) { clearInterval(hbTimerRef.current); hbTimerRef.current = null; }
      socketRef.current = null;
    };
  }, [userId, username]);

  const start = useCallback(() => {
    if (!socketRef.current) {
      initSocket();
      socketRef.current = socket;
    }
    lastMatchedRoomId = null; // reset de-dupe before a new search
    const ok = startMatch();
    if (!ok) socketRef.current?.emit("match:request");
    setStatus("searching");
    console.log('first', socketRef.current, "start");
  }, []);

  const next = useCallback(() => {
    if (roomId) socketRef.current?.emit("end:room", { roomId });
    setPeer(null);
    setRoomId(null);
    setStatus("searching");
    lastMatchedRoomId = null;
    console.log(socketRef.current, "next");
    setTimeout(() => socketRef.current?.emit("match:request"), 200);
  }, [roomId]);

  const end = useCallback(() => {
    if (roomId) socketRef.current?.emit("end:room", { roomId });
    setPeer(null);
    setRoomId(null);
    setStatus("ended");
    console.log(socketRef.current, "end", roomId);
    lastMatchedRoomId = null;
  }, [roomId]);

  const teardown = useCallback(() => {
    try { socketRef.current?.disconnect(); } catch {}
    socketRef.current = null;
    currentIdentity = null;
    lastMatchedRoomId = null;
  }, []);

  return { status, peer, roomId, start, next, end, teardown, socket: socketRef.current };
}
