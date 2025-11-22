// src/socket/matchHandler.ts
import { Socket } from "socket.io";
import { redis } from "../utils/redis/redisClient";
import { scripts } from "../utils/redis/scripts";

const STALE_MS = Number(process.env.STALE_MS || 30_000);

export async function handleMatchRequest(socket: Socket) {
  const userId = socket.data.userId as string;
  if (!userId) return socket.emit("match:error", "not-authenticated");

  const roomId = `r:${userId}:${Date.now()}`;
  const now = Date.now();

  try {
    // Optional: if user is already matched/in-room, ignore
    const u = await redis.hgetall(`user:${userId}`);
    if (u && (u.status === "matched" || (u.currentRoom && u.currentRoom !== ""))) {
      return socket.emit("match:error", "already-in-room");
    }

    // ensure requester is in global pools (defensive)
    await redis.sadd("available", userId);
    await redis.zadd("available_by_time", now, userId);

    // ARGV: requesterId, nowTs(ms), staleMs, roomId
    const raw: any = await redis.evalsha(
      scripts.matchSha!, 0,
      userId,
      String(now),
      String(STALE_MS),
      roomId
    );

    // ---- normalize response ----
    let parsed: any = null;
    if (typeof raw === "string") {
      // Try JSON first
      if (raw.startsWith("{")) {
        try { parsed = JSON.parse(raw); } catch { /* fallthrough */ }
      }
    } else if (raw && typeof raw === "object") {
      parsed = raw; // some redis clients return tables/objects
    }

    if (parsed) {
      if (parsed.ok) {
        const peerId = parsed.candidate;
        const rid = parsed.roomId || roomId;
        return socket.emit("match:found", { peerId, roomId: rid });
      }

      // Non-fatal: keep searching
      const errCode = String(parsed.err || "").toUpperCase();
      if (errCode === "NO_PEER" || errCode === "STALE_PEER" || errCode === "NOT_AVAILABLE") {
        return socket.emit("match:queued");
      }

      // Anything else -> hard error
      return socket.emit("match:error", errCode || "match_failed");
    }

    // Legacy fallback: treat raw string as peerId ONLY if it looks like an ID (not JSON)
    if (typeof raw === "string" && raw && raw[0] !== "{" && /^[A-Za-z0-9:_-]{3,128}$/.test(raw)) {
      return socket.emit("match:found", { peerId: raw, roomId });
    }

    // Default graceful path: queue
    return socket.emit("match:queued");
  } catch (e: any) {
    const msg = String(e?.message || e);
    // Common pattern: treat NO_PEER as queued
    if (msg.includes("NO_PEER")) {
      return socket.emit("match:queued");
    }
    console.error("[match] error", e);
    return socket.emit("match:error", msg);
  }
}
